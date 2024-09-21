const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/serverConfig");
async function authToken(req, res, next) {
    try {
        const token = req.headers['x-access-token'];
        if(!token) throw new Error("Token not found");
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.address = decoded.address;
        next();
        } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

}

module.exports = authToken;