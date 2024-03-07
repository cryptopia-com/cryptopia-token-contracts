import "../scripts/helpers/converters.ts";
import { expect } from "chai";
import { ethers } from "hardhat";

import { 
    CryptosToken,
    CryptosTokenOFTAdapter,
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
        let cryptosTokenOFTAdapterInstance: CryptosTokenOFTAdapter;
        let cryptosTokenPolygonInstance: CryptosTokenPolygon;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenOFTAdapterAddress: string;
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
            const CryptosTokenOFTAdapterFactory = await ethers.getContractFactory("CryptosTokenOFTAdapter");
            const CryptosTokenPolygonFactory = await ethers.getContractFactory("CryptosTokenPolygon");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            // Deploy tokens
            cryptosTokenInstance = await CryptosTokenFactory.deploy(deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenOFTAdapterInstance = await CryptosTokenOFTAdapterFactory.deploy(
                cryptosTokenAddress, layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenOFTAdapterAddress = await cryptosTokenOFTAdapterInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(
                polygonBridgeDepositor, layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenOFTAdapterAddress, layerZeroEndpointEthereumAddress);

            await cryptosTokenOFTAdapterInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenOFTAdapterAddress, 32));

            // Fund user account
            await cryptosTokenInstance.transfer(user, initialUserBalance);
        });

        it ("Should not transfer without approval", async () => {

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

            const [nativeFee] = await cryptosTokenOFTAdapterInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const operation = cryptosTokenOFTAdapterInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            expect(operation).to.be
                .revertedWithCustomError(cryptosTokenInstance, "ERC20InsufficientAllowance")
                .withArgs(user, 0, amountToTransfer);
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

            const [nativeFee] = await cryptosTokenOFTAdapterInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenInstance.connect(signer).approve(cryptosTokenOFTAdapterAddress, amountToTransfer);
            await cryptosTokenOFTAdapterInstance.connect(signer).send(sendParam, messagingFee, user, {
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
        let polygonBridgeDepositor: string;
        let user: string;

        // Instances
        let cryptosTokenInstance: CryptosToken;
        let cryptosTokenOFTAdapterInstance: CryptosTokenOFTAdapter;
        let cryptosTokenPolygonInstance: CryptosTokenPolygon;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenOFTAdapterAddress: string;
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
            const CryptosTokenOFTAdapterFactory = await ethers.getContractFactory("CryptosTokenOFTAdapter");
            const CryptosTokenPolygonFactory = await ethers.getContractFactory("CryptosTokenPolygon");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            // Deploy tokens
            cryptosTokenInstance = await CryptosTokenFactory.deploy(deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenOFTAdapterInstance = await CryptosTokenOFTAdapterFactory.deploy(
                cryptosTokenAddress, layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenOFTAdapterAddress = await cryptosTokenOFTAdapterInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(
                polygonBridgeDepositor, layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenOFTAdapterAddress, layerZeroEndpointEthereumAddress);

            await cryptosTokenOFTAdapterInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenOFTAdapterAddress, 32));

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

            const [nativeFee] = await cryptosTokenOFTAdapterInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenInstance.approve(cryptosTokenOFTAdapterAddress, initialUserBalance);
            await cryptosTokenOFTAdapterInstance.send(sendParam, messagingFee, user, {
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