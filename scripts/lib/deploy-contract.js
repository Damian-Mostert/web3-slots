const { ethers } = require("hardhat");

module.exports = async function deployContract(name, args = []) {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying " + name + " contract with the account:", deployer.address);

  // Get the ContractFactory and deploy the contract
  const ContractFactory = await ethers.getContractFactory(name);
  const contract = await ContractFactory.deploy(...args);
    
  // Log the transaction hash immediately after deployment initiation
  // Wait for the contract to be deployed
  const res = await contract.waitForDeployment();
  const address = await res.getAddress();
  
  console.log(`${name} deployed to:`, address);
  
  return address;
};
