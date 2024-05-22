## Scripts

Deploy: 
npx hardhat run --network localhost ./scripts/skale/europa/deploy.ts 
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/deploy.ts
npx hardhat run --network skaleEuropaMainnet ./scripts/skale/europa/deploy.ts

Setup LayerZero (Ensure all tokens are deployed first!):
npx hardhat run --network localhost ./scripts/skale/europa/layerzero/setup.ts
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/layerzero/setup.ts
npx hardhat run --network skaleEuropaMainnet ./scripts/skale/europa/layerzero/setup.ts

Verify: 
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/verify.ts
npx hardhat run --network skaleEuropaMainnet ./scripts/skale/europa/verify.ts