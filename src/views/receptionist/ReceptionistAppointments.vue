<template>
  <div
    class="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300 animate-fade-in"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
        📋 Quản lý Lịch hẹn (Lễ tân)
      </h2>
      <button
        @click="fetchAppointments"
        class="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 hover:from-teal-700 hover:to-cyan-700 dark:hover:from-teal-600 dark:hover:to-cyan-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
      >
        🔄 Làm mới dữ liệu
      </button>
    </div>

    <!-- Table -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-slide-up"
    >
      <table class="min-w-full text-left text-sm">
        <!-- Table Head -->
        <thead
          class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 uppercase tracking-wider border-b-2 border-teal-200 dark:border-teal-800"
        >
          <tr>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">ID</th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
              Bệnh nhân
            </th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
              Bác sĩ
            </th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
              Dịch vụ
            </th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
              Thời gian (Bắt đầu)
            </th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
              Ghế khám
            </th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
              Trạng thái
            </th>
            <th
              scope="col"
              class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-center"
            >
              Thao tác
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Empty State -->
          <tr v-if="appointments.length === 0">
            <td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
              <div class="text-4xl mb-2">📭</div>
              <p>Không có dữ liệu lịch hẹn nào.</p>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-for="app in appointments"
            :key="app.id"
            class="hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors duration-200"
          >
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">#{{ app.id }}</td>
            <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ app.patientName }}</td>
            <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ app.dentistName }}</td>
            <td class="px-6 py-4 text-teal-600 dark:text-teal-400 font-medium">
              {{ app.serviceName }}
            </td>
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
              {{ formatDateTime(app.startTime) }}
            </td>
            <td class="px-6 py-4">
              <span
                :class="
                  app.chairName === 'Chưa gán ghế'
                    ? 'text-orange-600 dark:text-orange-400 italic'
                    : 'text-green-600 dark:text-green-400 font-bold'
                "
              >
                {{ app.chairName }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span
                :class="getStatusBadgeClass(app.statusText)"
                class="px-3 py-1.5 rounded-full text-xs font-semibold inline-block transition-all duration-200"
              >
                {{ app.statusText }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex gap-2 justify-center flex-wrap">
                <!-- Details Button -->
                <button
                  @click="viewAppointmentDetail(app.id)"
                  class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95"
                >
                  🔍 Chi tiết
                </button>

                <!-- Confirm Button -->
                <button
                  v-if="app.statusText === 'Pending'"
                  @click="confirmAppointment(app.id)"
                  class="bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/60 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95"
                >
                  ✓ Xác nhận
                </button>

                <!-- Check-in Button -->
                <button
                  v-if="app.statusText === 'Confirmed'"
                  @click="checkInAppointment(app.id)"
                  class="bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  ✓ Check-in
                </button>

                <!-- Processed Badge -->
                <span
                  v-if="app.statusText !== 'Pending' && app.statusText !== 'Confirmed'"
                  class="text-gray-500 dark:text-gray-400 text-xs italic"
                >
                  ✓ Đã xử lý
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 px-4 transition-opacity duration-300 backdrop-blur-sm"
    >
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-teal-900/50 w-full max-w-2xl overflow-hidden transform transition-all duration-300 animate-slide-up border border-gray-200 dark:border-gray-700"
      >
        <!-- Modal Header -->
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20"
        >
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
            📋 Chi tiết Lịch hẹn #{{ selectedAppointment?.id }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none transition-colors duration-200"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <div v-if="isLoadingDetail" class="flex justify-center items-center py-10">
            <svg
              class="animate-spin h-8 w-8 text-teal-600 dark:text-teal-400"
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
          </div>

          <div v-else-if="selectedAppointment" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <div
                class="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800"
              >
                <p class="text-sm text-gray-600 dark:text-gray-400 font-semibold">Bệnh nhân</p>
                <p class="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {{ selectedAppointment.patientName }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 font-semibold">Bác sĩ phụ trách</p>
                <p class="text-gray-900">{{ selectedAppointment.dentistName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 font-semibold">Dịch vụ điều trị</p>
                <p class="text-blue-600 font-medium">{{ selectedAppointment.serviceName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 font-semibold">Ghế khám</p>
                <p
                  :class="
                    selectedAppointment.chairName === 'Chưa gán ghế'
                      ? 'text-orange-500'
                      : 'text-green-600 font-bold'
                  "
                >
                  {{ selectedAppointment.chairName }}
                </p>
              </div>
            </div>

            <!-- Cột phải -->
            <div class="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div>
                <p class="text-sm text-gray-500 font-semibold">Thời gian dự kiến</p>
                <p class="text-gray-900">{{ formatDateTime(selectedAppointment.startTime) }}</p>
                <p class="text-gray-500 text-sm">
                  đến {{ formatDateTime(selectedAppointment.endTime) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 font-semibold">Trạng thái hiện tại</p>
                <span
                  :class="getStatusBadgeClass(selectedAppointment.statusText)"
                  class="px-3 py-1 rounded-full text-sm font-semibold inline-block mt-1"
                >
                  {{ selectedAppointment.statusText }}
                </span>
              </div>
              <!-- Các trường mở rộng (Nếu có trong DTO) -->
              <div v-if="selectedAppointment.bookingSource">
                <p class="text-sm text-gray-500 font-semibold">Nguồn đặt lịch</p>
                <p class="text-gray-900">{{ selectedAppointment.bookingSource }}</p>
              </div>
              <div v-if="selectedAppointment.note">
                <p class="text-sm text-gray-500 font-semibold">Ghi chú</p>
                <p class="text-gray-700 italic border-l-4 border-gray-300 pl-2 mt-1">
                  {{ selectedAppointment.note }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            @click="closeModal"
            class="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            Đóng
          </button>
          <button
            v-if="selectedAppointment?.statusText === 'Confirmed'"
            @click="
              checkInAppointment(selectedAppointment.id),closeModal()"
            class="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            Check-in ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/untils/axios'

const appointments = ref([])

// --- BIẾN TRẠNG THÁI CHO MODAL ---
const isModalOpen = ref(false)
const isLoadingDetail = ref(false)
const selectedAppointment = ref(null)

// 1. Fetch dữ liệu danh sách lịch hẹn
const fetchAppointments = async () => {
  try {
    const response = await axios.get('/appointments')
    appointments.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách:', error)
  }
}

// 2. Mở Modal & Lấy chi tiết 1 lịch hẹn
const viewAppointmentDetail = async (id) => {
  isModalOpen.value = true
  isLoadingDetail.value = true
  selectedAppointment.value = null // Reset dữ liệu cũ

  try {
    // Lưu ý: Đảm bảo bạn đã thêm API GET /api/appointments/{id} vào Backend C# như hướng dẫn trước đó nhé!
    const response = await axios.get(`/appointments/${id}`)
    selectedAppointment.value = response.data
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    alert('Không thể tải chi tiết lịch hẹn. Vui lòng thử lại!')
    isModalOpen.value = false
  } finally {
    isLoadingDetail.value = false
  }
}

// 3. Đóng Modal
const closeModal = () => {
  isModalOpen.value = false
  selectedAppointment.value = null
}

// 4. Hàm Xác nhận lịch (Pending -> Confirmed)
const confirmAppointment = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xác nhận lịch hẹn này?')) return
  try {
    const response = await axios.put(`/appointments/${id}/confirm`)
    alert(response.data.message || 'Xác nhận thành công!')
    await fetchAppointments()
  } catch (error) {
    alert(error.response?.data?.error || 'Xác nhận thất bại!')
  }
}

// 5. Hàm Check-in (Confirmed -> CheckedIn & Assign Chair)
const checkInAppointment = async (id) => {
  if (!confirm('Bệnh nhân đã đến? Hệ thống sẽ tự động tìm ghế trống để gán.')) return
  try {
    const response = await axios.put(`/appointments/${id}/checkin`)
    alert(response.data.message || 'Check-in thành công và đã gán ghế!')
    await fetchAppointments()
  } catch (error) {
    alert(error.response?.data?.error || 'Check-in thất bại. Có thể phòng khám đang hết ghế trống!')
  }
}

// --- Các hàm Format giao diện ---
const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700'
    case 'Confirmed':
      return 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700'
    case 'CheckedIn':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
    case 'InProgress':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700'
    case 'Completed':
      return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
    case 'Cancelled':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
    case 'NoShow':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-700'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>
