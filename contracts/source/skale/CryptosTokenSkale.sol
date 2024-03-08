// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";

import "../infrastructure/CryptopiaTokenRetriever.sol";

/// @title Cryptopia Token for Skale
/// @notice Game currency used in Cryptopia
/// @dev Implements the ERC20 standard
/// @author Frank Bonnet - <frankbonnet@outlook.com>
contract CryptosTokenSkale is OFT, CryptopiaTokenRetriever {

    /// @dev Contract constructor
    /// @param _layerZeroEndpoint Local endpoint address
    /// @param _owner Token owner used as a delegate in LayerZero Endpoint
    constructor(address _layerZeroEndpoint, address _owner ) 
        OFT("Cryptos", "TOS", _layerZeroEndpoint, _owner) Ownable(_owner) {}


    /// @dev Failsafe mechanism
    /// Allows the owner to retrieve tokens from the contract that 
    /// might have been send there by accident
    /// @param _tokenContract The address of ERC20 compatible token
    function retrieveTokens(address _tokenContract) 
        external onlyOwner()
    {
        _retrieveTokens(_tokenContract);
    }
}