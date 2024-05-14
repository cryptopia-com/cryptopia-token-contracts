// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import "@layerzerolabs/test-devtools-evm-hardhat/contracts/mocks/EndpointV2Mock.sol";

contract MockLayerZeroEndpointAlt is EndpointV2Mock {

    address internal immutable nativeErc20;

    constructor(uint16 _chainId, address _altToken) 
        EndpointV2Mock(_chainId)
    {
        nativeErc20 = _altToken;
    }
}