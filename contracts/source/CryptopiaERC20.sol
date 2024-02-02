// SPDX-License-Identifier: ISC
pragma solidity ^0.8.20 < 0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./CryptopiaERC20Retriever.sol";

/// @title Cryptopia ERC20 
/// @notice Token that extends Openzeppelin ERC20Upgradeable
/// @dev Implements the ERC20 standard
/// @author Frank Bonnet - <frankbonnet@outlook.com>
abstract contract CryptopiaERC20 is ERC20, AccessControl, CryptopiaERC20Retriever {

    /// @dev Contract initializer
    /// @param name Token name (long)
    /// @param symbol Token ticker symbol (short)
    constructor(string memory name, string memory symbol) 
        ERC20(name, symbol) 
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }


    /** 
     * Admin functions
     */
    /// @dev Failsafe mechanism
    /// Allows the owner to retrieve tokens from the contract that 
    /// might have been send there by accident
    /// @param tokenContract The address of ERC20 compatible token
    function retrieveTokens(address tokenContract) 
        override public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        if (tokenContract != address(this))
        {
            super.retrieveTokens(tokenContract);
        }
    }
}