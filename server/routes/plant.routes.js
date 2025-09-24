const router = require('express').Router();
const plantController = require('../controllers/plant.controller');
const { authMiddleware, isExpert } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary.config');

// Route for Hilly Users to submit a plant
router.post('/submit', authMiddleware, upload.single('image'), plantController.submitPlant);

// GET all submissions pending verification
router.get('/pending', authMiddleware, isExpert, plantController.getPendingSubmissions);

// POST to verify a specific submission
router.post('/verify/:id', authMiddleware, isExpert, plantController.verifySubmission);

// GET expert's verification history
router.get('/history/expert', authMiddleware, isExpert, plantController.getExpertHistory);

// GET all verified plants
router.get('/verified', plantController.getVerifiedPlants);



module.exports = router;