// server/services/applicationService.js
const Application = require('../models/application');

const createApplication = async (req, res) => {
  try {
    const application = new Application({
      ...req.body,
      userId: req.user.userId,
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.userId });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
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

module.exports = {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
};