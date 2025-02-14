![CI](https://github.com/cryptopia-com/cryptopia-token-contracts/actions/workflows/hardhat-ci.yml/badge.svg?branch=development)

# Cryptopia Token Contracts

## Overview

Welcome to the Cryptopia Token Contracts repository. These Ethereum smart contracts are designed to power the token functionalities of Cryptopia, an innovative blockchain-based game pioneering the future of decentralized, play-to-earn gaming.

**Repository URI**: [Cryptopia Token Contracts on GitHub](https://github.com/cryptopia-com/cryptopia-token-contracts.git)

## Pre-requisites

- Node.js v14.x.x or above
- npm v6.x.x or above

## Installation

1. **Clone the Repository**
```bash
git clone https://github.com/cryptopia-com/cryptopia-token-contracts.git
```

2. **Install Dependencies**
```bash
npm install
```

## Compilation

Compile the contracts with Hardhat:
```bash
npx hardhat compile
```

## Deployment

Deploy contracts to ethereum networks:
```bash
npx hardhat run ./scripts/ethereum/deploy.ts --network <network-name>
```

Deploy contracts to polygon networks:
```bash
npx hardhat run ./scripts/polygon/deploy.ts --network <network-name>
```

## Verify

Verify contracts on ethereum networks:
```bash
npx hardhat run ./scripts/ethereum/verify.ts --network <network-name>
```

Verify contracts on polygon networks:
```bash
npx hardhat run ./scripts/polygon/verify.ts --network <network-name>
```

## Testing

Run tests with Hardhat:
```bash
npx hardhat test
```

## Features

- **Decentralization**: Built to prioritize strong decentralization.
- **Balanced Economics**: Supports both Tycoon and Adventurer strategies.
- **Technological Innovations**: Includes features like Multisig Wallets and P2P Mesh Network.

## License

All rights reserved. Unauthorized copying, modification, or distribution of this project or any of its contents, via any medium, is strictly prohibited. For any form of usage or inquiries, please contact the maintainers.
