## Scripts

Deploy: 
npx hardhat run --network ethereumSepolia ./scripts/ethereum/deploy.ts 
npx hardhat run --network polygonAmoy ./scripts/polygon/deploy.ts 
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/deploy.ts 
npx hardhat run --network skaleNebulaTestnet ./scripts/skale/nebula/deploy.ts

Setup LayerZero (Ensure all tokens are deployed first!): 
npx hardhat run --network ethereumSepolia ./scripts/ethereum/layerzero/setup.ts 
npx hardhat run --network polygonAmoy ./scripts/polygon/layerzero/setup.ts 
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/layerzero/setup.ts

Port: 
npx hardhat run ./scripts/port.ts
