// routes/application.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Application = require('../models/application');

// @route   GET api/applications
// @desc    Get all applications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get only applications created by the logged-in user
    const applications = await Application.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/applications/:id
// @desc    Get application by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Check if the application belongs to the logged-in user
    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(application);
  } catch (err) {
    console.error('Error fetching application by ID:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Application not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/applications
// @desc    Create a new application
// @access  Private
router.post('/', [
  auth,
  [
    check('position', 'Position is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('status', 'Status is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    position,
    company,
    location,
    status,
    description,
    applyDate,
    notes,
    contactName,
    contactEmail,
    contactPhone,
    documents
  } = req.body;

  try {
    const newApplication = new Application({
      user: req.user.id,
      position,
      company,
      location,
      status,
      description,
      applyDate,
      notes,
      contactName,
      contactEmail,
      contactPhone,
      documents
    });

    const application = await newApplication.save();
    res.json(application);
  } catch (err) {
    console.error('Error creating application:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/applications/:id
// @desc    Update an application
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    position,
    company,
    location,
    status,
    description,
    applyDate,
    notes,
    contactName,
    contactEmail,
    contactPhone,
    documents
  } = req.body;

  // Build application object
  const applicationFields = {};
  if (position) applicationFields.position = position;
  if (company) applicationFields.company = company;
  if (location) applicationFields.location = location;
  if (status) applicationFields.status = status;
  if (description) applicationFields.description = description;
  if (applyDate) applicationFields.applyDate = applyDate;
  if (notes) applicationFields.notes = notes;
  if (contactName) applicationFields.contactName = contactName;
  if (contactEmail) applicationFields.contactEmail = contactEmail;
  if (contactPhone) applicationFields.contactPhone = contactPhone;
  if (documents) applicationFields.documents = documents;

  try {
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Check if the application belongs to the logged-in user
    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    application = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: applicationFields },
      { new: true }
    );

    res.json(application);
  } catch (err) {
    console.error('Error updating application:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Application not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/applications/:id
// @desc    Delete an application
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Check if the application belongs to the logged-in user
    if (application.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await application.remove();
    res.json({ msg: 'Application removed' });
  } catch (err) {
    console.error('Error deleting application:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Application not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;