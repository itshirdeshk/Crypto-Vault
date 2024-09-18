import React from 'react'
import { useWeb3Context } from '../contexts/useWeb3Context'
import UploadImage from "../components/UploadImage"

export const Home = () => {
    const { web3State } = useWeb3Context();
    const { selectedAccount } = web3State;

    return (
        <UploadImage />
    )
}
