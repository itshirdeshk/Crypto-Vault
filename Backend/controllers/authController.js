const { ethers } = require("ethers");
const UserModel = require("../models/User");

async function authController(req, res, next) {
    try {
        const { signature } = req.body;

        const { address } = req.query;
        if (!signature) {
            throw new Error("Signature is invalid!")
        }
        const recoveredAddress = ethers.utils.verifyMessage("Welcome to Crypto Vault Website", signature);

        if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
            const address = recoveredAddress.toLowerCase();
            const user = await UserModel.findOne({ userAddress: address })
            if (!user) {
                const user = await UserModel.create({ userAddress: address })
                console.log(user);
            }
            return res.status(200).json({ message: "Authentication successfull" })
        } else {
            return res.status(404).json({ message: "Authentication failed" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { authController }