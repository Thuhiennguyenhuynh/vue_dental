<template>
  <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-6 border-b pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Lịch hẹn (Admin)</h2>

      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-600">Lọc theo ngày:</label>
        <input
          type="date"
          v-model="filterDate"
          @change="filterAppointments"
          class="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
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
            <th class="p-4 font-semibold">Dịch vụ</th>
            <th class="p-4 font-semibold text-center">Trạng thái</th>
            <th class="p-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading" class="border-b">
            <td colspan="7" class="p-4 text-center text-blue-500 font-medium py-8 animate-pulse">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="filteredAppointments.length === 0" class="border-b">
            <td colspan="7" class="p-4 text-center text-gray-500 py-8">Không có lịch hẹn nào trong ngày này.</td>
          </tr>
          <tr
            v-for="app in filteredAppointments"
            :key="app.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm"
          >
            <td class="p-4 text-gray-500 font-medium">#{{ app.id }}</td>
            <td class="p-4 font-bold text-blue-600">
              {{ new Date(app.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) }}
            </td>
            <td class="p-4 font-medium">{{ app.patientName }}</td>
            <td class="p-4">BS. {{ app.dentistName }}</td>
            <td class="p-4">{{ app.serviceName }}</td>

            <td class="p-4 text-center">
              <span :class="getStatusClass(app.statusText)" class="px-3 py-1.5 rounded-full text-xs font-semibold">
                {{ translateStatus(app.statusText) }}
              </span>
            </td>

            <td class="p-4 text-right space-x-2">
              <button
                v-if="app.statusText === 'Pending'"
                @click="updateStatus(app.id, 1, 'Xác nhận/Duyệt lịch hẹn này?')"
                class="text-blue-600 hover:text-white px-3 py-1 bg-blue-50 hover:bg-blue-600 rounded font-medium transition-colors"
              >
                Duyệt
              </button>

              <button
                v-if="app.statusText === 'Confirmed'"
                @click="updateStatus(app.id, 2, 'Xác nhận Bệnh nhân đã tới Check-in?')"
                class="text-green-600 hover:text-white px-3 py-1 bg-green-50 hover:bg-green-600 rounded font-medium transition-colors"
              >
                Check-in
              </button>

              <button
                v-if="app.statusText === 'Pending' || app.statusText === 'Confirmed'"
                @click="cancelAppointment(app.id)"
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

const allAppointments = ref([])
const filteredAppointments = ref([])
const isLoading = ref(false)

// Mặc định lọc theo ngày hôm nay
const filterDate = ref(new Date().toISOString().split('T')[0])

// Hàm dịch tiếng Anh sang tiếng Việt cho dễ nhìn
const translateStatus = (statusText) => {
  const map = {
    'Pending': 'Chờ duyệt',
    'Confirmed': 'Đã duyệt',
    'CheckedIn': 'Đã Check-in',
    'InTreatment': 'Đang điều trị',
    'Completed': 'Hoàn thành',
    'Cancelled': 'Đã hủy',
    'NoShow': 'Không đến'
  }
  return map[statusText] || statusText
}

const getStatusClass = (statusText) => {
  const classMap = {
    'Pending': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'Confirmed': 'bg-blue-100 text-blue-700 border border-blue-200',
    'CheckedIn': 'bg-green-100 text-green-700 border border-green-200',
    'InTreatment': 'bg-purple-100 text-purple-700 border border-purple-200',
    'Completed': 'bg-gray-200 text-gray-800 border border-gray-300',
    'Cancelled': 'bg-red-100 text-red-700 border border-red-200',
    'NoShow': 'bg-gray-200 text-gray-500 border border-gray-300'
  }
  return classMap[statusText] || 'bg-gray-100 text-gray-600'
}

// Lấy toàn bộ danh sách lịch hẹn
const fetchAppointments = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/appointments')
    allAppointments.value = response.data
    filterAppointments() // Lọc theo ngày đang chọn
  } catch (error) {
    console.error('Lỗi tải danh sách lịch hẹn:', error)
  } finally {
    isLoading.value = false
  }
}

// Lọc lịch hẹn theo filterDate
const filterAppointments = () => {
  if (!filterDate.value) {
    filteredAppointments.value = allAppointments.value
    return
  }
  filteredAppointments.value = allAppointments.value.filter(app => {
    // Tách lấy chuỗi YYYY-MM-DD từ startTime
    const appDate = app.startTime.split('T')[0]
    return appDate === filterDate.value
  })
}

// Hàm gọi API Cập nhật trạng thái (Duyệt / Check-in)
const updateStatus = async (id, newStatus, confirmMsg) => {
  if (!confirm(confirmMsg)) return

  try {
    // Gọi PUT /api/appointments/{id} với body chứa status
    await api.put(`/appointments/${id}`, { status: newStatus })
    alert('Thao tác thành công!')
    fetchAppointments() // Reload lại danh sách
  } catch (error) {
    alert('Lỗi: ' + (error.response?.data?.message || error.response?.data?.Error || 'Thao tác thất bại.'))
  }
}

// Hàm gọi API Hủy lịch
const cancelAppointment = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn HỦY lịch hẹn này không?')) return

  try {
    // Gọi DELETE /api/appointments/{id}
    await api.delete(`/appointments/${id}`)
    alert('Hủy lịch thành công!')
    fetchAppointments() // Reload lại danh sách
  } catch (error) {
    alert('Lỗi: ' + (error.response?.data?.message || error.response?.data?.Error || 'Không thể hủy lịch.'))
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>
