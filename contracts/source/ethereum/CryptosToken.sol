// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../infrastructure/CryptopiaTokenRetriever.sol";

/// @title Cryptopia Token 
/// @notice Game currency used in Cryptopia
/// @dev Implements the ERC20 standard
/// @author Frank Bonnet - <frankbonnet@outlook.com>
contract CryptosToken is ERC20, Ownable, CryptopiaTokenRetriever {

    /// @dev Contract constructor
    /// @param _owner Inital token owner
    constructor(address _owner) 
        ERC20("Cryptos", "TOS") Ownable(_owner)
    {
        _mint(msg.sender, 10_000_000_000 * 10 ** decimals());
    }

    /// @dev Failsafe mechanism
    /// Allows the owner to retrieve tokens from the contract that 
    /// might have been sent there by accident
    /// @param _tokenContract The address of ERC20 compatible token
    function retrieveTokens(address _tokenContract) 
        external override onlyOwner()
    {
        _retrieveTokens(_tokenContract);
    }
}