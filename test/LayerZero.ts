import "../scripts/helpers/converters.ts";
import { expect } from "chai";
import { ethers } from "hardhat";

import { 
    MockERC20,
    CryptosToken,
    CryptosTokenPolygon,
    CryptosTokenSkaleEuropa,
    CryptosTokenBNB,
    CryptosTokenBase
} from "../typechain-types";

import { 
    Options 
} from '@layerzerolabs/lz-v2-utilities';

import { 
    MessagingFeeStruct, 
    SendParamStruct,
} from "../typechain-types/contracts/source/ethereum/CryptosToken";

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
        let user: string;

        // Instances
        let skaleFeeTokenInstance: MockERC20;
        let cryptosTokenInstance: CryptosToken;
        let cryptosTokenPolygonInstance: CryptosTokenPolygon;
        let cryptosTokenSkaleInstance: CryptosTokenSkaleEuropa;
        let cryptosTokenBNBInstance: CryptosTokenBNB;
        let cryptosTokenBaseInstance: CryptosTokenBase;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenPolygonAddress: string;
        let cryptosTokenSkaleAddress: string;
        let cryptosTokenBNBAddress: string;
        let cryptosTokenBaseAddress: string;

        // Settings
        const eidEthereum = 40161;
        const eidPolygon = 40109;
        const eidSkale = 40273;
        const eidBNB = 30102;
        const eidBase = 30184;
        const lzReceiveGasLimit = 60000;

        const initialUserBalance = "1000".toWei();

        /**
         * Deploy Token Contract
         */
        before(async () => {

            // Accounts
            [deployer, user] = (
                await ethers.getSigners()).map(s => s.address);

            // Factories
            const SkaleFeeTokenFactory = await ethers.getContractFactory("MockERC20");
            const CryptosTokenFactory = await ethers.getContractFactory("CryptosToken");
            const CryptosTokenPolygonFactory = await ethers.getContractFactory("CryptosTokenPolygon");
            const CryptosTokenSkaleFactory = await ethers.getContractFactory("CryptosTokenSkaleEuropa");
            const CryptosTokenBNBFactory = await ethers.getContractFactory("CryptosTokenBNB");
            const CryptosTokenBaseFactory = await ethers.getContractFactory("CryptosTokenBase");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            const LayerZeroEndpointAltFactory = await ethers.getContractFactory("MockLayerZeroEndpointAlt");

            // Deploy fee tokens
            skaleFeeTokenInstance = await SkaleFeeTokenFactory.deploy();
            const skaleFeeTokenAddress = await skaleFeeTokenInstance.address;
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            const layerZeroEndpointSkaleInstance = await LayerZeroEndpointAltFactory.deploy(eidSkale, skaleFeeTokenAddress);
            const layerZeroEndpointSkaleAddress = await layerZeroEndpointSkaleInstance.address;

            const layerZeroEndpointBNBInstance = await LayerZeroEndpointFactory.deploy(eidBNB);
            const layerZeroEndpointBNBAddress = await layerZeroEndpointBNBInstance.address;

            const layerZeroEndpointBaseInstance = await LayerZeroEndpointFactory.deploy(eidBase);
            const layerZeroEndpointBaseAddress = await layerZeroEndpointBaseInstance.address;

            // Deploy OFTs
            cryptosTokenInstance = await CryptosTokenFactory.deploy(layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            cryptosTokenSkaleInstance = await CryptosTokenSkaleFactory.deploy(layerZeroEndpointSkaleAddress, deployer);
            cryptosTokenSkaleAddress = await cryptosTokenSkaleInstance.address;

            cryptosTokenBNBInstance = await CryptosTokenBNBFactory.deploy(layerZeroEndpointBNBAddress, deployer);
            cryptosTokenBNBAddress = await cryptosTokenBNBInstance.address;

            cryptosTokenBaseInstance = await CryptosTokenBaseFactory.deploy(layerZeroEndpointBaseAddress, deployer);
            cryptosTokenBaseAddress = await cryptosTokenBaseInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);

            // Setup peers
            await cryptosTokenInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenSkaleInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenBNBInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenBaseInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));

            // Setup enforced options
            const requiredOptions = Options.newOptions()
                .addExecutorLzReceiveOption(lzReceiveGasLimit, 0)
                .toHex()
                .toString();

            await cryptosTokenInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenPolygonInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenSkaleInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenBNBInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenBaseInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            // Fund user account
            await cryptosTokenInstance.transfer(user, initialUserBalance);
        });

        it ("Should transfer to Polygon", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "60".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidPolygon,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenInstance.connect(signer).send(sendParam, messagingFee, user, {
                value: nativeFee
            });

            // Assert
            const userBalanceEthereum = await cryptosTokenInstance.balanceOf(user);
            const userBalancePolygon = await cryptosTokenPolygonInstance.balanceOf(user);

            expect(userBalanceEthereum).to.equal(ethers.BigNumber.from(initialUserBalance).sub(amountToTransfer));
            expect(userBalancePolygon).to.equal(ethers.BigNumber.from(amountToTransfer));
        });

        it ("Should transfer to Skale", async () => {
                
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "25".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidSkale,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const userBalanceEthereumBefore = await cryptosTokenInstance.balanceOf(user);
            const userBalanceSkaleBefore = await cryptosTokenSkaleInstance.balanceOf(user);

            // Act
            await cryptosTokenInstance.connect(signer).send(sendParam, messagingFee, user, {
                value: nativeFee
            });

            // Assert
            const userBalanceEthereumAfter = await cryptosTokenInstance.balanceOf(user);
            const userBalanceSkaleAfter = await cryptosTokenSkaleInstance.balanceOf(user);

            expect(userBalanceEthereumAfter).to.equal(userBalanceEthereumBefore.sub(amountToTransfer));
            expect(userBalanceSkaleAfter).to.equal(userBalanceSkaleBefore.add(amountToTransfer));
        });

        it ("Should transfer to BNB", async () => {
                
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "15".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidBNB,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const userBalanceEthereumBefore = await cryptosTokenInstance.balanceOf(user);
            const userBalanceBNBBefore = await cryptosTokenBNBInstance.balanceOf(user);

            // Act
            await cryptosTokenInstance.connect(signer).send(sendParam, messagingFee, user, {
                value: nativeFee
            });

            // Assert
            const userBalanceEthereumAfter = await cryptosTokenInstance.balanceOf(user);
            const userBalanceBNBAfter = await cryptosTokenBNBInstance.balanceOf(user);

            expect(userBalanceEthereumAfter).to.equal(userBalanceEthereumBefore.sub(amountToTransfer));
            expect(userBalanceBNBAfter).to.equal(userBalanceBNBBefore.add(amountToTransfer));
        });

        it ("Should transfer to Base", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "10".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidBase,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const userBalanceEthereumBefore = await cryptosTokenInstance.balanceOf(user);
            const userBalanceBaseBefore = await cryptosTokenBaseInstance.balanceOf(user);

            // Act
            await cryptosTokenInstance.connect(signer).send(sendParam, messagingFee, user, {
                value: nativeFee
            });

            // Assert
            const userBalanceEthereumAfter = await cryptosTokenInstance.balanceOf(user);
            const userBalanceBaseAfter = await cryptosTokenBaseInstance.balanceOf(user);

            expect(userBalanceEthereumAfter).to.equal(userBalanceEthereumBefore.sub(amountToTransfer));
            expect(userBalanceBaseAfter).to.equal(userBalanceBaseBefore.add(amountToTransfer));
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
        let skaleFeeTokenInstance: MockERC20;
        let cryptosTokenInstance: CryptosToken;
        let cryptosTokenPolygonInstance: CryptosTokenPolygon;
        let cryptosTokenSkaleInstance: CryptosTokenSkaleEuropa;
        let cryptosTokenBNBInstance: CryptosTokenBNB;
        let cryptosTokenBaseInstance: CryptosTokenBase;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenPolygonAddress: string;
        let cryptosTokenSkaleAddress: string;
        let cryptosTokenBNBAddress: string;
        let cryptosTokenBaseAddress: string;

        // Settings
        const eidEthereum = 40161;
        const eidPolygon = 40109;
        const eidSkale = 40273;
        const eidBNB = 30102;
        const eidBase = 30184;
        const lzReceiveGasLimit = 60000;

        const initialUserBalance = "1000".toWei();

        /**
         * Deploy Token Contract
         */
        before(async () => {

            // Accounts
            [deployer, user] = (
                await ethers.getSigners()).map(s => s.address);

            // Factories
            const SkaleFeeTokenFactory = await ethers.getContractFactory("MockERC20");
            const CryptosTokenFactory = await ethers.getContractFactory("CryptosToken");
            const CryptosTokenPolygonFactory = await ethers.getContractFactory("CryptosTokenPolygon");
            const CryptosTokenSkaleFactory = await ethers.getContractFactory("CryptosTokenSkaleEuropa");
            const CryptosTokenBNBFactory = await ethers.getContractFactory("CryptosTokenBNB");
            const CryptosTokenBaseFactory = await ethers.getContractFactory("CryptosTokenBase");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            const LayerZeroEndpointAltFactory = await ethers.getContractFactory("MockLayerZeroEndpointAlt");

            // Deploy fee tokens
            skaleFeeTokenInstance = await SkaleFeeTokenFactory.deploy();
            const skaleFeeTokenAddress = await skaleFeeTokenInstance.address;
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            const layerZeroEndpointSkaleInstance = await LayerZeroEndpointAltFactory.deploy(eidSkale, skaleFeeTokenAddress);
            const layerZeroEndpointSkaleAddress = await layerZeroEndpointSkaleInstance.address;

            const layerZeroEndpointBNBInstance = await LayerZeroEndpointFactory.deploy(eidBNB);
            const layerZeroEndpointBNBAddress = await layerZeroEndpointBNBInstance.address;

            const layerZeroEndpointBaseInstance = await LayerZeroEndpointFactory.deploy(eidBase);
            const layerZeroEndpointBaseAddress = await layerZeroEndpointBaseInstance.address;

            // Deploy OFTs
            cryptosTokenInstance = await CryptosTokenFactory.deploy(layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            cryptosTokenSkaleInstance = await CryptosTokenSkaleFactory.deploy(layerZeroEndpointSkaleAddress, deployer);
            cryptosTokenSkaleAddress = await cryptosTokenSkaleInstance.address;

            cryptosTokenBNBInstance = await CryptosTokenBNBFactory.deploy(layerZeroEndpointBNBAddress, deployer);
            cryptosTokenBNBAddress = await cryptosTokenBNBInstance.address;

            cryptosTokenBaseInstance = await CryptosTokenBaseFactory.deploy(layerZeroEndpointBaseAddress, deployer);
            cryptosTokenBaseAddress = await cryptosTokenBaseInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);

            // Setup peers
            await cryptosTokenInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenSkaleInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenBNBInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenBaseInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));

            // Setup enforced options
            const requiredOptions = Options.newOptions()
                .addExecutorLzReceiveOption(lzReceiveGasLimit, 0)
                .toHex()
                .toString();

            await cryptosTokenInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenPolygonInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenSkaleInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenBNBInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenBaseInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            // Fund user account
            const sendParam: SendParamStruct = {
                dstEid: eidPolygon,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: initialUserBalance,
                minAmountLD: initialUserBalance,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenInstance.send(sendParam, messagingFee, user, {
                value: nativeFee
            });
        });


        it ("Should transfer to Ethereum", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "60".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidEthereum,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
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

            expect(userBalancePolygon).to.equal(ethers.BigNumber.from(initialUserBalance).sub(amountToTransfer));
            expect(userBalanceEthereum).to.equal(ethers.BigNumber.from(amountToTransfer));
        });

        it ("Should transfer to Skale", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "25".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidSkale,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
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

            expect(userBalanceSkaleAfter).to.equal(userBalanceSkaleBefore.add(amountToTransfer));
            expect(userBalancePolygonAfter).to.equal(userBalancePolygonBefore.sub(amountToTransfer));
        });

        it ("Should transfer to BNB", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "15".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidBNB,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
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
            const userBalanceBNBBefore = await cryptosTokenBNBInstance.balanceOf(user);

            // Act
            await cryptosTokenPolygonInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalancePolygonAfter = await cryptosTokenPolygonInstance.balanceOf(user);
            const userBalanceBNBAfter = await cryptosTokenBNBInstance.balanceOf(user);

            expect(userBalanceBNBAfter).to.equal(userBalanceBNBBefore.add(amountToTransfer));
            expect(userBalancePolygonAfter).to.equal(userBalancePolygonBefore.sub(amountToTransfer));
        });

        it ("Should transfer to Base", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "10".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidBase,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
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
            const userBalanceBaseBefore = await cryptosTokenBaseInstance.balanceOf(user);

            // Act
            await cryptosTokenPolygonInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalancePolygonAfter = await cryptosTokenPolygonInstance.balanceOf(user);
            const userBalanceBaseAfter = await cryptosTokenBaseInstance.balanceOf(user);

            expect(userBalanceBaseAfter).to.equal(userBalanceBaseBefore.add(amountToTransfer));
            expect(userBalancePolygonAfter).to.equal(userBalancePolygonBefore.sub(amountToTransfer));
        });
    });

    /**
     * Test OFT transfers from Skale
     */
    describe("Skale", function () {

        // Accounts
        let deployer: string;
        let user: string;

        // Instances
        let skaleFeeTokenInstance: MockERC20;
        let cryptosTokenInstance: CryptosToken;
        let cryptosTokenPolygonInstance: CryptosTokenPolygon;
        let cryptosTokenSkaleInstance: CryptosTokenSkaleEuropa;
        let cryptosTokenBNBInstance: CryptosTokenBNB;
        let cryptosTokenBaseInstance: CryptosTokenBase;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenPolygonAddress: string;
        let cryptosTokenSkaleAddress: string;
        let cryptosTokenBNBAddress: string;
        let cryptosTokenBaseAddress: string;

        // Settings
        const eidEthereum = 40161;
        const eidPolygon = 40109;
        const eidSkale = 40273;
        const eidBNB = 30102;
        const eidBase = 30184;
        const lzReceiveGasLimit = 60000;

        const initialUserBalance = "1000".toWei();
        const skaleTokenBalance = "1000".toWei();

        /**
         * Deploy Token Contract
         */
        before(async () => {

            // Accounts
            [deployer, user] = (
                await ethers.getSigners()).map(s => s.address);

            // Factories
            const SkaleFeeTokenFactory = await ethers.getContractFactory("MockERC20");
            const CryptosTokenFactory = await ethers.getContractFactory("CryptosToken");
            const CryptosTokenPolygonFactory = await ethers.getContractFactory("CryptosTokenPolygon");
            const CryptosTokenSkaleFactory = await ethers.getContractFactory("CryptosTokenSkaleEuropa");
            const CryptosTokenBNBFactory = await ethers.getContractFactory("CryptosTokenBNB");
            const CryptosTokenBaseFactory = await ethers.getContractFactory("CryptosTokenBase");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            const LayerZeroEndpointAltFactory = await ethers.getContractFactory("MockLayerZeroEndpointAlt");

            // Deploy fee tokens
            skaleFeeTokenInstance = await SkaleFeeTokenFactory.deploy();
            const skaleFeeTokenAddress = await skaleFeeTokenInstance.address;
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            const layerZeroEndpointSkaleInstance = await LayerZeroEndpointAltFactory.deploy(eidSkale, skaleFeeTokenAddress);
            const layerZeroEndpointSkaleAddress = await layerZeroEndpointSkaleInstance.address;

            const layerZeroEndpointBNBInstance = await LayerZeroEndpointFactory.deploy(eidBNB);
            const layerZeroEndpointBNBAddress = await layerZeroEndpointBNBInstance.address;

            const layerZeroEndpointBaseInstance = await LayerZeroEndpointFactory.deploy(eidBase);
            const layerZeroEndpointBaseAddress = await layerZeroEndpointBaseInstance.address;

            // Deploy OFTs
            cryptosTokenInstance = await CryptosTokenFactory.deploy(layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            cryptosTokenSkaleInstance = await CryptosTokenSkaleFactory.deploy(layerZeroEndpointSkaleAddress, deployer);
            cryptosTokenSkaleAddress = await cryptosTokenSkaleInstance.address;

            cryptosTokenBNBInstance = await CryptosTokenBNBFactory.deploy(layerZeroEndpointBNBAddress, deployer);
            cryptosTokenBNBAddress = await cryptosTokenBNBInstance.address;

            cryptosTokenBaseInstance = await CryptosTokenBaseFactory.deploy(layerZeroEndpointBaseAddress, deployer);
            cryptosTokenBaseAddress = await cryptosTokenBaseInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);

            // Setup peers
            await cryptosTokenInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenSkaleInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenBNBInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenBaseInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));

            // Setup enforced options
            const requiredOptions = Options.newOptions()
                .addExecutorLzReceiveOption(lzReceiveGasLimit, 0)
                .toHex()
                .toString();

            await cryptosTokenInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenPolygonInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenSkaleInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenBNBInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);
            
            await cryptosTokenBaseInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            // Fund user account
            await skaleFeeTokenInstance.mint(user, skaleTokenBalance);

            const sendParam: SendParamStruct = {
                dstEid: eidSkale,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: initialUserBalance,
                minAmountLD: initialUserBalance,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenInstance.send(sendParam, messagingFee, user, {
                value: nativeFee
            });
        });

        it ("Should transfer to Ethereum", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "50".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidEthereum,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenSkaleInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await skaleFeeTokenInstance
                .connect(signer)
                .approve(cryptosTokenSkaleAddress, nativeFee);

            // Act
            await cryptosTokenSkaleInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceSkale = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalanceEthereum = await cryptosTokenInstance.balanceOf(user);

            expect(userBalanceSkale).to.equal(ethers.BigNumber.from(initialUserBalance).sub(amountToTransfer));
            expect(userBalanceEthereum).to.equal(ethers.BigNumber.from(amountToTransfer));
        });

        it ("Should transfer to Polygon", async () => {

            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "25".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidPolygon,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenSkaleInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await skaleFeeTokenInstance
                .connect(signer)
                .approve(cryptosTokenSkaleAddress, nativeFee);

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

            expect(userBalancePolygonAfter).to.equal(userBalancePolygonBefore.add(amountToTransfer));
            expect(userBalanceSkaleAfter).to.equal(userBalanceSkaleBefore.sub(amountToTransfer));
        });

        it ("Should transfer to BNB", async () => {
            
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "25".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidBNB,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenSkaleInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await skaleFeeTokenInstance
                .connect(signer)
                .approve(cryptosTokenSkaleAddress, nativeFee);

            const userBalanceSkaleBefore = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalanceBNBBefore = await cryptosTokenBNBInstance.balanceOf(user);

            // Act
            await cryptosTokenSkaleInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceSkaleAfter = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalanceBNBAfter = await cryptosTokenBNBInstance.balanceOf(user);

            expect(userBalanceSkaleAfter).to.equal(userBalanceSkaleBefore.sub(amountToTransfer));
            expect(userBalanceBNBAfter).to.equal(userBalanceBNBBefore.add(amountToTransfer));
        });

        it ("Should transfer to Base", async () => {
            
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "10".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidBase,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenSkaleInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await skaleFeeTokenInstance
                .connect(signer)
                .approve(cryptosTokenSkaleAddress, nativeFee);

            const userBalanceSkaleBefore = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalanceBaseBefore = await cryptosTokenBaseInstance.balanceOf(user);

            // Act
            await cryptosTokenSkaleInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceSkaleAfter = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalanceBaseAfter = await cryptosTokenBaseInstance.balanceOf(user);

            expect(userBalanceSkaleAfter).to.equal(userBalanceSkaleBefore.sub(amountToTransfer));
            expect(userBalanceBaseAfter).to.equal(userBalanceBaseBefore.add(amountToTransfer));
        });
    });

    /**
     * Test OFT transfers from BNB
     */
    describe("BNB", function () {

        // Accounts
        let deployer: string;
        let user: string;

        // Instances
        let skaleFeeTokenInstance: MockERC20;
        let cryptosTokenInstance: CryptosToken;
        let cryptosTokenPolygonInstance: CryptosTokenPolygon;
        let cryptosTokenSkaleInstance: CryptosTokenSkaleEuropa;
        let cryptosTokenBNBInstance: CryptosTokenBNB;
        let cryptosTokenBaseInstance: CryptosTokenBase;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenPolygonAddress: string;
        let cryptosTokenSkaleAddress: string;
        let cryptosTokenBNBAddress: string;
        let cryptosTokenBaseAddress: string;

        // Settings
        const eidEthereum = 40161;
        const eidPolygon = 40109;
        const eidSkale = 40273;
        const eidBNB = 30102;
        const eidBase = 30184;
        const lzReceiveGasLimit = 60000;

        const initialUserBalance = "1000".toWei();

        /**
         * Deploy Token Contract
         */
        before(async () => {

            // Accounts
            [deployer, user] = (
                await ethers.getSigners()).map(s => s.address);

            // Factories
            const SkaleFeeTokenFactory = await ethers.getContractFactory("MockERC20");
            const CryptosTokenFactory = await ethers.getContractFactory("CryptosToken");
            const CryptosTokenPolygonFactory = await ethers.getContractFactory("CryptosTokenPolygon");
            const CryptosTokenSkaleFactory = await ethers.getContractFactory("CryptosTokenSkaleEuropa");
            const CryptosTokenBNBFactory = await ethers.getContractFactory("CryptosTokenBNB");
            const CryptosTokenBaseFactory = await ethers.getContractFactory("CryptosTokenBase");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            const LayerZeroEndpointAltFactory = await ethers.getContractFactory("MockLayerZeroEndpointAlt");

            // Deploy fee tokens
            skaleFeeTokenInstance = await SkaleFeeTokenFactory.deploy();
            const skaleFeeTokenAddress = await skaleFeeTokenInstance.address;
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            const layerZeroEndpointSkaleInstance = await LayerZeroEndpointAltFactory.deploy(eidSkale, skaleFeeTokenAddress);
            const layerZeroEndpointSkaleAddress = await layerZeroEndpointSkaleInstance.address;

            const layerZeroEndpointBNBInstance = await LayerZeroEndpointFactory.deploy(eidBNB);
            const layerZeroEndpointBNBAddress = await layerZeroEndpointBNBInstance.address;

            const layerZeroEndpointBaseInstance = await LayerZeroEndpointFactory.deploy(eidBase);
            const layerZeroEndpointBaseAddress = await layerZeroEndpointBaseInstance.address;

            // Deploy OFTs
            cryptosTokenInstance = await CryptosTokenFactory.deploy(layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            cryptosTokenSkaleInstance = await CryptosTokenSkaleFactory.deploy(layerZeroEndpointSkaleAddress, deployer);
            cryptosTokenSkaleAddress = await cryptosTokenSkaleInstance.address;

            cryptosTokenBNBInstance = await CryptosTokenBNBFactory.deploy(layerZeroEndpointBNBAddress, deployer);
            cryptosTokenBNBAddress = await cryptosTokenBNBInstance.address;

            cryptosTokenBaseInstance = await CryptosTokenBaseFactory.deploy(layerZeroEndpointBaseAddress, deployer);
            cryptosTokenBaseAddress = await cryptosTokenBaseInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);

            // Setup peers
            await cryptosTokenInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenSkaleInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenBNBInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenBaseInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));

            // Setup enforced options
            const requiredOptions = Options.newOptions()
                .addExecutorLzReceiveOption(lzReceiveGasLimit, 0)
                .toHex()
                .toString();

            await cryptosTokenInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenPolygonInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenSkaleInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenBNBInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenBaseInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            // Fund user account
            const sendParam: SendParamStruct = {
                dstEid: eidBNB,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: initialUserBalance,
                minAmountLD: initialUserBalance,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenInstance.send(sendParam, messagingFee, user, {
                value: nativeFee
            });
        });


        it ("Should transfer to Ethereum", async () => {
            
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "60".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidEthereum,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenBNBInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenBNBInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceEthereum = await cryptosTokenInstance.balanceOf(user);
            const userBalanceBNB = await cryptosTokenBNBInstance.balanceOf(user);

            expect(userBalanceBNB).to.equal(ethers.BigNumber.from(initialUserBalance).sub(amountToTransfer));
            expect(userBalanceEthereum).to.equal(ethers.BigNumber.from(amountToTransfer));
        });

        it ("Should transfer to Polygon", async () => {
            
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "25".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidPolygon,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenBNBInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const userBalancePolygonBefore = await cryptosTokenPolygonInstance.balanceOf(user);
            const userBalanceBNBBefore = await cryptosTokenBNBInstance.balanceOf(user);

            await cryptosTokenBNBInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalancePolygonAfter = await cryptosTokenPolygonInstance.balanceOf(user);
            const userBalanceBNBAfter = await cryptosTokenBNBInstance.balanceOf(user);

            expect(userBalancePolygonAfter).to.equal(userBalancePolygonBefore.add(amountToTransfer));
            expect(userBalanceBNBAfter).to.equal(userBalanceBNBBefore.sub(amountToTransfer));
        });

        it ("Should transfer to Skale", async () => {
            
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "15".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidSkale,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenBNBInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const userBalanceSkaleBefore = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalanceBNBBefore = await cryptosTokenBNBInstance.balanceOf(user);

            await cryptosTokenBNBInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceSkaleAfter = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalanceBNBAfter = await cryptosTokenBNBInstance.balanceOf(user);

            expect(userBalanceSkaleAfter).to.equal(userBalanceSkaleBefore.add(amountToTransfer));
            expect(userBalanceBNBAfter).to.equal(userBalanceBNBBefore.sub(amountToTransfer));
        });

        it ("Should transfer to Base", async () => {
            
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "10".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidBase,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenBNBInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const userBalanceBaseBefore = await cryptosTokenBaseInstance.balanceOf(user);
            const userBalanceBNBBefore = await cryptosTokenBNBInstance.balanceOf(user);

            await cryptosTokenBNBInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceBaseAfter = await cryptosTokenBaseInstance.balanceOf(user);
            const userBalanceBNBAfter = await cryptosTokenBNBInstance.balanceOf(user);

            expect(userBalanceBaseAfter).to.equal(userBalanceBaseBefore.add(amountToTransfer));
            expect(userBalanceBNBAfter).to.equal(userBalanceBNBBefore.sub(amountToTransfer));
        });
    });

    /**
     * Test OFT transfers from Base
     */
    describe("Base", function () {

        // Accounts
        let deployer: string;
        let user: string;

        // Instances
        let skaleFeeTokenInstance: MockERC20;
        let cryptosTokenInstance: CryptosToken;
        let cryptosTokenPolygonInstance: CryptosTokenPolygon;
        let cryptosTokenSkaleInstance: CryptosTokenSkaleEuropa;
        let cryptosTokenBNBInstance: CryptosTokenBNB;
        let cryptosTokenBaseInstance: CryptosTokenBase;

        // Addresses
        let cryptosTokenAddress: string;
        let cryptosTokenPolygonAddress: string;
        let cryptosTokenSkaleAddress: string;
        let cryptosTokenBNBAddress: string;
        let cryptosTokenBaseAddress: string;

        // Settings
        const eidEthereum = 40161;
        const eidPolygon = 40109;
        const eidSkale = 40273;
        const eidBNB = 30102;
        const eidBase = 30184;
        const lzReceiveGasLimit = 60000;

        const initialUserBalance = "1000".toWei();

        /**
         * Deploy Token Contract
         */
        before(async () => {

            // Accounts
            [deployer, user] = (
                await ethers.getSigners()).map(s => s.address);

            // Factories
            const SkaleFeeTokenFactory = await ethers.getContractFactory("MockERC20");
            const CryptosTokenFactory = await ethers.getContractFactory("CryptosToken");
            const CryptosTokenPolygonFactory = await ethers.getContractFactory("CryptosTokenPolygon");
            const CryptosTokenSkaleFactory = await ethers.getContractFactory("CryptosTokenSkaleEuropa");
            const CryptosTokenBNBFactory = await ethers.getContractFactory("CryptosTokenBNB");
            const CryptosTokenBaseFactory = await ethers.getContractFactory("CryptosTokenBase");
            const LayerZeroEndpointFactory = await ethers.getContractFactory("MockLayerZeroEndpoint");
            const LayerZeroEndpointAltFactory = await ethers.getContractFactory("MockLayerZeroEndpointAlt");

            // Deploy fee tokens
            skaleFeeTokenInstance = await SkaleFeeTokenFactory.deploy();
            const skaleFeeTokenAddress = await skaleFeeTokenInstance.address;
            
            // Deploy endpoints
            const layerZeroEndpointEthereumInstance = await LayerZeroEndpointFactory.deploy(eidEthereum);
            const layerZeroEndpointEthereumAddress = await layerZeroEndpointEthereumInstance.address;

            const layerZeroEndpointPolygonInstance = await LayerZeroEndpointFactory.deploy(eidPolygon);
            const layerZeroEndpointPolygonAddress = await layerZeroEndpointPolygonInstance.address;

            const layerZeroEndpointSkaleInstance = await LayerZeroEndpointAltFactory.deploy(eidSkale, skaleFeeTokenAddress);
            const layerZeroEndpointSkaleAddress = await layerZeroEndpointSkaleInstance.address;

            const layerZeroEndpointBNBInstance = await LayerZeroEndpointFactory.deploy(eidBNB);
            const layerZeroEndpointBNBAddress = await layerZeroEndpointBNBInstance.address;

            const layerZeroEndpointBaseInstance = await LayerZeroEndpointFactory.deploy(eidBase);
            const layerZeroEndpointBaseAddress = await layerZeroEndpointBaseInstance.address;

            // Deploy OFTs
            cryptosTokenInstance = await CryptosTokenFactory.deploy(layerZeroEndpointEthereumAddress, deployer);
            cryptosTokenAddress = await cryptosTokenInstance.address;

            cryptosTokenPolygonInstance = await CryptosTokenPolygonFactory.deploy(layerZeroEndpointPolygonAddress, deployer);
            cryptosTokenPolygonAddress = await cryptosTokenPolygonInstance.address;

            cryptosTokenSkaleInstance = await CryptosTokenSkaleFactory.deploy(layerZeroEndpointSkaleAddress, deployer);
            cryptosTokenSkaleAddress = await cryptosTokenSkaleInstance.address;

            cryptosTokenBNBInstance = await CryptosTokenBNBFactory.deploy(layerZeroEndpointBNBAddress, deployer);
            cryptosTokenBNBAddress = await cryptosTokenBNBInstance.address;

            cryptosTokenBaseInstance = await CryptosTokenBaseFactory.deploy(layerZeroEndpointBaseAddress, deployer);
            cryptosTokenBaseAddress = await cryptosTokenBaseInstance.address;

            // Setup endpoints
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointEthereumInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointPolygonInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);
            await layerZeroEndpointSkaleInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointBNBInstance.setDestLzEndpoint(cryptosTokenBaseAddress, layerZeroEndpointBaseAddress);

            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenAddress, layerZeroEndpointEthereumAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenPolygonAddress, layerZeroEndpointPolygonAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenSkaleAddress, layerZeroEndpointSkaleAddress);
            await layerZeroEndpointBaseInstance.setDestLzEndpoint(cryptosTokenBNBAddress, layerZeroEndpointBNBAddress);

            // Setup peers
            await cryptosTokenInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenPolygonInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenPolygonInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenSkaleInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));
            await cryptosTokenSkaleInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenBNBInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenBNBInstance.setPeer(eidBase, ethers.utils.zeroPad(cryptosTokenBaseAddress, 32));

            await cryptosTokenBaseInstance.setPeer(eidEthereum, ethers.utils.zeroPad(cryptosTokenAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidPolygon, ethers.utils.zeroPad(cryptosTokenPolygonAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidSkale, ethers.utils.zeroPad(cryptosTokenSkaleAddress, 32));
            await cryptosTokenBaseInstance.setPeer(eidBNB, ethers.utils.zeroPad(cryptosTokenBNBAddress, 32));

            // Setup enforced options
            const requiredOptions = Options.newOptions()
                .addExecutorLzReceiveOption(lzReceiveGasLimit, 0)
                .toHex()
                .toString();

            await cryptosTokenInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenPolygonInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenSkaleInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenBNBInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBase,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            await cryptosTokenBaseInstance.setEnforcedOptions(
                [  
                    {
                        eid: eidEthereum,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidPolygon,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidSkale,
                        msgType: 1,
                        options: requiredOptions
                    },
                    {
                        eid: eidBNB,
                        msgType: 1,
                        options: requiredOptions
                    }
                ]);

            // Fund user account
            const sendParam: SendParamStruct = {
                dstEid: eidBase,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: initialUserBalance,
                minAmountLD: initialUserBalance,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenInstance.send(sendParam, messagingFee, user, {
                value: nativeFee
            });
        });

        it ("Should transfer to Ethereum", async () => {
            
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "60".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidEthereum,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenBaseInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            await cryptosTokenBaseInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceEthereum = await cryptosTokenInstance.balanceOf(user);
            const userBalanceBase = await cryptosTokenBaseInstance.balanceOf(user);

            expect(userBalanceBase).to.equal(ethers.BigNumber.from(initialUserBalance).sub(amountToTransfer));
            expect(userBalanceEthereum).to.equal(ethers.BigNumber.from(amountToTransfer));
        });

        it ("Should transfer to Polygon", async () => {
            
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "25".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidPolygon,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenBaseInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const userBalancePolygonBefore = await cryptosTokenPolygonInstance.balanceOf(user);
            const userBalanceBaseBefore = await cryptosTokenBaseInstance.balanceOf(user);

            await cryptosTokenBaseInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalancePolygonAfter = await cryptosTokenPolygonInstance.balanceOf(user);
            const userBalanceBaseAfter = await cryptosTokenBaseInstance.balanceOf(user);

            expect(userBalancePolygonAfter).to.equal(userBalancePolygonBefore.add(amountToTransfer));
            expect(userBalanceBaseAfter).to.equal(userBalanceBaseBefore.sub(amountToTransfer));
        });

        it ("Should transfer to Skale", async () => {
            
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "15".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidSkale,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenBaseInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const userBalanceSkaleBefore = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalanceBaseBefore = await cryptosTokenBaseInstance.balanceOf(user);

            await cryptosTokenBaseInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceSkaleAfter = await cryptosTokenSkaleInstance.balanceOf(user);
            const userBalanceBaseAfter = await cryptosTokenBaseInstance.balanceOf(user);

            expect(userBalanceSkaleAfter).to.equal(userBalanceSkaleBefore.add(amountToTransfer));
            expect(userBalanceBaseAfter).to.equal(userBalanceBaseBefore.sub(amountToTransfer));
        });

        it ("Should transfer to BNB", async () => {
            
            // Setup
            const signer = await ethers.getSigner(user);
            const amountToTransfer = "10".toWei();

            const sendParam: SendParamStruct = {
                dstEid: eidBNB,
                to: ethers.utils.zeroPad(user, 32),
                amountLD: amountToTransfer,
                minAmountLD: amountToTransfer,
                extraOptions: `0x`,
                composeMsg: `0x`,
                oftCmd: `0x`
            };

            const [nativeFee] = await cryptosTokenBaseInstance
                .quoteSend(sendParam, false);
            const messagingFee: MessagingFeeStruct = {
                nativeFee: nativeFee,
                lzTokenFee: 0
            };

            const userBalanceBNBBefore = await cryptosTokenBNBInstance.balanceOf(user);
            const userBalanceBaseBefore = await cryptosTokenBaseInstance.balanceOf(user);

            await cryptosTokenBaseInstance
                .connect(signer)
                .send(sendParam, messagingFee, user, 
                {
                    value: nativeFee
                });

            // Assert
            const userBalanceBNBAfter = await cryptosTokenBNBInstance.balanceOf(user);
            const userBalanceBaseAfter = await cryptosTokenBaseInstance.balanceOf(user);

            expect(userBalanceBNBAfter).to.equal(userBalanceBNBBefore.add(amountToTransfer));
            expect(userBalanceBaseAfter).to.equal(userBalanceBaseBefore.sub(amountToTransfer));
        });
    });
});