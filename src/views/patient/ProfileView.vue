<template>
  <div class="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 mt-4">
    <div class="flex items-center justify-between mb-8 border-b pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
      <button
        @click="isEditing = !isEditing"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="isEditing ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'"
      >
        {{ isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin' }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-10 text-blue-500 animate-pulse">
      Đang tải thông tin...
    </div>

    <form v-else @submit.prevent="updateProfile" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
          <input
            v-model="profile.name"
            :disabled="!isEditing"
            type="text"
            class="w-full px-4 py-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <input
            v-model="profile.phone"
            :disabled="!isEditing"
            type="tel"
            class="w-full px-4 py-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="profile.email"
            :disabled="!isEditing"
            type="email"
            class="w-full px-4 py-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
          />
        </div>
      </div>

      <div v-if="isEditing" class="pt-6 border-t flex justify-end">
        <button
          type="submit"
          :disabled="saving"
          class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {{ saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
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
  email: ''
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
