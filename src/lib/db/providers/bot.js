import { ethers } from'ethers'
import contract from'@/data/artifacts/scripts/contracts/SlotMachine.sol/SlotMachine.json'
import { parseUnits, formatUnits } from'viem'
const { abi } = contract;

const networkRpc = process.env.NEXT_PUBLIC_NETWORK_RPC; // WebSocket URL for Ethereum node
const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
// Set up the WebSocket provider and signer (wallet)
const provider = new ethers.WebSocketProvider(networkRpc);
const wallet = new ethers.Wallet(ownerPrivateKey, provider);

// Instantiate the contract
const slotMachineContract = new ethers.Contract(contractAddress, abi, wallet);

// Define the prizes for each symbol
const symbolPrizes = {
  'banana': 0.05, // prize in ETH
  'seven': 0.1,
  'cherry': 0.08,
  'plum': 0.06,
  'orange': 0.07,
  'bell': 0.15,
  'bar': 0.2,
  'lemon': 0.05,
  'melon': 0.12
};

// Function to calculate prize based on the matching symbols
const calculatePrize = (results) => {
  const [symbol1, symbol2, symbol3] = results;

  // Check for matches
  let prize = 0;
  if (symbol1 === symbol2 && symbol2 === symbol3) {
    // All three symbols match
    prize = symbolPrizes[symbol1] * 3; // Triple prize for 3 matching symbols
  } else if (symbol1 === symbol2 || symbol2 === symbol3 || symbol1 === symbol3) {
    // Two symbols match
    prize = Math.max(symbolPrizes[symbol1], symbolPrizes[symbol2], symbolPrizes[symbol3]);
  }

  return prize;
};

// Set up event listener for the `RequestSpin` event
const listenToSpinRequest = async () => {
  try {
    // Listen for the "RequestSpin" event
    slotMachineContract.on('RequestSpin', async (player, betAmount) => {
      console.log(`Spin requested by: ${player} with bet amount: ${formatUnits(betAmount, 18)} ETH`);

      // Simulate spin result
      const symbols = [
        'banana', 'seven', 'cherry', 'plum', 'orange', 'bell', 'bar', 'lemon', 'melon'
      ];
      const randomResults = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];

      console.log(`Spin results: ${randomResults.join(', ')}`);

      // Calculate the prize based on the matching symbols
      const prize = calculatePrize(randomResults);

      try {
        // Set the spin result on the contract
        const tx = await slotMachineContract.setSpinResult(
          player,
          randomResults[0],
          randomResults[1],
          randomResults[2],
          parseUnits(prize.toString(), 18) // Assuming prize is in ETH
        );

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log(`Spin results for ${player} have been set successfully. Transaction hash: ${receipt.transactionHash}`);
      } catch (error) {
        console.error('Error setting spin result:', error);
      }
    });

    console.log('Event listener is now active. Listening for spin requests...');
  } catch (error) {
    console.error('Error setting up event listener:', error);
  }
};


listenToSpinRequest();

