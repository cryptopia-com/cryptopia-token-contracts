## Scripts

Deploy:
npx hardhat run --network localhost ./scripts/bnb/deploy.ts
npx hardhat run --network bnbTestnet ./scripts/bnb/deploy.ts
npx hardhat run --network bnbMainnet ./scripts/bnb/deploy.ts

Setup LayerZero (Ensure all tokens are deployed first!):
npx hardhat run --network localhost ./scripts/bnb/layerzero/setup.ts
npx hardhat run --network bnbTestnet ./scripts/bnb/layerzero/setup.ts
npx hardhat run --network bnbMainnet ./scripts/bnb/layerzero/setup.ts

Verify:
npx hardhat run --network bnbTestnet ./scripts/bnb/verify.ts
npx hardhat run --network bnbMainnet ./scripts/bnb/verify.ts