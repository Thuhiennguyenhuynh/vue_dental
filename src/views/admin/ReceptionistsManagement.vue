<template>
  <div class="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-md dark:shadow-lg border border-teal-200 dark:border-teal-900 hover:shadow-lg transition-shadow duration-300 animate-fade-in">
    <div class="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">👩‍💼 Quản lý Lễ tân</h2>

      <button
        @click="$router.push('/admin/create-staff')"
        class="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 hover:from-teal-700 hover:to-cyan-700 dark:hover:from-teal-600 dark:hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
      >
        <span>➕</span> Cấp tài khoản mới
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 text-gray-700 dark:text-gray-300 border-b-2 border-teal-200 dark:border-teal-800">
            <th class="p-4 font-semibold">ID User</th>
            <th class="p-4 font-semibold">Tên đăng nhập (Username)</th>
            <th class="p-4 font-semibold">Vai trò</th>
            <th class="p-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="isLoading && receptionists.length === 0">
            <td colspan="4" class="p-4 text-center text-gray-500 dark:text-gray-400 py-8">⏳ Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="receptionists.length === 0">
            <td colspan="4" class="p-4 text-center text-gray-500 dark:text-gray-400 py-12">📭 Chưa có tài khoản Lễ tân nào trong hệ thống.</td>
          </tr>
          <tr
            v-for="staff in receptionists"
            :key="staff.id"
            class="border-b border-gray-200 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors duration-200"
          >
            <td class="p-4 text-gray-600 dark:text-gray-400">#{{ staff.id }}</td>
            <td class="p-4 font-medium text-gray-800 dark:text-gray-100">{{ staff.username }}</td>
            <td class="p-4">
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-300 dark:border-purple-700">
                👩‍💼 {{ staff.role }}
              </span>
            </td>
            <td class="p-4 text-right">
              <button
                @click="deleteReceptionist(staff.id)"
                class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 bg-red-50 dark:bg-red-900/30 rounded font-medium transition-colors"
              >
                Xóa tài khoản
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
