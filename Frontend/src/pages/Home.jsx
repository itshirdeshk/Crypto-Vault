import React, { useState } from 'react'
import { useWeb3Context } from '../contexts/useWeb3Context'
import UploadImage from "../components/UploadImage"
import GetImage from '../components/getImage';

export const Home = () => {
    const [reload, setReload] = useState(false);

    const reloadEffect = () => {
        setReload(!reload);
    }

    return (
        <div className="relative h-full w-screen flex flex-col justify-center items-center mt-8 px-4 ">
            <UploadImage reloadEffect={reloadEffect} />
            <GetImage reload={reload} />
        </div>
    )
}
