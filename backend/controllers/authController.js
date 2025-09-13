const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const user = await User.create({ name, email, password, address });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send user info with role and token
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role, // make sure `role` exists in your User model
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.logout = (req, res) => {
  // For JWT, logout can be handled on the client side by deleting the token
  res.json({ message: 'Logged out successfully' });
};
