import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to provide authentication state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Check for token in local storage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Update state based on token presence
  }, []);

  // Login function to set authenticated state
  const login = () => {
    setIsAuthenticated(true);
  };

  // Logout function to clear authenticated state and remove token
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // Clear token from local storage
  };

  // Provide authentication state and functions to the children components
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};