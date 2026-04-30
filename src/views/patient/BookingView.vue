<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 animate-fade-in"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10 animate-slide-up">
        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          📅 Đặt Lịch Khám
        </h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Vui lòng chọn dịch vụ, bác sĩ và thời gian phù hợp với bạn.
        </p>
      </div>

      <!-- Main Layout: Grid 2 Cột -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- CỘT TRÁI: FORM CHỌN -->
        <div
          class="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden sticky top-8 border border-teal-200 dark:border-teal-900 hover:shadow-2xl transition-shadow duration-300 animate-slide-in"
        >
          <!-- Progress Bar -->
          <div
            class="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 px-6 py-4 flex justify-between items-center text-white"
          >
            <span class="font-semibold flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                ></path>
              </svg>
              Thông tin Đặt lịch
            </span>
            <span
              class="text-sm font-medium bg-teal-500 dark:bg-teal-600 px-3 py-1 rounded-full text-white"
              >📍 Bước {{ currentStep }}/3</span
            >
          </div>

          <div class="p-6 space-y-6">
            <!-- Step 1: Service Selection -->
            <div class="animate-slide-in" style="animation-delay: 0.1s">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
                >1. Chọn Dịch vụ khám <span class="text-red-500">*</span></label
              >
              <div class="relative">
                <select
                  v-model="selectedServiceId"
                  @change="checkAndFetchSlots"
                  class="block w-full pl-4 pr-10 py-3 text-base border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:ring-teal-400 sm:text-sm rounded-xl transition bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                >
                  <option value="" disabled>-- Chọn dịch vụ --</option>
                  <option v-for="srv in services" :key="srv.id" :value="srv.id">
                    {{ srv.name }} ({{ srv.duration }} phút) - {{ formatCurrency(srv.price) }}
                  </option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Step 2: Dentist Selection -->
            <div
              :class="{ 'opacity-50 pointer-events-none': !selectedServiceId }"
              class="transition-opacity duration-300 animate-slide-in"
              style="animation-delay: 0.15s"
            >
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
                >2. Chọn Bác sĩ điều trị <span class="text-red-500">*</span></label
              >
              <div class="relative">
                <select
                  v-model="selectedDentistId"
                  @change="checkAndFetchSlots"
                  class="block w-full pl-4 pr-10 py-3 text-base border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:ring-teal-400 sm:text-sm rounded-xl transition bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                >
                  <option value="" disabled>-- Chọn bác sĩ --</option>
                  <option v-for="doc in dentists" :key="doc.id" :value="doc.id">
                    BS. {{ doc.name }} - {{ doc.specialty }}
                  </option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Step 3: Date Selection -->
            <div
              :class="{ 'opacity-50 pointer-events-none': !selectedDentistId }"
              class="transition-opacity duration-300 animate-slide-in"
              style="animation-delay: 0.2s"
            >
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
                >3. Chọn Ngày khám <span class="text-red-500">*</span></label
              >
              <input
                type="date"
                v-model="selectedDate"
                @change="checkAndFetchSlots"
                :min="minDate"
                class="block w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:ring-teal-400 sm:text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-600 transition cursor-pointer"
              />
            </div>

            <!-- Notes Section -->
            <div
              class="pt-4 border-t border-gray-200 dark:border-gray-700 animate-slide-in"
              style="animation-delay: 0.25s"
            >
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
                >💬 Ghi chú cho bác sĩ (Tùy chọn)</label
              >
              <textarea
                v-model="bookingNote"
                rows="3"
                placeholder="Triệu chứng của bạn, hoặc các lưu ý đặc biệt..."
                class="block w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:ring-teal-400 sm:text-sm transition resize-none bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- CỘT PHẢI: KẾT QUẢ KHUNG GIỜ -->
        <div class="lg:col-span-7 animate-slide-up">
          <!-- State 1: Form Incomplete -->
          <div
            v-if="!isFormComplete"
            class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]"
          >
            <div
              class="w-24 h-24 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center mb-6"
            >
              <svg
                class="w-12 h-12 text-teal-600 dark:text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              📋 Chọn thông tin để xem giờ trống
            </h3>
            <p class="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
              Hãy hoàn thành việc chọn Dịch vụ, Bác sĩ và Ngày ở khung bên trái để hệ thống tính
              toán các khung giờ phù hợp nhất cho bạn.
            </p>
          </div>

          <!-- State 2: Loading -->
          <div
            v-else-if="isLoadingSlots"
            class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]"
          >
            <svg
              class="animate-spin h-16 w-16 text-teal-600 dark:text-teal-400 mb-4"
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
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
              🔍 Đang tìm kiếm khung giờ trống...
            </p>
          </div>

          <!-- State 3: Available Slots -->
          <div
            v-else
            class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-teal-200 dark:border-teal-900 hover:shadow-2xl transition-shadow duration-300"
          >
            <div
              class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 px-6 py-5 border-b border-teal-200 dark:border-teal-800"
            >
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 dark:text-green-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Khung giờ khả dụng ngày {{ formatDateDisplay(selectedDate) }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                ⏱️ Dịch vụ sẽ kéo dài khoảng {{ selectedServiceDuration }} phút.
              </p>
            </div>

            <div class="p-6">
              <!-- No slots available -->
              <div
                v-if="availableSlots.length === 0"
                class="text-center py-10 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
              >
                <svg
                  class="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p class="text-lg font-semibold text-red-700 dark:text-red-300 mb-1">
                  😞 Rất tiếc, đã hết giờ trống!
                </p>
                <p class="text-sm text-red-600 dark:text-red-400">
                  Bác sĩ đã kín lịch vào ngày này hoặc khung giờ còn lại không đủ cho dịch vụ của
                  bạn. Vui lòng chọn ngày khác.
                </p>
              </div>

              <!-- Available time slots -->
              <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <button
                  v-for="slot in availableSlots"
                  :key="slot"
                  @click="selectedSlot = slot"
                  :class="[
                    'py-3 px-2 rounded-xl text-center text-sm font-bold border-2 transition-all duration-200 transform hover:scale-105 active:scale-95',
                    selectedSlot === slot
                      ? 'bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 text-white border-teal-400 shadow-md ring-2 ring-teal-300 dark:ring-teal-700 ring-offset-1'
                      : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 shadow-sm',
                  ]"
                >
                  {{ slot }}
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <div
              class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 px-6 py-5 border-t border-teal-200 dark:border-teal-800 flex justify-between items-center"
              v-if="availableSlots.length > 0"
            >
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Giờ đã chọn:
                <span v-if="selectedSlot" class="text-teal-600 dark:text-teal-400 font-bold text-lg"
                  >⏰ {{ selectedSlot }}</span
                ><span v-else class="italic text-gray-500">Chưa chọn giờ</span>
              </p>
              <button
                @click="submitBooking"
                :disabled="!selectedSlot || isSubmitting"
                :class="[
                  'px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center',
                  !selectedSlot || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl',
                ]"
              >
                <svg
                  v-if="isSubmitting"
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                {{ isSubmitting ? 'Đang xử lý...' : 'Xác nhận Đặt Lịch' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/untils/axios'

const router = useRouter()

// Dữ liệu danh mục
const services = ref([])
const dentists = ref([])

// State Form
const selectedServiceId = ref('')
const selectedDentistId = ref('')
// Set minDate là ngày hôm nay để không chọn được quá khứ
const minDate = new Date().toISOString().split('T')[0]
const selectedDate = ref('')
const bookingNote = ref('')

// State Kết quả & Loading
const availableSlots = ref([])
const selectedSlot = ref('')
const isLoadingSlots = ref(false)
const isSubmitting = ref(false)

// Giả lập lấy ID của User đang đăng nhập (PatientId). Trong thực tế, bạn lấy từ Vuex Store hoặc localStorage sau khi login.
const currentPatientId = ref(1) // TODO: Thay bằng ID thật của user

// --- COMPUTED PROPERTIES ---

// Tính toán bước hiện tại
const currentStep = computed(() => {
  if (!selectedServiceId.value) return 1
  if (!selectedDentistId.value) return 2
  return 3
})

// Kiểm tra xem đã chọn đủ 3 trường chưa
const isFormComplete = computed(() => {
  return selectedServiceId.value && selectedDentistId.value && selectedDate.value
})

// Lấy thông tin duration để hiển thị
const selectedServiceDuration = computed(() => {
  const service = services.value.find((s) => s.id === selectedServiceId.value)
  return service ? service.duration : 0
})

// --- LẤY DỮ LIỆU BAN ĐẦU ---
onMounted(async () => {
  try {
    const [resServices, resDentists] = await Promise.all([
      axios.get('/services'), // Đảm bảo API này đã có ở Backend
      axios.get('/dentists'), // Đảm bảo API này đã có ở Backend
    ])
    services.value = resServices.data

    // Chỉ lấy bác sĩ đang Active (Status = 1) theo rule SRS
    dentists.value = resDentists.data.filter((d) => d.status === 1)
  } catch (error) {
    console.error('Lỗi khi tải danh mục:', error)
    alert('Có lỗi xảy ra khi tải dữ liệu dịch vụ và bác sĩ.')
  }
})

// --- LOGIC TÌM GIỜ TRỐNG ---
const checkAndFetchSlots = async () => {
  // Reset selected slot khi đổi bất kỳ option nào
  selectedSlot.value = ''

  if (isFormComplete.value) {
    isLoadingSlots.value = true
    try {
      // Gọi API /api/slots với ĐỦ 3 tham số theo chuẩn Backend mới sửa
      const response = await axios.get('/slots', {
        params: {
          dentistId: selectedDentistId.value,
          serviceId: selectedServiceId.value,
          date: selectedDate.value,
        },
      })
      availableSlots.value = response.data
    } catch (error) {
      console.error('Lỗi fetch slots:', error)
      availableSlots.value = []
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      }
    } finally {
      isLoadingSlots.value = false
    }
  } else {
    availableSlots.value = []
  }
}

// --- LOGIC ĐẶT LỊCH ---
const submitBooking = async () => {
  if (!selectedSlot.value) return

  isSubmitting.value = true
  try {
    // Format lại startTime thành DateTime string hoàn chỉnh để gửi Backend
    const startDateTimeStr = `${selectedDate.value}T${selectedSlot.value}:00`

    const requestPayload = {
      patientId: currentPatientId.value,
      dentistId: selectedDentistId.value,
      serviceId: selectedServiceId.value,
      startTime: startDateTimeStr,
      note: bookingNote.value,
      bookingSource: 'Online', // Hardcode theo yêu cầu của SRS
    }

    const response = await axios.post('/appointments', requestPayload)

    alert('🎉 Đặt lịch thành công! Cảm ơn bạn đã sử dụng dịch vụ.')

    // Có thể điều hướng về trang Lịch sử của bệnh nhân (MyAppointments)
    // router.push('/patient/my-appointments');

    // Reset form
    selectedServiceId.value = ''
    selectedDentistId.value = ''
    selectedDate.value = ''
    selectedSlot.value = ''
    bookingNote.value = ''
    availableSlots.value = []
  } catch (error) {
    console.error('Lỗi đặt lịch:', error)
    alert(error.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại sau.')
  } finally {
    isSubmitting.value = false
  }
}

// --- Utils Format ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const formatDateDisplay = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
