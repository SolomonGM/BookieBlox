// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "./Utils.sol";

contract Escrow {
    address public owner;

    event Deposit(address indexed client, uint amount, string receipt);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function deposit(string memory receipt) public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");

        // Emit event for the deposit
        emit Deposit(msg.sender, msg.value, receipt);
    }

    function withdraw(uint amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
