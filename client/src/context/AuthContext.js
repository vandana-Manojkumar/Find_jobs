import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from storage on component mount
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem('token')) {
        setAuthToken(localStorage.getItem('token'));
        try {
          const res = await axios.get('https://socialaddress-manoj-backend.onrender.com/api/auth/user');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Set Auth Token for global axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('https://socialaddress-manoj-backend.onrender.com/api/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('https://socialaddress-manoj-backend.onrender.com/api/auth/login', userData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 