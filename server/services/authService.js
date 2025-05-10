// services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({
      email,
      password,
      name
    });

    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };