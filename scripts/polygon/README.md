## Scripts

Deploy:
npx hardhat run --network localhost ./scripts/polygon/deploy.ts
npx hardhat run --network polygonMumbai ./scripts/polygon/deploy.ts
npx hardhat run --network polygonMainnet ./scripts/polygon/deploy.ts

Verify:
npx hardhat run --network polygonMumbai ./scripts/polygon/verify.ts
npx hardhat run --network polygonMainnet ./scripts/polygon/verify.ts