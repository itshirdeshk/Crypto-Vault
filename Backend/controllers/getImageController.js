const UserModel = require("../models/User");
const {decryptData} = require("../utils/decryption")
const axios = require("axios")

const PINATA_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs/";

async function returnIpfsResponse(ipfsHash) {
    const res = await axios(`${PINATA_GATEWAY_URL}${ipfsHash}`)
    return res.data;
}

async function getImageController(req, res, next) {
    try {
        const userAddress = req.address;
        const user = await UserModel.findOne({ userAddress: userAddress.toLowerCase() });

        if (!user) {
            throw new Error("User does not exist");
        }

        const { page, limit } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 1;

        if (pageNumber < 1 || limitNumber < 1) {
            throw new Error("Pagination Issue")
        }

        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = pageNumber * limitNumber;

        const ipfsHashArray = req.body.slice(startIndex, Math.min(req.body.length, endIndex));

        const decryptedImageArray = [];
        if (ipfsHashArray.length > 0) {
            const encryptedDataArray = await Promise.all(ipfsHashArray.map(async (ipfsHash) => {
                const res = await returnIpfsResponse(ipfsHash);
                return res;
            }))

            for (const img of encryptedDataArray) {
                const decryptedImgData = decryptData(img.encryptedData, img.iv, user.encryptionKey);
                decryptedImageArray.push(decryptedImgData.toString('base64'));
            }
        }

        return res.status(200).json({ message: "Image Fetched Successfully", decryptedImageArray });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getImageController }