import "../scripts/helpers/converters.ts";
import { expect } from "chai";
import { ethers } from "hardhat";

import { 
    CryptosTokenPolygon
} from "../typechain-types";

/**
 * CryptosToken on Polygon (child)
 */
describe("Polygon", function () {

    // Accounts
    let deployer: string;
    let depositor: string;
    let receiver: string;
    let withdrawer: string;
    let other: string;

    // Instances
    let cryptosTokenInstance: CryptosTokenPolygon;

    /**
     * Deploy Crafting Contracts
     */
    before(async () => {

        // Accounts
        [deployer, depositor, receiver, withdrawer, other] = (await ethers.getSigners()).map(s => s.address);

        // Factories
        const CryptosTokenFactory = await ethers.getContractFactory("CryptosTokenPolygon");
        
        // Deploy Inventories
        cryptosTokenInstance = await CryptosTokenFactory.deploy(depositor);
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

        it ("Polygon bridge is set as depositor", async () => {

            // Setup
            const expected = depositor;

            // Act
            const actual = await cryptosTokenInstance.depositor();

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

    /**
     * Test bridge
     */
    describe("Bridge", function () {

        it ("Non-depositor cannot deposit", async () => {

            // Setup
            const amount = ethers.utils.parseEther("100");
            const amountEncoded = ethers.utils.defaultAbiCoder.encode(["uint256"], [amount]);
            const otherSigner = ethers.provider.getSigner(other);

            // Act
            const operation = cryptosTokenInstance
                .connect(otherSigner)
                .deposit(receiver, amountEncoded);
            
            // Assert
            await expect(operation).to.be
                .revertedWithCustomError(cryptosTokenInstance, "Unauthorized");
        });

        it ("Polyong bridge (depositor) can deposit", async () => {

            // Setup
            const amount = ethers.utils.parseEther("100");
            const amountEncoded = ethers.utils.defaultAbiCoder.encode(["uint256"], [amount]);
            const depositorSigner = ethers.provider.getSigner(depositor);

            // Act
            await cryptosTokenInstance
                .connect(depositorSigner)
                .deposit(receiver, amountEncoded);

            // Assert
            const receiverBalance = await cryptosTokenInstance.balanceOf(receiver);
            expect(receiverBalance).to.equal(amount);
        });
    });

    /**
     * Test withdraw
     */
    describe("Withdraw", function () {

        // Setup
        const depositAmount = ethers.utils.parseEther("200");

        /**
         * Deposit tokens
         */
        before(async () => {
            const amountEncoded = ethers.utils.defaultAbiCoder.encode(["uint256"], [depositAmount]);
            const depositorSigner = ethers.provider.getSigner(depositor);

            await cryptosTokenInstance
                .connect(depositorSigner)
                .deposit(withdrawer, amountEncoded);
        });

        it ("Should not withdraw more tokens than deposited", async () => {

            // Setup
            const withdrawAmount = depositAmount.add(1);
            const withdrawerSigner = ethers.provider.getSigner(withdrawer);

            // Act
            const operation = cryptosTokenInstance
                .connect(withdrawerSigner)
                .withdraw(withdrawAmount);
            
            // Assert
            await expect(operation).to.be
                .revertedWithCustomError(cryptosTokenInstance, "ERC20InsufficientBalance");
        });

        it ("Should withdraw deposited tokens", async () => {

            // Setup
            const withdrawAmount = depositAmount;
            const withdrawerSigner = ethers.provider.getSigner(withdrawer);

            const totalSupplyBefore = await cryptosTokenInstance.totalSupply();
            const withdrawerBalanceBefore = await cryptosTokenInstance.balanceOf(withdrawer);

            // Act
            await cryptosTokenInstance
                .connect(withdrawerSigner)
                .withdraw(withdrawAmount);

            const totalSupplyAfter = await cryptosTokenInstance.totalSupply();
            const withdrawerBalanceAfter = await cryptosTokenInstance.balanceOf(withdrawer);

            // Assert
            expect(totalSupplyAfter).to.equal(totalSupplyBefore.sub(withdrawAmount));
            expect(withdrawerBalanceAfter).to.equal(withdrawerBalanceBefore.sub(withdrawAmount));
        });
    });
});