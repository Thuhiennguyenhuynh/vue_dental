<template>
  <div>
    <div v-if="userRole === 'Patient'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 flex items-center justify-between">
        <div>
          <h3 class="text-gray-500 font-medium mb-1">Lịch khám sắp tới</h3>
          <p class="text-2xl font-bold text-gray-800">Chưa có lịch</p>
        </div>
        <div class="p-3 bg-blue-50 rounded-full text-blue-500 text-2xl">📅</div>
      </div>

      <div @click="$router.push('/booking')" class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl shadow-md text-white flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow">
        <div>
          <h3 class="font-medium mb-1 opacity-90">Cần khám răng?</h3>
          <p class="text-2xl font-bold">Đặt lịch ngay ➔</p>
        </div>
        <div class="text-4xl opacity-80">🦷</div>
      </div>
    </div>

    <div v-else-if="userRole === 'Admin' || userRole === 'Receptionist'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-if="isLoading" class="col-span-3 text-center py-10 text-gray-500">
        Đang tải thống kê...
      </div>

      <template v-else>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 font-medium">Lịch khám hôm nay</h3>
          <p class="text-4xl font-bold text-blue-600 mt-2">{{ stats.appointmentsToday }}</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 font-medium">Lịch đang chờ duyệt</h3>
          <p class="text-4xl font-bold text-yellow-500 mt-2">{{ stats.pendingAppointments }}</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 font-medium">Nha sĩ đang hoạt động</h3>
          <p class="text-4xl font-bold text-green-500 mt-2">{{ stats.activeDentists }}</p>
        </div>
      </template>
    </div>

    <div v-else-if="userRole === 'Dentist'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-gray-500 font-medium">Ca khám của tôi hôm nay</h3>
        <p class="text-4xl font-bold text-purple-600 mt-2">4</p> </div>
    </div>

    <div class="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
      <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Thông báo nội bộ</h2>
      <p class="text-gray-500 italic">Hiện tại không có thông báo mới nào...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/untils/axios.js'

const userRole = ref('')
const isLoading = ref(false)

// Chứa dữ liệu thống kê từ API
const stats = ref({
  appointmentsToday: 0,
  pendingAppointments: 0,
  activeDentists: 0
})

onMounted(async () => {
  // Lấy role từ LocalStorage
  const role = localStorage.getItem('role')
  if (role) {
    userRole.value = role
  }

  // Nếu là Admin hoặc Lễ tân thì gọi API lấy thống kê
  if (role === 'Admin' || role === 'Receptionist') {
    isLoading.value = true
    try {
      const response = await api.get('/Admin/dashboard-stats')
      stats.value = response.data
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu thống kê:', error)
    } finally {
      isLoading.value = false
    }
  }
})
</script>
