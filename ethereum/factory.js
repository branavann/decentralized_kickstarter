import web3 from './web3';
// Importing our ABI for the deployed contract 
import CampaignFactory from './build/CampaignFactory.json';

// Provides us access to our deployed contract instance
const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xd77fEa70946a742aCbCCd709870E494bDdCB5822'
);

export default instance; 

