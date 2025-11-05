// src/config/axios.ts
import axios from 'axios'

// Tạo instance Axios chung
const api = axios.create({
  baseURL: 'http://localhost:8888', // URL backend NestJS của bạn,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Thêm interceptor nếu cần (ví dụ thêm token)
api.interceptors.request.use(
  config => {
    // Ví dụ nếu bạn có token lưu ở localStorage
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    
return config
  },
  error => Promise.reject(error)
)

export default api
