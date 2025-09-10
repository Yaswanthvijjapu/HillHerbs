const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for temporary local storage
const upload = multer({ dest: 'uploads/' });

module.exports = { cloudinary, upload };