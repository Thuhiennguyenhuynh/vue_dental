<template>
  <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-6 border-b pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Lịch hẹn (Lễ Tân)</h2>

      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Lọc theo ngày:</label>
        <input type="date" v-model="filterDate" @change="fetchAppointments" class="px-3 py-2 border rounded-lg outline-none" />
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
            <td colspan="7" class="p-4 text-center text-gray-500">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="appointments.length === 0" class="border-b">
            <td colspan="7" class="p-4 text-center text-gray-500">Không có lịch hẹn nào trong ngày này.</td>
          </tr>
          <tr
            v-for="app in appointments"
            :key="app.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm"
          >
            <td class="p-4 text-gray-500">#{{ app.id }}</td>
            <td class="p-4 font-medium text-blue-600">
              {{ new Date(app.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) }}
            </td>
            <td class="p-4">{{ app.patientName }}</td>
            <td class="p-4">{{ app.dentistName }}</td>
            <td class="p-4 font-medium">{{ app.chairName || 'Chưa gán' }}</td>

            <td class="p-4 text-center">
              <span :class="getStatusClass(app.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ getStatusText(app.status) }}
              </span>
            </td>

            <td class="p-4 text-right space-x-2">
              <button
                v-if="app.status === 0"
                @click="updateStatus(app.id, 'confirm')"
                class="text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded font-medium"
              >
                Xác nhận
              </button>

              <button
                v-if="app.status === 1"
                @click="updateStatus(app.id, 'checkin')"
                class="text-green-600 hover:text-green-800 px-3 py-1 bg-green-50 rounded font-medium"
              >
                Check-in
              </button>

              <button
                v-if="app.status === 0 || app.status === 1"
                @click="updateStatus(app.id, 'cancel')"
                class="text-red-500 hover:text-red-600 px-3 py-1 bg-red-50 rounded font-medium"
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

// Hàm mapping trạng thái dựa theo Schema SRS 4.3.1
const getStatusText = (status) => {
  const statusMap = {
    0: 'Pending',
    1: 'Confirmed',
    2: 'CheckedIn',
    3: 'InProgress',
    4: 'Completed',
    5: 'Cancelled'
  }
  return statusMap[status] || 'Unknown'
}

const getStatusClass = (status) => {
  const classMap = {
    0: 'bg-yellow-100 text-yellow-700', // Pending
    1: 'bg-blue-100 text-blue-700',   // Confirmed
    2: 'bg-green-100 text-green-700', // CheckedIn
    3: 'bg-purple-100 text-purple-700',// InProgress
    4: 'bg-gray-200 text-gray-800',   // Completed
    5: 'bg-red-100 text-red-700'      // Cancelled
  }
  return classMap[status] || 'bg-gray-100'
}

const fetchAppointments = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/Appointments', {
      params: { date: filterDate.value }
    })
    // Cần backend trả về DTO chứa cả Name của Patient, Dentist và Chair
    appointments.value = response.data
  } catch (error) {
    console.error('Lỗi tải danh sách lịch hẹn:', error)
  } finally {
    isLoading.value = false
  }
}

// Xử lý gọi API chuyển trạng thái (FR-03, FR-04, FR-05)
const updateStatus = async (id, action) => {
  let confirmMsg = action === 'cancel' ? 'Xác nhận hủy lịch này?' : `Tiến hành ${action} lịch hẹn?`;
  if (!confirm(confirmMsg)) return;

  try {
    // Gọi đúng các endpoint định nghĩa trong SRS 4.5.4, 4.5.5, 4.5.6
    await api.put(`/Appointments/${id}/${action}`)
    fetchAppointments() // Reload list sau khi thành công
  } catch (error) {
    alert('Lỗi: ' + (error.response?.data?.message || 'Thao tác thất bại do vi phạm ràng buộc nghiệp vụ.'))
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>
