// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../infrastructure/CryptopiaTokenRetriever.sol";

/// @title Cryptopia Token 
/// @notice Game currency used in Cryptopia
/// @dev Implements the ERC20 standard
/// @author Frank Bonnet - <frankbonnet@outlook.com>
contract CryptosToken is Ownable, ERC20, CryptopiaTokenRetriever {

    /// @dev Contract constructor
    /// @param _owner Token owner is allowed to retrieve tokens send to the contract by accident
    constructor(address _owner) 
        ERC20("Cryptos", "TOS") Ownable(_owner)
    {
        _mint(msg.sender, 10_000_000_000 * 10 ** decimals());
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
}