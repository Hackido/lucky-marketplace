// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./interfaces/IListingFactory.sol";

/// @title A factory contract for deployment of Lucky Listings
/// @author Radosvet Mihtarski
/// @notice Use this contract to publish new Lucky Listings 
/// @dev All function calls are currently implemented
contract LuckyListingFactory is IListingFactory {
    LuckyListing[] private deployed;

    function publish(string calldata _productCid, uint _price, uint _maxSlots)
        external
        payable
        override
    {
        LuckyListing listing =
            new LuckyListing{ value: msg.value }(msg.sender, _productCid, _price, _maxSlots);

        deployed.push(listing);

        emit Published(deployed.length - 1);
    }

    function fetch()
        external
        view
        override
        returns(LuckyListing[] memory)
    {
        return deployed;
    }
}