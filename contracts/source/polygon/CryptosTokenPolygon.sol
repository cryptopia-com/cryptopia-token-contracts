// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";

import "../errors/AccessErrors.sol";
import "../errors/ArgumentErrors.sol";
import "../infrastructure/CryptopiaTokenRetriever.sol";

/// @title Cryptopia Token for Polygon
/// @notice Game currency used in Cryptopia
/// @dev Implements the ERC20 standard
/// @author Frank Bonnet - <frankbonnet@outlook.com>
contract CryptosTokenPolygon is OFT, CryptopiaTokenRetriever {

    /// @dev Polygon Bridge
    address public immutable polygonBridgeDepositor;


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

    /// @dev Throw if not Polygon bridge depositor
    modifier onlyPolygonBridgeDepositor() 
    {
        if (_msgSender() != polygonBridgeDepositor)
        {
            revert Unauthorized();
        }
        _;
    }


    /// @dev Contract constructor
    /// @param _polygonBridgeDepositor Polygon bridge
    /// @param _layerZeroEndpoint Local endpoint address
    /// @param _owner Token owner used as a delegate in LayerZero Endpoint
    constructor(address _polygonBridgeDepositor, address _layerZeroEndpoint, address _owner ) 
        OFT("Cryptos", "TOS", _layerZeroEndpoint, _owner) Ownable(_owner)
        notNull(_polygonBridgeDepositor)
        notNull(_layerZeroEndpoint)
        notNull(_owner)
    {
        polygonBridgeDepositor = _polygonBridgeDepositor;
    }


    /// @notice called when token is deposited on root chain
    /// @dev Should be callable only by ChildChainManager
    /// Should handle deposit by minting the required amount for user
    /// Make sure minting is done only by this function
    /// @param user user address for whom deposit is being done
    /// @param depositData abi encoded amount
    function deposit(address user, bytes calldata depositData)
        external 
        onlyPolygonBridgeDepositor() 
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