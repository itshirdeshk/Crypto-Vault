import axios from 'axios';
import React, { useState } from 'react'
import { useWeb3Context } from '../contexts/useWeb3Context';
import toast from 'react-hot-toast';
import { ImageUp } from 'lucide-react';

function UploadImage({ reloadEffect }) {
    const [file, setFile] = useState(null);
    const { web3State } = useWeb3Context();
    const { selectedAccount, contractInstance } = web3State;
    const [loading, setLoading] = useState(false);

    const uploadImageHash = async (ipfsHash) => {
        // const tx = await contractInstance.uploadFile(selectedAccount, ipfsHash);

        await toast.promise(contractInstance.uploadFile(selectedAccount, ipfsHash), {
            loading: "Transaction is pending",
            success: "Transaction successful",
            error: "Transaction failed"
        })
    }

    const handleImageUpload = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const url = "https://crypto-vault-backend.onrender.com/api/uploadImage";
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "x-access-token": token
                }
            }
            const res = await axios.post(url, formData, config);
            toast.success("Image Uploaded!");

            uploadImageHash(res.data.ipfsHash);
            reloadEffect();
        } catch (error) {
            console.error(error);
            toast.error("Image Upload Failed!")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-full w-screen flex flex-col justify-center items-center gap-6">
            <p className="font-semibold md:text-[24px]">
                Upload file with Web3s Security
            </p>
            <div className="w-full flex justify-center items-center">
                <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-[200px] md:w-[210px]"
                />
            </div>
            {file ? (
                <button
                    onClick={handleImageUpload}
                    disabled={loading}
                    className="border-sky-400 border-dotted p-2 border-2 rounded-md flex flex-col justify-center items-center hover:bg-sky-200"
                >
                    <ImageUp />
                    {loading ? "Uploading..." : "Upload"}
                </button>
            ) : (
                <p className="text-[20px] font-semibold text-red-500">
                    Choose a File To Upload
                </p>
            )}

            <br />
        </div>);
}

export default UploadImage