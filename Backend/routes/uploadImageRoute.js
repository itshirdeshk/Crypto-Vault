const express = require("express");
const { uploadImageController } = require("../controllers/uploadImageController");
const { uploadUserImage } = require("../middleware/multer");
const authToken = require("../middleware/authToken");
const router = express.Router();


router.post("/uploadImage", authToken, uploadUserImage, uploadImageController);

module.exports = router