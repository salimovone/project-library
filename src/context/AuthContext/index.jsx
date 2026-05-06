import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('access') !== null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let baseURL = import.meta.env.VITE_API_BASE;
  if (baseURL?.endsWith('/')) {
    baseURL = baseURL.slice(0, -1);
  }

  const login = useCallback(async (username, password, callback = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${baseURL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw data || { message: "Tizimga kirishda xatolik yuz berdi." };
      }

      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      
      setIsAuthenticated(true);
      
      if (callback) callback();
    } catch (err) {
      let errMsg = "Tizimga kirishda xatolik yuz berdi. Login yoki parolni tekshiring.";
      
      if (err?.detail) {
        errMsg = err.detail;
      } else if (err?.message) {
        errMsg = err.message;
      } else if (typeof err === 'string') {
        errMsg = err;
      } else if (err && typeof err === 'object') {
        const firstValue = Object.values(err)[0];
        if (Array.isArray(firstValue)) {
          errMsg = firstValue[0];
        }
      }
      
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');
      const accessToken = localStorage.getItem('access');
      
      if (refreshToken) {
        await fetch(`${baseURL}/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken ? `Bearer ${accessToken}` : '',
          },
          body: JSON.stringify({ refresh: refreshToken })
        });
      }
    } catch (err) {
      console.error("Logoutda xatolik:", err);
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  }, [baseURL]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};