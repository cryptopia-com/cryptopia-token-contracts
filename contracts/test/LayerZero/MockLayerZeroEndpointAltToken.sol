// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import "../token/MockERC20.sol";

contract MockLayerZeroEndpointAltToken is MockERC20
{
    constructor() MockERC20() {}
}