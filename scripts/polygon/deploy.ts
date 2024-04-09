import ora from 'ora-classic';
import chalk from 'chalk';
import hre, { ethers } from "hardhat"; 
import appConfig, { NetworkConfig } from "../../app.polygon.config";
import { Contract } from "ethers";
import { DeploymentManager } from "../helpers/deployments";
import { waitForMinimumTime } from "../helpers/timers";
import { waitForTransaction } from "../helpers/transactions";

// Settins
const MIN_TIME = 100;

// Deployment
enum DeploymentStatus 
{
    None,
    Deployed,
    Skipped
}

// Internal
let deployCounter = 0;
let skipCounter = 0;

let config: NetworkConfig;
let lastDeploymentStatus = DeploymentStatus.None;
let deploymentManager: DeploymentManager;

/**
 * Deploy contracts
 * 
 * npx hardhat run --network localhost ./scripts/polygon/deploy.ts
 * npx hardhat run --network polygonMumbai ./scripts/polygon/deploy.ts
 * npx hardhat run --network polygonMainnet ./scripts/polygon/deploy.ts
 */
async function main() {

    // Config
    const isDevEnvironment = hre.network.name == "hardhat" 
        || hre.network.name == "ganache" 
        || hre.network.name == "localhost";
    config = appConfig.networks[
        isDevEnvironment ? "development" : hre.network.name];

    deploymentManager = new DeploymentManager(hre.network.name);
    const [deployer] = await ethers.getSigners();

    console.log(`\n\nStarting deployment to ${chalk.yellow(hre.network.name)} from ${chalk.blue(deployer.address)}..`);

    //////////////////////////////////
    ////// Ensure LZ Endpoint ////////
    //////////////////////////////////
    let lzEndpointAddress: string;
    if (!config.layerZero.endpoint.endpointLocation.startsWith("0x"))
    {
        const [lzEndpointContract] = await ensureDeployed(
            "MockLayerZeroEndpoint", 
            [
                config.layerZero.endpoint.endpointId
            ],
            "MockLayerZeroEndpoint:Polygon");

        lzEndpointAddress = await lzEndpointContract.address;
    }
    else 
    {
        lzEndpointAddress = config.layerZero.endpoint.endpointLocation;
    }


    //////////////////////////////////
    ////// Deploy Cryptos Token //////
    //////////////////////////////////
    await ensureDeployed(
        "CryptosTokenPolygon", 
        [
            lzEndpointAddress,
            deployer.address
        ]);

    // Done
    console.log(`\n\nFinished deployment to ${chalk.yellow(hre.network.name)}:`);
    console.log(`  ${chalk.bold(deployCounter)} deployed`);
    console.log(`  ${chalk.bold(skipCounter)} skipped\n\n`);
}

/**
 * Deploy contract
 * 
 * @param {string} contractName - Name of the contract to deploy.
 * @param {unknown[]} args - Arguments to pass to the contract constructor.
 * @param {string} deploymentKey - Key to save the deployment.
 * @returns A tuple containing the contract instance and a boolean indicating if the contract was deployed.
 */
async function ensureDeployed(contractName: string, args?: unknown[], deploymentKey?: string) : Promise<[Contract, DeploymentStatus]> 
{
    if (!deploymentKey)
    {
        deploymentKey = contractName;
    }

    if (deploymentManager.isContractDeployed(deploymentKey))
    {
        const factory = await ethers.getContractFactory(contractName);
        const deploymentInfo = deploymentManager.getContractDeployment(deploymentKey);

        // Skip
        if (deploymentInfo.bytecode == factory.bytecode)
        {
            if (lastDeploymentStatus != DeploymentStatus.Skipped)
            {
                console.log("\n");
            }

            console.log(`Skipping ${chalk.green(deploymentKey)} (unchanged bytecode)`);
            lastDeploymentStatus = DeploymentStatus.Skipped;
            skipCounter++;
            
            return [
                await ethers.getContractAt(
                    contractName, 
                    deploymentInfo.address), 
                lastDeploymentStatus
            ];
        }

        // Fail
        else {
            throw new Error(`Contract ${deploymentKey} has already been deployed with different bytecode`);
        }
    }

    // Deploy
    else {
        lastDeploymentStatus = DeploymentStatus.Deployed;
        return [
            await _deployContract(
                contractName, 
                deploymentKey, 
                args), 
            lastDeploymentStatus
        ];
    }
}

/**
 * Deploy contract
 * 
 * @param {string} contractName - Name of the contract to deploy.
 * @param {string} deploymentKey - Key to save the deployment.
 * @param {unknown[]} args - Arguments to pass to the contract constructor.
 * @returns The contract instance.
 */
async function _deployContract(contractName: string, deploymentKey: string, args?: unknown[], ) : Promise<Contract> 
{
    console.log(`\n\nDeploying ${chalk.green(deploymentKey)} to ${chalk.yellow(hre.network.name)}`);
    let transactionLoader = ora(`Creating transaction...`).start();
    const transactionStartTime = Date.now();

    // Create transaction
    const factory = await ethers.getContractFactory(contractName);
    const instance = await factory.deploy(...(args ?? []));
    const deploymentTransaction = instance.deployTransaction;

    if (!deploymentTransaction)
    {
        throw new Error(`Failed to create deployment transaction for ${contractName}`);
    }

    await waitForMinimumTime(transactionStartTime, MIN_TIME);
    transactionLoader.succeed(`Transaction created ${chalk.cyan(deploymentTransaction.hash)}`);
    const deploymentLoader = ora(`Waiting for confirmations...`).start();
    const confirmationLoaderStartTime = Date.now();

    // Wait for confirmation
    const receipt = await waitForTransaction(
        deploymentTransaction.hash, 
        config.confirmations ?? 1, 
        config.pollingInterval ?? 1000, 
        config.pollingTimeout ?? 5000);

    if (!receipt) 
    {
        throw new Error(`Transaction receipt not found for hash: ${deploymentTransaction.hash}`);
    }

    const contractAddress = await instance.address;

    // Save deployment
    deploymentManager.saveContractDeployment(deploymentKey, contractName, contractAddress, args ? args : [], factory.bytecode, false);

    await waitForMinimumTime(confirmationLoaderStartTime, MIN_TIME);
    deploymentLoader.succeed(`Contract deployed at ${chalk.cyan(contractAddress)} in block ${chalk.cyan(receipt.blockNumber)}`);

    deployCounter++;
    return instance;
}

// Deploy
main().catch((error) => 
{
  console.error(error);
  process.exitCode = 1;
});