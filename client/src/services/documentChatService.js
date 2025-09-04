// src/services/documentChatService.js
const API_BASE_URL = 'http://localhost:5000';

const documentChatService = {
  async sendMessage(message, essayId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/document-chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token if needed
        },
        body: JSON.stringify({
          message,
          essayId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to document chat:', error);
      throw error;
    }
  },

  async getChatHistory(essayId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/document-chat/history/${essayId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token if needed
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }
};

export default documentChatService; 