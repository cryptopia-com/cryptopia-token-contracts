## Scripts

Deploy: 
npx hardhat run --network ethereumSepolia ./scripts/ethereum/deploy.ts 
npx hardhat run --network polygonAmoy ./scripts/polygon/deploy.ts 
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/deploy.ts 
npx hardhat run --network skaleNebulaTestnet ./scripts/skale/nebula/deploy.ts
npx hardhat run --network bnbTestnet ./scripts/bnb/deploy.ts 

Setup LayerZero (Ensure all tokens are deployed first!): 
npx hardhat run --network ethereumSepolia ./scripts/ethereum/layerzero/setup.ts 
npx hardhat run --network polygonAmoy ./scripts/polygon/layerzero/setup.ts 
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/layerzero/setup.ts
npx hardhat run --network bnbTestnet ./scripts/bnb/layerzero/setup.ts 

Verify: 
npx hardhat run --network ethereumSepolia ./scripts/ethereum/verify.ts 
npx hardhat run --network polygonAmoy ./scripts/polygon/verify.ts 
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/verify.ts 
npx hardhat run --network skaleNebulaTestnet ./scripts/skale/nebula/verify.ts
npx hardhat run --network bnbTestnet ./scripts/bnb/verify.ts 

Port: 
npx hardhat run ./scripts/port.ts
