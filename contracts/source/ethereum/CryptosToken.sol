// SPDX-License-Identifier: ISC
pragma solidity 0.8.20;

import "../CryptopiaERC20.sol";

/// @title Cryptopia Token 
/// @notice Game currency used in Cryptoipa
/// @dev Implements the ERC20 standard
/// @author Frank Bonnet - <frankbonnet@outlook.com>
contract CryptosToken is CryptopiaERC20 {

    /// @dev Contract constructor
    constructor() CryptopiaERC20("Cryptos", "TOS")
    {
        _mint(msg.sender, 10_000_000_000 * 10 ** decimals());
    }
}