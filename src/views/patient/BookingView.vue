<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-8 border-b pb-4">
        <h2 class="text-2xl font-bold text-gray-800">Đặt lịch khám nha khoa</h2>
        <button @click="$router.push('/dashboard')" class="text-gray-500 hover:text-blue-600">Trở về Dashboard</button>
      </div>

      <form @submit.prevent="submitBooking" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">1. Chọn Dịch vụ</label>
            <select v-model="form.serviceId" required @change="fetchSlots" class="w-full px-4 py-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled>-- Chọn dịch vụ --</option>
              <option v-for="svc in services" :key="svc.id" :value="svc.id">
                {{ svc.name }} ({{ svc.duration }} phút - {{ formatCurrency(svc.price) }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">2. Chọn Bác sĩ</label>
            <select v-model="form.dentistId" required @change="fetchSlots" class="w-full px-4 py-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled>-- Chọn bác sĩ --</option>
              <option v-for="den in dentists" :key="den.id" :value="den.id">
                BS. {{ den.name }} ({{ den.specialty }})
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">3. Chọn Ngày khám</label>
          <input v-model="form.date" type="date" :min="today" required @change="fetchSlots" class="w-full px-4 py-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div v-if="form.serviceId && form.dentistId && form.date">
          <label class="block text-sm font-medium text-gray-700 mb-2">4. Chọn Khung giờ trống</label>

          <div v-if="isLoadingSlots" class="text-blue-500 py-4">Đang tính toán giờ trống...</div>
          <div v-else-if="availableSlots.length === 0" class="text-red-500 py-4 bg-red-50 px-4 rounded-lg">
            Bác sĩ đã kín lịch vào ngày này. Vui lòng chọn ngày hoặc bác sĩ khác!
          </div>

          <div v-else class="grid grid-cols-3 md:grid-cols-5 gap-3 mt-2">
            <button
              v-for="slot in availableSlots"
              :key="slot"
              type="button"
              @click="selectedSlot = slot"
              :class="[
                'py-2 px-3 rounded-lg border text-sm font-medium transition-all',
                selectedSlot === slot
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600'
              ]"
            >
              {{ slot }}
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-500 bg-red-50 p-3 rounded-lg text-sm">{{ errorMessage }}</div>

        <div class="pt-6 border-t">
          <button
            type="submit"
            :disabled="isBooking || !selectedSlot"
            class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {{ isBooking ? 'Đang xử lý đặt lịch...' : 'Xác nhận Đặt lịch' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/untils/axios.js'

const router = useRouter()
const today = new Date().toISOString().split('T')[0]

// State quản lý form
const services = ref([])
const dentists = ref([])
const availableSlots = ref([])
const selectedSlot = ref('')

const form = ref({
  serviceId: '',
  dentistId: '',
  date: today
})

const isLoadingSlots = ref(false)
const isBooking = ref(false)
const errorMessage = ref('')

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// Tải danh mục ban đầu
onMounted(async () => {
  try {
    const [resServices, resDentists] = await Promise.all([
      api.get('/Services'),
      api.get('/Dentists')
    ])
    services.value = resServices.data
    // Chỉ lấy bác sĩ đang hoạt động (Status = 1)
    dentists.value = resDentists.data.filter(d => d.status === 1)
  } catch (error) {
    console.error('Lỗi tải danh mục', error)
  }
})

// Gọi API lấy Slot (FR-01)
const fetchSlots = async () => {
  selectedSlot.value = ''
  if (!form.value.serviceId || !form.value.dentistId || !form.value.date) return

  isLoadingSlots.value = true
  try {
    // API Spec: GET /api/slots?date=...&dentistId=...&serviceId=...
    const response = await api.get('/Slots', {
      params: {
        date: form.value.date,
        dentistId: form.value.dentistId,
        serviceId: form.value.serviceId
      }
    })
    availableSlots.value = response.data
  } catch (error) {
    console.error('Lỗi lấy slot trống', error)
    availableSlots.value = []
  } finally {
    isLoadingSlots.value = false
  }
}

// Xử lý tạo lịch (FR-02)
const submitBooking = async () => {
  if (!selectedSlot.value) return

  isBooking.value = true
  errorMessage.value = ''

  try {
    // Tạo định dạng Datetime: "YYYY-MM-DDTHH:mm:00"
    const startTime = `${form.value.date}T${selectedSlot.value}:00`

    // Lưu ý: Lấy PatientId từ user đăng nhập (Ví dụ lưu trong LocalStorage lúc Login)
    const patientId = localStorage.getItem('patientId') || 1 // Tạm hardcode fallback 1

    await api.post('/Appointments', {
      patientId: parseInt(patientId),
      dentistId: form.value.dentistId,
      serviceId: form.value.serviceId,
      startTime: startTime
    })

    alert('Đặt lịch thành công! Đang chờ lễ tân xác nhận.')
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Có lỗi xảy ra khi đặt lịch.'
  } finally {
    isBooking.value = false
  }
}
</script>
