// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFTAdapter.sol";

/// @title Cryptopia Token OFT Adapter
/// @notice The OFT Adapter allows the existing token to expand to any supported chain as a native token 
///         with a unified global supply, inheriting all the features of the OFT Standard. This works as 
///         an intermediary contract that handles sending and receiving tokens that have already been deployed.
/// @dev see https://docs.layerzero.network/contracts/oft-adapter
/// @author Frank Bonnet - <frankbonnet@outlook.com>
contract CryptosTokenOFTAdapter is OFTAdapter  {

    /// @dev Contract constructor
    /// @param _token The CryptosToken contract address
    /// @param _layerZeroEndpoint Local endpoint address
    /// @param _owner Inital token owner used as a delegate in LayerZero Endpoint
    constructor(address _token,address _layerZeroEndpoint, address _owner ) 
        OFTAdapter(_token, _layerZeroEndpoint, _owner) Ownable(_owner) {}
}