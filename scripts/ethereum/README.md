## Scripts

Deploy:
npx hardhat run --network localhost ./scripts/ethereum/deploy.ts
npx hardhat run --network ethereumSepolia ./scripts/ethereum/deploy.ts
npx hardhat run --network ethereumMainnet ./scripts/ethereum/deploy.ts

Setup LayerZero (Ensure all tokens are deployed first!):
npx hardhat run --network localhost ./scripts/ethereum/layerzero/setup.ts
npx hardhat run --network ethereumSepolia ./scripts/ethereum/layerzero/setup.ts
npx hardhat run --network ethereumMainnet ./scripts/ethereum/layerzero/setup.ts

Verify:
npx hardhat run --network ethereumGoerli ./scripts/ethereum/verify.ts
npx hardhat run --network ethereumMainnet ./scripts/ethereum/verify.ts