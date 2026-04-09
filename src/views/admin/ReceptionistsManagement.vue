<template>
  <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-6 border-b pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Lễ tân</h2>

      <button
        @click="$router.push('/admin/create-staff')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
      >
        <span>+</span> Cấp tài khoản mới
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 text-gray-600 border-b border-gray-200">
            <th class="p-4 font-semibold">ID User</th>
            <th class="p-4 font-semibold">Tên đăng nhập (Username)</th>
            <th class="p-4 font-semibold">Vai trò</th>
            <th class="p-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading && receptionists.length === 0">
            <td colspan="4" class="p-4 text-center text-gray-500">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="receptionists.length === 0">
            <td colspan="4" class="p-4 text-center text-gray-500">Chưa có tài khoản Lễ tân nào trong hệ thống.</td>
          </tr>
          <tr
            v-for="staff in receptionists"
            :key="staff.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="p-4 text-gray-500">#{{ staff.id }}</td>
            <td class="p-4 font-medium text-gray-800">{{ staff.username }}</td>
            <td class="p-4">
              <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {{ staff.role }}
              </span>
            </td>
            <td class="p-4 text-right">
              <button
                @click="deleteReceptionist(staff.id)"
                class="text-red-500 hover:text-red-600 px-3 py-1 bg-red-50 rounded font-medium"
              >
                Xóa tài khoản
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/untils/axios.js'

const receptionists = ref([])
const isLoading = ref(false)

// Gọi API lấy danh sách
const fetchReceptionists = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/Admin/receptionists')
    receptionists.value = response.data
  } catch (error) {
    console.error('Lỗi tải danh sách lễ tân:', error)
  } finally {
    isLoading.value = false
  }
}

// Gọi API xóa tài khoản
const deleteReceptionist = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa tài khoản lễ tân này vĩnh viễn?')) {
    try {
      await api.delete(`/Admin/receptionists/${id}`)
      fetchReceptionists() // Load lại bảng sau khi xóa
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể xóa tài khoản này.')
    }
  }
}

onMounted(() => {
  fetchReceptionists()
})
</script>
