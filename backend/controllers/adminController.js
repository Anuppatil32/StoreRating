const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const user = await User.create({ name, email, password, address, role });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, address, ownerId, category, imageUrl } = req.body;
    const store = await Store.create({ name, address, ownerId, category, imageUrl });
    res.status(201).json({ message: 'Store created successfully', store });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    const where = {};
    if (name) where.name = name;
    if (email) where.email = email;
    if (address) where.address = address;
    if (role) where.role = role;
    const users = await User.findAll({ where });
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: req.user.role === 'owner' ? ['Ratings'] : [],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
