const express = require("express");
const { getImageController } = require("../controllers/getImageController");
const authToken = require("../middleware/authToken");
const router = express.Router();


router.post("/getImage", authToken, getImageController);

module.exports = router