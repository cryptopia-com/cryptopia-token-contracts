// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import { MessagingParams } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import { MessagingFee, MessagingReceipt } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/interfaces/IOFT.sol";

import "../../infrastructure/CryptopiaTokenRetriever.sol";
import "../SkaleMappedERC20Token.sol";

/// @title Cryptopia Token for Skale Europa
/// @notice Game currency used in Cryptopia
/// @dev Implements the ERC20 and the Omnichain Fungible Token (OFT) standards. The contract also implements 
///      the SkaleMappedERC20Token contract to allow the SKALE bridge to mint and burn tokens
/// @author Frank Bonnet - <frankbonnet@outlook.com>
contract CryptosTokenSkaleEuropa is OFT, SkaleMappedERC20Token, CryptopiaTokenRetriever {
    using SafeERC20 for IERC20;


    /// @dev Error used to handle cases where the native ERC20 token 
    ///      for fee payment is not set in the EndpointV2Alt contract
    error LzAltTokenUnavailable();


    /// @dev Contract constructor
    /// @param _layerZeroEndpoint Local endpoint address
    /// @param _owner Token owner used as a delegate in LayerZero Endpoint
    constructor(address _layerZeroEndpoint, address _owner ) 
        OFT("Europa TOS", "TOS", _layerZeroEndpoint, _owner) 
        SkaleMappedERC20Token() 
        Ownable(_owner) {}


    /// @dev Allows the SKALE bridge to mint tokens 
    /// @param to The address to mint tokens to
    /// @param amount The amount of tokens to mint
    function mint(address to, uint amount) 
        public override onlyRole(SKALE_MINTER_ROLE) 
    {
        _mint(to, amount);

        // Emit event
        emit Mint(to, amount);
    }


    /// @dev Allows the SKALE bridge to burn tokens
    /// @param amount The amount of tokens to burn
    function burn(uint amount)
        public override onlyRole(SKALE_BURNER_ROLE)
    {
        _burn(msg.sender, amount);

        // Emit event
        emit Burn(msg.sender, amount);
    }


    /// @dev Failsafe mechanism
    /// @notice Allows the owner to retrieve tokens from the contract  
    ///         that might have been send there by accident
    /// @param _tokenContract The address of ERC20 compatible token
    function retrieveTokens(address _tokenContract) 
        external override onlyOwner()
    {
        _retrieveTokens(_tokenContract);
    }


    /**
     * @dev Internal function to interact with the LayerZero EndpointV2.send() for sending a message.
     * @param _dstEid The destination endpoint ID.
     * @param _message The message payload.
     * @param _options Additional options for the message.
     * @param _fee The calculated LayerZero fee for the message.
     *      - nativeFee: The native fee.
     *      - lzTokenFee: The lzToken fee.
     * @param _refundAddress The address to receive any excess fee values sent to the endpoint.
     * @return receipt The receipt for the sent message.
     *      - guid: The unique identifier for the sent message.
     *      - nonce: The nonce of the sent message.
     *      - fee: The LayerZero fee incurred for the message.
     */
    function _lzSend(
        uint32 _dstEid,
        bytes memory _message,
        bytes memory _options,
        MessagingFee memory _fee,
        address _refundAddress
    ) internal virtual override returns (MessagingReceipt memory receipt) 
    {
        // Push corresponding fees to the endpoint, any excess is sent back to the _refundAddress from the endpoint
        _payNative(_fee.nativeFee);
        if (_fee.lzTokenFee > 0)
        {
            _payLzToken(_fee.lzTokenFee);
        }

        return
            // solhint-disable-next-line check-send-result
            endpoint.send(
                MessagingParams(_dstEid, _getPeerOrRevert(_dstEid), _message, _options, _fee.lzTokenFee > 0),
                _refundAddress
            );
    }


    /// @dev Internal function to pay the alt token fee associated with the message
    /// @param _nativeFee The alt token fee to be paid
    /// @return nativeFee The amount of native currency paid
    /// @dev If the OApp needs to initiate MULTIPLE LayerZero messages in a single transaction,
    ///      this will need to be overridden because alt token would contain multiple lzFees
    function _payNative(uint _nativeFee) 
        internal virtual override returns(uint nativeFee) 
    {
        address nativeErc20 = endpoint.nativeToken();
        if (nativeErc20 == address(0)) 
        {
            revert LzAltTokenUnavailable();
        }

        // Pay Alt token fee by sending tokens to the endpoint
        IERC20(nativeErc20).safeTransferFrom(
            msg.sender, address(endpoint), _nativeFee);

        return 0;
    }
}