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

// User Profile service
export const UserProfileService = {
  // Get current user's profile
  getProfile: async () => {
    try {
      const response = await api.get('/userprofile/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create or update user profile
  saveProfile: async (profileData) => {
    try {
      const response = await api.post('/userprofile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update specific profile fields
  updateProfile: async (updates) => {
    try {
      const response = await api.patch('/userprofile', updates);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// University service
export const UniversityService = {
  // Search universities
  search: async (searchParams) => {
    try {
      const response = await api.get('/universities/search', { params: searchParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get all universities
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/universities', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get university by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/universities/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create university (admin only)
  create: async (universityData) => {
    try {
      const response = await api.post('/universities', universityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update university (admin only)
  update: async (id, universityData) => {
    try {
      const response = await api.put(`/universities/${id}`, universityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete university (admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/universities/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Seed universities with sample data (admin only)
  seed: async () => {
    try {
      const response = await api.post('/universities/seed');
      return response.data;
    } catch (error) {
      throw error;
    }
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

export default api;