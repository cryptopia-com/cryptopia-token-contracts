import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const secret = JSON.parse(
  require('fs')
    .readFileSync(".secret")
    .toString()
    .trim());

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    ethereumGoerli: {
      url: "https://go.getblock.io/79e554c44ca544ba885b4728daf91a54",
      chainId: 5,
      accounts: {
        mnemonic: secret.ethereumGoerli.mnemonic,
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
      url: "https://go.getblock.io/b0287fc41bb446f196b744cc5471be37",
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
    version: "0.8.20",
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