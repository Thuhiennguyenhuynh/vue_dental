import axios from 'axios'

// Cấu hình URL mặc định trỏ về project C#
const api = axios.create({
  baseURL: 'https://localhost:7146/api', // ĐẢM BẢO CỔNG 7123 KHỚP VỚI C# CỦA BẠN
})

// Tự động nhét Token vào mỗi lần gọi API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
