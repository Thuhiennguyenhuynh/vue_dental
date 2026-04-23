<template>
  <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Tiếp nhận & Duyệt lịch</h2>
        <p class="text-sm text-gray-500 mt-1">Quản lý danh sách bệnh nhân đến khám trong ngày</p>
      </div>

      <div class="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border">
        <label class="text-xs font-bold text-gray-400 uppercase ml-2">Ngày trực:</label>
        <input
          type="date"
          v-model="filterDate"
          @change="fetchAppointments"
          class="bg-transparent border-none outline-none text-blue-600 font-bold"
        />
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr class="text-gray-400 text-xs uppercase tracking-wider">
            <th class="px-4 py-2">Thời gian</th>
            <th class="px-4 py-2">Bệnh nhân</th>
            <th class="px-4 py-2">Dịch vụ & Bác sĩ</th>
            <th class="px-4 py-2">Ghế khám</th>
            <th class="px-4 py-2 text-center">Trạng thái</th>
            <th class="px-4 py-2 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="text-center">
            <td colspan="6" class="py-10 text-blue-500 font-medium animate-pulse">Đang tải danh sách lịch hẹn...</td>
          </tr>
          <tr v-else-if="appointments.length === 0" class="text-center">
            <td colspan="6" class="py-10 text-gray-400 italic bg-gray-50 rounded-xl">Không có lịch hẹn nào cho ngày này.</td>
          </tr>

          <tr
            v-for="app in appointments"
            :key="app.id"
            class="bg-white hover:bg-blue-50 transition-colors shadow-sm ring-1 ring-gray-100 rounded-lg"
          >
            <td class="px-4 py-4">
              <div class="text-lg font-bold text-blue-700">
                {{ formatTime(app.startTime) }}
              </div>
              <div class="text-xs text-gray-400">{{ formatDate(app.startTime) }}</div>
            </td>
            <td class="px-4 py-4">
              <div class="font-bold text-gray-800">{{ app.patientName }}</div>
              <div class="text-xs text-gray-500">Mã: #{{ app.id }}</div>
            </td>
            <td class="px-4 py-4">
              <div class="text-sm font-medium text-gray-700">{{ app.serviceName }}</div>
              <div class="text-xs text-blue-500">BS. {{ app.dentistName }}</div>
            </td>
            <td class="px-4 py-4 font-medium text-gray-600">
              {{ app.chairName || 'Chưa gán ghế' }}
            </td>
            <td class="px-4 py-4 text-center">
              <span :class="getStatusClass(app.statusText)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                {{ app.statusText }}
              </span>
            </td>
            <td class="px-4 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button
                  v-if="app.statusText === 'Pending'"
                  @click="handleAction(app.id, 1, 'duyệt lịch')"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm"
                >
                  Duyệt lịch
                </button>

                <button
                  v-if="app.statusText === 'Confirmed'"
                  @click="handleAction(app.id, 2, 'check-in')"
                  class="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition shadow-sm"
                >
                  Check-in
                </button>

                <button
                  v-if="['Pending', 'Confirmed'].includes(app.statusText)"
                  @click="handleCancel(app.id)"
                  class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                  title="Hủy lịch"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/untils/axios.js';

const appointments = ref([]);
const loading = ref(true);
const filterDate = ref(new Date().toISOString().split('T')[0]);

const fetchAppointments = async () => {
  loading.value = true;
  try {
    const response = await api.get('/appointments');
    // Lọc lịch theo ngày đang chọn
    appointments.value = response.data.filter(a => a.startTime.startsWith(filterDate.value));
  } catch (error) {
    console.error("Lỗi:", error);
  } finally {
    loading.value = false;
  }
};

const handleAction = async (id, status, label) => {
  if (!confirm(`Bạn có chắc muốn ${label} này?`)) return;
  try {
    await api.put(`/appointments/${id}`, { status });
    alert("Cập nhật thành công!");
    fetchAppointments();
  } catch (error) {
    alert(error.response?.data?.Error || "Có lỗi xảy ra");
  }
};

const handleCancel = async (id) => {
  if (!confirm("Hủy lịch hẹn này?")) return;
  try {
    await api.delete(`/appointments/${id}`);
    alert("Đã hủy lịch!");
    fetchAppointments();
  } catch (error) {
    alert(error.response?.data?.Error || "Không thể hủy");
  }
};

const getStatusClass = (status) => {
  const map = {
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Confirmed': 'bg-blue-100 text-blue-700',
    'CheckedIn': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
    'Completed': 'bg-gray-100 text-gray-600'
  };
  return map[status] || 'bg-gray-100';
};

const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN');

onMounted(fetchAppointments);
</script>
