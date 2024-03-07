import ora from 'ora-classic';
import chalk from 'chalk';
import hre, { ethers } from "hardhat"; 
import appConfig, { NetworkConfig } from "../../../app.polygon.config";
import { DeploymentManager } from "../../helpers/deployments";
import { waitForMinimumTime } from "../../helpers/timers";

import { 
    MockLayerZeroEndpoint,
    CryptosTokenPolygon,
} from "../../../typechain-types";

// Settins
const MIN_TIME = 100;

let config: NetworkConfig;
let deploymentManager: DeploymentManager;
let tokenInstance: CryptosTokenPolygon;
let mockEndpointInstance: MockLayerZeroEndpoint;

/**
 * Setup peers and endpoints
 * 
 * npx hardhat run --network localhost ./scripts/polygon/layerzero/setup.ts
 * npx hardhat run --network polygonMumbai ./scripts/polygon/layerzero/setup.ts
 * npx hardhat run --network polygonMainnet ./scripts/polygon/layerzero/setup.ts
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

    console.log(`\n\nStarting LayerZero setup on ${chalk.yellow(hre.network.name)}..`);

    const tokenAddress = deploymentManager.getContractDeployment("CryptosTokenPolygon").address;
    tokenInstance = await ethers.getContractAt("CryptosTokenPolygon", tokenAddress);

    const owner = await tokenInstance.owner();
    if (owner != deployer.address)
    {
        throw new Error(`Deployer ${deployer.address} is not the owner of the token contract ${tokenAddress}!`);
    }

    //////////////////////////////////
    ///// Ensure Enpoint Setup ///////
    //////////////////////////////////
    if (config.layerZero.endpoint.endpointLocation == "MockLayerZeroEndpoint" && 
        config.layerZero.endpoint.endpointDestinations && 
        config.layerZero.endpoint.endpointDestinations?.length > 0)
    {
        const mockEndpointAddress = deploymentManager.getContractDeployment("MockLayerZeroEndpoint:Ethereum").address;
        mockEndpointInstance = await ethers.getContractAt("MockLayerZeroEndpoint", mockEndpointAddress);

        for (let destination of config.layerZero.endpoint.endpointDestinations)
        {
            await ensureMockEndpointDestinationSet(destination.destinationToken, destination.destinationEndpoint);
        }
    }


    //////////////////////////////////
    /////// Ensure Peers Set /////////
    //////////////////////////////////
    for (let peer of config.layerZero.peers)
    {
        await ensurePeerSet(peer.network, peer.endpointId, peer.deploymentKey);
    }

    console.log(`\Ensured ${chalk.bold(config.layerZero.peers.length.toString())} peers were confiured on ${chalk.yellow(hre.network.name)}!\n\n`);
}

/**
 * Ensure peer is set
 * 
 * @param network Network (see hardhat.config.ts)
 * @param eid Peer endpoint ID
 * @param peer Peer deployment key
 */
async function ensurePeerSet(network: string, eid: number, peer: string): Promise<void>
{
    const peerAddress = new DeploymentManager(network)
        .getContractDeployment(peer).address;

    // Check if peer is already set
    if (await tokenInstance.isPeer(eid, ethers.utils.zeroPad(peerAddress, 32)))
    {
        return Promise.resolve();
    }

    const transactionLoader = ora(`Configuring ${chalk.green(peer)} as peer..`).start();
    const transactionStartTime = Date.now();

    await tokenInstance.setPeer(eid, ethers.utils.zeroPad(peerAddress, 32));

    await waitForMinimumTime(transactionStartTime, MIN_TIME);
    transactionLoader.succeed(`Configured ${chalk.green(peer)} as peer with endpoint ID ${chalk.blue(eid.toString())}`);
}

/**
 * Ensure mock endpoint destination is set
 * 
 * @param destinationToken Destination token
 * @param destinationEndpoint Destination endpoint
 */
async function ensureMockEndpointDestinationSet(destinationToken: string, destinationEndpoint: string): Promise<void>
{
    const destinationTokenAddress = deploymentManager.getContractDeployment(destinationToken).address;
    const destinationEndpointAddress = deploymentManager.getContractDeployment(destinationEndpoint).address;

    const transactionLoader = ora(`Configuring mock endpoint for ${chalk.green(destinationToken)}..`).start();
    const transactionStartTime = Date.now();

    await mockEndpointInstance.setDestLzEndpoint(destinationTokenAddress, destinationEndpointAddress);

    await waitForMinimumTime(transactionStartTime, MIN_TIME);
    transactionLoader.succeed(`Configured mock ${chalk.green(destinationEndpoint)} endpoint for ${chalk.green(destinationToken)}`);
}

// Deploy
main().catch((error) => 
{
  console.error(error);
  process.exitCode = 1;
});