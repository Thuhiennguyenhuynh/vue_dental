<!-- Thay thế toàn bộ thẻ <script setup> trong MyAppointments.vue bằng đoạn dưới đây -->
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/untils/axios.js'

const appointments = ref([])
const isLoading = ref(true)

// Thêm trạng thái 6 = NoShow theo BA Update
const getStatusText = (status) => {
  const map = {
    0: 'Chờ xác nhận',
    1: 'Đã xác nhận',
    2: 'Đã Check-in',
    3: 'Đang điều trị',
    4: 'Hoàn thành',
    5: 'Đã hủy',
    6: 'Không đến'
  }
  return map[status] || 'Không xác định'
}

const getStatusClass = (status) => {
  const map = {
    0: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    1: 'bg-blue-100 text-blue-700 border border-blue-200',
    2: 'bg-green-100 text-green-700 border border-green-200',
    3: 'bg-purple-100 text-purple-700 border border-purple-200',
    4: 'bg-gray-200 text-gray-800 border border-gray-300',
    5: 'bg-red-100 text-red-700 border border-red-200',
    6: 'bg-orange-100 text-orange-800 border border-orange-200'
  }
  return map[status] || 'bg-gray-100'
}

const getStatusBorder = (status) => {
  const map = { 0: 'bg-yellow-400', 1: 'bg-blue-500', 2: 'bg-green-500', 3: 'bg-purple-500', 4: 'bg-gray-400', 5: 'bg-red-500', 6: 'bg-orange-500' }
  return map[status] || 'bg-gray-200'
}

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Logic kiểm tra Rule BR-04: Hủy trước giờ khám ít nhất 2 giờ
const canCancel = (startTimeStr) => {
  const startTime = new Date(startTimeStr).getTime()
  const now = new Date().getTime()
  const twoHoursInMs = 2 * 60 * 60 * 1000
  return (startTime - now) >= twoHoursInMs
}

const fetchMyAppointments = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/appointments');
    const currentPatientId = parseInt(localStorage.getItem('patientId')) || 1; // Fallback tạm

    appointments.value = response.data.filter(a => a.patientId === currentPatientId || a.PatientId === currentPatientId);
  } catch (error) {
    console.error('Lỗi lấy danh sách:', error);
  } finally {
    isLoading.value = false;
  }
}

const handleCancel = async (id) => {
  if (!confirm("Bạn chắc chắn muốn hủy lịch hẹn này?")) return;
  try {
    await api.put(`/appointments/${id}/cancel`)
    alert("Hủy lịch thành công.");
    fetchMyAppointments();
  } catch (error) {
    alert("Lỗi khi hủy: " + (error.response?.data?.message || 'Không thể hủy lịch do quá hạn (cần trước 2 tiếng).'));
  }
}

onMounted(() => {
  fetchMyAppointments()
})
</script>
