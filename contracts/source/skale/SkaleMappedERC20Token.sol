// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Cryptopia Token for Skale Europa
/// @notice Game currency used in Cryptopia
/// @dev Implements the ERC20 and the Omnichain Fungible Token (OFT) standards
/// @author Frank Bonnet - <frankbonnet@outlook.com>
abstract contract SkaleMappedERC20Token is AccessControl {

    /**
     * Storage
     */
    address constant public SKALE_BRIDGE = 0xD2aAA00500000000000000000000000000000000;


    /**
     * Roles
     */
    bytes32 public constant SKALE_MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant SKALE_BURNER_ROLE = keccak256("BURNER_ROLE");


    /**
     * Events
     */
    /// @dev Emitted when tokens are minted by the SKALE bridge
    /// @param account The address that the tokens are minted to
    /// @param amount The amount of tokens minted
    event Mint(address indexed account, uint amount);

    /// @dev Emitted when tokens are burned by the SKALE bridge
    /// @param account The address that the tokens are burned from (the SKALE bridge)
    /// @param amount The amount of tokens burned
    event Burn(address indexed account, uint amount);


    /// @dev Contract constructor
    /// @notice Set up the access control for the SKALE bridge
    constructor() 
    {
        _grantRole(SKALE_MINTER_ROLE, SKALE_BRIDGE);
        _grantRole(SKALE_BURNER_ROLE, SKALE_BRIDGE); 
    }


    /// @dev Allows the SKALE bridge to mint tokens 
    /// @notice Must be implemented by the derived contract. The implementation should call _mint 
    ///         and ensure that the call is only made by the SKALE bridge
    /// @param to The address to mint tokens to
    /// @param amount The amount of tokens to mint
    function mint(address to, uint amount) public virtual;


    /// @dev Allows the SKALE bridge to burn tokens
    /// @notice Must be implemented by the derived contract. The implementation should call _burn
    ///         and ensure that the call is only made by the SKALE bridge
    /// @param amount The amount of tokens to burn
    function burn(uint amount) public virtual;
}