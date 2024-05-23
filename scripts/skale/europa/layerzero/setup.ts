import ora from 'ora-classic';
import chalk from 'chalk';
import hre, { ethers } from "hardhat"; 
import appConfig, { NetworkConfig } from "../../../../app.skale.europa.config";
import { DeploymentManager } from "../../../helpers/deployments";
import { waitForMinimumTime } from "../../../helpers/timers";

import { 
    Options 
} from '@layerzerolabs/lz-v2-utilities';

import { 
    CryptosTokenSkaleEuropa,
    MockLayerZeroEndpointAlt
} from "../../../../typechain-types";

import { 
    EnforcedOptionParamStruct 
} from "../../../typechain-types/contracts/source/skale/europa/CryptosTokenSkaleEuropa";

// Settins
const MIN_TIME = 100;

let config: NetworkConfig;
let deploymentManager: DeploymentManager;
let tokenInstance: CryptosTokenSkaleEuropa;
let mockEndpointInstance: MockLayerZeroEndpointAlt;

/**
 * Setup peers and endpoints
 * 
 * npx hardhat run --network localhost ./scripts/skale/europa/layerzero/setup.ts
 * npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/layerzero/setup.ts
 * npx hardhat run --network skaleEuropaMainnet ./scripts/skale/europa/layerzero/setup.ts
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

    const tokenAddress = deploymentManager.getContractDeployment("CryptosTokenSkaleEuropa").address;
    tokenInstance = await ethers.getContractAt("CryptosTokenSkaleEuropa", tokenAddress);

    const owner = await tokenInstance.owner();
    if (owner != deployer.address)
    {
        throw new Error(`Deployer ${deployer.address} is not the owner of the token contract ${tokenAddress}!`);
    }

    //////////////////////////////////
    ///// Ensure Enpoint Setup ///////
    //////////////////////////////////
    if (!config.layerZero.endpoint.endpointLocation.startsWith("0x") && 
        config.layerZero.endpoint.endpointDestinations && 
        config.layerZero.endpoint.endpointDestinations?.length > 0)
    {
        const mockEndpointAddress = deploymentManager.getContractDeployment("MockLayerZeroEndpointAlt:Skale").address;
        mockEndpointInstance = await ethers.getContractAt("MockLayerZeroEndpointAlt", mockEndpointAddress);

        for (let destination of config.layerZero.endpoint.endpointDestinations)
        {
            await ensureMockEndpointDestinationSet(destination.destinationToken, destination.destinationEndpoint);
        }
    }


    //////////////////////////////////
    /////// Ensure Peers Set /////////
    //////////////////////////////////
    for (let peer of Object.values(config.layerZero.peers))
    {
        await ensurePeerSet(peer.network, peer.endpointId, peer.token);
    }


    //////////////////////////////////
    ////// Ensure Options Set ////////
    //////////////////////////////////
    await ensureOptionsSet(config.layerZero.options, config.layerZero.peers);

    console.log(`\Ensured ${chalk.bold(Object.keys(config.layerZero.peers).length.toString())} peers were confiured on ${chalk.yellow(hre.network.name)}!\n\n`);
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
 * Ensure options are set
 * 
 * @param options Options
 * @param peers Peers
 */
async function ensureOptionsSet(options: any, peers: any): Promise<void>
{
    const transactionLoader = ora(`Configuring options`).start();
    const transactionStartTime = Date.now();

    // Construct enforced options
    let enforcedOptions: EnforcedOptionParamStruct[] = [];
    for (let network of Object.keys(options))
    {
        const networkOptions = options[network];
        const networkPeers = peers[network];

        if (!networkPeers)
        {
            throw new Error(`No peers found for network ${network}`);
        }

        for (let executorLzReceiveOption of networkOptions.executorLzReceiveOptions)
        {
            enforcedOptions.push({
                eid: networkPeers.endpointId,
                msgType: executorLzReceiveOption.msgType,
                options: Options.newOptions()
                    .addExecutorLzReceiveOption(executorLzReceiveOption.gasLimit, 0)
                    .toHex()
                    .toString()
            });
        }
    }

    // Set enforced options
    await tokenInstance.setEnforcedOptions(enforcedOptions);

    await waitForMinimumTime(transactionStartTime, MIN_TIME);
    transactionLoader.succeed(`Configured options`);
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