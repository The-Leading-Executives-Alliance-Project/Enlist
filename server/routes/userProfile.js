const express = require('express');
const router = express.Router();
const UserProfile = require('../models/userProfile');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Create or update user profile
router.post('/', auth, async (req, res) => {
  try {
    // Robust userId extraction from JWT payload structure
    const userId = req.user.user?.id || req.user.user?._id || req.user.id || req.user._id;
    if (!userId) {
      console.error('No userId found in req.user:', req.user);
      return res.status(400).json({ error: 'User ID not found in authentication token.' });
    }
    
    // Save profile data (without formCompleted field)
    const profileData = { 
      ...req.body, 
      user: userId
    };

    const profile = await UserProfile.findOneAndUpdate(
      { user: userId },
      profileData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    // Update user's formCompleted status
    await User.findByIdAndUpdate(userId, { formCompleted: true });
    
    res.json(profile);
  } catch (err) {
    console.error('Profile upsert error:', err);
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
});

// Get profile for current user
router.get('/me', auth, async (req, res) => {
  try {
    // Robust userId extraction from JWT payload structure
    const userId = req.user.user?.id || req.user.user?._id || req.user.id || req.user._id;
    
    const profile = await UserProfile.findOne({ user: userId });
    
    res.json(profile);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 