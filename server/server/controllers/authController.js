// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

exports.register = async (req, res) => {
  try {
    console.log('Registration attempt received with body:', { ...req.body, password: '***' });
    const { email, password, fullName } = req.body;
    
    console.log('Checking if user exists with email:', email);
    // Clear any existing user with this email (temporary fix for testing)
    await User.deleteOne({ email });
    console.log('Cleared any existing user data for:', email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    console.log('Creating new user with email:', email);
    const user = new User({
      email,
      password,
      fullName
    });

    console.log('Saving user to database');
    await user.save();
    console.log('User saved successfully, ID:', user._id);
    
    console.log('Generating JWT token');
    const token = generateToken(user._id);
    console.log('JWT token generated successfully');

    console.log('Registration successful, returning user data and token');
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      },
      token
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login attempt received with body:', { ...req.body, password: '***' });
    const { email, password } = req.body;
    
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('User found, checking password');
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      console.log('Password verification failed for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Password verified, generating token');
    const token = generateToken(user._id);
    console.log('Login successful, returning user data and token');
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      },
      token
    });
  } catch (error) {
    console.error('Error in user login:', error);
    res.status(400).json({ error: error.message });
  }
};