## Scripts

Deploy:
npx hardhat run --network localhost ./scripts/ethereum/deploy.ts
npx hardhat run --network ethereumGoerli ./scripts/ethereum/deploy.ts
npx hardhat run --network ethereumMainnet ./scripts/ethereum/deploy.ts

Verify:
npx hardhat run --network ethereumGoerli ./scripts/ethereum/verify.ts
npx hardhat run --network ethereumMainnet ./scripts/ethereum/verify.ts