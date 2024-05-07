import ora from 'ora-classic';
import chalk from 'chalk';
import hre from "hardhat"; 
import { DeploymentManager } from "../helpers/deployments";

const deploymentManager = new DeploymentManager(hre.network.name);

/**
 * Verify contracts on Etherscan.
 * 
 * npx hardhat run --network polygonAmoy ./scripts/polygon/verify.ts
 * npx hardhat run --network polygonMainnet ./scripts/polygon/verify.ts
 */
async function main() {

    const contractName = "CryptosTokenPolygon";
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
                contract: "contracts/source/polygon/CryptosTokenPolygon.sol:CryptosTokenPolygon"
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