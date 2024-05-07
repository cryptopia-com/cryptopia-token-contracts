## Scripts

Deploy:
npx hardhat run --network localhost ./scripts/polygon/deploy.ts
npx hardhat run --network polygonAmoy ./scripts/polygon/deploy.ts
npx hardhat run --network polygonMainnet ./scripts/polygon/deploy.ts

Setup LayerZero (Ensure all tokens are deployed first!):
npx hardhat run --network localhost ./scripts/polygon/layerzero/setup.ts
npx hardhat run --network polygonAmoy ./scripts/polygon/layerzero/setup.ts
npx hardhat run --network polygonMainnet ./scripts/polygon/layerzero/setup.ts

Verify:
npx hardhat run --network polygonAmoy ./scripts/polygon/verify.ts
npx hardhat run --network polygonMainnet ./scripts/polygon/verify.ts