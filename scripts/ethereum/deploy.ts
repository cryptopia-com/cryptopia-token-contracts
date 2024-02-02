import ora from 'ora-classic';
import chalk from 'chalk';
import hre, { ethers } from "hardhat"; 
import appConfig, { NetworkConfig } from "../../app.ethereum.config";
import { DeploymentManager } from "../helpers/deployments";
import { waitForMinimumTime } from "../helpers/timers";
import { waitForTransaction } from "../helpers/transactions";

// Config
let config: NetworkConfig;

// Settins
const MIN_TIME = 100;

/**
 * Deploy contracts
 * 
 * npx hardhat run --network localhost ./scripts/ethereum/deploy.ts
 * npx hardhat run --network ethereumGoerli ./scripts/ethereum/deploy.ts
 * npx hardhat run --network ethereumMainnet ./scripts/ethereum/deploy.ts
 */
async function main() {

    // Config
    const isDevEnvironment = hre.network.name == "hardhat" || hre.network.name == "localhost";
    config = appConfig.networks[isDevEnvironment ? "development" : hre.network.name];
        
    const contractName = "CryptosToken";
    const deploymentManager = new DeploymentManager(hre.network.name);

    console.log(`\nDeploying ${chalk.green(contractName)} to ${chalk.yellow(hre.network.name)}`);

    // log deployer address
    const deployer = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer[0].address}`);

    if (deploymentManager.isContractDeployed(contractName))
    {
        // Skip
        const deploymentTransaction = deploymentManager.getContractDeployment(contractName);
        ora(`Skipping.. Already deployed at ${chalk.cyan(deploymentTransaction.address)}`).warn();
    }
    else 
    {
        // Deploy
        let transactionLoader = ora(`Creating transaction...`).start();
        const transactionStartTime = Date.now();

        // Create transaction
        const factory = await ethers.getContractFactory(contractName);
        const instance = await factory.deploy();
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
        deploymentManager.saveContractDeployment(
            contractName, contractName, contractAddress, [], factory.bytecode, false);

        await waitForMinimumTime(confirmationLoaderStartTime, MIN_TIME);
        deploymentLoader.succeed(`Contract deployed at ${chalk.cyan(contractAddress)} in block ${chalk.cyan(receipt.blockNumber)}`);
    }

    // Done
    console.log(`\nFinished deployment to ${chalk.yellow(hre.network.name)}:`);
}

// Deploy
main().catch((error) => 
{
  console.error(error);
  process.exitCode = 1;
});