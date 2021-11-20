// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

library Utils {
    function toWei(uint amount) internal pure returns (uint) {
        return amount * 10 ** _decimals();
    }

    function _decimals() internal pure returns (uint) {
        return 18;
    }

    function notEqual(string memory str1, string memory str2) internal pure returns (bool) {
        if (keccak256(abi.encodePacked(str1)) != keccak256(abi.encodePacked(str2))) {
            return true;
        } else {
            return false;
        }
    }
}