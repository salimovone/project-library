import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('access') != null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let baseURL = import.meta.env.VITE_API_BASE;

  if(baseURL.endsWith('/')) {
    baseURL = baseURL.slice(0, -1);
  }

  const login = async (username, password, callback = null) => {
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => null); 
        throw errorData || { message: "Tizimga kirishda xatolik yuz berdi." };
      }

      const data = await response.json();
      if(!response.ok){
        throw data || { message: "Tizimga kirishda xatolik yuz berdi." };
      }

      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      
      if (response.status === 200 || response.status === 201) {
        setIsAuthenticated(true);
      }
      callback && callback();
    } catch (error) {
      let errMsg = "Tizimga kirishda xatolik yuz berdi. Login yoki parolni tekshiring.";
      if (error?.detail) {
        errMsg = error.detail;
      } else if (error?.message) {
        errMsg = error.message;
      } else if (typeof error === 'string') {
        errMsg = error;
      } else if (error && typeof error === 'object') {
        const firstValue = Object.values(error)[0];
        if (Array.isArray(firstValue)) errMsg = firstValue[0];
      }
      
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');
      const accessToken = localStorage.getItem('access'); // Odatda logout uchun access token ham so'raladi
      
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
    } catch (error) {
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};