import chalk from 'chalk';
import { HardhatUserConfig, task } from "hardhat/config";
import { LayerZeroConfig } from './scripts/types/LayerZeroConfig';
import "@nomicfoundation/hardhat-toolbox";

import { 
  MessagingFeeStruct, 
  SendParamStruct 
} from "./typechain-types/contracts/source/ethereum/CryptosToken.js";
import { DeploymentManager } from "./scripts/helpers/deployments";

let secret: any = {};
try {
  secret = JSON.parse(
    require('fs')
      .readFileSync(".secret")
      .toString()
      .trim());
} catch (error) {
  console.warn("Warning: .secret file is missing. Using empty config.");
}

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
      url: "https://go.getblock.io/8e9b429a2cc7420b8f68297565f5ab82",
      chainId: 137,
      accounts: {
        mnemonic: secret.polygonMainnet.mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    },
    skaleNebulaTestnet: {
      url: "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet",
      chainId: 37084624,
      accounts: {
        mnemonic: secret.skaleNebulaTestnet.mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    },
    skaleNebulaMainnet: {
      url: "https://mainnet.skalenodes.com/v1/green-giddy-denebola",
      chainId: 1482601649,
      accounts: {
        mnemonic: secret.skaleNebulaMainnet.mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    },
    skaleEuropaTestnet: {
      url: "https://testnet.skalenodes.com/v1/juicy-low-small-testnet",
      chainId: 1444673419,
      accounts: {
        mnemonic: secret.skaleEuropaTestnet.mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    },
    skaleEuropaMainnet: {
      url: "https://mainnet.skalenodes.com/v1/elated-tan-skat",
      chainId: 2046399126,
      accounts: {
        mnemonic: secret.skaleEuropaMainnet.mnemonic,
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
      mainnet: secret.ethereumMainnet.etherscan,
      sepolia: secret.ethereumSepolia.etherscan,
      polygon: secret.polygonMainnet.etherscan,
      polygonAmoy: secret.polygonAmoy.etherscan,
      skaleNebulaTestnet: secret.skaleNebulaTestnet.etherscan,
      skaleNebulaMainnet: secret.skaleNebulaMainnet.etherscan,
      skaleEuropaTestnet: secret.skaleEuropaTestnet.etherscan,
      skaleEuropaMainnet: secret.skaleEuropaMainnet.etherscan
    },
    customChains: [
      {
        network: "skaleNebulaTestnet",
        chainId: 37084624,
        urls: {
            apiURL: "https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com/api",
            browserURL: "https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com"
        }
      },
      {
        network: "skaleNebulaMainnet",
        chainId: 1482601649,
        urls: {
            apiURL: "https://green-giddy-denebola.explorer.mainnet.skalenodes.com/api",
            browserURL: "https://green-giddy-denebola.explorer.mainnet.skalenodes.com"
        }
      },
      {
        network: "skaleEuropaTestnet",
        chainId: 1444673419,
        urls: {
            apiURL: "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com/api",
            browserURL: "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com"
        }
      },
      {
        network: "skaleEuropaMainnet",
        chainId: 2046399126,
        urls: {
            apiURL: "https://elated-tan-skat.explorer.mainnet.skalenodes.com/api",
            browserURL: "https://elated-tan-skat.explorer.mainnet.skalenodes.com"
        }
      }
    ]
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
 * Read the LZ config for a pathway
 * 
 * npx hardhat config --network localhost --origin "ethereum" --destination "skale"
 * npx hardhat config --network localhost --origin "polygon" --destination "ethereum" 
 * npx hardhat config --network localhost --origin "skale" --destination "ethereum" 
 * 
 * npx hardhat config --network ethereumSepolia --origin "ethereum" --destination "skale" 
 * npx hardhat config --network polygonAmoy --origin "polygon" --destination "ethereum" 
 * npx hardhat config --network skaleEuropaTestnet --origin "skale" --destination "ethereum" 
 * 
 * npx hardhat config --network ethereumMainnet --origin "ethereum" --destination "skale" 
 * npx hardhat config --network polygonMainnet --origin "polygon" --destination "skale" 
 * npx hardhat config --network skaleEuropaMainnet --origin "skale" --destination "ethereum" 
 */
task("config", "Read the LZ config for a pathway")
  .addParam("origin", "The origin of the pathway")
  .addParam("destination", "The destination of the pathway")
  .setAction(async (taskArguments, hre) =>
  {
    // Config
    const isDevEnvironment = hre.network.name == "hardhat" 
        || hre.network.name == "ganache" 
        || hre.network.name == "localhost";

    const chain =  taskArguments.origin[0].toUpperCase() + taskArguments.origin.slice(1);;
    if (taskArguments.origin == "skale")
    {
        taskArguments.origin = "skale.europa";
    }

    const appConfig = await loadConfigAsync(taskArguments.origin);
    const config = appConfig.networks[
        isDevEnvironment ? "development" : hre.network.name];

    const deploymentManger = new DeploymentManager(hre.network.name);
    const peer = config.layerZero.peers[taskArguments.destination];
    
    const oappAddress = deploymentManger.getContractDeployment(
     config.layerZero.adapter ? config.layerZero.adapter : config.layerZero.token).address;
    const remoteEid = peer.endpointId; 

    let ethereumLzEndpointAddress = config.layerZero.endpoint.endpointLocation;
    if (!config.layerZero.endpoint.endpointLocation.startsWith("0x"))
    {
        ethereumLzEndpointAddress = deploymentManger.getContractDeployment(
          `${config.layerZero.endpoint.endpointLocation}:${chain.charAt(0).toUpperCase() + chain.slice(1)}`).address;
    }

    const endpointInstance = await hre.ethers.getContractAt("ILayerZeroEndpointV2", ethereumLzEndpointAddress);
    const sendLibAddress = await endpointInstance.getSendLibrary(oappAddress, remoteEid);
    const receiveLibAddress = (await endpointInstance.getReceiveLibrary(oappAddress, remoteEid)).lib;
    const executorConfigType = 1; // 1 for executor
    const ulnConfigType = 2; // 2 for UlnConfig

    try {
      // Fetch and decode for sendLib (both Executor and ULN Config)
      const sendExecutorConfigBytes = await endpointInstance.getConfig(
        oappAddress,
        sendLibAddress,
        remoteEid,
        executorConfigType,
      );
      const executorConfigAbi = ['tuple(uint32 maxMessageSize, address executorAddress)'];
      const executorConfigArray = hre.ethers.utils.defaultAbiCoder.decode(
        executorConfigAbi,
        sendExecutorConfigBytes,
      );
      console.log('Send Library Executor Config:', executorConfigArray);
  
      const sendUlnConfigBytes = await endpointInstance.getConfig(
        oappAddress,
        sendLibAddress,
        remoteEid,
        ulnConfigType,
      );
      const ulnConfigStructType = [
        'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)',
      ];
      const sendUlnConfigArray = hre.ethers.utils.defaultAbiCoder.decode(
        ulnConfigStructType,
        sendUlnConfigBytes,
      );
      console.log('Send Library ULN Config:', sendUlnConfigArray);
  
      // Fetch and decode for receiveLib (only ULN Config)
      const receiveUlnConfigBytes = await endpointInstance.getConfig(
        oappAddress,
        receiveLibAddress,
        remoteEid,
        ulnConfigType,
      );
      const receiveUlnConfigArray = hre.ethers.utils.defaultAbiCoder.decode(
        ulnConfigStructType,
        receiveUlnConfigBytes,
      );
      console.log('Receive Library ULN Config:', receiveUlnConfigArray);
    } catch (error) {
      console.error('Error fetching or decoding config:', error);
    }
  });

/**
 * Bridge tokens
 * 
 * npx hardhat bridge --network localhost --origin "ethereum" --destination "skale" --amount "100"
 * npx hardhat bridge --network localhost --origin "polygon" --destination "ethereum" --amount "100"
 * npx hardhat bridge --network localhost --origin "skale" --destination "ethereum" --amount "100"
 * 
 * npx hardhat bridge --network ethereumSepolia --origin "ethereum" --destination "skale" --amount "9999"
 * npx hardhat bridge --network polygonAmoy --origin "polygon" --destination "skale" --amount "1"
 * npx hardhat bridge --network skaleEuropaTestnet --origin "skale" --destination "ethereum" --amount "100"
 * 
 * npx hardhat bridge --network ethereumMainnet --origin "ethereum" --destination "skale" --amount "1"
 * npx hardhat bridge --network polygonMainnet --origin "polygon" --destination "skale" --amount "1"
 * npx hardhat bridge --network skaleEuropaMainnet --origin "skale" --destination "ethereum" --amount "100"
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

    const chain =  taskArguments.origin[0].toUpperCase() + taskArguments.origin.slice(1);;
    if (taskArguments.origin == "skale")
    {
        taskArguments.origin = "skale.europa";
    }

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
    const sendParam: SendParamStruct = {
        dstEid: peer.endpointId,
        to: hre.ethers.utils.zeroPad(to, 32),
        amountLD: amountInWei,
        minAmountLD: amountInWei,
        extraOptions: `0x`,
        composeMsg: `0x`,
        oftCmd: `0x`
    };

    const [nativeFee] = await originOFTInstance
        .quoteSend(sendParam, false);
    const messagingFee: MessagingFeeStruct = {
        nativeFee: nativeFee,
        lzTokenFee: 0
    };

    // Approve the alt token spending if required
    if (config.layerZero.endpoint.endpointAltToken)  
    {
      let nativeTokenAddress: string;
      if (!config.layerZero.endpoint.endpointAltToken.startsWith("0x"))
      {
        nativeTokenAddress = deploymentManger.getContractDeployment(
          `${config.layerZero.endpoint.endpointAltToken}:${chain}`).address;
      }
      else 
      {
        nativeTokenAddress = config.layerZero.endpoint.endpointAltToken;
      }

      const nativeTokenInstance = await hre.ethers.getContractAt("ERC20", nativeTokenAddress);
      const allowance = await nativeTokenInstance.allowance(from, originOFTAddress);
      if (allowance < nativeFee)
      {
        await nativeTokenInstance.approve(originOFTAddress, nativeFee.sub(allowance));
      }
    }

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
   * npx hardhat balance --network localhost --chain "skale" 
   * 
   * npx hardhat balance --network ethereumSepolia --chain "ethereum" 
   * npx hardhat balance --network polygonAmoy --chain "polygon" 
   * npx hardhat balance --network skaleEuropaTestnet --chain "skale" 
   * 
   * npx hardhat balance --network ethereumMainnet --chain "ethereum" 
   * npx hardhat balance --network polygonMainnet --chain "polygon" 
   * npx hardhat balance --network skaleEuropaMainnet --chain "skale" 
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

    if (taskArguments.chain == "skale")
    {
        taskArguments.chain = "skale.europa";
    }

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

  /**
   * Fund the specified account on the specified chain (alt endpoints only)
   * 
   * npx hardhat fund --network localhost --chain "skale" --amount "1" 
   */
  task("fund", "Fund the specified account on the specified chain (alt endpoints only)")
  .addParam("chain", "The chain to fund the account on")
  .addParam("amount", "The amount to fund the account with")
  .addOptionalParam("account", "The account to fund")
  .setAction(async (taskArguments, hre) =>
  {
    // Config
    const isDevEnvironment = hre.network.name == "hardhat" 
        || hre.network.name == "ganache" 
        || hre.network.name == "localhost";

    const chain =  taskArguments.chain[0].toUpperCase() + taskArguments.chain.slice(1);;
    if (taskArguments.chain == "skale")
    {
        taskArguments.chain = "skale.europa";
    }

    const appConfig = await loadConfigAsync(taskArguments.chain);
    const config = appConfig.networks[
        isDevEnvironment ? "development" : hre.network.name];
    const deploymentManger = new DeploymentManager(hre.network.name);

    const tokenAddress = deploymentManger.getContractDeployment(`MockLayerZeroEndpointAltToken:${chain}`).address;
    const tokenInstance = await hre.ethers.getContractAt("MockLayerZeroEndpointAltToken", tokenAddress);

    const account = taskArguments.account ? taskArguments.account : 
        (await hre.ethers.getSigners())[0].address;

    const amountInWei = hre.ethers.utils
        .parseEther(taskArguments.amount)
        .toString();

    await tokenInstance.mint(account, amountInWei);
  });