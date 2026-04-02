<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100"
  >
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-blue-600">Dental Clinic</h1>
        <p class="mt-2 text-gray-500">Đăng nhập hệ thống nha khoa</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Tên tài khoản</label>
          <input
            v-model="username"
            type="text"
            placeholder="Nhập tài khoản (VD: Hien)"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            placeholder="Nhập mật khẩu (VD: 123)"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Vai trò đăng nhập</label>
          <select
            v-model="role"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="Receptionist">Lễ tân</option>
            <option value="Admin">Quản trị viên</option>
            <option value="Dentist">Nha sĩ</option>
          </select>
        </div>

        <div v-if="errorMessage" class="text-sm text-center text-red-500 font-medium">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition-colors focus:ring-4 focus:ring-blue-200"
        >
          Đăng Nhập
        </button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// SỬA LỖI Ở ĐÂY: Import cấu hình api đã tạo thay vì axios mặc định
import api from '../untils/axios'



const username = ref('Hien')
const password = ref('123')
const role = ref('Receptionist')
const errorMessage = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    errorMessage.value = '' // Reset lỗi cũ

    // Gọi API của C# (Đã được cấu hình baseURL là https://localhost:7146/api)
    // Đường dẫn đầy đủ sẽ là: https://localhost:7146/api/auth/login
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value,
      role: role.value,
    })

    // Lưu Token và Role vào trình duyệt
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('role', response.data.role)

    alert('Đăng nhập thành công!')

    // Mở comment dòng này để tự động chuyển hướng sau khi đăng nhập thành công
    router.push('/dashboard')
  }catch (error) {
    // 1. Kiểm tra xem server C# có trả về response lỗi hay không
    if (error.response && error.response.data) {
      // Bắt cả 'message' (thường) và 'Message' (hoa) đề phòng C# serialize JSON khác nhau
      errorMessage.value = error.response.data.message || error.response.data.Message || 'Đã xảy ra lỗi từ Server!'
    }
    // 2. Trường hợp sập Server (không có response)
    else if (error.request) {
      errorMessage.value = 'Không thể kết nối đến Backend C#. Vui lòng kiểm tra lại Server!'
    }
    // 3. Các lỗi khác của Frontend
    else {
      errorMessage.value = 'Lỗi hệ thống: ' + error.message
    }
  }
}
</script>
