const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { upload } = require('../config/cloudinary.config'); // Import our multer config
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/register', upload.single('idProof'), authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.put('/profile', authMiddleware, authController.updateProfile);
router.get('/profile/id-proof', authMiddleware, authController.getIdProof);


module.exports = router;
