// controllers/applicationController.js
const Application = require('../models/Application');

exports.createApplication = async (req, res) => {
  try {
    const application = new Application({
      user: req.user._id,
      ...req.body
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('documents')
      .sort({ lastUpdated: -1 });
    res.json(applications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, lastUpdated: Date.now() },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.submitApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = 'submitted';
    application.submissionDate = Date.now();
    await application.save();
    
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};