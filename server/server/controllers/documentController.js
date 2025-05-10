// controllers/documentController.js
const Document = require('../models/Document');

exports.uploadDocument = async (req, res) => {
  try {
    const { type, title, fileUrl } = req.body;
    
    const document = new Document({
      user: req.user._id,
      type,
      title,
      fileUrl,
      metadata: {
        fileSize: req.body.fileSize,
        mimeType: req.body.mimeType
      }
    });

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id });
    res.json(documents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};