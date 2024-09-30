import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/profile", {
              withCredentials: true,
          })

        setUser(response.data); // Set the user if valid session exists
      } catch (error) {
          setUser(null); // No user session exists, reset the user
          console.error('Error fetching user session', error);
      }
    };

    checkLoggedInUser();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    return;
  };

  const logout = async () => {
    try {
        await axios.post('http://localhost:3001/auth/logout', {}, { withCredentials: true });
        setUser(null);
        navigate('/login');
    } catch (error) {
        console.error('Logout failed', error);
    }
  };

  const value = {
      user,
      login,
      logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};