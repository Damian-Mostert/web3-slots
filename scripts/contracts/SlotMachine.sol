// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SlotMachine is Ownable {

    // ADMIN FUNCTIONS
    function updatePrice(uint256 new_price) external onlyOwner {
        price = new_price;
    }
    function updatePoints(string memory symbol, uint256 twoMatchPayout, uint256 threeMatchPayout) external onlyOwner {
        points[symbol] = [twoMatchPayout, threeMatchPayout];
    }
    function withdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient funds");
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");
    }
    function deposit() external payable {}

    // SLOT MACHINE LOGIC
    uint256 public price;

    constructor() {
        price = 0.075 ether;
        points["Cherry"] = [8 ether, 16 ether]; 
        points["Lemon"] = [7 ether, 14 ether];
        points["Plum"] = [6 ether, 12 ether];
        points["Orange"] = [5 ether, 10 ether];
        points["Bell"] = [4 ether, 8 ether];
        points["Melon"] = [3 ether, 6 ether];
        points["Bar"] = [2 ether, 4 ether];
        points["Seven"] = [1 ether, 2 ether];
    }

    string[] public symbols = [
        "Cherry",
        "Lemon",
        "Plum",
        "Orange",
        "Bell",
        "Melon",
        "Bar",
        "Seven"
    ];

    mapping(string => uint256[2]) public points; // Points for 2-match and 3-match

    struct Slot {
        bool redeemed;
        string[3] results;
        uint256 prize;
    }

    mapping(address => Slot) public slots;
    mapping(address => uint256) public balances;

    function spin() external payable returns (Slot memory) {
        require(msg.value >= price, "Minimum bet is the current price");
        require(slots[msg.sender].redeemed, "Previous slot not claimed");

        string[3] memory results = _generateResults();
        uint256 prize = _calculatePrize(results);

/*         if (address(this).balance < prize) {
            prize = 0; // Contract can't pay out
        } */

        slots[msg.sender] = Slot({
            redeemed: false,
            results: results,
            prize: prize
        });
        balances[msg.sender] += prize;

        return slots[msg.sender];
    }

    function userBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    function cashOut() external {
        uint256 amount = balances[msg.sender];
        require(address(this).balance >= amount, "Insufficient funds");
        balances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");
    }

    // PRIVATE HELPERS
    function _generateResults() private view returns (string[3] memory) {
        string[3] memory results;
        for (uint256 i = 0; i < 3; i++) {
            uint256 index = _random(i) % symbols.length;
            results[i] = symbols[index];
        }
        return results;
    }

    function _calculatePrize(string[3] memory results) private view returns (uint256) {
        uint256[8] memory counts; // Count occurrences for each symbol

        for (uint256 i = 0; i < 3; i++) {
            for (uint256 j = 0; j < symbols.length; j++) {
                if (keccak256(abi.encodePacked(results[i])) == keccak256(abi.encodePacked(symbols[j]))) {
                    counts[j]++;
                }
            }
        }

        uint256 maxCount = 0;
        uint256 symbolIndex = 0;
        for (uint256 i = 0; i < counts.length; i++) {
            if (counts[i] > maxCount) {
                maxCount = counts[i];
                symbolIndex = i;
            }
        }

        if (maxCount == 2) {
            return (points[symbols[symbolIndex]][0] * price) / 1 ether;
        } else if (maxCount == 3) {
            return (points[symbols[symbolIndex]][1] * price) / 1 ether;
        } else {
            return 0;
        }
    }

    function _random(uint256 salt) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender, salt)));
    }
}