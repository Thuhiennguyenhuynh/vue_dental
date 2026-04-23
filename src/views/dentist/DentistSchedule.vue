<template>
  <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-8 border-b pb-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Lịch làm việc của tôi</h2>
        <p class="text-sm text-gray-500">Danh sách bệnh nhân cần điều trị hôm nay</p>
      </div>
      <div class="bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-bold">
        {{ new Date().toLocaleDateString('vi-VN') }}
      </div>
    </div>

    <div v-if="loading" class="text-center py-10 text-blue-500 animate-pulse">Đang tải lịch khám...</div>

    <div v-else-if="appointments.length === 0" class="text-center py-12 text-gray-400 italic">
      Hôm nay bạn không có lịch hẹn nào.
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="app in appointments"
        :key="app.id"
        class="flex items-center justify-between p-5 border rounded-xl hover:shadow-md transition-shadow"
        :class="app.statusText === 'InTreatment' ? 'border-purple-200 bg-purple-50' : 'bg-white'"
      >
        <div class="flex gap-6 items-center">
          <div class="text-center border-r pr-6">
            <div class="text-xl font-bold text-blue-600">{{ formatTime(app.startTime) }}</div>
            <div class="text-xs text-gray-400">Bắt đầu</div>
          </div>

          <div>
            <div class="font-bold text-lg text-gray-800">{{ app.patientName }}</div>
            <div class="text-sm text-gray-600">{{ app.serviceName }} — <span class="font-medium">Ghế: {{ app.chairName }}</span></div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span :class="getStatusClass(app.statusText)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            {{ app.statusText }}
          </span>

          <button
            v-if="app.statusText === 'CheckedIn'"
            @click="updateStatus(app.id, 3)"
            class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition"
          >
            Bắt đầu khám
          </button>

          <button
            v-if="app.statusText === 'InTreatment'"
            @click="updateStatus(app.id, 4)"
            class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition"
          >
            Hoàn thành
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/untils/axios.js';

const appointments = ref([]);
const loading = ref(true);

const fetchSchedule = async () => {
  loading.value = true;
  try {
    const dentistId = localStorage.getItem('dentistId') || 1; // Lấy ID nha sĩ từ storage
    const response = await api.get(`/appointments/dentist/${dentistId}`);
    // Chỉ lấy lịch trong ngày hôm nay
    const today = new Date().toISOString().split('T')[0];
    appointments.value = response.data.filter(a => a.startTime.startsWith(today));
  } catch (error) {
    console.error("Lỗi tải lịch:", error);
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (id, status) => {
  try {
    await api.put(`/appointments/${id}`, { status });
    fetchSchedule();
  } catch (error) {
    alert("Không thể cập nhật trạng thái");
  }
};

const getStatusClass = (status) => {
  const map = {
    'CheckedIn': 'bg-green-100 text-green-700',
    'InTreatment': 'bg-purple-100 text-purple-700',
    'Completed': 'bg-gray-100 text-gray-600'
  };
  return map[status] || 'bg-blue-100 text-blue-700';
};

const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

onMounted(fetchSchedule);
</script>
