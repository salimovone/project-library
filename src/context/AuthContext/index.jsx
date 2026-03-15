import { createContext, useState, useEffect, useContext } from 'react';
import api from '../../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dastur yonganda tokenni tekshirish
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('access');
      
      if (accessToken) {        
        try {
          await api.post('/token/verify/', { token: accessToken });
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token verification failed");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Tizimga kirish funksiyasi
  const login = async (username, password) => {
    try {
      const response = await api.post('/token/', { username, password });
      
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error("Login xatoligi:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

