// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Bid is Ownable, ReentrancyGuard {

    uint public price;

    constructor() {
        price = 0.001 ether;
    }
    
    mapping(address=>uint) prizes;

    event PURCHASE(address sender,uint value);
    event REDEEM(address sender,uint value);
    //ADMIN
    function setPrize(address winner,uint value) external onlyOwner(){
        prizes[winner] = value;
    }
    function updatePrice(uint new_price) external onlyOwner {
        price = new_price;
    }
    function withdrawBalance(uint amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient funds");
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");
    }

    function redeem() external payable {
        uint amount = prizes[msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");         
        require(success, "Withdraw failed");
        prizes[msg.sender] = 0;
        emit REDEEM(msg.sender,amount);
    }

    function purchase() external payable {
        uint amount = (msg.value / price);
        emit PURCHASE(msg.sender,amount);
    }

}
