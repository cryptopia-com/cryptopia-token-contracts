// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * Mock ERC20 token
 */
contract MockERC20 is ERC20 {

    /**
     * Construct mock ERC20 token
     */
    constructor() ERC20("Mock ERC20", "MOCK20") {}

    /**
     * Mint `_amount` of tokens to `_to`
     */
    function mint(address _to, uint256 _amount) external 
    {
        _mint(_to, _amount);
    }

    /**
     * Burn `_amount` of tokens from `_from`
     */
    function burn(address _from, uint256 _amount) external 
    {
        _burn(_from, _amount);
    }
}