const { ethers } = require("ethers");
const UserModel = require("../models/User");
const pinataSDK = require("@pinata/sdk");
const { PINATA_API_KEY, PINATA_SECRET_KEY } = require("../config/serverConfig");

async function uploadImageController(req, res, next) {
    try {
        console.log(req.file);

        const pinata = new pinataSDK({ pinataApiKey: PINATA_API_KEY, pinataSecretApiKey: PINATA_SECRET_KEY })

        const result = await pinata.testAuthentication();

        return res.status(200).json({ message: "Image Uploaded Successfullly" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = { uploadImageController }