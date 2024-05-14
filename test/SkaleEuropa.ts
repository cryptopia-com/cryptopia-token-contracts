import "../scripts/helpers/converters.ts";
import { expect } from "chai";
import { ethers } from "hardhat";

import { 
    MockERC20,
    CryptosTokenSkaleEuropa
} from "../typechain-types";

/**
 * CryptosToken on Skale Europa (child)
 */
describe("Skale Europa", function () {

    // Accounts
    let deployer: string;
    let receiver: string;
    let withdrawer: string;
    let other: string;

    // Instances
    let skaleTokenInstance: MockERC20;
    let cryptosTokenInstance: CryptosTokenSkaleEuropa;

    // Settings_payNative
    const eidSkale = 40273;

    /**
     * Deploy Token Contract
     */
    before(async () => {

        // Accounts
        [deployer, receiver, withdrawer, other] = (
            await ethers.getSigners()).map(s => s.address);

        // Factories
        const SkaleTokenFactory = await ethers.getContractFactory("MockERC20");
        const CryptosTokenFactory = await ethers.getContractFactory("DevelopmentTokenSkaleEuropa");
        const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpointAlt");
        
        // Deploy SKL token
        skaleTokenInstance = await SkaleTokenFactory.deploy();

        // Deploy endpoint
        const layerZeroEndpointInstance = await LayerZeroEndpointFactory.deploy(eidSkale, skaleTokenInstance.address);
        const layerZeroEndpointAddress = await layerZeroEndpointInstance.address;

        // Deploy Cryptos token
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
     * Test bridge
     */
    describe("Bridge", function () {

        // Settings
        const bridge = "0xD2aAA00500000000000000000000000000000000";

        it("Bridge should have the MINTER_ROLE", async () => {

            // Setup
            const role = ethers.utils.keccak256(
                ethers.utils.toUtf8Bytes("MINTER_ROLE"));

            // Act
            const hasRole = await cryptosTokenInstance.hasRole(role, bridge);

            // Assert
            expect(hasRole).to.equal(true);
        });

        it("Bridge should have the BURNER_ROLE", async () => {

            // Setup
            const role = ethers.utils.keccak256(
                ethers.utils.toUtf8Bytes("BURNER_ROLE"));

            // Act
            const hasRole = await cryptosTokenInstance.hasRole(role, bridge);

            // Assert
            expect(hasRole).to.equal(true);
        });

        it ("Non-Bridge should not be able to mint", async () => {
                
            // Setup
            const amount = ethers.utils.parseEther("100");
            const nonBridgeSigner = ethers.provider.getSigner(other);

            // Act
            const operation = cryptosTokenInstance
                .connect(nonBridgeSigner)
                .mint(other, amount);

            // Assert
            await expect(operation).to.be
                .revertedWithCustomError(cryptosTokenInstance, "AccessControlUnauthorizedAccount")
                .withArgs(other, "MINTER_ROLE".toKeccak256());
        });

        it ("Bridge should be able to mint", async () => {
                
            // Setup
            const amount = ethers.utils.parseEther("100");
            const balanceBefore = await cryptosTokenInstance.balanceOf(deployer);

            // Act
            await cryptosTokenInstance.mint(deployer, amount);

            // Assert
            const balanceAfter = await cryptosTokenInstance.balanceOf(deployer);
            expect(balanceAfter).to.equal(balanceBefore.add(amount));
        });

        it ("Minting should emit Mint event", async () => {

            // Setup
            const amount = ethers.utils.parseEther("100");

            // Act
            const operation = cryptosTokenInstance.mint(deployer, amount);

            // Assert
            await expect(operation).to
                .emit(cryptosTokenInstance, "Mint")
                .withArgs(deployer, amount);
        });

        it ("Non-Bridge should not be able to burn", async () => {
                
            // Setup
            const amount = ethers.utils.parseEther("100");
            const nonBridgeSigner = ethers.provider.getSigner(other);

            // Act
            const operation = cryptosTokenInstance
                .connect(nonBridgeSigner)
                .burn(amount);

            // Assert
            await expect(operation).to.be
                .revertedWithCustomError(cryptosTokenInstance, "AccessControlUnauthorizedAccount")
                .withArgs(other, "BURNER_ROLE".toKeccak256());
        });

        it ("Bridge should be able to burn", async () => {
                
            // Setup
            const amount = ethers.utils.parseEther("100");
            const balanceBefore = await cryptosTokenInstance.balanceOf(deployer);

            // Act
            await cryptosTokenInstance.burn(amount);

            // Assert
            const balanceAfter = await cryptosTokenInstance.balanceOf(deployer);
            expect(balanceAfter).to.equal(balanceBefore.sub(amount));
        });

        it ("Burning should emit Burn event", async () => {

            // Setup
            const amount = ethers.utils.parseEther("100");

            // Act
            const operation = cryptosTokenInstance.burn(amount);

            // Assert
            await expect(operation).to
                .emit(cryptosTokenInstance, "Burn")
                .withArgs(deployer, amount);
        });
    });

    /**
     * Test failsafe    
     */
    describe("Failsafe", function () {

        // Setup
        const lostAmount = ethers.utils.parseEther("999");

        // Instances
        let mockTokenInstance: MockERC20;

        /**
         * Deposit tokens by accident
         */
        before(async () => {

            // Deploy mock token
            const mockTokenFactory = await ethers.getContractFactory("MockERC20");
            mockTokenInstance = await mockTokenFactory.deploy();

            // Mint tokens
            await mockTokenInstance.mint(cryptosTokenInstance.address, lostAmount);
        });

        it ("Non-Owner should not be able to retrieve tokens", async () => {
                
                // Setup
                const lostTokenAddress = mockTokenInstance.address;
                const nonAdminSigner = ethers.provider.getSigner(other);
 
                // Act
                const operation = cryptosTokenInstance
                    .connect(nonAdminSigner)
                    .retrieveTokens(lostTokenAddress);

                // Assert
                await expect(operation).to.be
                    .revertedWithCustomError(cryptosTokenInstance, "OwnableUnauthorizedAccount")
                    .withArgs(other);
        });

        it ("Owner should be able to retrieve tokens", async () => {
                
            // Setup
            const cryptosTokenAddress = cryptosTokenInstance.address;
            const lostTokenAddress = mockTokenInstance.address;
            const balanceBefore = await cryptosTokenInstance.balanceOf(deployer);

            // Act
            await cryptosTokenInstance.retrieveTokens(lostTokenAddress);

            // Assert
            const balanceAfter = await mockTokenInstance.balanceOf(deployer);
            expect(balanceAfter).to.equal(balanceBefore.add(lostAmount));

            const balanceContract = await mockTokenInstance.balanceOf(cryptosTokenAddress);
            expect(balanceContract).to.equal(0);
        });

        it ("Should emit RetrieveTokens event", async () => {
                
            // Setup
            const lostTokenAddress = mockTokenInstance.address;

            await mockTokenInstance.mint(
                cryptosTokenInstance.address, lostAmount);
            
            // Act
            const operation = cryptosTokenInstance
                .retrieveTokens(lostTokenAddress);

            // Assert
            await expect(operation).to
                .emit(cryptosTokenInstance, "RetrieveTokens")
                .withArgs(lostTokenAddress, deployer, lostAmount);
        });
    });
});