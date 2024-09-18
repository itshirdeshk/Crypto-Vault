import { ethers } from "ethers";
import contractAbi from "../constants/contractAbi.json"
import toast from "react-hot-toast";
import axios from "axios";

export const connectWallet = async () => {
    try {
        if (!window.ethereum) {
            throw new Error("Metamask is not installed")
        }

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        })

        const selectedAccount = accounts[0];

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const message = "Welcome to Crypto Vault Website";
        const signature = await signer.signMessage(message);

        const dataSignature = {
            signature
        }

        const url = `http://localhost:3000/api/auth?address=${selectedAccount}` 
        const res = await axios.post(url, dataSignature);
        console.log(res.data);
        
        const contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

        return { contractInstance, selectedAccount };
    } catch (error) {
        toast.error("Wallet connection failed")
        console.error(error);

    }
}