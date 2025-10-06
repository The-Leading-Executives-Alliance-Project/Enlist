// services/documentService.js
const multer = require('multer');
const Document = require('../models/document');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single('document');

const createDocument = async (req, res) => {
  try {
    const userId = req.user.user?.id || req.user.user?._id || req.user.id || req.user._id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in authentication token.' });
    }

    const documentData = {
      ...req.body,
      userId: userId
    };

    const document = new Document(documentData);
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: error.message });
  }
};


const getDocuments = async (req, res) => {
  try {
    const userId = req.user.user?.id || req.user.user?._id || req.user.id || req.user._id;
    const documents = await Document.find({ userId: userId });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const userId = req.user.user?.id || req.user.user?._id || req.user.id || req.user._id;
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: userId,
    });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDocument,
  getDocuments,
  deleteDocument,
};