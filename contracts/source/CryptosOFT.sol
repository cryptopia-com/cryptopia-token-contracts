// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";

import "./errors/ArgumentErrors.sol";
import "./events/OwnershipEvents.sol";
import "./infrastructure/CryptopiaTokenRetriever.sol";

/// @title OFT with two step ownership transfer
/// @dev Extends the OFT standard with a two step ownership transfer
/// @author Frank Bonnet - <frankbonnet@outlook.com>
abstract contract CryptosOFT is OFT, CryptopiaTokenRetriever {

    /// @dev Address of the pending owner
    address private _pendingOwner;


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


    /// @dev Contract constructor
    /// @param _name The name of the OFT.
    /// @param _symbol The symbol of the OFT.
    /// @param _layerZeroEndpoint Local endpoint address
    /// @param _initialOwner Token owner used as a delegate in LayerZero Endpoint
    constructor(
        string memory _name,
        string memory _symbol, 
        address _layerZeroEndpoint, 
        address _initialOwner) 
        OFT(_name, _symbol, _layerZeroEndpoint, _initialOwner) 
        Ownable(_initialOwner)
        notNull(_layerZeroEndpoint)
        notNull(_initialOwner) {}


    /**
     * @dev Returns the address of the pending owner
     * @return The address of the pending owner
     */
    function pendingOwner() public view virtual returns (address) 
    {
        return _pendingOwner;
    }


    /**
     * @dev Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one.
     * Can only be called by the current owner.
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) public virtual override onlyOwner 
    {
        _pendingOwner = newOwner;

        // Emit event
        emit OwnershipTransferStarted(owner(), newOwner);
    }


    /**
     * @dev The new owner accepts the ownership transfer.
     */
    function acceptOwnership() public virtual {
        address sender = _msgSender();
        if (pendingOwner() != sender) 
        {
            revert OwnableUnauthorizedAccount(sender);
        }

        _transferOwnership(sender);
    }


    /// @dev Failsafe mechanism
    /// Allows the owner to retrieve tokens from the contract that 
    /// might have been sent there by accident
    /// @param _tokenContract The address of ERC20 compatible token
    function retrieveTokens(address _tokenContract) 
        external override onlyOwner
    {
        _retrieveTokens(_tokenContract);
    }


    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`) and deletes any pending owner.
     * Internal function without access restriction.
     * @param newOwner The address of the new owner
     */
    function _transferOwnership(address newOwner) internal virtual override 
    {
        delete _pendingOwner;
        super._transferOwnership(newOwner);
    }
}