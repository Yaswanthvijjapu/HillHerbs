const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

// All routes here require being logged in AND being an admin
router.use(authMiddleware, isAdmin);

router.get('/pending-experts', adminController.getPendingExperts);
router.post('/verify-expert', adminController.verifyExpert);
router.get('/experts-data', adminController.getAllExpertsData); 


module.exports = router;