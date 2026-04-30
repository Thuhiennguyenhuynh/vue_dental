<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Ghế Khám</h2>
      <button @click="openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md font-medium transition flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Thêm Ghế mới
      </button>
    </div>

    <!-- BẢNG DANH SÁCH GHẾ -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full text-left text-sm whitespace-nowrap">
        <thead class="bg-gray-100 uppercase tracking-wider border-b border-gray-200">
          <tr>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600">ID</th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600">Tên Ghế / Phòng</th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600">Trạng thái hoạt động</th>
            <th scope="col" class="px-6 py-4 font-semibold text-gray-600 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading" class="border-b">
            <td colspan="4" class="text-center py-8 text-gray-500">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="chairs.length === 0" class="border-b">
            <td colspan="4" class="text-center py-8 text-gray-500">Chưa có dữ liệu ghế khám nào.</td>
          </tr>
          <tr v-for="chair in chairs" :key="chair.id" class="border-b hover:bg-gray-50 transition">
            <td class="px-6 py-4 font-medium text-gray-900">#{{ chair.id }}</td>
            <td class="px-6 py-4 text-gray-800 font-medium">{{ chair.name }}</td>
            <td class="px-6 py-4">
              <!-- SRS quy định: 1 = Available, 0 = Maintenance -->
              <span v-if="chair.status === 1" class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                Sẵn sàng (Available)
              </span>
              <span v-else class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                Đang bảo trì (Maintenance)
              </span>
            </td>
            <td class="px-6 py-4 text-center space-x-3">
              <button @click="openModal(chair)" class="text-blue-600 hover:text-blue-800 font-medium">Sửa</button>
              <button @click="deleteChair(chair.id)" class="text-red-600 hover:text-red-800 font-medium">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL THÊM/SỬA GHẾ -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-xl font-bold text-gray-800">{{ isEditing ? 'Cập nhật Ghế' : 'Thêm Ghế mới' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-red-500 focus:outline-none transition">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form @submit.prevent="saveChair" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Tên Ghế / Số Phòng <span class="text-red-500">*</span></label>
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="VD: Ghế VIP 1, Phòng 2 - Ghế A..."
              class="block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Trạng thái <span class="text-red-500">*</span></label>
            <select
              v-model="formData.status"
              required
              class="block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option :value="1">Sẵn sàng hoạt động</option>
              <option :value="0">Đang bảo trì / Hỏng hóc</option>
            </select>
            <p class="text-xs text-gray-500 mt-1 italic">Hệ thống sẽ không tự động gán khách vào ghế đang bảo trì.</p>
          </div>

          <div class="pt-4 flex justify-end space-x-3">
            <button type="button" @click="closeModal" class="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-xl font-medium transition">
              Hủy
            </button>
            <button type="submit" :disabled="isSubmitting" class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl font-medium transition flex items-center">
               <span v-if="isSubmitting" class="mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
              {{ isSubmitting ? 'Đang lưu...' : 'Lưu dữ liệu' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/untils/axios';

const chairs = ref([]);
const isLoading = ref(false);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const isEditing = ref(false);

const formData = ref({
  id: null,
  name: '',
  status: 1 // Default là Sẵn sàng
});

// Fetch dữ liệu
const fetchChairs = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/chairs');
    chairs.value = response.data;
  } catch (error) {
    console.error('Lỗi lấy danh sách ghế:', error);
  } finally {
    isLoading.value = false;
  }
};

// Modal handlers
const openModal = (chair = null) => {
  if (chair) {
    isEditing.value = true;
    formData.value = { ...chair };
  } else {
    isEditing.value = false;
    formData.value = { id: null, name: '', status: 1 };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Lưu dữ liệu (Create/Update)
const saveChair = async () => {
  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      await axios.put(`/chairs/${formData.value.id}`, formData.value);
      alert('Cập nhật ghế thành công!');
    } else {
      await axios.post('/chairs', { name: formData.value.name, status: formData.value.status });
      alert('Thêm ghế mới thành công!');
    }
    closeModal();
    fetchChairs();
  } catch (error) {
    alert('Có lỗi xảy ra khi lưu dữ liệu!');
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

// Xóa ghế
const deleteChair = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa ghế này không?')) return;
  try {
    await axios.delete(`/chairs/${id}`);
    alert('Đã xóa ghế thành công!');
    fetchChairs();
  } catch (error) {
    alert('Không thể xóa ghế này (có thể ghế đang được gắn với lịch hẹn).');
  }
};

onMounted(() => {
  fetchChairs();
});
</script>
