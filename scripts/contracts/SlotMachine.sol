// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SlotMachine is Ownable, ReentrancyGuard {

    uint256 public price;
    mapping(address => uint256) public balances;

    event RequestSpin(address indexed player, uint256 betAmount);
    event SpinResult(address indexed player, string[3] results, uint256 prize);
    event Deposit(address indexed player, uint256 amount);
    event Withdraw(address indexed owner, uint256 amount);
    event CashOut(address indexed player, uint256 amount);
    event PriceUpdated(uint256 newPrice);

    struct Slot {
        string[3] results;
        uint256 prize;
        bool redeemed;
    }

    mapping(address => Slot) public slots;

    constructor() {
        price = 0.075 ether;
    }

    function updatePrice(uint256 new_price) external onlyOwner {
        price = new_price;
        emit PriceUpdated(new_price);
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient funds");
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");
        emit Withdraw(msg.sender, amount);
    }

    function deposit() external payable onlyOwner {
        emit Deposit(msg.sender, msg.value);
    }

    function spin() external payable {
        require(msg.value >= price, "Minimum bet is the current price");
        Slot storage userSlot = slots[msg.sender];
        require(userSlot.redeemed || userSlot.prize == 0, "Previous slot not claimed");
        emit RequestSpin(msg.sender, msg.value);
    }

    function setSpinResult(
        address player,
        string memory result_0,
        string memory result_1,
        string memory result_2,
        uint256 prize
    ) external onlyOwner {
        require(player != address(0), "Invalid player address");
        Slot storage userSlot = slots[player];
        userSlot.redeemed = true;
        userSlot.prize = prize;
        userSlot.results[0] = result_0;
        userSlot.results[1] = result_1;
        userSlot.results[2] = result_2;
        balances[player] += prize;
        emit SpinResult(player, userSlot.results, prize);
    }

    function lastSpin() external view returns (string[3] memory results, uint256 prize) {
        Slot storage userSlot = slots[msg.sender];
        return (userSlot.results, userSlot.prize);
    }

    function userBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    // Using the nonReentrant modifier to protect against reentrancy attacks
    function cashOut() external nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to cash out");
        require(address(this).balance >= amount, "Insufficient funds in contract");

        // Update balance before transferring funds
        balances[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");

        emit CashOut(msg.sender, amount);
    }
}
