// routes/document.js
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', documentController.uploadDocument);
router.get('/', documentController.getUserDocuments);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;