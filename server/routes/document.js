// routes/document.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Document = require('../models/document');

// Setup multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExt);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept common document file types
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, JPG, JPEG, and PNG files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   POST api/documents/upload
// @desc    Upload a document
// @access  Private
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ errors: [{ msg: 'No file uploaded' }] });
    }

    // Create a new document record
    const newDocument = new Document({
      user: req.user.id,
      filename: req.file.originalname,
      path: req.file.path,
      type: path.extname(req.file.originalname).substring(1),
      size: req.file.size,
      applicationId: req.body.applicationId || null // Associate with an application if provided
    });

    const document = await newDocument.save();
    res.json(document);
  } catch (err) {
    console.error('Error uploading document:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/documents
// @desc    Get all documents
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get only documents uploaded by the logged-in user
    const documents = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error('Error fetching documents:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/documents/:id
// @desc    Get document by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Check if the document belongs to the logged-in user
    if (document.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(document);
  } catch (err) {
    console.error('Error fetching document by ID:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Check if the document belongs to the logged-in user
    if (document.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Delete the file from the storage
    fs.unlink(document.path, async (err) => {
      if (err) {
        console.error('Error deleting file from storage:', err);
        // Continue with DB deletion even if file delete fails
      }

      // Delete the document from the database
      await document.remove();
      res.json({ msg: 'Document removed' });
    });
  } catch (err) {
    console.error('Error deleting document:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;