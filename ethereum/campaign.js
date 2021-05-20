import Campaign from './build/Campaign.json';
import web3 from './web3';

// show.js will generate the address of the specific contract
export default (address) => {
    return new web3.eth.Contract(Campaign.abi, address);
};
