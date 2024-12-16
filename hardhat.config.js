require('@openzeppelin/hardhat-upgrades');
require('@nomicfoundation/hardhat-ethers');


const network = {
    url: process.env.NEXT_PUBLIC_NETWORK_RPC,
    accounts: [process.env.OWNER_PRIVATE_KEY],
};

module.exports = {
    solidity: '0.8.19',
    defaultNetwork: 'sepolia',
    paths: {
        sources: './src/lib/contracts',
        artifacts: "./src/lib/data/artifacts",
        cache: "./build/cache" ,
    },
    networks: {
        ganache: network,
        testnet: network,        
        mainnet: network,
    },
};
