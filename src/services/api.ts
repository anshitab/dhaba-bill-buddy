import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';  // Use the actual backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000 // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
const menuAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/menu');
      return response;
    } catch (error) {
      console.error('Error in menuAPI.getAll:', error);
      throw error;
    }
  },
  add: (data: any) => api.post('/menu/add', data),
  edit: (id: string, data: any) => api.put(`/menu/edit/${id}`, data),
  delete: (id: string) => api.delete(`/menu/delete/${id}`),
};

const transactionsAPI = {
  create: async (data: any) => {
    try {
      const response = await api.post('/transactions', data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },
  getToday: async () => {
    try {
      const response = await api.get('/transactions/today');
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },
  exportCSV: async () => {
    try {
      const response = await api.get('/transactions/today/csv', { responseType: 'blob' });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },
};

const adminAPI = {
  login: (credentials: { username: string; password: string }) => 
    api.post('/admin/login', credentials),
};

export { menuAPI, transactionsAPI, adminAPI };
export default api; 