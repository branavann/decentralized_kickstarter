const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const  compiledFactory = require('./build/CampaignFactory.json');


const provider = new HDWalletProvider(
    'orient frozen define shock mouse talent adapt scorpion brush rib aisle token',
    'https://rinkeby.infura.io/v3/16a624b7c1124b048ab4429260e8e423'
);

// Creates an instance of web3 that connects to Rinkeby test network
const web3 = new Web3(provider);

const deploy = async () => {
    // Gather a list of unlocked accounts
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    // Contract deployment
    const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({data: compiledFactory.evm.bytecode.object })
        .send({gas: '1000000', from: accounts[0] });

    // Recording the address of our deployed contract
    console.log('Contract deployed to', result.options.address);
    
};

deploy();