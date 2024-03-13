// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {

    constructor() ERC20("Mock Token", "MOCK") {}

    function mint(address to, uint amount) 
        external 
    {
        _mint(to, amount);
    }
}