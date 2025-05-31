import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Menu Items API
export const menuAPI = {
  getAll: () => api.get('/menu'),
  add: (item) => api.post('/menu/add', item),
  edit: (id, item) => api.put(`/menu/edit/${id}`, item),
  delete: (id) => api.delete(`/menu/delete/${id}`),
};

// Transactions API
export const transactionsAPI = {
  add: (txn) => api.post('/transactions', txn),
  getToday: () => api.get('/transactions/today'),
};

// Logging API
export const loggingAPI = {
  log: (logData) => api.post('/log', logData),
};

// Admin API
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
};

export default api; 