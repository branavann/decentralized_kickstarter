import Web3 from "web3";

// Declaring a globally accessible variable 
let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // Condition for browser with Metamask
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    // Condition or sever or alternative wallet
    const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/16a624b7c1124b048ab4429260e8e423");
    web3 = new Web3(provider);
}

export default web3;


