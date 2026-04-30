<template>
  <div
    class="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-md dark:shadow-lg border border-teal-200 dark:border-teal-900 hover:shadow-lg dark:hover:shadow-teal-900/30 transition-shadow duration-300 animate-fade-in"
  >
    <!-- Header -->
    <div
      class="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"
    >
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Quản lý Lịch hẹn (Admin)</h2>

      <div class="flex items-center gap-3">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Lọc theo ngày:</label>
        <input
          type="date"
          v-model="filterDate"
          @change="filterAppointments"
          class="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:ring-teal-400 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 text-gray-700 dark:text-gray-300 border-b-2 border-teal-200 dark:border-teal-800 text-sm"
          >
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
          <!-- Loading State -->
          <tr v-if="isLoading" class="border-b">
            <td
              colspan="7"
              class="p-4 text-center text-teal-600 dark:text-teal-400 font-medium py-8"
            >
              <div class="flex items-center justify-center gap-2">
                <svg
                  class="animate-spin h-5 w-5"
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
                Đang tải dữ liệu...
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="filteredAppointments.length === 0" class="border-b">
            <td colspan="7" class="p-4 text-center text-gray-500 dark:text-gray-400 py-12">
              <div class="text-lg font-medium">📭 Không có lịch hẹn nào</div>
              <p class="text-sm mt-1">Không có lịch hẹn trong ngày này.</p>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-for="app in filteredAppointments"
            :key="app.id"
            class="border-b border-gray-200 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors duration-200 text-sm animate-slide-up"
          >
            <td class="p-4 text-gray-600 dark:text-gray-400 font-medium">#{{ app.id }}</td>
            <td class="p-4 font-bold text-teal-600 dark:text-teal-400">
              {{
                new Date(app.startTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </td>
            <td class="p-4 font-medium text-gray-800 dark:text-gray-200">{{ app.patientName }}</td>
            <td class="p-4 text-gray-700 dark:text-gray-300">BS. {{ app.dentistName }}</td>
            <td class="p-4 text-gray-700 dark:text-gray-300">{{ app.serviceName }}</td>

            <!-- Status Badge -->
            <td class="p-4 text-center">
              <span
                :class="getStatusClass(app.statusText)"
                class="inline-block px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              >
                {{ translateStatus(app.statusText) }}
              </span>
            </td>

            <!-- Action Buttons -->
            <td class="p-4 text-right space-x-2 flex justify-end gap-2">
              <button
                v-if="app.statusText === 'Pending'"
                @click="updateStatus(app.id, 1, 'Xác nhận/Duyệt lịch hẹn này?')"
                class="text-teal-700 dark:text-teal-300 hover:text-white px-3 py-1.5 bg-teal-100 dark:bg-teal-900/40 hover:bg-teal-600 dark:hover:bg-teal-600 rounded-lg font-medium transition-all duration-200 active:scale-95 text-xs"
              >
                ✓ Duyệt
              </button>

              <button
                v-if="app.statusText === 'Confirmed'"
                @click="updateStatus(app.id, 2, 'Xác nhận Bệnh nhân đã tới Check-in?')"
                class="text-green-700 dark:text-green-300 hover:text-white px-3 py-1.5 bg-green-100 dark:bg-green-900/40 hover:bg-green-600 dark:hover:bg-green-600 rounded-lg font-medium transition-all duration-200 active:scale-95 text-xs"
              >
                ✓ Check-in
              </button>

              <button
                v-if="app.statusText === 'Pending' || app.statusText === 'Confirmed'"
                @click="cancelAppointment(app.id)"
                class="text-red-700 dark:text-red-300 hover:text-white px-3 py-1.5 bg-red-100 dark:bg-red-900/40 hover:bg-red-600 dark:hover:bg-red-600 rounded-lg font-medium transition-all duration-200 active:scale-95 text-xs"
              >
                ✕ Hủy
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
    Pending: 'Chờ duyệt',
    Confirmed: 'Đã duyệt',
    CheckedIn: 'Đã Check-in',
    InTreatment: 'Đang điều trị',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
    NoShow: 'Không đến',
  }
  return map[statusText] || statusText
}

const getStatusClass = (statusText) => {
  const classMap = {
    Pending:
      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700',
    Confirmed:
      'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700',
    CheckedIn:
      'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700',
    InTreatment:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700',
    Completed:
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700',
    Cancelled:
      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700',
    NoShow:
      'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600',
  }
  return classMap[statusText] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
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
  filteredAppointments.value = allAppointments.value.filter((app) => {
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
    alert(
      'Lỗi: ' +
        (error.response?.data?.message || error.response?.data?.Error || 'Thao tác thất bại.'),
    )
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
    alert(
      'Lỗi: ' +
        (error.response?.data?.message || error.response?.data?.Error || 'Không thể hủy lịch.'),
    )
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>
