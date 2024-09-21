import React, { useEffect, useState } from 'react'
import { useWeb3Context } from '../contexts/useWeb3Context'
import axios from 'axios';
import toast from 'react-hot-toast';
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react';

function GetImage({reload}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [imagePerPage, setImagePerPage] = useState(2);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const { web3State } = useWeb3Context();
    const { selectedAccount, contractInstance } = web3State;

    const getImageHashes = async () => {
        const ipfsHashes = await contractInstance.viewFiles(selectedAccount)
        return ipfsHashes;
    }

    const pagination = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        try {
            const getImage = async () => {
                setLoading(true);
                const ipfsHashes = await getImageHashes();
                const ipfsHashesArray = Object.values(ipfsHashes);

                const url = `https://crypto-vault-backend.onrender.com/api/getImage?page=${currentPage}&limit=${imagePerPage}`;
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        "x-access-token": token
                    }
                }
                const res = await axios.post(url, ipfsHashesArray, config);
                const imagesData = res.data.decryptedImageArray;
                setImages(imagesData)
                setLoading(false)
            }

            contractInstance && getImage();
        } catch (error) {
            toast.error("Error while fetching images")
        } finally {
            setLoading(false);
        }
    }, [contractInstance, currentPage, imagePerPage, selectedAccount, reload])
    return (<>
        {!loading ? (
            images.length > 0 ?
                (
                    <div className="flex justify-start md:justify-center items-center w-full  overflow-x-auto">
                        {images.map((imgData, index) => (
                            <img
                                key={index}
                                src={`data:image/jpeg;base64,${imgData}`}
                                alt={`Image ${index + 1}`}
                                className="w-[300px] h-[240px]  mx-2 object-cover"
                            />
                        ))}
                    </div>
                )
                : (
                    <p>No images found</p>
                )) : <p>Loading...</p>
        }
        <div className='w-full h-20 flex justify-center items-center gap-4'><button onClick={() => pagination(currentPage - 1)} disabled={currentPage === 1 || loading}><CircleArrowLeft className='w-8 h-8 opacity-80' /></button>
            <button onClick={() => pagination(currentPage + 1)} disabled={loading} ><CircleArrowRight className='w-8 h-8 opacity-80' /></button></div>
    </>)
}

export default GetImage;