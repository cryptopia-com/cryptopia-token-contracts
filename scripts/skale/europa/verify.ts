import ora from 'ora-classic';
import chalk from 'chalk';
import hre from "hardhat"; 
import { DeploymentManager } from "../../helpers/deployments";

const deploymentManager = new DeploymentManager(hre.network.name);

/**
 * Verify contracts on Etherscan.
 * 
 * npx hardhat run --network skaleEuropaTestnet ./scripts/skale/europa/verify.ts
 * npx hardhat run --network skaleEuropaMainnet ./scripts/skale/europa/verify.ts
 */
async function main() {

    const isTestnet = hre.network.name.includes("Testnet");
    const contractName = "CryptosTokenSkaleEuropa";
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
                contract: isTestnet 
                    ? "contracts/test/skale/europa/DevelopmentTokenSkaleEuropa.sol:DevelopmentTokenSkaleEuropa" 
                    : "contracts/source/skale/europa/CryptosTokenSkaleEuropa.sol:CryptosTokenSkaleEuropa"
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