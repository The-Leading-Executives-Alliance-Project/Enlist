// src/services/api.js
import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: '/api', // Using relative path to work with Vite proxy
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response;
      
      // If unauthorized, log the user out
      if (status === 401) {
        console.error('Session expired or unauthorized access');
        // Logout the user and redirect to login
        AuthService.logout();
        window.location.href = '/login';
      }
      
      if (status === 403) {
        console.error('Forbidden access');
      }
      
      if (status === 404) {
        console.error('Resource not found');
      }
      
      if (status === 500) {
        console.error('Internal server error');
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth service methods
export const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Login an existing user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Logout the current user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Get the current authenticated user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  },
  
  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Applications service
export const ApplicationService = {
  // Get all applications
  getAll: async () => {
    return api.get('/applications');
  },
  
  // Get a specific application
  getById: async (id) => {
    return api.get(`/applications/${id}`);
  },
  
  // Create a new application
  create: async (applicationData) => {
    return api.post('/applications', applicationData);
  },
  
  // Update an application
  update: async (id, applicationData) => {
    return api.put(`/applications/${id}`, applicationData);
  }
};

// Document service
export const DocumentService = {
  // Upload a document
  upload: async (formData) => {
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Get all documents
  getAll: async () => {
    return api.get('/documents');
  },
  
  // Delete a document
  delete: async (id) => {
    return api.delete(`/documents/${id}`);
  }
};

// Chat service
export const ChatService = {
  // Send a message to the AI
  sendMessage: async (message) => {
    return api.post('/chat/message', { message });
  },
  
  // Get chat history
  getHistory: async () => {
    return api.get('/chat/history');
  }
};

// Experience service
export const ExperienceService = {
  // Get all experiences for current user
  getAll: async () => {
    return api.get('/userprofile/me');
  },
  
  // Add a new experience
  add: async (experienceData) => {
    return api.post('/userprofile/experiences', experienceData);
  },
  
  // Update an existing experience
  update: async (experienceId, experienceData) => {
    return api.put(`/userprofile/experiences/${experienceId}`, experienceData);
  },
  
  // Delete an experience
  delete: async (experienceId) => {
    return api.delete(`/userprofile/experiences/${experienceId}`);
  },
  
  // Update entire experiences array (for bulk operations)
  updateAll: async (experiences) => {
    return api.post('/userprofile', { experiences });
  }
};

export default api;