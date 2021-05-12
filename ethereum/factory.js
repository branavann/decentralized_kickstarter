import web3 from './web3';
// Importing our ABI for the deployed contract 
import CampaignFactory from './build/CampaignFactory.json';

// Provides us access to our deployed contract instance
const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x2E316EFF8fdce44e889a9F32c79912F66c72916d'
);

export default instance; 

