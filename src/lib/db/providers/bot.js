import { ethers } from'ethers'
import Bid from "@/data/artifacts/src/lib/contracts/Bid.sol/Bid.json";
const { abi } = Bid;
import Address from "../models/address";

const networkRpc = process.env.NEXT_PUBLIC_NETWORK_RPC; // WebSocket URL for Ethereum node
const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
// Set up the WebSocket provider and signer (wallet)
const provider = new ethers.WebSocketProvider(networkRpc);
const wallet = new ethers.Wallet(ownerPrivateKey, provider);

// Instantiate the contract
const contract = new ethers.Contract(contractAddress, abi, wallet);

export {contract}

const listen = async () => {
  try {
    contract.on('PURCHASE', async (sender, value) => {
        await Address.updateOne({
          value:sender,
        },{
          spins:Number(value)
        })
    })
    contract.on('REDEEM', async (sender, value) => {
       await Address.updateOne({
         value:sender,
       },{
         balance:0
       })
   })
  } catch (error) {
    console.error('Error setting up event listener:', error);
  }
};


export default listen;
