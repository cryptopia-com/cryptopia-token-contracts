import ora from 'ora-classic';
import chalk from 'chalk';
import hre from "hardhat"; 
import { DeploymentManager } from "../helpers/deployments";

const deploymentManager = new DeploymentManager(hre.network.name);

/**
 * Verify contracts on BscScan.
 * 
 * npx hardhat run --network bnbTestnet ./scripts/bnb/verify.ts
 * npx hardhat run --network bnbMainnet ./scripts/bnb/verify.ts
 */
async function main() {

    const contractName = "CryptosTokenBNB";
    const deployment = deploymentManager.getContractDeployment(contractName);
    console.log(`\n\nVerifying ${chalk.green(contractName)} on ${chalk.yellow(hre.network.name)}`);

    if (deployment.verified) 
    {
        // Skip
        ora(`Skipping.. (already verified)`).warn();
    }
    else 
    {
        try {
            await hre.run("verify:verify", {
                address: deployment.address,
                constructorArguments: deployment.constructorArguments,
                contract: "contracts/source/bnb/CryptosTokenBNB.sol:CryptosTokenBNB"
            });

            ora(`Successfully verified`).succeed();
        }
        catch (error)
        {
            ora(`Failed to verify: ${error}`).fail();
        }

        deploymentManager.setContractVerified(contractName, true);
    }

    console.log(`\n\nFinished verification on ${chalk.yellow(hre.network.name)}:`);
}

// Deploy
main().catch((error) => 
{
  console.error(error);
  process.exitCode = 1;
});