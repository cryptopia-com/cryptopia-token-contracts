import chalk from 'chalk';
import { HardhatUserConfig, task } from "hardhat/config";
import { LayerZeroConfig } from './scripts/types/LayerZeroConfig';
import "@nomicfoundation/hardhat-toolbox";

import { 
  Options 
} from '@layerzerolabs/lz-v2-utilities';

import { 
  MessagingFeeStruct, 
  SendParamStruct 
} from "./typechain-types/contracts/source/ethereum/CryptosToken.js";
import { DeploymentManager } from "./scripts/helpers/deployments";

const secret = JSON.parse(
  require('fs')
    .readFileSync(".secret")
    .toString()
    .trim());

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    ethereumSepolia: {
      url: "https://go.getblock.io/b4c5e41104bc47feb4993830c820957f",
      chainId: 11155111,
      accounts: {
        mnemonic: secret.ethereumSepolia.mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    },
    ethereumMainnet: {
      url: "https://go.getblock.io/ea6c212105ae468591a146a082da2e93",
      chainId: 1,
      accounts: {
        mnemonic: secret.ethereumMainnet.mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    },
    polygonAmoy: {
      url: "https://go.getblock.io/07d076840042416eb75709631abdb21a",
      chainId: 80002,
      accounts: {
        mnemonic: secret.polygonAmoy.mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    },
    polygonMainnet: {
      url: "https://go.getblock.io/a338e4262f064158b2f436186ba26f52",
      chainId: 137,
      accounts: {
        mnemonic: secret.polygonMainnet.mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    }
  },
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000
      }
    }
  },
  etherscan: {
    apiKey: {
      sepolia: secret.ethereumSepolia.etherscan,
      polygonAmoy: secret.polygonAmoy.etherscan,
    }
  }
};

export default config;

export interface NetworkConfig {
  layerZero: LayerZeroConfig;
}

interface AppConfig {
  networks: {
      [key: string]: NetworkConfig;
  };
}

/**
 * Load the configuration for the specified network
 * 
 * @param network to load the configuration for
 * @returns the configuration for the specified network
 */
async function loadConfigAsync(network: string) : Promise<AppConfig>
{
  try {
    return (await import(`./app.${network}.config`)).default;
  } 
  catch (error) 
  {
    console.error("Failed to load the configuration:", error);
    return Promise.reject(error); 
  }
}

/**
 * Bridge tokens
 * 
 * npx hardhat bridge --network localhost --origin "ethereum" --destination "polygon" --amount "100"
 * npx hardhat bridge --network localhost --origin "polygon" --destination "ethereum" --amount "100"
 * 
 * npx hardhat bridge --network ethereumSepolia --origin "ethereum" --destination "polygon" --amount "100"
 * npx hardhat bridge --network polygonAmoy --origin "polygon" --destination "ethereum" --amount "100"
 * 
 * npx hardhat bridge --network ethereumMainnet --origin "ethereum" --destination "polygon" --amount "100"
 * npx hardhat bridge --network polygonMainnet --origin "polygon" --destination "ethereum" --amount "100"
 */
task("bridge", "Transfer tokens between blockchains")
  .addParam("origin", "The network to bridge from")
  .addParam("destination", "The network to bridge to")
  .addParam("amount", "The amount of tokens to bridge")
  .addOptionalParam("to", "The address to bridge the tokens to")
  .setAction(async (taskArguments, hre) =>
  {
    // Config
    const isDevEnvironment = hre.network.name == "hardhat" 
        || hre.network.name == "ganache" 
        || hre.network.name == "localhost";

    const appConfig = await loadConfigAsync(taskArguments.origin);
    const config = appConfig.networks[
        isDevEnvironment ? "development" : hre.network.name];

    const deploymentManger = new DeploymentManager(hre.network.name);
    const peer = config.layerZero.peers[taskArguments.destination];
    
    const originOFTAddress = deploymentManger.getContractDeployment(
      config.layerZero.adapter ? config.layerZero.adapter : config.layerZero.token).address;
    const originOFTInstance = await hre.ethers.getContractAt("OFT", originOFTAddress);

    const from = (await hre.ethers.getSigners())[0].address;
    const to = taskArguments.to ? taskArguments.to : from;

    const amountInWei = hre.ethers.utils
      .parseEther(taskArguments.amount)
      .toString();

    // Approve the OFT adapter to spend the tokens
    if (config.layerZero.adapter)
    {
        const originTokenAddress = deploymentManger.getContractDeployment(config.layerZero.token).address;
        const originTokenInstance = await hre.ethers.getContractAt("ERC20", originTokenAddress);
        await originTokenInstance.approve(originOFTAddress, originTokenAddress);
    }

    // Send the tokens
    const extraOptions = Options.newOptions()
        .addExecutorLzReceiveOption(200000, 0)
        .toHex()
        .toString();

    const sendParam: SendParamStruct = {
        dstEid: peer.endpointId,
        to: hre.ethers.utils.zeroPad(to, 32),
        amountLD: amountInWei,
        minAmountLD: amountInWei,
        extraOptions: extraOptions,
        composeMsg: `0x`,
        oftCmd: `0x`
    };

    const [nativeFee] = await originOFTInstance
        .quoteSend(sendParam, false);
    const messagingFee: MessagingFeeStruct = {
        nativeFee: nativeFee,
        lzTokenFee: 0
    };

    await originOFTInstance.send(sendParam, messagingFee, to, 
    {
      value: nativeFee
    });
  });


  /**
   * Get the balance of the specified account on the specified chain
   * 
   * npx hardhat balance --network localhost --chain "ethereum" 
   * npx hardhat balance --network localhost --chain "polygon" 
   * 
   * npx hardhat balance --network ethereumSepolia --chain "ethereum" 
   * npx hardhat balance --network polygonAmoy --chain "polygon" 
   * 
   * npx hardhat balance --network ethereumMainnet --chain "ethereum" 
   * npx hardhat balance --network polygonMainnet --chain "polygon" 
   */
  task("balance", "Get the balance of the specified account")
  .addParam("chain", "The chain to get the balance on")
  .addOptionalParam("account", "The account to get the balance for")
  .setAction(async (taskArguments, hre) =>
  {
    // Config
    const isDevEnvironment = hre.network.name == "hardhat" 
        || hre.network.name == "ganache" 
        || hre.network.name == "localhost";

    const appConfig = await loadConfigAsync(taskArguments.chain);
    const config = appConfig.networks[
        isDevEnvironment ? "development" : hre.network.name];
    const deploymentManger = new DeploymentManager(hre.network.name);

    const tokenAddress = deploymentManger.getContractDeployment(
      config.layerZero.token).address;
    const tokenInstance = await hre.ethers.getContractAt("ERC20", tokenAddress);

    const account = taskArguments.account ? taskArguments.account : 
        (await hre.ethers.getSigners())[0].address;

    const balance = await tokenInstance.balanceOf(account);
    const balanceFormatted = hre.ethers.utils.formatUnits(balance, 'ether');

    console.log(`The balance of ${chalk.cyan(account)} on ${chalk.yellow(hre.network.name)} is ${chalk.bold(balanceFormatted)}`);
  });