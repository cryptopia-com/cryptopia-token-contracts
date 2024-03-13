// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import "../../../source/skale/nebula/CryptosTokenSkaleNebula.sol";

contract DevelopmentTokenSkaleNebula is CryptosTokenSkaleNebula {

    constructor(address _owner) 
        CryptosTokenSkaleNebula(_owner) 
    {
        _grantRole(SKALE_MINTER_ROLE, msg.sender);
        _grantRole(SKALE_BURNER_ROLE, msg.sender); 
    }
}