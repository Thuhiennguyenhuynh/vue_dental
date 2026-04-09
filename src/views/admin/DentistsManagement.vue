<template>
  <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-6 border-b pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Bác sĩ (Nha sĩ)</h2>

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
            <th class="p-4 font-semibold">ID</th>
            <th class="p-4 font-semibold">Họ và tên</th>
            <th class="p-4 font-semibold">Chuyên khoa</th>
            <th class="p-4 font-semibold text-center">Trạng thái</th>
            <th class="p-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading && dentists.length === 0">
            <td colspan="5" class="p-4 text-center text-gray-500">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="dentists.length === 0">
            <td colspan="5" class="p-4 text-center text-gray-500">Chưa có nha sĩ nào trong hệ thống.</td>
          </tr>
          <tr
            v-for="dentist in dentists"
            :key="dentist.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="p-4 text-gray-500">#{{ dentist.id }}</td>
            <td class="p-4 font-medium text-gray-800">{{ dentist.name }}</td>
            <td class="p-4 text-gray-600">{{ dentist.specialty }}</td>
            <td class="p-4 text-center">
              <span v-if="dentist.status === 1" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Đang làm việc
              </span>
              <span v-else class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                Tạm ngưng
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button @click="openEditModal(dentist)" class="text-yellow-500 hover:text-yellow-600 px-2 py-1 bg-yellow-50 rounded">Sửa</button>
              <button @click="deleteDentist(dentist.id)" class="text-red-500 hover:text-red-600 px-2 py-1 bg-red-50 rounded">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden">
        <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
          Cập nhật thông tin Nha sĩ
        </h3>

        <form @submit.prevent="updateDentist" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
            <input v-model="form.specialty" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select v-model.number="form.status" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option :value="1">Đang làm việc</option>
              <option :value="0">Tạm ngưng</option>
            </select>
          </div>

          <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>

          <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Hủy</button>
            <button type="submit" :disabled="isSaving" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
              {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/untils/axios.js'

const dentists = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')

const currentId = ref(null)
const form = ref({
  name: '',
  specialty: '',
  status: 1
})

// Lấy danh sách nha sĩ
const fetchDentists = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/Dentists')
    dentists.value = response.data
  } catch (error) {
    console.error('Lỗi tải danh sách nha sĩ:', error)
  } finally {
    isLoading.value = false
  }
}

// Mở Modal sửa
const openEditModal = (dentist) => {
  currentId.value = dentist.id
  form.value = {
    name: dentist.name,
    specialty: dentist.specialty,
    status: dentist.status
  }
  errorMessage.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Lưu thông tin cập nhật (Gọi API PUT)
const updateDentist = async () => {
  isSaving.value = true
  errorMessage.value = ''
  try {
    await api.put(`/Dentists/${currentId.value}`, form.value)
    closeModal()
    fetchDentists() // Tải lại danh sách
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Có lỗi xảy ra khi lưu.'
  } finally {
    isSaving.value = false
  }
}

// Xóa nha sĩ
const deleteDentist = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa nha sĩ này? Lưu ý: Không thể xóa nếu họ đã có lịch khám.')) {
    try {
      await api.delete(`/Dentists/${id}`)
      fetchDentists()
    } catch (error) {
      // Bắt lỗi InvalidOperationException từ C# (Đã có lịch khám)
      const msg = error.response?.data?.error || 'Không thể xóa nha sĩ này.'
      alert('LỖI: ' + msg)
    }
  }
}

onMounted(() => {
  fetchDentists()
})
</script>
