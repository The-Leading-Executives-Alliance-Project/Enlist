// services/chatService.js
const OpenAI = require('openai');
const { OPENAI_API_KEY } = require('../config/env');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({
      message: response.choices[0].message.content,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    // Implement chat history retrieval from database
    res.json({ history: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendMessage, getChatHistory };