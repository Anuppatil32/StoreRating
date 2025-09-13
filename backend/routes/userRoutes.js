const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// router.use(authenticate, authorize(['user']));

router.get('/stores', userController.getStores);
router.get('/search', userController.searchStores);
router.post('/submit-rating', userController.submitRating);
router.put('/update-password', userController.updatePassword);

module.exports = router;
