const express = require("express");
const { uploadImageController } = require("../controllers/uploadImageController");
const { uploadUserImage } = require("../middleware/multer")
const router = express.Router();


router.post("/uploadImage", uploadUserImage, uploadImageController);

module.exports = router