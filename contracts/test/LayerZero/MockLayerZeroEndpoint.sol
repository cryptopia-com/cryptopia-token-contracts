// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import "@layerzerolabs/test-devtools-evm-hardhat/contracts/mocks/EndpointV2Mock.sol";

contract MockLayerZeroEndpoint is EndpointV2Mock {

    constructor(uint16 _chainId) 
        EndpointV2Mock(_chainId) {}
}