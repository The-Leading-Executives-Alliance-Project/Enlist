// src/services/chatService.js
const chatService = {
  async sendMessage(message) {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const responses = {
            academic: "Could you tell me about your interests and extracurricular activities?",
            interests: "Based on your profile, I'd recommend programs in",
            default: "How else can I help you with your university application?",
          };

          resolve({
            text: responses[message.toLowerCase()] || responses.default,
            timestamp: new Date().toISOString(),
          });
        }, 1000);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async startNewSession() {
    try {
      // Simulate session initialization
      return {
        sessionId: `session_${Date.now()}`,
        startTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error starting new session:', error);
      throw error;
    }
  }
};

export default chatService;