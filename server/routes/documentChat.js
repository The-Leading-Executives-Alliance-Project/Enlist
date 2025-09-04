const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OpenAI = require('openai');
const { OPENAI_API_KEY } = require('../config/env');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// @route   POST api/document-chat/message
// @desc    Send a message to the document chat AI
// @access  Private
router.post('/message', auth, async (req, res) => {
  try {
    const { message, essayId } = req.body;
    
    // Validate input
    if (!message || !essayId) {
      return res.status(400).json({ 
        error: 'Message and essayId are required' 
      });
    }

    // For now, return a placeholder response
    // This is where you would integrate with an AI service later
    const placeholderResponses = [
      "That's a great question about your essay! I'd be happy to help you improve your writing.",
      "I can see you're working on your essay. Let me provide some guidance on that.",
      "Your essay topic sounds interesting. Here are some suggestions to make it stronger.",
      "I understand you're looking for feedback. Let me help you enhance your essay.",
      "That's a thoughtful approach to your essay. Here's some advice to consider."
    ];
    
    const randomResponse = placeholderResponses[Math.floor(Math.random() * placeholderResponses.length)];
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({
      message: randomResponse,
      timestamp: new Date().toISOString(),
      essayId: essayId
    });
    
  } catch (error) {
    console.error('Error in document chat:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// @route   POST api/document-chat/improve
// @desc    Get AI improvements for an essay
// @access  Private
router.post('/improve', auth, async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Validate input
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt is required' 
      });
    }

    // Call OpenAI API with GPT-4
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert essay writing assistant. You must respond with ONLY a valid JSON object containing the improved text and changes made."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiResponse = response.choices[0].message.content;
    
    res.json({
      message: aiResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in essay improvement:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// @route   GET api/document-chat/history/:essayId
// @desc    Get chat history for a specific essay
// @access  Private
router.get('/history/:essayId', auth, async (req, res) => {
  try {
    const { essayId } = req.params;
    
    // For now, return empty history
    // This is where you would fetch chat history from database later
    res.json({
      messages: [],
      essayId: essayId
    });
    
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

module.exports = router; 