const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// Instance of web3
const web3 = new Web3(ganache.provider());

// Importing our compiled contracts 
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

// Global variables
let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    // Deploying an instance of compiledFactory
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '1000000' });

    // Creating an instance of campaign using our compiledFactory
    await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1000000'});

    // Returns address of our deployed campaign
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns', () => {
    it('Deployment of factory and campaign contract', () => {
        // Checks if the addresses exist for these contracts 
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    it('Manager is set to the address from which the contract was called', async() => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
        console.log(manager);
    });
    it('Ability to contribute to the contract and update the contributors mapping', async() => {
        await campaign.methods.contribute().send({ from: accounts[1], gas: '1000000', value: '200' });
        // isContributor should return true if they successfully contributed 
        const isContributor = await campaign.methods.contributors(accounts[1]).call();
        assert(isContributor);
    });
    it('Enforcing the minimum contribution requirement', async() => {
        try {
            // This should return in an error and push us into the catch block
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '10'
            });
            // Test will fail if the try block successfully executes
            assert(false);
        } catch (err) {
            // Test will pass if we encounter the error 
            assert(err);
        }
    });
    it('Enables a manager to make a payment request', async() => {
        await campaign.methods
            .createRequest('Purchase materials', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        // Returning the request through the public requests array
        const managerRequest = await campaign.methods.requests(0).call();
        assert.equal('Purchase materials',managerRequest.description);
    });
    it('End to end testing', async() => {

        // Checking the inital balance of the address that'll recieve the funds 
        let initialBalance = await web3.eth.getBalance(accounts[1]);
        initialBalance = web3.utils.fromWei(initialBalance, 'ether');
        initialBalance = parseFloat(initialBalance);

        // Contributing to the campaign
        await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei('10', 'ether')});

        // Creating a request for campaign spending
        await campaign.methods
            .createRequest('Test', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000' })

        // Approving the request as a contributor
        await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: '1000000' });

        // Finalizing the request and sending the funds
        await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '1000000' });

        // Checking if the funds were transferred 
        let finalBalance = await web3.eth.getBalance(accounts[1]);
        finalBalance = web3.utils.fromWei(finalBalance, 'ether');
        finalBalance = parseFloat(finalBalance);

        // Assertion 
        assert(finalBalance - initialBalance > 4.5);
        console.log(finalBalance - initialBalance);
    });

})