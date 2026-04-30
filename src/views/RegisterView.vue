<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-10 animate-fade-in"
  >
    <div
      class="w-full max-w-md p-8 space-y-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-slide-up border border-teal-100 dark:border-teal-900"
    >
      <!-- Header -->
      <div class="text-center space-y-2">
        <div
          class="inline-block p-3 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 rounded-full mb-2"
        >
          <span class="text-4xl">📋</span>
        </div>
        <h1
          class="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent"
        >
          Đăng Ký
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Tạo tài khoản bệnh nhân mới</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-3">
        <!-- Name Field -->
        <div class="animate-slide-in" style="animation-delay: 0.05s">
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >Họ và tên</label
          >
          <input
            v-model="name"
            type="text"
            placeholder="Nhập họ và tên"
            :class="[
              'w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300',
              'bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100',
              fieldErrors.name
                ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-700/50'
                : 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-700/50 focus:border-teal-500',
            ]"
            @input="clearError('name')"
          />
          <p v-if="fieldErrors.name" class="mt-1 text-xs text-red-500 font-medium">
            {{ fieldErrors.name }}
          </p>
        </div>

        <!-- Phone Field -->
        <div class="animate-slide-in" style="animation-delay: 0.1s">
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >Số điện thoại</label
          >
          <input
            v-model="phone"
            type="text"
            placeholder="Nhập số điện thoại (VD: 09...)"
            :class="[
              'w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300',
              'bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100',
              fieldErrors.phone
                ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-700/50'
                : 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-700/50 focus:border-teal-500',
            ]"
            @input="clearError('phone')"
          />
          <p v-if="fieldErrors.phone" class="mt-1 text-xs text-red-500 font-medium">
            {{ fieldErrors.phone }}
          </p>
        </div>

        <!-- Username Field -->
        <div class="animate-slide-in" style="animation-delay: 0.15s">
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >Tên tài khoản</label
          >
          <input
            v-model="username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            :class="[
              'w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300',
              'bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100',
              fieldErrors.username
                ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-700/50'
                : 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-700/50 focus:border-teal-500',
            ]"
            @input="clearError('username')"
          />
          <p v-if="fieldErrors.username" class="mt-1 text-xs text-red-500 font-medium">
            {{ fieldErrors.username }}
          </p>
        </div>

        <!-- Password Field -->
        <div class="animate-slide-in" style="animation-delay: 0.2s">
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >Mật khẩu</label
          >
          <input
            v-model="password"
            type="password"
            placeholder="Nhập mật khẩu"
            :class="[
              'w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300',
              'bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100',
              fieldErrors.password
                ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-700/50'
                : 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-700/50 focus:border-teal-500',
            ]"
            @input="clearError('password')"
          />
          <p v-if="fieldErrors.password" class="mt-1 text-xs text-red-500 font-medium">
            {{ fieldErrors.password }}
          </p>
        </div>

        <!-- Error Message -->
        <div
          v-if="generalError"
          class="text-sm text-center text-red-600 dark:text-red-400 font-medium p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 animate-slide-up"
        >
          {{ generalError }}
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="text-sm text-center text-green-600 dark:text-green-400 font-medium p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 animate-slide-up"
        >
          ✓ {{ successMessage }}
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 dark:from-teal-600 dark:to-cyan-600 dark:hover:from-teal-500 dark:hover:to-cyan-500 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-teal-200 dark:focus:ring-teal-700/50 mt-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <span v-if="isLoading" class="inline-flex items-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Đang xử lý...
          </span>
          <span v-else>Đăng Ký Ngay</span>
        </button>

        <!-- Login Link -->
        <div class="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          Đã có tài khoản?
          <router-link
            to="/"
            class="text-teal-600 dark:text-teal-400 font-semibold hover:underline transition-colors duration-200"
          >
            Đăng nhập
          </router-link>
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
      phone: phone.value,
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
      } else if (data.message || data.Message) {
        generalError.value = data.message || data.Message
      } else {
        generalError.value = 'Đăng ký thất bại!'
      }
    } else if (error.request) {
      generalError.value = 'Không thể kết nối đến Backend C#!'
    } else {
      generalError.value = 'Lỗi hệ thống: ' + error.message
    }
  } finally {
    isLoading.value = false
  }
}
</script>
