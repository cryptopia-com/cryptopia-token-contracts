// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../../infrastructure/CryptopiaTokenRetriever.sol";
import "../SkaleMappedERC20Token.sol";

/// @title Cryptopia Token for Skale Nebula
/// @notice Game currency used in Cryptopia
/// @dev Implements the ERC20 standard. The contract also implements the SkaleMappedERC20Token 
///      contract to allow the SKALE bridge to mint and burn tokens
/// @author Frank Bonnet - <frankbonnet@outlook.com>
contract CryptosTokenSkaleNebula is Ownable, ERC20, SkaleMappedERC20Token, CryptopiaTokenRetriever {

    /// @dev Contract constructor
    /// @param _owner Token owner is allowed to retrieve tokens send to the contract by accident
    constructor(address _owner) 
        ERC20("Nebula TOS", "TOS") 
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
}