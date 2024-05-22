## Scripts

Deploy: 
npx hardhat run --network localhost ./scripts/ethereum/deploy.ts 
npx hardhat run --network localhost ./scripts/polygon/deploy.ts 
npx hardhat run --network localhost ./scripts/skale/europa/deploy.ts 
npx hardhat run --network localhost ./scripts/skale/nebula/deploy.ts

Setup LayerZero (Ensure all tokens are deployed first!): 
npx hardhat run --network localhost ./scripts/ethereum/layerzero/setup.ts 
npx hardhat run --network localhost ./scripts/polygon/layerzero/setup.ts 
npx hardhat run --network localhost ./scripts/skale/europa/layerzero/setup.ts

Port: 
npx hardhat run ./scripts/port.ts