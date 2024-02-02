// SPDX-License-Identifier: ISC
pragma solidity ^0.8.20 < 0.9.0;

import "../errors/AccessErrors.sol";
import "../CryptopiaERC20.sol";

/// @title Cryptopia Token for Polygon
/// @notice Game currency used in Cryptoipa
/// @dev Implements the ERC20 standard
/// @author Frank Bonnet - <frankbonnet@outlook.com>
contract CryptosTokenPolygon is CryptopiaERC20 {

    /// @dev Polygon Bridge
    address public depositor;


    /// @dev Throw if not depositor
    modifier onlyDepositor() 
    {
        if (_msgSender() != depositor)
        {
            revert Unauthorized();
        }
        _;
    }


    /// @dev Contract constructor
    /// @param _depositor Polygon bridge
    constructor(address _depositor) 
        CryptopiaERC20("Cryptos", "TOS")
    {
        depositor = _depositor;
    }


    /// @notice called when token is deposited on root chain
    /// @dev Should be callable only by ChildChainManager
    /// Should handle deposit by minting the required amount for user
    /// Make sure minting is done only by this function
    /// @param user user address for whom deposit is being done
    /// @param depositData abi encoded amount
    function deposit(address user, bytes calldata depositData)
        external onlyDepositor
    {
        uint amount = abi.decode(depositData, (uint));
        _mint(user, amount);
    }


    /// @notice called when user wants to withdraw tokens back to root chain
    /// @dev Should burn user's tokens. This transaction will be verified when exiting on root chain
    /// @param amount amount of tokens to withdraw
    function withdraw(uint256 amount) 
        external 
    {
        _burn(_msgSender(), amount);
    }
}