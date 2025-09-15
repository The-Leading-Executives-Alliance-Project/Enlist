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

// @route   GET api/documents/:essayId
// @desc    Get essay by essayId
// @access  Private
router.get('/:essayId', auth, async (req, res) => {
  try {
    const { essayId } = req.params;
    const userId = req.user.id;
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
    const userId = req.user.id;
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
    const userId = req.user.id;
    const documents = await Document.find({ userId }).sort({ lastModified: -1 });
    
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

module.exports = router;