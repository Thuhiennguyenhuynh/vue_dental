<!-- src/views/receptionist/ReceptionistAppointments.vue -->
<template>
  <div class="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300 animate-fade-in">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Quản lý lịch hẹn (Lễ tân)</h2>
      <button @click="fetchAppointments" class="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
        Làm mới
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-gray-200">
      <table class="min-w-full text-left text-sm">
        <thead class="bg-gradient-to-r from-teal-50 to-cyan-50 uppercase tracking-wider border-b-2 border-teal-200">
          <tr>
            <th class="px-6 py-4 font-semibold">ID</th>
            <th class="px-6 py-4 font-semibold">Bệnh nhân</th>
            <th class="px-6 py-4 font-semibold">Bác sĩ</th>
            <th class="px-6 py-4 font-semibold">Dịch vụ</th>
            <th class="px-6 py-4 font-semibold">Thời gian</th>
            <th class="px-6 py-4 font-semibold">Ghế</th>
            <th class="px-6 py-4 font-semibold">Trạng thái</th>
            <th class="px-6 py-4 font-semibold text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="appointments.length === 0">
            <td colspan="8" class="text-center py-12 text-gray-500">Không có lịch hẹn nào.</td>
          </tr>
          <tr v-for="app in appointments" :key="app.id" class="hover:bg-teal-50 transition-colors">
            <td class="px-6 py-4 font-medium">#{{ app.id }}</td>
            <td class="px-6 py-4">{{ app.patientName }}</td>
            <td class="px-6 py-4">{{ app.dentistName }}</td>
            <td class="px-6 py-4 text-teal-600 font-medium">{{ app.serviceName }}</td>
            <td class="px-6 py-4">{{ formatDateTime(app.startTime) }}</td>
            <td class="px-6 py-4">
              <span :class="app.chairName ? 'text-green-600 font-bold' : 'text-orange-600 italic'">
                {{ app.chairName || 'Chưa gán' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span :class="getStatusBadgeClass(app.statusText)" class="px-3 py-1.5 rounded-full text-xs font-semibold">
                {{ app.statusText }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex gap-2 justify-center flex-wrap">
                <!-- Nút Xác nhận chỉ hiện ở trạng thái Pending -->
                <button v-if="app.statusText === 'Pending'" @click="confirmAppointment(app.id)" class="bg-teal-100 text-teal-700 hover:bg-teal-200 px-3 py-1.5 rounded-lg text-xs font-medium">
                  Xác nhận
                </button>
                <!-- Nút Check-in chỉ hiện ở trạng thái Confirmed -->
                <button v-if="app.statusText === 'Confirmed'" @click="openCheckInModal(app.id)" class="bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                  Check-in
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL CHỌN GHẾ CHECK-IN -->
    <div v-if="isCheckInModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Check-in & Gán Ghế Khám</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Chọn ghế trống <span class="text-red-500">*</span></label>
            <select v-model="selectedChairId" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-teal-500 focus:border-teal-500">
              <option value="" disabled>-- Vui lòng chọn ghế --</option>
              <option v-for="chair in availableChairs" :key="chair.id" :value="chair.id">
                {{ chair.name }}
              </option>
            </select>
            <p v-if="availableChairs.length === 0" class="text-red-500 text-xs mt-1">Hiện không có ghế nào đang trống/sẵn sàng!</p>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="closeCheckInModal" class="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg font-medium">Hủy</button>
            <button @click="submitCheckIn" :disabled="!selectedChairId || submitting" class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg font-medium disabled:opacity-50">
              {{ submitting ? 'Đang xử lý...' : 'Hoàn tất Check-in' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/untils/axios'

const appointments = ref([])

// State cho Modal Check-in
const isCheckInModalOpen = ref(false)
const availableChairs = ref([])
const selectedChairId = ref('')
const currentCheckInId = ref(null)
const submitting = ref(false)

const fetchAppointments = async () => {
  try {
    const response = await axios.get('/appointments')
    appointments.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách:', error)
  }
}

// Xác nhận lịch (Pending -> Confirmed)
const confirmAppointment = async (id) => {
  if (!confirm('Bạn chắc chắn muốn xác nhận lịch hẹn này?')) return
  try {
    await axios.put(`/appointments/${id}/confirm`)
    alert('Xác nhận thành công!')
    fetchAppointments()
  } catch (error) {
    alert(error.response?.data?.error || 'Xác nhận thất bại!')
  }
}

// Mở Modal Check-in và lấy danh sách ghế
const openCheckInModal = async (id) => {
  currentCheckInId.value = id
  selectedChairId.value = ''
  try {
    const resChairs = await axios.get('/chairs')
    // BA Update: Chỉ hiển thị ghế có Status = 1 (Available)
    availableChairs.value = resChairs.data.filter(c => c.status === 1)
    isCheckInModalOpen.value = true
  } catch (error) {
    alert('Lỗi lấy danh sách ghế: ' + error.message)
  }
}

const closeCheckInModal = () => {
  isCheckInModalOpen.value = false
  currentCheckInId.value = null
}

// Gửi Check-in kèm ID ghế
const submitCheckIn = async () => {
  if (!selectedChairId.value) return
  submitting.value = true
  try {
    await axios.put(`/appointments/${currentCheckInId.value}/checkin`, {
        chairId: selectedChairId.value
    })
    alert('Check-in thành công và đã gán ghế!')
    closeCheckInModal()
    fetchAppointments()
  } catch (error) {
    alert(error.response?.data?.error || 'Check-in thất bại.')
  } finally {
    submitting.value = false
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'Confirmed': return 'bg-teal-100 text-teal-800 border-teal-300'
    case 'CheckedIn': return 'bg-green-100 text-green-800 border-green-300'
    case 'InProgress': return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'Completed': return 'bg-gray-200 text-gray-800 border-gray-300'
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-300'
    case 'NoShow': return 'bg-orange-100 text-orange-800 border-orange-300'
    default: return 'bg-gray-100 text-gray-600'
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>
