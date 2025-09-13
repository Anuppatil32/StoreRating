const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// router.use(authenticate, authorize(['admin']));

router.post('/create-user', adminController.registerUser);
router.post('/create-store', adminController.createStore);
router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.get('/stores', adminController.getStores);

module.exports = router;
