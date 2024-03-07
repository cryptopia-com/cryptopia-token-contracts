// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title Cryptopia ERC20 
/// @notice Token that extends Openzeppelin ERC20Upgradeable
/// @dev Implements the ERC20 standard
/// @author Frank Bonnet - <frankbonnet@outlook.com>
abstract contract CryptopiaTokenRetriever {
    using SafeERC20 for ERC20;

    /**
     * Events
     */
    /// @dev Emitted when tokens are retrieved
    /// @param tokenContract The address of ERC20 compatible token
    /// @param account The address of the receiver
    /// @param value The amount of tokens retrieved
    event RetrieveTokens(address indexed tokenContract, address indexed account, uint value);


    /** 
     * Admin functions
     */
    /// @dev Failsafe mechanism
    /// Allows the owner to retrieve tokens from the contract that 
    /// might have been send there by accident
    /// @param _tokenContract The address of ERC20 compatible token
    function _retrieveTokens(address _tokenContract) 
        internal   
    {
        ERC20 tokenInstance = ERC20(_tokenContract);
        uint tokenBalance = tokenInstance.balanceOf(address(this));
        if (tokenBalance > 0) 
        {
            // Transfer tokens to the default admin
            tokenInstance.safeTransfer(msg.sender, tokenBalance);

            // Emit event
            emit RetrieveTokens(_tokenContract, msg.sender, tokenBalance);
        }
    }
}