import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: { Accept: 'application/json' },
});

// Bir vaqtning o'zida kelgan bir nechta xatoliklarni kutib turish uchun
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

// 1. So'rov ketishidan oldin (Request Interceptor)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    // Agar token bo'lsa, uni headerga qo'shamiz
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Javob kelganda (Response Interceptor)
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Agar xatolik 401 bo'lsa va bu so'rov oldin qayta urinib ko'rilmagan bo'lsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // Agar allaqachon yangilanayotgan bo'lsa, bu so'rovni navbatga qo'yamiz
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
        // Refresh token ham yo'q bo'lsa, tizimdan chiqarish kerak
        processQueue(new Error("No refresh token"), null);
        localStorage.clear();
        window.location.href = '/login'; // Login sahifasiga yo'naltirish
        return Promise.reject(error);
      }

      try {
        // Tokenni yangilash uchun alohida toza axios ishlatamiz (chekksiz loopga tushmaslik uchun)
        const response = await axios.post(`${import.meta.env.VITE_API_BASE}/api/token/refresh/`, {
          refresh: refreshToken
        });

        const newAccess = response.data.access;
        const newRefresh = response.data.refresh;

        // Yangi tokenlarni saqlaymiz
        localStorage.setItem('access', newAccess);
        if (newRefresh) {
          localStorage.setItem('refresh', newRefresh);
        }

        // Original so'rovga yangi tokenni yopishtirib qayta jo'natamiz
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;
        processQueue(null, newAccess);
        
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh token ham eskirgan bo'lsa
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Boshqa turdagi xatoliklar
    const payload = error?.response?.data || { message: error.message || 'Network Error' };
    return Promise.reject(payload);
  }
);

export default api;