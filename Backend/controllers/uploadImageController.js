const { ethers } = require("ethers");
const UserModel = require("../models/User");
const pinataSDK = require("@pinata/sdk");
const { PINATA_API_KEY, PINATA_SECRET_KEY } = require("../config/serverConfig");
const generateEncryptionKey = require("../utils/generateKey");
const { encryptFile } = require("../utils/encryption");

async function uploadImageController(req, res, next) {
    try {
        const userAddress = req.address;
        const user = await UserModel.findOne({ userAddress: userAddress.toLowerCase() });

        if (!user) {
            throw new Error("User does not exist");
        }

        if (user.encryptionKey === null) {
            const encryptionKey = generateEncryptionKey(32);
            user.encryptionKey = encryptionKey;
            await user.save();
        }

        const { encryptedData, iv } = encryptFile(req.file.buffer, user.encryptionKey);

        const pinata = new pinataSDK({ pinataApiKey: PINATA_API_KEY, pinataSecretApiKey: PINATA_SECRET_KEY })

        const resPinata = await pinata.pinJSONToIPFS({ encryptedData, iv });

        return res.status(200).json({ message: "Image Uploaded Successfullly", ipfsHash: resPinata.IpfsHash })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = { uploadImageController }