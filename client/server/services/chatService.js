// server/services/chatService.js
const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY } = require('../config/env');

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({
      message: response.data.choices[0].message.content,
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