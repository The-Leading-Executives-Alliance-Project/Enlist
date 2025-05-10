// src/utils/constants.js
export const APP_CONSTANTS = {
  APP_NAME: 'CONCIS-Evolve Enlist',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  SERVICE_LEVELS: {
    SELF_SERVE: 'self_serve',
    SELF_SERVE_ADVANCED: 'self_serve_advanced',
    ASSIST_REVIEW: 'assist_review',
    FULL_SERVICE: 'full_service',
  },

  MESSAGE_TYPES: {
    TEXT: 'text',
    SYSTEM: 'system',
    ERROR: 'error',
  },

  APPLICATION_STATUS: {
    DRAFT: 'draft',
    IN_PROGRESS: 'in_progress',
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    COMPLETED: 'completed',
  },
};

export const UNIVERSITIES = [
  'University of British Columbia',
  'Simon Fraser University',
  'University of Victoria',
  'British Columbia Institute of Technology',
  'Thompson Rivers University',
];

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};