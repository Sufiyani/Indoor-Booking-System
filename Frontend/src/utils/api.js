// import axios from 'axios';
// const API_BASE_URL = 'http://localhost:4000';
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true, // credentials (cookies/token) allow
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Attach token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle 401 Unauthorized globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('adminToken');
//       localStorage.removeItem('adminName');
//       localStorage.removeItem('adminEmail');
//       window.location.href = '/admin/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:4000';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   headers: { 'Content-Type': 'application/json' }
// });

// // Attach token to all requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Global response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Only remove token if it exists
//       localStorage.removeItem('adminToken');
//       localStorage.removeItem('adminName');
//       window.location.href = '/admin/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminName");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;
