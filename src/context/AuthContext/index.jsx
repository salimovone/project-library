import { createContext, useEffect, useState } from 'react';
import api from '../../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('access') != null );
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await api.post('/token/', { username, password });
      
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error("Login xatoligi:", error);
      throw error;
    }finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try{
      const refreshToken = localStorage.getItem('refresh');
      await api.post("/logout/", { refresh: refreshToken });
    } catch (error) {
      console.error("Logout xatoligi:", error);
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

