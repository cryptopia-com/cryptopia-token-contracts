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
    let other: string;

    // Instances
    let cryptosTokenInstance: CryptosToken;

    /**
     * Deploy Token Contract
     */
    before(async () => {

        // Accounts
        [deployer, other] = (await ethers.getSigners()).map(s => s.address);

        // Factories
        const CryptosTokenFactory = await ethers.getContractFactory("CryptosToken");
        
        // Deploy Inventories
        cryptosTokenInstance = await CryptosTokenFactory.deploy(deployer);
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

        it ("Deployer should be owner", async () => {
                
                // Act
                const owner = await cryptosTokenInstance.owner();

                // Assert
                expect(owner).to.equal(deployer);
        });
    });

    /**
     * Test failsafe    
     */
    describe("Failsafe", function () {

        const lostAmount = ethers.utils.parseEther("999");

        /**
         * Transfer tokens by accident
         */
        before(async () => {

            // Transfer tokens to the contract
            await cryptosTokenInstance.transfer(
                cryptosTokenInstance.address, lostAmount);
        });

        it ("Non-Owner should not be able to retrieve tokens", async () => {
                
                // Setup
                const tokenAddress = cryptosTokenInstance.address;
                const nonAdminSigner = ethers.provider.getSigner(other);
 
                // Act
                const operation = cryptosTokenInstance
                    .connect(nonAdminSigner)
                    .retrieveTokens(tokenAddress);

                // Assert
                await expect(operation).to.be
                    .revertedWithCustomError(cryptosTokenInstance, "OwnableUnauthorizedAccount")
                    .withArgs(other);
        });

        it ("Owner should be able to retrieve tokens", async () => {
                
            // Setup
            const tokenAddress = cryptosTokenInstance.address;
            const balanceBefore = await cryptosTokenInstance.balanceOf(deployer);

            // Act
            await cryptosTokenInstance.retrieveTokens(tokenAddress);

            // Assert
            const balanceAfter = await cryptosTokenInstance.balanceOf(deployer);
            expect(balanceAfter).to.equal(balanceBefore.add(lostAmount));

            const balanceContract = await cryptosTokenInstance.balanceOf(tokenAddress);
            expect(balanceContract).to.equal(0);
        });

        it ("Should emit RetrieveTokens event", async () => {
                
            // Setup
            const tokenAddress = cryptosTokenInstance.address;

            await cryptosTokenInstance.transfer(
                cryptosTokenInstance.address, lostAmount);
            
            // Act
            const operation = cryptosTokenInstance
                .retrieveTokens(tokenAddress);

            // Assert
            await expect(operation).to
                .emit(cryptosTokenInstance, "RetrieveTokens")
                .withArgs(tokenAddress, deployer, lostAmount);
        });
    });
});