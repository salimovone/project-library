import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: { Accept: 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({resolve, reject});
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = localStorage.getItem('refresh');

      if (!refreshToken) {
        processQueue(new Error("No refresh token"), null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/token/refresh/`, {
          refresh: refreshToken
        });

        const newAccess = response.data.access;
        const newRefresh = response.data.refresh;

        localStorage.setItem('access', newAccess);
        if (newRefresh) {
          localStorage.setItem('refresh', newRefresh);
        }

        originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;
        processQueue(null, newAccess);
        
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const payload = error?.response?.data || { message: error.message || 'Network Error' };
    return Promise.reject(payload);
  }
);

export default api;