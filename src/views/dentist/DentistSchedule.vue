<template>
  <div
    class="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg border border-teal-200 dark:border-teal-900 hover:shadow-lg transition-shadow duration-300 animate-fade-in"
  >
    <!-- Header -->
    <div
      class="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Lịch làm việc của tôi</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Danh sách bệnh nhân cần điều trị hôm nay
        </p>
      </div>
      <div
        class="bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40 px-4 py-2 rounded-lg text-teal-700 dark:text-teal-300 font-bold transition-all duration-300"
      >
        📅 {{ new Date().toLocaleDateString('vi-VN') }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <svg
        class="animate-spin h-8 w-8 mx-auto text-teal-600 dark:text-teal-400 mb-2"
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
      <p class="text-teal-600 dark:text-teal-400 font-medium">Đang tải lịch khám...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="appointments.length === 0" class="text-center py-12">
      <div class="text-4xl mb-2">📭</div>
      <p class="text-gray-500 dark:text-gray-400 italic">Hôm nay bạn không có lịch hẹn nào.</p>
    </div>

    <!-- Appointments List -->
    <div v-else class="grid gap-4">
      <div
        v-for="app in appointments"
        :key="app.id"
        class="flex items-center justify-between p-5 border-2 rounded-xl hover:shadow-lg transition-all duration-300 animate-slide-up"
        :class="
          app.statusText === 'InTreatment'
            ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 hover:border-teal-300 dark:hover:border-teal-700'
        "
      >
        <div class="flex gap-6 items-center flex-1">
          <!-- Time Section -->
          <div class="text-center border-r border-gray-300 dark:border-gray-600 pr-6 min-w-20">
            <div class="text-xl font-bold text-teal-600 dark:text-teal-400">
              {{ formatTime(app.startTime) }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Bắt đầu</div>
          </div>

          <!-- Patient Info -->
          <div>
            <div class="font-bold text-lg text-gray-800 dark:text-gray-100">
              {{ app.patientName }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ app.serviceName }} —
              <span class="font-medium text-teal-600 dark:text-teal-400"
                >Ghế: {{ app.chairName }}</span
              >
            </div>
          </div>
        </div>

        <!-- Status & Actions -->
        <div class="flex items-center gap-4">
          <span
            :class="getStatusClass(app.statusText)"
            class="px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all duration-200"
          >
            {{ app.statusText }}
          </span>

          <button
            v-if="app.statusText === 'CheckedIn'"
            @click="updateStatus(app.id, 3)"
            class="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            🏥 Bắt đầu khám
          </button>

          <button
            v-if="app.statusText === 'InTreatment'"
            @click="updateStatus(app.id, 4)"
            class="bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            ✓ Hoàn thành
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/untils/axios.js'

const appointments = ref([])
const loading = ref(true)

const fetchSchedule = async () => {
  loading.value = true
  try {
    const dentistId = localStorage.getItem('dentistId') || 1 // Lấy ID nha sĩ từ storage
    const response = await api.get(`/appointments/dentist/${dentistId}`)
    // Chỉ lấy lịch trong ngày hôm nay
    const today = new Date().toISOString().split('T')[0]
    appointments.value = response.data.filter((a) => a.startTime.startsWith(today))
  } catch (error) {
    console.error('Lỗi tải lịch:', error)
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id, status) => {
  try {
    await api.put(`/appointments/${id}`, { status })
    fetchSchedule()
  } catch (error) {
    alert('Không thể cập nhật trạng thái')
  }
}

const getStatusClass = (status) => {
  const map = {
    CheckedIn:
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700',
    InTreatment:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700',
    Completed:
      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600',
  }
  return (
    map[status] ||
    'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700'
  )
}

const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

onMounted(fetchSchedule)
</script>
