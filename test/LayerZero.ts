import "../scripts/helpers/converters.ts";
import { expect } from "chai";
import { ethers } from "hardhat";

import { 
    CryptosToken,
    CryptosTokenOFTAdapter,
    CryptosTokenPolygon,
    CryptosTokenSkaleEuropa
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
        let cryptosTokenSkaleInstance: CryptosTokenSkaleEuropa;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenOFTAdapterAddress: string;
        let cryptosTokenPolygonAddress: string;
        let cryptosTokenSkaleAddress: string;

        // Settings
        const eidEthereum = 40161;
        const eidPolygon = 40109;
        const eidSkale = 40254;

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
            const CryptosTokenSkaleFactory = await ethers.getContractFactory("CryptosTokenSkaleEuropa");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            const layerZeroEndpointSkaleInstance = await LayerZeroEndpointFactory.deploy(eidSkale);
            const layerZeroEndpointSkaleAddress = await layerZeroEndpointSkaleInstance.address;

            // Deploy tokens
            cryptosTokenInstance = await CryptosTokenFactory.deploy(deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenOFTAdapterInstance = await CryptosTokenOFTAdapterFactory.deploy(
                cryptosTokenAddress, layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenOFTAdapterAddress = await cryptosTokenOFTAdapterInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(
                polygonBridgeDepositor, layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            cryptosTokenSkaleInstance = await CryptosTokenSkaleFactory.deploy(
                layerZeroEndpointSkaleAddress, deployer);
            cryptosTokenSkaleAddress = await cryptosTokenSkaleInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);

            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenOFTAdapterAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);

            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenOFTAdapterAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);

            // Setup peers
            await cryptosTokenOFTAdapterInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenOFTAdapterInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));

            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenOFTAdapterAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));

            await cryptosTokenSkaleInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenOFTAdapterAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));

            // Fund user account
            await cryptosTokenInstance.transfer(user, initialUserBalance);
        });

        it ("Should not transfer without approval", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "50".toWei();
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
            const amountToTransfer = "20".toWei();
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

            const userBalanceEthereumBefore = await cryptosTokenInstance.balanceOf(user);
            const userBalancePolygonBefore = await cryptosTokenPolygonInstance.balanceOf(user);

            // Act
            await cryptosTokenInstance.connect(signer).approve(cryptosTokenOFTAdapterAddress, amountToTransfer);
            await cryptosTokenOFTAdapterInstance.connect(signer).send(sendParam, messagingFee, user, {
                value: nativeFee
            });

            // Assert
            const userBalanceEthereumAfter = await cryptosTokenInstance.balanceOf(user);
            const userBalancePolygonAfter = await cryptosTokenPolygonInstance.balanceOf(user);

            expect(userBalanceEthereumAfter).to.equal(userBalanceEthereumBefore.sub(amountToTransfer));
            expect(userBalancePolygonAfter).to.equal(userBalancePolygonBefore.add(ethers.BigNumber.from(amountToTransfer)));
        });

        it ("Should transfer to Skale", async () => {
                
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "25".toWei();
            const extraOptions = Options.newOptions()
                .addExecutorLzReceiveOption(200000, 0)
                .toHex()
                .toString();

            const sendParam: SendParamStruct = {
                dstEid: eidSkale,
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

            const userBalanceEthereumBefore = await cryptosTokenInstance.balanceOf(user);
            const userBalanceSkaleBefore = await cryptosTokenSkaleInstance.balanceOf(user);

            // Act
            await cryptosTokenInstance.connect(signer).approve(cryptosTokenOFTAdapterAddress, amountToTransfer);
            await cryptosTokenOFTAdapterInstance.connect(signer).send(sendParam, messagingFee, user, {
                value: nativeFee
            });

            // Assert
            const userBalanceEthereumAfter = await cryptosTokenInstance.balanceOf(user);
            const userBalanceSkaleAfter = await cryptosTokenSkaleInstance.balanceOf(user);

            expect(userBalanceEthereumAfter).to.equal(userBalanceEthereumBefore.sub(amountToTransfer));
            expect(userBalanceSkaleAfter).to.equal(userBalanceSkaleBefore.add(ethers.BigNumber.from(amountToTransfer)));
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
        let cryptosTokenSkaleInstance: CryptosTokenSkaleEuropa;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenOFTAdapterAddress: string;
        let cryptosTokenPolygonAddress: string;
        let cryptosTokenSkaleAddress: string;

        // Settings
        const eidEthereum = 40161;
        const eidPolygon = 40109;
        const eidSkale = 40254;

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
            const CryptosTokenSkaleFactory = await ethers.getContractFactory("CryptosTokenSkaleEuropa");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            const layerZeroEndpointSkaleInstance = await LayerZeroEndpointFactory.deploy(eidSkale);
            const layerZeroEndpointSkaleAddress = await layerZeroEndpointSkaleInstance.address;

            // Deploy tokens
            cryptosTokenInstance = await CryptosTokenFactory.deploy(deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenOFTAdapterInstance = await CryptosTokenOFTAdapterFactory.deploy(
                cryptosTokenAddress, layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenOFTAdapterAddress = await cryptosTokenOFTAdapterInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(
                polygonBridgeDepositor, layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            cryptosTokenSkaleInstance = await CryptosTokenSkaleFactory.deploy(
                layerZeroEndpointSkaleAddress, deployer);
            cryptosTokenSkaleAddress = await cryptosTokenSkaleInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);

            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenOFTAdapterAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);

            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenOFTAdapterAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);

            // Setup peers
            await cryptosTokenOFTAdapterInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenOFTAdapterInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));

            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenOFTAdapterAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));

            await cryptosTokenSkaleInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenOFTAdapterAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));

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
            const amountToTransfer = "50".toWei();
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

            const userBalancePolygonBefore = await cryptosTokenPolygonInstance.balanceOf(user);
            const userBalanceEthereumBefore = await cryptosTokenInstance.balanceOf(user);

            // Act
            await cryptosTokenPolygonInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalancePolygonAfter = await cryptosTokenPolygonInstance.balanceOf(user);
            const userBalanceEthereumAfter = await cryptosTokenInstance.balanceOf(user);

            expect(userBalancePolygonAfter).to.equal(userBalancePolygonBefore.sub(amountToTransfer));
            expect(userBalanceEthereumAfter).to.equal(userBalanceEthereumBefore.add(ethers.BigNumber.from(amountToTransfer)));
        });

        it ("Should transfer to Skale", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "25".toWei();
            const extraOptions = Options.newOptions()
                .addExecutorLzReceiveOption(200000, 0)
                .toHex()
                .toString();

            const sendParam: SendParamStruct = {
                dstEid: eidSkale,
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

            const userBalancePolygonBefore = await cryptosTokenPolygonInstance.balanceOf(user);
            const userBalanceSkaleBefore = await cryptosTokenSkaleInstance.balanceOf(user);

            // Act
            await cryptosTokenPolygonInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalancePolygonAfter = await cryptosTokenPolygonInstance.balanceOf(user);
            const userBalanceSkaleAfter = await cryptosTokenSkaleInstance.balanceOf(user);

            expect(userBalancePolygonAfter).to.equal(userBalancePolygonBefore.sub(amountToTransfer));
            expect(userBalanceSkaleAfter).to.equal(userBalanceSkaleBefore.add(ethers.BigNumber.from(amountToTransfer)));
        });
    });

    /**
     * Test OFT transfers from Skale
     */
    describe("Skale", function () {

        // Accounts
        let deployer: string;
        let polygonBridgeDepositor: string;
        let user: string;

        // Instances
        let cryptosTokenInstance: CryptosToken;
        let cryptosTokenOFTAdapterInstance: CryptosTokenOFTAdapter;
        let cryptosTokenPolygonInstance: CryptosTokenPolygon;
        let cryptosTokenSkaleInstance: CryptosTokenSkaleEuropa;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenOFTAdapterAddress: string;
        let cryptosTokenPolygonAddress: string;
        let cryptosTokenSkaleAddress: string;

        // Settings
        const eidEthereum = 40161;
        const eidPolygon = 40109;
        const eidSkale = 40254;

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
            const CryptosTokenSkaleFactory = await ethers.getContractFactory("CryptosTokenSkaleEuropa");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            const layerZeroEndpointSkaleInstance = await LayerZeroEndpointFactory.deploy(eidSkale);
            const layerZeroEndpointSkaleAddress = await layerZeroEndpointSkaleInstance.address;

            // Deploy tokens
            cryptosTokenInstance = await CryptosTokenFactory.deploy(deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenOFTAdapterInstance = await CryptosTokenOFTAdapterFactory.deploy(
                cryptosTokenAddress, layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenOFTAdapterAddress = await cryptosTokenOFTAdapterInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(
                polygonBridgeDepositor, layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            cryptosTokenSkaleInstance = await CryptosTokenSkaleFactory.deploy(
                layerZeroEndpointSkaleAddress, deployer);
            cryptosTokenSkaleAddress = await cryptosTokenSkaleInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);

            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenOFTAdapterAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);

            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenOFTAdapterAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);

            // Setup peers
            await cryptosTokenOFTAdapterInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenOFTAdapterInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));

            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenOFTAdapterAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));

            await cryptosTokenSkaleInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenOFTAdapterAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));

            // Fund user account
            const extraOptions = Options.newOptions()
                .addExecutorLzReceiveOption(200000, 0)
                .toHex()
                .toString();

            const sendParam: SendParamStruct = {
                dstEid: eidSkale,
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
            const amountToTransfer = "50".toWei();
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

            const [nativeFee] = await cryptosTokenSkaleInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const userBalanceSkaleBefore = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalanceEthereumBefore = await cryptosTokenInstance.balanceOf(user);

            // Act
            await cryptosTokenSkaleInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceSkaleAfter = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalanceEthereumAfter = await cryptosTokenInstance.balanceOf(user);

            expect(userBalanceSkaleAfter).to.equal(userBalanceSkaleBefore.sub(amountToTransfer));
            expect(userBalanceEthereumAfter).to.equal(userBalanceEthereumBefore.add(ethers.BigNumber.from(amountToTransfer)));
        });

        it ("Should transfer to Polygon", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "25".toWei();
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

            const [nativeFee] = await cryptosTokenSkaleInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const userBalanceSkaleBefore = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalancePolygonBefore = await cryptosTokenPolygonInstance.balanceOf(user);

            // Act
            await cryptosTokenSkaleInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceSkaleAfter = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalancePolygonAfter = await cryptosTokenPolygonInstance.balanceOf(user);

            expect(userBalanceSkaleAfter).to.equal(userBalanceSkaleBefore.sub(amountToTransfer));
            expect(userBalancePolygonAfter).to.equal(userBalancePolygonBefore.add(ethers.BigNumber.from(amountToTransfer)));
        });
    });
});