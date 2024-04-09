import { expect } from "chai";
import { ethers } from "hardhat";

import { 
    CryptosToken,
    CryptosTokenPolygon
} from "../typechain-types";

import { 
    Options 
} from '@layerzerolabs/lz-v2-utilities';

import { 
    MessagingFeeStruct, 
    SendParamStruct 
} from "../typechain-types/contracts/source/ethereum/CryptosTokenOFTAdapter.js";

/**
 * Layer Zero
 */
describe("LayerZero", function () {

    /**
     * Test OFT transfers from Ethereum
     */
    describe("Ethereum", function () {

        // Accounts
        let deployer: string;
        let polygonBridgeDepositor: string;
        let user: string;

        // Instances
        let cryptosTokenInstance: CryptosToken;
        let cryptosTokenPolygonInstance: CryptosTokenPolygon;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenPolygonAddress: string;

        // Settings
        const eidEthereum = 30101;
        const eidPolygon = 30109;

        const initialUserBalance = "100".toWei();

        /**
         * Deploy Token Contract
         */
        before(async () => {

            // Accounts
            [deployer, polygonBridgeDepositor, user] = (
                await ethers.getSigners()).map(s => s.address);

            // Factories
            const CryptosTokenFactory = await ethers.getContractFactory("CryptosToken");
            const CryptosTokenPolygonFactory = await ethers.getContractFactory("CryptosTokenPolygon");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            // Deploy tokens
            cryptosTokenInstance = await CryptosTokenFactory.deploy(
                layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(
                layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);

            await cryptosTokenInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));

            // Fund user account
            await cryptosTokenInstance.transfer(user, initialUserBalance);
        });

        it ("Should transfer to Polygon", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "60".toWei();
            const extraOptions = Options.newOptions()
                .addExecutorLzReceiveOption(200000, 0)
                .toHex()
                .toString();

            const sendParam: SendParamStruct = {
                dstEid: eidPolygon,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: extraOptions,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenInstance.connect(signer).approve(cryptosTokenAddress, amountToTransfer);
            await cryptosTokenInstance.connect(signer).send(sendParam, messagingFee, user, {
                value: nativeFee
            });

            // Assert
            const userBalanceEthereum = await cryptosTokenInstance.balanceOf(user);
            const userBalancePolygon = await cryptosTokenPolygonInstance.balanceOf(user);

            expect(userBalanceEthereum).to.equal(ethers.BigNumber.from(initialUserBalance).sub(amountToTransfer));
            expect(userBalancePolygon).to.equal(ethers.BigNumber.from(amountToTransfer));
        });
    });

    /**
     * Test OFT transfers from Polygon
     */
    describe("Polygon", function () {

        // Accounts
        let deployer: string;
        let user: string;

        // Instances
        let cryptosTokenInstance: CryptosToken;
        let cryptosTokenPolygonInstance: CryptosTokenPolygon;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenPolygonAddress: string;

        // Settings
        const eidEthereum = 30101;
        const eidPolygon = 30109;

        const initialUserBalance = "100".toWei();

        /**
         * Deploy Token Contract
         */
        before(async () => {

            // Accounts
            [deployer, user] = (
                await ethers.getSigners()).map(s => s.address);

            // Factories
            const CryptosTokenFactory = await ethers.getContractFactory("CryptosToken");
            const CryptosTokenPolygonFactory = await ethers.getContractFactory("CryptosTokenPolygon");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            // Deploy tokens
            cryptosTokenInstance = await CryptosTokenFactory.deploy(
                layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(
                layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);

            await cryptosTokenInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));

            // Fund user account
            const extraOptions = Options.newOptions()
                .addExecutorLzReceiveOption(200000, 0)
                .toHex()
                .toString();

            const sendParam: SendParamStruct = {
                dstEid: eidPolygon,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: initialUserBalance,
                minAmountLD: initialUserBalance,
                extraOptions: extraOptions,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenInstance.approve(cryptosTokenAddress, initialUserBalance);
            await cryptosTokenInstance.send(sendParam, messagingFee, user, {
                value: nativeFee
            });
        });

        it ("Should transfer to Ethereum", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "60".toWei();
            const extraOptions = Options.newOptions()
                .addExecutorLzReceiveOption(200000, 0)
                .toHex()
                .toString();

            const sendParam: SendParamStruct = {
                dstEid: eidEthereum,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: extraOptions,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenPolygonInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenPolygonInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceEthereum = await cryptosTokenInstance.balanceOf(user);
            const userBalancePolygon = await cryptosTokenPolygonInstance.balanceOf(user);

            expect(userBalanceEthereum).to.equal(ethers.BigNumber.from(amountToTransfer));
            expect(userBalancePolygon).to.equal(ethers.BigNumber.from(initialUserBalance).sub(amountToTransfer));
        });
    });
});