const Rating = require('../models/Rating');
const Store = require('../models/Store');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getMyRatings = async (req, res) => {
  try {
    const { ownerId } = req.query; // Get ownerId from query parameters
    
    if (!ownerId) {
      return res.status(400).json({ message: 'Owner ID is required' });
    }

    const store = await Store.findOne({ where: { ownerId: ownerId } });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ['name', 'email'] }],
    });

    res.json(ratings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getAverageRating = async (req, res) => {
  try {
    const { ownerId } = req.query; // Get ownerId from query parameters
    
    if (!ownerId) {
      return res.status(400).json({ message: 'Owner ID is required' });
    }
    const store = await Store.findOne({ where: { ownerId: ownerId } });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const ratings = await Rating.findAll({ where: { storeId: store.id } });
    const avg =
      ratings.reduce((acc, r) => acc + r.rating, 0) / (ratings.length || 1);

    res.json({ averageRating: avg.toFixed(2), totalRatings: ratings.length });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    req.user.password = password;
    await req.user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
