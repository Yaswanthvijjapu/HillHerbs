const router = require('express').Router();
const plantController = require('../controllers/plant.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary.config');

router.post('/submit', authMiddleware, upload.single('image'), plantController.submitPlant);

module.exports = router;