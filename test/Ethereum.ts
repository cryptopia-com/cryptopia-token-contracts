import "../scripts/helpers/converters.ts";
import { expect } from "chai";
import { ethers } from "hardhat";

import { 
    CryptosToken
} from "../typechain-types";

/**
 * CryptosToken on Ethereum (parent)
 */
describe("Ethereum", function () {

    // Accounts
    let deployer: string;

    // Instances
    let cryptosTokenInstance: CryptosToken;

    /**
     * Deploy Crafting Contracts
     */
    before(async () => {

        // Accounts
        [deployer] = (await ethers.getSigners()).map(s => s.address);

        // Factories
        const CryptosTokenFactory = await ethers.getContractFactory("CryptosToken");
        
        // Deploy Inventories
        cryptosTokenInstance = await CryptosTokenFactory.deploy();
    });

    /**
     * Test deploy
     */
    describe("Deploy", function () {

        it("There should be 10 billion tokens", async () => {

            // Setup
            const expected = ethers.utils.parseEther("10000000000");

            // Act
            const actual = await cryptosTokenInstance.totalSupply();

            // Assert
            expect(actual).to.equal(expected);
        });

        it ("Deployer should own all tokens", async () => {

            // Setup
            const expected = ethers.utils.parseEther("10000000000");

            // Act
            const actual = await cryptosTokenInstance.balanceOf(deployer);

            // Assert
            expect(actual).to.equal(expected);
        });

        it ("Deployer should have the DEFAULT_ADMIN role", async () => {
                
                // Setup
                const expected = true;
                const role = await cryptosTokenInstance.DEFAULT_ADMIN_ROLE();

                // Act
                const actual = await cryptosTokenInstance.hasRole(role, deployer);

                // Assert
                expect(actual).to.equal(expected);
        });
    });
});