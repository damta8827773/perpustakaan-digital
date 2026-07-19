// SPDX-License-Identifier: MIT
// Pencatatan hak cipta buku on-chain. Bahasa: Solidity.
pragma solidity ^0.8.24;

contract CopyrightLedger {
    struct Record {
        string isbn;
        address registrar;
        uint256 timestamp;
    }

    Record[] public records;

    event Registered(string isbn, address indexed registrar);

    function register(string calldata isbn) external {
        records.push(Record(isbn, msg.sender, block.timestamp));
        emit Registered(isbn, msg.sender);
    }
}
