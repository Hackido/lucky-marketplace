// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../LuckyListing.sol";

interface IListingFactory {
    event Published(uint indexed id);

    function publish(string calldata _productCid, uint _price, uint _maxSlots)
        external
        payable;

    function fetch()
        external
        view returns (LuckyListing[] memory);
}