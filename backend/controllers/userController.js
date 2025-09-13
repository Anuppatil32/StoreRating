// userController.js

const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

// Get stores for the user
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving stores' });
  }
};

// Search for stores by name or address
exports.searchStores = async (req, res) => {
  const { query } = req.query;
  try {
    const stores = await Store.findAll({
      where: {
        [Sequelize.Op.or]: [
          { name: { [Sequelize.Op.iLike]: `%${query}%` } },
          { address: { [Sequelize.Op.iLike]: `%${query}%` } },
        ],
      },
    });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Error searching stores' });
  }
};

exports.submitRating = async (req, res) => {
  const { storeId, rating, comment, userId } = req.body;
  
  // Simple validation
  if (!storeId || !rating || !comment) {
    return res.status(400).json({ message: "All fields (storeId, rating, and comment) are required" });
  }

  try {
    const newRating = await Rating.create({
      userId: userId,
      storeId,
      rating,
      comment,
    });
    res.status(201).json(newRating);
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: 'Error submitting rating', error: error.message });
  }
};



// Update password
exports.updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    user.password = newPassword; // make sure to hash the password first
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
};
