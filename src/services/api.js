import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: { Accept: 'application/json' },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const payload = error?.response?.data || { message: error.message || 'Network Error' };
    return Promise.reject(payload);
  }
);

export default api;
