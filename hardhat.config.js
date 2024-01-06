const { task } = require('hardhat/config');

require('dotenv').config();
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('solidity-coverage');
const { JsonRpcProvider } = require('ethers/node_modules/@ethersproject/providers');

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

task('balances', 'Prints list of accounts and balances', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    const provider = new hre.ethers.providers.JsonRpcProvider(JsonRpcProvider.defaultUrl());

    const amounts = await Promise.all(
        accounts.map(async (a) => {
            const bal = await provider.getBalance(a.address);
            return { address: a.address, balance: bal.toString() };
        })
    );
    console.log(amounts);
});

module.exports = {
    defaultNetwork: 'localhost',
    networks: {
        // goerli: {
        //     url: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`,
        //     accounts: [process.env.PRIVATE_KEY],
        //     // gas: 21000000,
        //     // gasPrice: 180000000000,
        //     // gasMultiplier: 1,
        //     chainId: 5,
        // },
        localhost: {
            url: `http://127.0.0.1:8545`,
            chainId: 31337,
            gasPrice: 3000000000,
            gasMultiplier: 1,
        },
        // mainnet: {
        //     url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
        //     accounts: [process.env.MAINNET_PRIVATE_KEY],
        //     chainId: 1,
        // },
    },
    solidity: {
        version: '0.8.17',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
                details: {
                    yul: false,
                },
            },
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: 'gas.txt',
        noColors: true,
    },
    paths: {
        sources: './contracts',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
    mocha: {
        timeout: 30000000000,
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
};
