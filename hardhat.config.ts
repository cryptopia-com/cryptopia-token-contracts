import { HardhatUserConfig, task } from "hardhat/config";
import { LayerZeroConfig } from './scripts/types/LayerZeroConfig';
import "@nomicfoundation/hardhat-toolbox";

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
    polygonMumbai: {
      url: "https://go.getblock.io/07d076840042416eb75709631abdb21a",
      chainId: 80001,
      accounts: {
        mnemonic: secret.polygonMumbai.mnemonic,
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
    },
    skaleChaos: {
      url: "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix",
      chainId: 1351057110,
      accounts: {
        mnemonic: secret.skaleChaos.mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    },
    skaleNebulaTestnet: {
      url: "https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird",
      chainId: 503129905,
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
      polygonMumbai: secret.polygonMumbai.etherscan,
      skaleChaos: secret.skaleChaos.etherscan,
      skaleNebulaTestnet: secret.skaleNebulaTestnet.etherscan,
      skaleNebulaMainnet: secret.skaleNebulaMainnet.etherscan
    },
    customChains: [
      {
        network: "skaleChaos",
        chainId: 1351057110,
        urls: {
            apiURL: "https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com/api",
            browserURL: "https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com"
        }
      },
      {
        network: "skaleNebulaTestnet",
        chainId: 503129905,
        urls: {
            apiURL: "https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com/api",
            browserURL: "https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com"
        }
      },
      {
        network: "skaleNebulaMainnet",
        chainId: 1482601649,
        urls: {
            apiURL: "https://green-giddy-denebola.explorer.mainnet.skalenodes.com//api",
            browserURL: "https://green-giddy-denebola.explorer.mainnet.skalenodes.com/"
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
 * Bridge tokens
 * 
 * npx hardhat bridge --network ethereumSepolia --origin "ethereum" --destination "polygon" --amount 100
 */
task("bridge", "Transfer tokens between blockchains")
  .addParam("origin", "The network to bridge from")
  .addParam("destination", "The network to bridge to")
  .addParam("amount", "The amount of tokens to bridge")
  .setAction(async (taskArguments, hre) =>
  {
    // Config
    const isDevEnvironment = hre.network.name == "hardhat" 
        || hre.network.name == "ganache" 
        || hre.network.name == "localhost";

    const appConfig = await loadConfigAsync(origin);
    const config = appConfig.networks[
        isDevEnvironment ? "development" : hre.network.name];

    const endpoint = config.layerZero.endpoint;
    const peer = config.layerZero.peers[taskArguments.origin];

    const deploymentManager = new DeploymentManager(
        hre.network.name, config.development);

    let to = "";
    if (taskArguments.inventory == "Backpack" || taskArguments.inventory == "Ship")
    {
      const inventoriesDeployment = await deploymentManager.getContractDeployment(deploymentManager.resolveContractName("Inventories"));
      to = inventoriesDeployment.address;
    }
    else
    {
      to = taskArguments.to;
    }

    const tokenDeployment = await deploymentManager.getContractDeployment(deploymentManager.resolveDeploymentKey("AssetToken:" + taskArguments.resource));
    const tokenInstance = await hre.ethers.getContractAt(deploymentManager.resolveContractName("AssetToken"), tokenDeployment.address);
    await tokenInstance.__mintTo(to, taskArguments.amount);

    if (taskArguments.inventory == "Backpack" || taskArguments.inventory == "Ship")
    {
      const inventoriesDeployment = await deploymentManager.getContractDeployment(deploymentManager.resolveContractName("Inventories"));
      const inventoriesInstance = await hre.ethers.getContractAt(deploymentManager.resolveContractName("Inventories"), inventoriesDeployment.address);
      await inventoriesInstance.__assignFungibleToken(taskArguments.to, taskArguments.inventory == "Backpack" ? 1 : 2, tokenInstance.address, taskArguments.amount);
    }
  });