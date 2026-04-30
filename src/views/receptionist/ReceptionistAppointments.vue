<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Lịch hẹn (Lễ tân)</h2>
      <button @click="fetchAppointments" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition">
        Làm mới dữ liệu
      </button>
    </div>

    <!-- BẢNG DANH SÁCH LỊCH HẸN -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full text-left text-sm whitespace-nowrap">
        <thead class="bg-gray-100 uppercase tracking-wider border-b-2 border-gray-200">
          <tr>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600">ID</th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600">Bệnh nhân</th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600">Bác sĩ</th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600">Dịch vụ</th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600">Thời gian (Bắt đầu)</th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600">Ghế khám</th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600">Trạng thái</th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="appointments.length === 0">
            <td colspan="8" class="text-center py-6 text-gray-500">Không có dữ liệu lịch hẹn nào.</td>
          </tr>
          <tr v-for="app in appointments" :key="app.id" class="border-b hover:bg-gray-50 transition">
            <td class="px-6 py-4 font-medium text-gray-900">#{{ app.id }}</td>
            <td class="px-6 py-4">{{ app.patientName }}</td>
            <td class="px-6 py-4">{{ app.dentistName }}</td>
            <td class="px-6 py-4 text-blue-600">{{ app.serviceName }}</td>
            <td class="px-6 py-4 font-medium">{{ formatDateTime(app.startTime) }}</td>
            <td class="px-6 py-4">
              <span :class="app.chairName === 'Chưa gán ghế' ? 'text-orange-500 italic' : 'text-green-600 font-bold'">
                {{ app.chairName }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span :class="getStatusBadgeClass(app.statusText)" class="px-3 py-1 rounded-full text-xs font-semibold">
                {{ app.statusText }}
              </span>
            </td>
            <td class="px-6 py-4 text-center space-x-2">
              <!-- NÚT CHI TIẾT -->
              <button
                @click="viewAppointmentDetail(app.id)"
                class="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded text-sm font-medium transition border border-gray-300">
                Chi tiết
              </button>

              <button
                v-if="app.statusText === 'Pending'"
                @click="confirmAppointment(app.id)"
                class="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded text-sm font-medium transition">
                Xác nhận
              </button>

              <button
                v-if="app.statusText === 'Confirmed'"
                @click="checkInAppointment(app.id)"
                class="bg-green-500 text-white hover:bg-green-600 px-3 py-1.5 rounded text-sm font-medium transition shadow-sm">
                Check-in (Gán ghế)
              </button>

              <span v-if="app.statusText !== 'Pending' && app.statusText !== 'Confirmed'" class="text-gray-400 text-sm italic">
                Đã xử lý
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL HIỂN THỊ CHI TIẾT -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 transition-opacity">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-xl font-bold text-gray-800">Chi tiết Lịch hẹn #{{ selectedAppointment?.id }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-red-500 focus:outline-none transition">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <div v-if="isLoadingDetail" class="flex justify-center items-center py-10">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>

          <div v-else-if="selectedAppointment" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Cột trái -->
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500 font-semibold">Bệnh nhân</p>
                <p class="text-lg font-medium text-gray-900">{{ selectedAppointment.patientName }}</p>
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
                <p :class="selectedAppointment.chairName === 'Chưa gán ghế' ? 'text-orange-500' : 'text-green-600 font-bold'">
                  {{ selectedAppointment.chairName }}
                </p>
              </div>
            </div>

            <!-- Cột phải -->
            <div class="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div>
                <p class="text-sm text-gray-500 font-semibold">Thời gian dự kiến</p>
                <p class="text-gray-900">{{ formatDateTime(selectedAppointment.startTime) }}</p>
                <p class="text-gray-500 text-sm">đến {{ formatDateTime(selectedAppointment.endTime) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 font-semibold">Trạng thái hiện tại</p>
                <span :class="getStatusBadgeClass(selectedAppointment.statusText)" class="px-3 py-1 rounded-full text-sm font-semibold inline-block mt-1">
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
                <p class="text-gray-700 italic border-l-4 border-gray-300 pl-2 mt-1">{{ selectedAppointment.note }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button @click="closeModal" class="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition shadow-sm">
            Đóng
          </button>
          <button
            v-if="selectedAppointment?.statusText === 'Confirmed'"
            @click="checkInAppointment(selectedAppointment.id); closeModal()"
            class="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg font-medium transition shadow-sm">
            Check-in ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/untils/axios';

const appointments = ref([]);

// --- BIẾN TRẠNG THÁI CHO MODAL ---
const isModalOpen = ref(false);
const isLoadingDetail = ref(false);
const selectedAppointment = ref(null);

// 1. Fetch dữ liệu danh sách lịch hẹn
const fetchAppointments = async () => {
  try {
    const response = await axios.get('/appointments');
    appointments.value = response.data;
  } catch (error) {
    console.error('Lỗi khi tải danh sách:', error);
  }
};

// 2. Mở Modal & Lấy chi tiết 1 lịch hẹn
const viewAppointmentDetail = async (id) => {
  isModalOpen.value = true;
  isLoadingDetail.value = true;
  selectedAppointment.value = null; // Reset dữ liệu cũ

  try {
    // Lưu ý: Đảm bảo bạn đã thêm API GET /api/appointments/{id} vào Backend C# như hướng dẫn trước đó nhé!
    const response = await axios.get(`/appointments/${id}`);
    selectedAppointment.value = response.data;
  } catch (error) {
    alert('Không thể tải chi tiết lịch hẹn. Vui lòng thử lại!');
    isModalOpen.value = false;
  } finally {
    isLoadingDetail.value = false;
  }
};

// 3. Đóng Modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedAppointment.value = null;
};

// 4. Hàm Xác nhận lịch (Pending -> Confirmed)
const confirmAppointment = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xác nhận lịch hẹn này?')) return;
  try {
    const response = await axios.put(`/appointments/${id}/confirm`);
    alert(response.data.message || 'Xác nhận thành công!');
    await fetchAppointments();
  } catch (error) {
    alert(error.response?.data?.error || 'Xác nhận thất bại!');
  }
};

// 5. Hàm Check-in (Confirmed -> CheckedIn & Assign Chair)
const checkInAppointment = async (id) => {
  if (!confirm('Bệnh nhân đã đến? Hệ thống sẽ tự động tìm ghế trống để gán.')) return;
  try {
    const response = await axios.put(`/appointments/${id}/checkin`);
    alert(response.data.message || 'Check-in thành công và đã gán ghế!');
    await fetchAppointments();
  } catch (error) {
    alert(error.response?.data?.error || 'Check-in thất bại. Có thể phòng khám đang hết ghế trống!');
  }
};

// --- Các hàm Format giao diện ---
const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'Confirmed': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'CheckedIn': return 'bg-green-100 text-green-800 border border-green-200';
    case 'InProgress': return 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'Completed': return 'bg-gray-200 text-gray-800 border border-gray-300';
    case 'Cancelled': return 'bg-red-100 text-red-800 border border-red-200';
    case 'NoShow': return 'bg-orange-100 text-orange-800 border border-orange-200';
    default: return 'bg-gray-100 text-gray-600';
  }
};

onMounted(() => {
  fetchAppointments();
});
</script>
