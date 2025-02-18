## Scripts

Deploy:
npx hardhat run --network localhost ./scripts/base/deploy.ts
npx hardhat run --network baseTestnet ./scripts/base/deploy.ts
npx hardhat run --network baseMainnet ./scripts/base/deploy.ts

Setup LayerZero (Ensure all tokens are deployed first!):
npx hardhat run --network localhost ./scripts/base/layerzero/setup.ts
npx hardhat run --network baseTestnet ./scripts/base/layerzero/setup.ts
npx hardhat run --network baseMainnet ./scripts/base/layerzero/setup.ts

Verify:
npx hardhat run --network baseTestnet ./scripts/base/verify.ts
npx hardhat run --network baseMainnet ./scripts/base/verify.ts