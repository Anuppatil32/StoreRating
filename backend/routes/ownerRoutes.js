const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// router.use(authenticate, authorize(['owner']));

router.get('/my-ratings', ownerController.getMyRatings);
router.get('/average-rating', ownerController.getAverageRating);
router.put('/update-password', ownerController.updatePassword);

module.exports = router;
