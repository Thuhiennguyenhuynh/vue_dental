<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
    <div class="w-full max-w-md p-8 space-y-4 bg-white rounded-2xl shadow-xl">
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-blue-600">Đăng Ký</h1>
        <p class="mt-2 text-gray-500">Tạo tài khoản bệnh nhân mới</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Họ và tên</label>
          <input
            v-model="name"
            type="text"
            placeholder="Nhập họ và tên"
            :class="[
              'w-full px-4 py-2 border rounded-lg outline-none transition-all',
              fieldErrors.name ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
            ]"
            @input="clearError('name')"
          />
          <p v-if="fieldErrors.name" class="mt-1 text-sm text-red-500 font-medium">
            {{ fieldErrors.name }}
          </p>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            v-model="phone"
            type="text"
            placeholder="Nhập số điện thoại (VD: 09...)"
            :class="[
              'w-full px-4 py-2 border rounded-lg outline-none transition-all',
              fieldErrors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
            ]"
            @input="clearError('phone')"
          />
          <p v-if="fieldErrors.phone" class="mt-1 text-sm text-red-500 font-medium">
            {{ fieldErrors.phone }}
          </p>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Tên tài khoản</label>
          <input
            v-model="username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            :class="[
              'w-full px-4 py-2 border rounded-lg outline-none transition-all',
              fieldErrors.username ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
            ]"
            @input="clearError('username')"
          />
          <p v-if="fieldErrors.username" class="mt-1 text-sm text-red-500 font-medium">
            {{ fieldErrors.username }}
          </p>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            placeholder="Nhập mật khẩu"
            :class="[
              'w-full px-4 py-2 border rounded-lg outline-none transition-all',
              fieldErrors.password ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
            ]"
            @input="clearError('password')"
          />
          <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-500 font-medium">
            {{ fieldErrors.password }}
          </p>
        </div>

        <div
          v-if="generalError"
          class="text-sm text-center text-red-500 font-medium p-2 bg-red-50 rounded-lg border border-red-100"
        >
          {{ generalError }}
        </div>

        <div
          v-if="successMessage"
          class="text-sm text-center text-green-600 font-medium p-2 bg-green-50 rounded-lg border border-green-100"
        >
          {{ successMessage }}
        </div>

        <button
          type="submit"
          class="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition-colors focus:ring-4 focus:ring-blue-200 mt-2"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Đang xử lý...</span>
          <span v-else>Đăng Ký Ngay</span>
        </button>

        <div class="text-center mt-4 text-sm text-gray-600">
          Đã có tài khoản?
          <router-link to="/" class="text-blue-600 font-semibold hover:underline">Đăng nhập</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../untils/axios'

const name = ref('')
const phone = ref('')
const username = ref('')
const password = ref('')

const fieldErrors = ref({})
const generalError = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const router = useRouter()

const clearError = (field) => {
  if (fieldErrors.value[field]) {
    fieldErrors.value[field] = null
  }
  generalError.value = ''
}

const handleRegister = async () => {
  try {
    fieldErrors.value = {}
    generalError.value = ''
    successMessage.value = ''
    isLoading.value = true

    const response = await api.post('/auth/register', {
      username: username.value,
      password: password.value,
      name: name.value,
      phone: phone.value
    })

    successMessage.value = response.data.message || response.data.Message || 'Đăng ký thành công!'

    setTimeout(() => {
      router.push('/')
    }, 1500)

  } catch (error) {
    console.error('Register Error:', error)

    if (error.response && error.response.data) {
      const data = error.response.data

      if (data.errors) {
        let errorsMap = {}
        for (let key in data.errors) {
          let normalizedKey = key.toLowerCase()
          // SỬA Ở ĐÂY: Dùng .join(' và ') để gom tất cả các lỗi chi tiết của cùng 1 ô
          errorsMap[normalizedKey] = data.errors[key].join(' và ')
        }
        fieldErrors.value = errorsMap
      }
      else if (data.message || data.Message) {
        generalError.value = data.message || data.Message
      }
      else {
        generalError.value = 'Đăng ký thất bại!'
      }
    }
    else if (error.request) {
      generalError.value = 'Không thể kết nối đến Backend C#!'
    }
    else {
      generalError.value = 'Lỗi hệ thống: ' + error.message
    }
  } finally {
    isLoading.value = false
  }
}
</script>
