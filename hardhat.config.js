require('@openzeppelin/hardhat-upgrades');
require('@nomicfoundation/hardhat-ethers');


const network = {
    url: process.env.NETWORK_RPC,
    accounts: [process.env.OWNER_PRIVATE_KEY],
};

module.exports = {
    solidity: '0.8.19',
    defaultNetwork: 'sepolia',
    paths: {
        sources: './scripts/contracts',
        artifacts: "./src/lib/data/artifacts",
        cache: "./build/cache" ,
    },
    viaIR: true,
    networks: {
        ganache: network,
        testnet: network,        
        mainnet: network,
    },
};
