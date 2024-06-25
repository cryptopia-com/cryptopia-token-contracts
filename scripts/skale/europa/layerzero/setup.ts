import ora from 'ora-classic';
import chalk from 'chalk';
import hre, { ethers } from "hardhat"; 
import appConfig, { NetworkConfig } from "../../../../app.skale.europa.config";
import { LayerZeroEndpointConfig } from '../../../types/LayerZeroConfig';
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
} from "../../../../typechain-types/contracts/source/skale/europa/CryptosTokenSkaleEuropa";

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
    let endpointLocation = config.layerZero.endpoint.endpointLocation;
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

        endpointLocation = mockEndpointAddress;
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


    //////////////////////////////////
    /// Ensure Endpoint Config Set ///
    //////////////////////////////////
    await ensureEndpointConfigSet(config.layerZero.endpoint.config, config.layerZero.peers, tokenAddress, endpointLocation);

    console.log(`\Ensured ${chalk.bold(Object.keys(config.layerZero.peers).length.toString())} peers were configured on ${chalk.yellow(hre.network.name)}!\n\n`);
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
        const networkPeer = peers[network];

        if (!networkPeer)
        {
            throw new Error(`No peers found for network ${network}`);
        }

        for (let executorLzReceiveOption of networkOptions.executorLzReceiveOptions)
        {
            enforcedOptions.push({
                eid: networkPeer.endpointId,
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
    transactionLoader.succeed(`Configured ${chalk.blue(enforcedOptions.length)} options for ${chalk.green("CryptosTokenSkaleEuropa")}`);
}

/**
 * Ensure endpoint consig is set
 * 
 * @param config Endpoint config
 * @param peers Peers
 * @param tokenAddress Token address
 * @param endpointAddress Endpoint address
 */
async function ensureEndpointConfigSet(config: any, peers: any, tokenAddress: string, endpointAddress: string): Promise<void>
{
    const executorConfigType = 1; // 1 for ExecutorConfig
    const configTypeExecutorStruct = 'tuple(uint32 maxMessageSize, address executorAddress)';

    const ulnConfigType = 2; // 2 for UlnConfig
    const ulnConfigTypeStruct = 'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)';

    const endpointInstance = await hre.ethers.getContractAt("ILayerZeroEndpointV2", endpointAddress);

    for (let network of Object.keys(config))
    {
        const networkConfig = config[network];
        const networkPeer = peers[network];

        if (!networkPeer)
        {
            throw new Error(`No peer found for network ${network}`);
        }

        if (!networkConfig)
        {
            continue;
        }

        if (!networkConfig.sendConfig)
        {
            throw new Error(`No send config found for network ${network}`);
        }

        if (!networkConfig.sendConfig.executorConfig)
        {
            throw new Error(`No send executor config found for network ${network}`);
        }

        if (!networkConfig.sendConfig.ulnConfig)
        {
            throw new Error(`No send uln config found for network ${network}`);
        }

        if (!networkConfig.receiveConfig)
        {
            throw new Error(`No receive config found for network ${network}`);
        }

        if (!networkConfig.receiveConfig.ulnConfig)
        {
            throw new Error(`No receive uln config found for network ${network}`);
        }

        // Send config
        const transactionLoaderSend = ora(`Configuring send config for ${chalk.yellow(network)}`).start();
        const transactionStartTimeSend = Date.now();

        const ulnConfigEncodedSend = ethers.utils.defaultAbiCoder.encode(
            [ulnConfigTypeStruct],
            [networkConfig.sendConfig.ulnConfig]);

        const setConfigParamUlnSend = {
            eid: networkPeer.endpointId,
            configType: ulnConfigType,
            config: ulnConfigEncodedSend,
        };

        const executorConfigEncodedSend = ethers.utils.defaultAbiCoder.encode(
            [configTypeExecutorStruct],
            [networkConfig.sendConfig.executorConfig]);

        const setConfigParamExecutorSend = {
            eid: networkPeer.endpointId,
            configType: executorConfigType,
            config: executorConfigEncodedSend,
        };

        const sendLibAddress = await endpointInstance.getSendLibrary(tokenAddress, networkPeer.endpointId);
        await endpointInstance.setConfig(tokenAddress, sendLibAddress, 
        [
            setConfigParamUlnSend,
            setConfigParamExecutorSend
        ]);

        await waitForMinimumTime(transactionStartTimeSend, MIN_TIME);
        transactionLoaderSend.succeed(`Configured send config for ${chalk.yellow(network)}`);


        // Receive config
        const transactionLoaderReceive = ora(`Configuring receive config for ${chalk.yellow(network)}`).start();
        const transactionStartTimeReceive = Date.now();

        const ulnConfigEncodedReceive = ethers.utils.defaultAbiCoder.encode(
            [ulnConfigTypeStruct],
            [networkConfig.receiveConfig.ulnConfig]);

        const setConfigParamUlnReceive = {
            eid: networkPeer.endpointId,
            configType: ulnConfigType,
            config: ulnConfigEncodedReceive,
        };

        const receiveLibAddress = (await endpointInstance.getReceiveLibrary(tokenAddress, networkPeer.endpointId)).lib;
        await endpointInstance.setConfig(tokenAddress, receiveLibAddress, 
        [
            setConfigParamUlnReceive
        ]);

        await waitForMinimumTime(transactionStartTimeReceive, MIN_TIME);
        transactionLoaderReceive.succeed(`Configured send config for ${chalk.yellow(network)}`);
    }
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