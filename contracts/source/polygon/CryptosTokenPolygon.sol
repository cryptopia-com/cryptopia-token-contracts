// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

import "../CryptosOFT.sol";

/// @title Cryptopia Token for Polygon
/// @notice Game currency used in Cryptopia
/// @dev Implements the ERC20 and OFT standard
/// @author Frank Bonnet - <frankbonnet@outlook.com>
contract CryptosTokenPolygon is CryptosOFT {

    /// @dev Contract constructor
    /// @param _layerZeroEndpoint Local endpoint address
    /// @param _initialOwner Token owner used as a delegate in LayerZero Endpoint
    constructor(
        address _layerZeroEndpoint, 
        address _initialOwner ) 
        CryptosOFT("Cryptos", "TOS", _layerZeroEndpoint, _initialOwner) {}
}