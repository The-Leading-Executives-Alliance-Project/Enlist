// routes/document.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Document = require('../models/document');

// Helper function to map essayId to fileCategory and documentName
const getDocumentInfo = (essayId) => {
  const mapping = {
    'personal-statement': { fileCategory: 'personal', documentName: 'Personal Statement' },
    'why-ubc': { fileCategory: 'UBC', documentName: 'Why UBC' },
    'why-sauder': { fileCategory: 'Sauder', documentName: 'Why Sauder' },
    'why-sfu': { fileCategory: 'SFU', documentName: 'Why SFU' },
    'why-beedie': { fileCategory: 'Beedie', documentName: 'Why Beedie' }
  };
  
  return mapping[essayId] || { fileCategory: 'personal', documentName: 'Essay' };
};

// @route   POST api/documents
// @desc    Create a new document
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.user.id;
    const { documentName, fileCategory, universityName, majorName } = req.body;

    if (!documentName || !fileCategory) {
      return res.status(400).json({ error: 'documentName and fileCategory are required' });
    }

    if (fileCategory === 'university') {
      if (!universityName || !majorName) {
        return res.status(400).json({ error: 'universityName and majorName are required for university documents' });
      }
    }

    const initialAiMessage = {
      sender: 'ai',
      text: 'Hi! I am here to help you with your essay. Type your essay and ask me for improvements!',
      changes: [],
      timestamp: new Date()
    };

    const newDoc = new Document({
      userId,
      fileCategory,
      documentName,
      universityName: fileCategory === 'university' ? universityName : undefined,
      majorName: fileCategory === 'university' ? majorName : undefined,
      essay: '',
      messages: [initialAiMessage],
      highlightedRanges: [],
      lastModified: new Date()
    });

    const saved = await newDoc.save();
    return res.status(201).json(saved);
  } catch (error) {
    // Handle duplicate key errors from unique index
    if (error && error.code === 11000) {
      return res.status(409).json({ error: 'A document with the same name and category already exists.' });
    }
    console.error('Error creating document:', error);
    return res.status(500).json({ error: 'Failed to create document' });
  }
});

// @route   GET api/documents/:essayId
// @desc    Get essay by essayId
// @access  Private
router.get('/:essayId', auth, async (req, res) => {
  try {
    const { essayId } = req.params;
    const userId = req.user.user.id;
    const { fileCategory, documentName } = getDocumentInfo(essayId);

    const document = await Document.findOne({
      userId,
      fileCategory,
      documentName,
    });

    if (!document) {
      // Return default empty state
      return res.json({
        essay: '',
        messages: [{ 
          sender: 'ai', 
          text: 'Hi! I am here to help you with your essay. Type your essay and ask me for improvements!' 
        }],
        highlightedRanges: [],
      });
    }

    res.json({
      essay: document.essay,
      messages: document.messages,
      highlightedRanges: document.highlightedRanges || [],
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// @route   POST api/documents/save
// @desc    Save essay (auto-save)
// @access  Private
router.post('/save', auth, async (req, res) => {
  try {
    const { essayId, essay, messages, highlightedRanges } = req.body;
    const userId = req.user.user.id;
    const { fileCategory, documentName } = getDocumentInfo(essayId);

    const document = await Document.findOneAndUpdate(
      { userId, fileCategory, documentName },
      {
        essay,
        messages,
        highlightedRanges: highlightedRanges || [],
        lastModified: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, document });
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({ error: 'Failed to save document' });
  }
});

// @route   GET api/documents
// @desc    Get all documents for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.user.id;
    const documents = await Document.find({ userId }).sort({ lastModified: -1 });
    
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;