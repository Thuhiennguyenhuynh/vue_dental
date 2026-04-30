<template>
  <div class="max-w-5xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg border border-teal-200 dark:border-teal-900 hover:shadow-lg transition-shadow duration-300 animate-fade-in">
    <div class="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">📅 Lịch hẹn của tôi</h2>
      <button @click="$router.push('/dashboard')" class="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium">
        ← Trở về trang chủ
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <svg class="animate-spin h-8 w-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-teal-600 dark:text-teal-400 font-medium">⏳ Đang tải dữ liệu lịch hẹn...</p>
    </div>

    <div v-else-if="appointments.length === 0" class="text-center py-12 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-dashed border-teal-200 dark:border-teal-800">
      <p class="text-gray-600 dark:text-gray-400 mb-4 text-lg">📭 Bạn chưa có lịch hẹn nào tại phòng khám.</p>
      <router-link to="/booking" class="inline-block px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 active:scale-95 shadow-md">
        📅 Đặt lịch ngay
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="app in appointments"
        :key="app.id"
        class="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 relative overflow-hidden animate-slide-up"
        :class="app.status === 5 || app.status === 4 ? 'bg-gray-50 dark:bg-gray-800/50 opacity-80' : 'bg-white dark:bg-slate-800'"
      >
        <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="getStatusBorder(app.status)"></div>

        <div class="flex justify-between items-start mb-4 pl-3">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">Mã phiếu: #{{ app.id }}</span>
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">{{ app.serviceName }}</h3>
          </div>
          <span :class="getStatusClass(app.status)" class="px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {{ getStatusText(app.status) }}
          </span>
        </div>

        <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400 pl-3 mb-5">
          <p><span class="font-medium text-gray-800 dark:text-gray-100">Bác sĩ:</span> BS. {{ app.dentistName }}</p>
          <p><span class="font-medium text-gray-800 dark:text-gray-100">Thời gian:</span> {{ formatDateTime(app.startTime) }}</p>
          <p><span class="font-medium text-gray-800 dark:text-gray-100">Ghế khám:</span> {{ app.chairName || 'Chưa phân bổ' }}</p>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700 text-right pl-3">
          <button
            v-if="(app.status === 0 || app.status === 1) && canCancel(app.startTime)"
            @click="handleCancel(app.id)"
            class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
          >
            Hủy lịch hẹn
          </button>
        </div>
      </div>
    </div>
          >
            Hủy lịch hẹn
          </button>
          <span v-else-if="(app.status === 0 || app.status === 1) && !canCancel(app.startTime)" class="text-sm text-red-400 italic">
            Không thể hủy do sát giờ khám (< 2 tiếng)
          </span>
          <span v-else class="text-sm text-gray-400 italic">
            Lịch hẹn đã hoàn tất / hủy
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/untils/axios.js'

const appointments = ref([])
const isLoading = ref(true)

// Mapping Text và CSS cho trạng thái (Dựa theo 4.3.1)
const getStatusText = (status) => {
  const map = { 0: 'Chờ xác nhận', 1: 'Đã xác nhận', 2: 'Đã Check-in', 3: 'Đang điều trị', 4: 'Hoàn thành', 5: 'Đã hủy' }
  return map[status] || 'Không xác định'
}

const getStatusClass = (status) => {
  const map = {
    0: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    1: 'bg-blue-100 text-blue-700 border border-blue-200',
    2: 'bg-green-100 text-green-700 border border-green-200',
    3: 'bg-purple-100 text-purple-700 border border-purple-200',
    4: 'bg-gray-200 text-gray-800 border border-gray-300',
    5: 'bg-red-100 text-red-700 border border-red-200'
  }
  return map[status] || 'bg-gray-100'
}

const getStatusBorder = (status) => {
  const map = { 0: 'bg-yellow-400', 1: 'bg-blue-500', 2: 'bg-green-500', 3: 'bg-purple-500', 4: 'bg-gray-400', 5: 'bg-red-500' }
  return map[status] || 'bg-gray-200'
}

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Logic kiểm tra Rule BR-04 (Hủy trước 2h)
const canCancel = (startTimeStr) => {
  const startTime = new Date(startTimeStr).getTime()
  const now = new Date().getTime()
  const twoHoursInMs = 2 * 60 * 60 * 1000
  return (startTime - now) >= twoHoursInMs
}

// const fetchMyAppointments = async () => {
//   isLoading.value = true
//   try {
//     // API chuẩn hóa chữ thường
//     const response = await api.get('/appointments')

//     // Nếu API trả về tất cả, frontend filter theo user hiện tại.
//     // Tốt nhất backend nên có endpoint riêng hoặc lấy patientId từ localStorage
//     const patientId = parseInt(localStorage.getItem('patientId')) || 1;
//     appointments.value = response.data.filter(a => a.patientId === patientId);
//   } catch (error) {
//     console.error('Lỗi tải danh sách:', error)
//   } finally {
//     isLoading.value = false
//   }
// }

const fetchMyAppointments = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/appointments');
    // Lấy ID của bệnh nhân hiện tại từ storage
    const currentPatientId = parseInt(localStorage.getItem('patientId'));

    // Lọc: Chỉ hiển thị lịch hẹn có PatientId khớp với người đang đăng nhập
    // Chú ý: Backend trả về DTO có thể là "patientId" hoặc "PatientId" tùy theo mapping
    appointments.value = response.data.filter(a => a.patientId === currentPatientId || a.PatientId === currentPatientId);

    console.log("Lịch hẹn đã lọc:", appointments.value);
  } catch (error) {
    console.error('Lỗi tải danh sách:', error);
  } finally {
    isLoading.value = false;
  }
}

const handleCancel = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) return;

  try {
    // SRS 4.5.4
    await api.put(`/appointments/${id}/cancel`)
    alert("Hủy lịch thành công.");
    fetchMyAppointments();
  } catch (error) {
    alert("Lỗi khi hủy lịch: " + (error.response?.data?.message || 'Vui lòng thử lại.'));
  }
}

onMounted(() => {
  fetchMyAppointments()
})
</script>
