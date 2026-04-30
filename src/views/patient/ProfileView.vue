<template>
  <div
    class="max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg border border-teal-200 dark:border-teal-900 hover:shadow-lg transition-shadow duration-300 animate-fade-in"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4"
    >
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">👤 Thông tin cá nhân</h2>
      <button
        @click="isEditing = !isEditing"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
        :class="
          isEditing
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            : 'bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40 text-teal-700 dark:text-teal-300 hover:from-teal-200 hover:to-cyan-200 dark:hover:from-teal-900/60 dark:hover:to-cyan-900/60'
        "
      >
        {{ isEditing ? '✕ Hủy chỉnh sửa' : '✏️ Chỉnh sửa thông tin' }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <svg
        class="animate-spin h-8 w-8 mx-auto text-teal-600 dark:text-teal-400 mb-2"
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
      <p class="text-teal-600 dark:text-teal-400 font-medium">Đang tải thông tin...</p>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="updateProfile" class="space-y-6 animate-slide-up">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Name Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Họ và tên</label
          >
          <input
            v-model="profile.name"
            :disabled="!isEditing"
            type="text"
            class="w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200"
            :class="
              isEditing
                ? 'border-teal-300 dark:border-teal-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                : 'border-gray-300 dark:border-gray-600 opacity-70 cursor-not-allowed'
            "
          />
        </div>

        <!-- Phone Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Số điện thoại</label
          >
          <input
            v-model="profile.phone"
            :disabled="!isEditing"
            type="tel"
            class="w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200"
            :class="
              isEditing
                ? 'border-teal-300 dark:border-teal-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                : 'border-gray-300 dark:border-gray-600 opacity-70 cursor-not-allowed'
            "
          />
        </div>

        <!-- Email Field -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Email</label
          >
          <input
            v-model="profile.email"
            :disabled="!isEditing"
            type="email"
            class="w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200"
            :class="
              isEditing
                ? 'border-teal-300 dark:border-teal-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                : 'border-gray-300 dark:border-gray-600 opacity-70 cursor-not-allowed'
            "
          />
        </div>
      </div>

      <!-- Save Button -->
      <div
        v-if="isEditing"
        class="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3"
      >
        <button
          type="button"
          @click="isEditing = false"
          class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-bold transition-all duration-200 active:scale-95"
        >
          Hủy
        </button>
        <button
          type="submit"
          :disabled="saving"
          class="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {{ saving ? '⏳ Đang lưu...' : '✓ Lưu thay đổi' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/untils/axios.js'

const profile = ref({
  name: '',
  phone: '',
  email: '',
})
const loading = ref(true)
const isEditing = ref(false)
const saving = ref(false)

const fetchProfile = async () => {
  loading.value = true
  try {
    const patientId = localStorage.getItem('patientId') || 1
    // Gọi API lấy thông tin bệnh nhân (SRS 4.1.2)
    const response = await api.get(`/patients/${patientId}`)
    profile.value = response.data
  } catch (error) {
    console.error('Lỗi tải thông tin profile:', error)
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  saving.value = true
  try {
    const patientId = localStorage.getItem('patientId') || 1
    await api.put(`/patients/${patientId}`, profile.value)
    alert('Cập nhật thông tin thành công!')
    isEditing.value = false
  } catch (error) {
    alert('Lỗi cập nhật: ' + (error.response?.data?.message || 'Vui lòng thử lại.'))
  } finally {
    saving.value = false
  }
}

onMounted(fetchProfile)
</script>
