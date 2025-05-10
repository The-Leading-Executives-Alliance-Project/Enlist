// routes/application.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', applicationController.createApplication);
router.get('/', applicationController.getApplications);
router.put('/:id', applicationController.updateApplication);
router.post('/:id/submit', applicationController.submitApplication);

module.exports = router;