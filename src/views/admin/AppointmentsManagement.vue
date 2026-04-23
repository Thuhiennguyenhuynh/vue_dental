<template>
  <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-6 border-b pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Lịch hẹn (Lễ Tân)</h2>

      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-600">Lọc theo ngày:</label>
        <input type="date" v-model="filterDate" @change="fetchAppointments" class="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 text-gray-600 border-b border-gray-200 text-sm">
            <th class="p-4 font-semibold">Mã</th>
            <th class="p-4 font-semibold">Giờ khám</th>
            <th class="p-4 font-semibold">Bệnh nhân</th>
            <th class="p-4 font-semibold">Bác sĩ</th>
            <th class="p-4 font-semibold">Ghế</th>
            <th class="p-4 font-semibold text-center">Trạng thái</th>
            <th class="p-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading" class="border-b">
            <td colspan="7" class="p-4 text-center text-blue-500 font-medium py-8 animate-pulse">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="appointments.length === 0" class="border-b">
            <td colspan="7" class="p-4 text-center text-gray-500 py-8">Không có lịch hẹn nào trong ngày này.</td>
          </tr>
          <tr
            v-for="app in appointments"
            :key="app.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm"
          >
            <td class="p-4 text-gray-500">#{{ app.id }}</td>
            <td class="p-4 font-bold text-blue-600">
              {{ new Date(app.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) }}
            </td>
            <td class="p-4 font-medium">{{ app.patientName }}</td>
            <td class="p-4">{{ app.dentistName }}</td>
            <td class="p-4 font-medium text-gray-600">{{ app.chairName || 'Chưa gán' }}</td>

            <td class="p-4 text-center">
              <span :class="getStatusClass(app.status)" class="px-3 py-1.5 rounded-full text-xs font-semibold">
                {{ getStatusText(app.status) }}
              </span>
            </td>

            <td class="p-4 text-right space-x-2">
              <button
                v-if="app.status === 0"
                @click="updateStatus(app.id, 'confirm')"
                class="text-blue-600 hover:text-white px-3 py-1 bg-blue-50 hover:bg-blue-600 rounded font-medium transition-colors"
              >
                Xác nhận
              </button>

              <button
                v-if="app.status === 1"
                @click="updateStatus(app.id, 'checkin')"
                class="text-green-600 hover:text-white px-3 py-1 bg-green-50 hover:bg-green-600 rounded font-medium transition-colors"
              >
                Check-in
              </button>

              <button
                v-if="(app.status === 0 || app.status === 1) && canCancel(app.startTime)"
                @click="updateStatus(app.id, 'cancel')"
                class="text-red-500 hover:text-white px-3 py-1 bg-red-50 hover:bg-red-500 rounded font-medium transition-colors"
              >
                Hủy
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/untils/axios.js'

const appointments = ref([])
const isLoading = ref(false)
const filterDate = ref(new Date().toISOString().split('T')[0])

const getStatusText = (status) => {
  const statusMap = { 0: 'Pending', 1: 'Confirmed', 2: 'CheckedIn', 3: 'InProgress', 4: 'Completed', 5: 'Cancelled' }
  return statusMap[status] || 'Unknown'
}

const getStatusClass = (status) => {
  const classMap = {
    0: 'bg-yellow-100 text-yellow-700', 1: 'bg-blue-100 text-blue-700',
    2: 'bg-green-100 text-green-700', 3: 'bg-purple-100 text-purple-700',
    4: 'bg-gray-200 text-gray-800', 5: 'bg-red-100 text-red-700'
  }
  return classMap[status] || 'bg-gray-100'
}

const canCancel = (startTimeStr) => {
  const startTime = new Date(startTimeStr).getTime()
  const now = new Date().getTime()
  return (startTime - now) >= (2 * 60 * 60 * 1000)
}

const fetchAppointments = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/appointments', {
      params: { date: filterDate.value }
    })
    appointments.value = response.data
  } catch (error) {
    console.error('Lỗi tải danh sách lịch hẹn:', error)
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async (id, action) => {
  const textAction = action === 'cancel' ? 'Hủy' : (action === 'confirm' ? 'Xác nhận' : 'Check-in');
  if (!confirm(`Bạn có chắc chắn muốn ${textAction} lịch hẹn này?`)) return;

  try {
    await api.put(`/appointments/${id}/${action}`)
    fetchAppointments()
  } catch (error) {
    alert('Lỗi: ' + (error.response?.data?.message || 'Thao tác thất bại do vi phạm ràng buộc nghiệp vụ.'))
  }
}

onMounted(() => fetchAppointments())
</script>
