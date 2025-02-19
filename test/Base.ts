import "../scripts/helpers/converters.ts";
import { expect } from "chai";
import { ethers } from "hardhat";

import { 
    CryptosTokenBase,
    MockERC20
} from "../typechain-types";

/**
 * CryptosToken on Base (child)
 */
describe("Base", function () {

    // Accounts
    let deployer: string;
    let other: string;

    // Instances
    let cryptosTokenInstance: CryptosTokenBase;

    // Settings
    const eidBase = 30184;

    /**
     * Deploy Token Contract
     */
    before(async () => {

        // Accounts
        [deployer, other] = (
            await ethers.getSigners()).map(s => s.address);

        // Factories
        const CryptosTokenFactory = await ethers.getContractFactory("CryptosTokenBase");
        const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
        
        // Deploy endpoint
        const layerZeroEndpointInstance = await LayerZeroEndpointFactory.deploy(eidBase);
        const layerZeroEndpointAddress = await layerZeroEndpointInstance.address;

        // Deploy token
        cryptosTokenInstance = await CryptosTokenFactory.deploy(
            layerZeroEndpointAddress, deployer);
    });

    /**
     * Test deploy
     */
    describe("Deploy", function () {

        it("There should be 0 tokens", async () => {

            // Setup
            const expected = 0;

            // Act
            const actual = await cryptosTokenInstance.totalSupply();

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

        // Instances
        let lostTokenInstance: MockERC20;

        // Settings
        const lostAmount = ethers.utils.parseEther("999");
        
        /**
         * Transfer tokens by accident
         */
        before(async () => {
            const MockERC20Factory = await ethers.getContractFactory("MockERC20");
            lostTokenInstance = await MockERC20Factory.deploy();

            await lostTokenInstance
                .mint(cryptosTokenInstance.address, lostAmount);
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
            const cryptosTokenAddress = cryptosTokenInstance.address;
            const lostTokenAddress = lostTokenInstance.address;
            const balanceBefore = await lostTokenInstance.balanceOf(deployer);

            // Act
            await cryptosTokenInstance.retrieveTokens(lostTokenAddress);

            // Assert
            const balanceAfter = await lostTokenInstance.balanceOf(deployer);
            expect(balanceAfter).to.equal(balanceBefore.add(lostAmount));

            const balanceContract = await cryptosTokenInstance.balanceOf(cryptosTokenAddress);
            expect(balanceContract).to.equal(0);
        });

        it ("Should emit RetrieveTokens event", async () => {
                
            // Setup
            const lostTokenAddress = lostTokenInstance.address;

            await lostTokenInstance
                .mint(cryptosTokenInstance.address, lostAmount);
            
            // Act
            const operation = cryptosTokenInstance
                .retrieveTokens(lostTokenAddress);

            // Assert
            await expect(operation).to
                .emit(cryptosTokenInstance, "RetrieveTokens")
                .withArgs(lostTokenAddress, deployer, lostAmount);
        });
    });

    /**
     * Test ownership    
     */
    describe("Ownership", function () {

        it ("Deployer should be owner initially", async () => {
                
            // Setup
            const expected = deployer;

            // Act
            const actual = await cryptosTokenInstance.owner();

            // Assert
            expect(actual).to.equal(expected);
        });

        it ("Non-Owner should not be able to transfer ownership", async () => {

            // Setup
            const newOwner = other;
            const nonAdminSigner = ethers.provider.getSigner(other);

            // Act
            const operation = cryptosTokenInstance
                .connect(nonAdminSigner)
                .transferOwnership(newOwner);

            // Assert
            await expect(operation).to.be
                .revertedWithCustomError(cryptosTokenInstance, "OwnableUnauthorizedAccount")
                .withArgs(other);
        });

        it ("Owner should be able to transfer ownership", async () => {

            // Setup
            const newOwner = other;
            const ownerSigner = ethers.provider.getSigner(deployer);

            // Act
            await cryptosTokenInstance
                .connect(ownerSigner)
                .transferOwnership(newOwner);

            // Assert
            const owner = await cryptosTokenInstance.owner();
            const pendingOwner = await cryptosTokenInstance.pendingOwner();
            expect(owner).to.equal(deployer);
            expect(pendingOwner).to.equal(newOwner);
        });

        it ("New owner should be able to accept ownership", async () => {

            // Setup
            const newOwner = other;
            const newOwnerSigner = ethers.provider.getSigner(other);

            // Act
            await cryptosTokenInstance
                .connect(newOwnerSigner)
                .acceptOwnership();

            // Assert
            const owner = await cryptosTokenInstance.owner();
            const pendingOwner = await cryptosTokenInstance.pendingOwner();
            expect(owner).to.equal(newOwner);
            expect(pendingOwner).to.equal(ethers.constants.AddressZero);
        });
    });
});