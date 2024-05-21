// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import "../../../source/skale/europa/CryptosTokenSkaleEuropa.sol";

contract DevelopmentTokenSkaleEuropa is CryptosTokenSkaleEuropa {

    constructor(address _layerZeroEndpoint, address _owner) 
        CryptosTokenSkaleEuropa(_layerZeroEndpoint, _owner) {}
}