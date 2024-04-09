// SPDX-License-Identifier: ISC
pragma solidity 0.8.22;

/// @dev Emitted when the ownership transfer is started
/// @param previousOwner The address of the previous owner
/// @param newOwner The address of the new owner
event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);