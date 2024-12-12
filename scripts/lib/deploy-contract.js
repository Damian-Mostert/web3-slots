const { ethers } = require("hardhat");

module.exports = async function deployContract(name, args = []) {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying " + name + " contract with the account:", deployer.address);

    // Get the ContractFactory and deploy the contract
    const ContractFactory = await ethers.getContractFactory(name);
    const contract = await ContractFactory.deploy(...args);
    const res = await contract.waitForDeployment();
    console.log(name + " deployed to:", await res.getAddress());
    return contract.address;
};
