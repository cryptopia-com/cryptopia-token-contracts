## Scripts

Deploy:
npx hardhat run --network localhost ./scripts/skale/deploy.ts
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/deploy.ts

Setup LayerZero (Ensure all tokens are deployed first!):
npx hardhat run --network localhost ./scripts/skale/layerzero/setup.ts
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/layerzero/setup.ts

Verify:
npx hardhat run --network skaleEuropaTestnet ./scripts/skale/verify.ts