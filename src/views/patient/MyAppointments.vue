<template>
  <div class="max-w-5xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 mt-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Lịch hẹn của tôi</h2>

    <div v-if="isLoading" class="text-center py-8 text-gray-500">
      Đang tải dữ liệu lịch hẹn...
    </div>

    <div v-else-if="appointments.length === 0" class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
      <p class="text-gray-500 mb-4">Bạn chưa có lịch hẹn nào tại phòng khám.</p>
      <router-link to="/booking" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Đặt lịch ngay
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="app in appointments"
        :key="app.id"
        class="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow relative overflow-hidden"
        :class="app.status === 5 ? 'bg-gray-50 opacity-75' : 'bg-white'"
      >
        <div class="absolute left-0 top-0 bottom-0 w-1" :class="getStatusBorder(app.status)"></div>

        <div class="flex justify-between items-start mb-4 pl-2">
          <div>
            <span class="text-sm text-gray-500 font-medium">Mã phiếu: #{{ app.id }}</span>
            <h3 class="text-lg font-bold text-gray-800 mt-1">{{ app.serviceName }}</h3>
          </div>
          <span :class="getStatusClass(app.status)" class="px-3 py-1 rounded-full text-xs font-medium">
            {{ getStatusText(app.status) }}
          </span>
        </div>

        <div class="space-y-2 text-sm text-gray-600 pl-2 mb-5">
          <p><span class="font-medium">Bác sĩ:</span> BS. {{ app.dentistName }}</p>
          <p><span class="font-medium">Thời gian:</span> {{ formatDateTime(app.startTime) }}</p>
          <p><span class="font-medium">Ghế khám:</span> {{ app.chairName || 'Chưa phân bổ' }}</p>
        </div>

        <div class="pt-4 border-t border-gray-100 text-right pl-2">
          <button
            v-if="app.status === 0 || app.status === 1"
            @click="handleCancel(app.id, app.startTime)"
            class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Hủy lịch hẹn
          </button>
          <span v-else class="text-sm text-gray-400 italic">
            Không thể thay đổi trạng thái
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
    0: 'bg-yellow-100 text-yellow-700',
    1: 'bg-blue-100 text-blue-700',
    2: 'bg-green-100 text-green-700',
    3: 'bg-purple-100 text-purple-700',
    4: 'bg-gray-200 text-gray-800',
    5: 'bg-red-100 text-red-700'
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

const fetchMyAppointments = async () => {
  isLoading.value = true
  try {
    // Giả định backend hỗ trợ filter theo patientId hoặc lấy từ JWT Token
    // Ở đây mình tạm dùng API get all hoặc bạn tự điều chỉnh endpoint thành /Appointments/my-appointments
    const response = await api.get('/Appointments')
    appointments.value = response.data
  } catch (error) {
    console.error('Lỗi tải danh sách:', error)
  } finally {
    isLoading.value = false
  }
}

// Logic kiểm tra Rule BR-04: Không cho hủy trước 2 giờ
const handleCancel = async (id, startTime) => {
  const startObj = new Date(startTime).getTime();
  const nowObj = new Date().getTime();
  const diffHours = (startObj - nowObj) / (1000 * 60 * 60);

  if (diffHours < 2) {
    alert("Quy định phòng khám: Không thể hủy lịch khi thời gian khám còn dưới 2 giờ. Vui lòng liên hệ trực tiếp lễ tân.");
    return;
  }

  if (!confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) return;

  try {
    // Gọi API hủy lịch (SRS 4.5.4)
    await api.put(`/Appointments/${id}/cancel`)
    alert("Hủy lịch thành công.");
    fetchMyAppointments(); // Tải lại danh sách
  } catch (error) {
    alert("Lỗi khi hủy lịch: " + (error.response?.data?.message || 'Vui lòng thử lại.'));
  }
}

onMounted(() => {
  fetchMyAppointments()
})
</script>
