## Scripts

Deploy: 
npx hardhat run --network localhost ./scripts/skale/nebula/deploy.ts 
npx hardhat run --network skaleNebulaTestnet ./scripts/skale/nebula/deploy.ts
npx hardhat run --network skaleNebulaMainnet ./scripts/skale/nebula/deploy.ts

Verify: 
npx hardhat run --network skaleNebulaTestnet ./scripts/skale/nebula/verify.ts
npx hardhat run --network skaleNebulaMainnet ./scripts/skale/nebula/verify.ts