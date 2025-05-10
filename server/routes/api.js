// routes/api.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authService = require('../services/authService');
const chatService = require('../services/chatService');
const applicationService = require('../services/applicationService');
const documentService = require('../services/documentService');

// Auth routes
router.post('/auth/register', authService.register);
router.post('/auth/login', authService.login);

// Chat routes
router.post('/chat/message', auth, chatService.sendMessage);
router.get('/chat/history', auth, chatService.getChatHistory);

// Application routes
router.post('/applications', auth, applicationService.createApplication);
router.get('/applications', auth, applicationService.getApplications);
router.get('/applications/:id', auth, applicationService.getApplication);
router.put('/applications/:id', auth, applicationService.updateApplication);

// Document routes
router.post('/documents/upload', auth, documentService.uploadDocument);
router.get('/documents', auth, documentService.getDocuments);
router.delete('/documents/:id', auth, documentService.deleteDocument);

module.exports = router;