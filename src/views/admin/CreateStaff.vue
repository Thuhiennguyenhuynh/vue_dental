<template>
  <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Tạo tài khoản Nhân sự</h2>

    <form @submit.prevent="handleCreateStaff" class="space-y-5">

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="VD: Nguyễn Văn A"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
          <input
            v-model="form.username"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Tên đăng nhập"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
        <select
          v-model="form.role"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-colors"
        >
          <option value="Dentist">Nha sĩ</option>
          <option value="Receptionist">Lễ tân</option>
        </select>
      </div>

      <div v-if="form.role === 'Dentist'">
        <label class="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
        <input
          v-model="form.specialty"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="VD: Nhổ răng khôn, Niềng răng..."
        />
      </div>

      <div class="pt-4">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {{ isLoading ? 'Đang tạo...' : 'Tạo tài khoản' }}
        </button>
      </div>

      <div v-if="errorMessage" class="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
        ⚠️ {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="p-3 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm">
        ✅ {{ successMessage }}
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Lưu ý: Đảm bảo đường dẫn này khớp với thư mục untils của bạn
import api from '@/untils/axios.js'

const form = ref({
  name: '',
  username: '',
  password: '',
  role: 'Dentist',
  specialty: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleCreateStaff = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const payload = { ...form.value }
  if (payload.role !== 'Dentist') {
    delete payload.specialty
  }

  try {
    const response = await api.post('/Admin/create-staff', payload)
    successMessage.value = response.data.message

    // Reset form
    form.value = { name: '', username: '', password: '', role: 'Dentist', specialty: '' }
  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.data.message || error.response.data.title || 'Có lỗi xảy ra từ server.'
    } else {
      errorMessage.value = 'Không thể kết nối đến server.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
