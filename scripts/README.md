## Scripts

Deploy: 
npx hardhat run --network localhost ./scripts/ethereum/deploy.ts 
npx hardhat run --network localhost ./scripts/polygon/deploy.ts 
npx hardhat run --network localhost ./scripts/skale/europa/deploy.ts 
npx hardhat run --network localhost ./scripts/skale/nebula/deploy.ts
npx hardhat run --network localhost ./scripts/bnb/deploy.ts 
npx hardhat run --network localhost ./scripts/base/deploy.ts 

Setup LayerZero (Ensure all tokens are deployed first!): 
npx hardhat run --network localhost ./scripts/ethereum/layerzero/setup.ts 
npx hardhat run --network localhost ./scripts/polygon/layerzero/setup.ts 
npx hardhat run --network localhost ./scripts/skale/europa/layerzero/setup.ts
npx hardhat run --network localhost ./scripts/bnb/layerzero/setup.ts 
npx hardhat run --network localhost ./scripts/base/layerzero/setup.ts 




Deploy: 
npx hardhat run --network ethereumSepolia ./scripts/ethereum/deploy.ts 
npx hardhat run --network polygonAmoy ./scripts/polygon/deploy.ts 
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/deploy.ts 
npx hardhat run --network skaleNebulaTestnet ./scripts/skale/nebula/deploy.ts
npx hardhat run --network bnbTestnet ./scripts/bnb/deploy.ts 
npx hardhat run --network baseTestnet ./scripts/base/deploy.ts 

Setup LayerZero (Ensure all tokens are deployed first!): 
npx hardhat run --network ethereumSepolia ./scripts/ethereum/layerzero/setup.ts 
npx hardhat run --network polygonAmoy ./scripts/polygon/layerzero/setup.ts 
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/layerzero/setup.ts
npx hardhat run --network bnbTestnet ./scripts/bnb/layerzero/setup.ts 
npx hardhat run --network baseTestnet ./scripts/base/layerzero/setup.ts 

Verify: 
npx hardhat run --network ethereumSepolia ./scripts/ethereum/verify.ts 
npx hardhat run --network polygonAmoy ./scripts/polygon/verify.ts 
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/verify.ts 
npx hardhat run --network skaleNebulaTestnet ./scripts/skale/nebula/verify.ts
npx hardhat run --network bnbTestnet ./scripts/bnb/verify.ts 
npx hardhat run --network baseTestnet ./scripts/base/verify.ts 



Deploy: 
npx hardhat run --network ethereumMainnet ./scripts/ethereum/deploy.ts 
npx hardhat run --network polygonMainnet ./scripts/polygon/deploy.ts 
npx hardhat run --network skaleEuropaMainnet ./scripts/skale/europa/deploy.ts 
npx hardhat run --network skaleNebulaMainnet ./scripts/skale/nebula/deploy.ts
npx hardhat run --network bnbMainnet ./scripts/bnb/deploy.ts 
npx hardhat run --network baseMainnet ./scripts/base/deploy.ts 

Setup LayerZero (Ensure all tokens are deployed first!): 
npx hardhat run --network ethereumMainnet ./scripts/ethereum/layerzero/setup.ts 
npx hardhat run --network polygonMainnet ./scripts/polygon/layerzero/setup.ts 
npx hardhat run --network skaleEuropaMainnet ./scripts/skale/europa/layerzero/setup.ts
npx hardhat run --network bnbMainnet ./scripts/bnb/layerzero/setup.ts 
npx hardhat run --network baseMainnet ./scripts/base/layerzero/setup.ts 

Verify: 
npx hardhat run --network ethereumMainnet ./scripts/ethereum/verify.ts 
npx hardhat run --network polygonMainnet ./scripts/polygon/verify.ts 
npx hardhat run --network skaleEuropaMainnet ./scripts/skale/europa/verify.ts 
npx hardhat run --network skaleNebulaMainnet ./scripts/skale/nebula/verify.ts
npx hardhat run --network bnbMainnet ./scripts/bnb/verify.ts 
npx hardhat run --network baseMainnet ./scripts/base/verify.ts 



Port: 
npx hardhat run ./scripts/port.ts
