// server/services/documentService.js
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

const uploadDocument = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const document = new Document({
        userId: req.user.userId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        path: req.file.path,
      });

      await document.save();
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.userId });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
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
  uploadDocument,
  getDocuments,
  deleteDocument,
};