// SPDX-License-Identifier: ISC
pragma solidity 0.8.20;

import "../errors/AccessErrors.sol";
import "../errors/ArgumentErrors.sol";
import "../CryptopiaERC20.sol";

/// @title Cryptopia Token for Polygon
/// @notice Game currency used in Cryptoipa
/// @dev Implements the ERC20 standard
/// @author Frank Bonnet - <frankbonnet@outlook.com>
contract CryptosTokenPolygon is CryptopiaERC20 {

    /// @dev Polygon Bridge
    address public immutable depositor;


    /**
     * Events
     */
    /// @dev Emitted when tokens are deposited on the root chain
    /// @param user The address from whom the tokens are deposited
    /// @param amount The amount of tokens deposited
    event Deposit(address indexed user, uint amount);

    /// @dev Emitted when tokens are withdrawn to the root chain
    /// @param user The address to whom the tokens are withdrawn
    /// @param amount The amount of tokens withdrawn
    event Withdraw(address indexed user, uint amount);


    /**
     * Mofifiers
     */
    /// @dev Ensures the provided address is non-zero
    /// @param account The address to validate
    modifier notNull(address account) 
    {
        if (account == address(0)) 
        {
            revert ArgumentZeroAddress();
        }
        _;
    }

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
        notNull(_depositor)
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
        external 
        onlyDepositor() 
        notNull(user)
    {
        uint amount = abi.decode(depositData, (uint));
        _mint(user, amount);

        // Emit event
        emit Deposit(user, amount);
    }


    /// @notice called when user wants to withdraw tokens back to root chain
    /// @dev Should burn user's tokens. This transaction will be verified when exiting on root chain
    /// @param amount amount of tokens to withdraw
    function withdraw(uint amount) 
        external 
    {
        _burn(_msgSender(), amount);

        // Emit event
        emit Withdraw(_msgSender(), amount);
    }
}