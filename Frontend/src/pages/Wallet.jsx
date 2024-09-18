import React, { useEffect } from 'react'
import { connectWallet } from '../utils/connetWallet'
import { useWeb3Context } from "../contexts/useWeb3Context"
import { useNavigate } from 'react-router-dom'

export const Wallet = () => {
    const navigate = useNavigate();
    const { web3State, updateWeb3State } = useWeb3Context();
    const { selectedAccount } = web3State;

    useEffect(() => {
        if (selectedAccount) {
            navigate("/home");
        }
    }, [selectedAccount, navigate]);

    const handleWalletConnection = async () => {
        const { contractInstance, selectedAccount } = await connectWallet();

        updateWeb3State({ contractInstance, selectedAccount });
    }
    return (
        <button onClick={handleWalletConnection}>Connet Wallet</button>
    )
}
