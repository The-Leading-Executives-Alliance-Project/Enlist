// src/components/auth/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../services/api';

/**
 * A wrapper component for routes that require authentication.
 * If the user is not authenticated, they will be redirected to the login page.
 * 
 * @param {Object} props
 * @param {React.ReactElement} props.children - The component to render if authenticated
 * @returns {React.ReactElement} The protected component or a redirect to login
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = AuthService.isAuthenticated();
  
  // If not authenticated, redirect to login with a returnUrl
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after successful login
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;