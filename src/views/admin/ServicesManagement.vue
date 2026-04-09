<template>
  <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-6 border-b pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Dịch vụ</h2>
      <button
        @click="openModal()"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
      >
        <span>+</span> Thêm dịch vụ
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 text-gray-600 border-b border-gray-200">
            <th class="p-4 font-semibold">ID</th>
            <th class="p-4 font-semibold">Tên dịch vụ</th>
            <th class="p-4 font-semibold">Thời lượng</th>
            <th class="p-4 font-semibold">Đơn giá</th>
            <th class="p-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading && services.length === 0">
            <td colspan="5" class="p-4 text-center text-gray-500">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="services.length === 0">
            <td colspan="5" class="p-4 text-center text-gray-500">Chưa có dịch vụ nào trong hệ thống.</td>
          </tr>
          <tr
            v-for="service in services"
            :key="service.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="p-4 text-gray-500">#{{ service.id }}</td>
            <td class="p-4 font-medium text-gray-800">{{ service.name }}</td>
            <td class="p-4 text-gray-600">{{ service.duration }} phút</td>
            <td class="p-4 text-blue-600 font-semibold">{{ formatCurrency(service.price) }}</td>
            <td class="p-4 text-right space-x-2">
              <button @click="openModal(service)" class="text-yellow-500 hover:text-yellow-600 px-2 py-1 bg-yellow-50 rounded">Sửa</button>
              <button @click="deleteService(service.id)" class="text-red-500 hover:text-red-600 px-2 py-1 bg-red-50 rounded">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden">
        <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
          {{ isEditing ? 'Cập nhật Dịch vụ' : 'Thêm Dịch vụ mới' }}
        </h3>

        <form @submit.prevent="saveService" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Nhổ răng khôn" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút)</label>
              <input v-model.number="form.duration" type="number" min="1" max="300" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: 30" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VNĐ)</label>
              <input v-model.number="form.price" type="number" min="0" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: 500000" />
            </div>
          </div>

          <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>

          <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Hủy</button>
            <button type="submit" :disabled="isSaving" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
              {{ isSaving ? 'Đang lưu...' : 'Lưu dữ liệu' }}
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

// State
const services = ref([])
const isLoading = ref(false)
const isSaving = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const errorMessage = ref('')
const currentId = ref(null)

const form = ref({
  name: '',
  duration: 30,
  price: 0
})

// Tiện ích format tiền tệ Việt Nam
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// 1. LẤY DANH SÁCH DỊCH VỤ (GET)
const fetchServices = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/Services')
    services.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách dịch vụ:', error)
    alert('Không thể tải danh sách dịch vụ. Vui lòng thử lại.')
  } finally {
    isLoading.value = false
  }
}

// 2. MỞ MODAL (Dùng chung cho cả Thêm và Sửa)
const openModal = (service = null) => {
  errorMessage.value = ''
  if (service) {
    isEditing.value = true
    currentId.value = service.id
    form.value = {
      name: service.name,
      duration: service.duration,
      price: service.price
    }
  } else {
    isEditing.value = false
    currentId.value = null
    form.value = { name: '', duration: 30, price: 0 }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// 3. LƯU DỮ LIỆU (POST / PUT)
const saveService = async () => {
  isSaving.value = true
  errorMessage.value = ''
  try {
    if (isEditing.value) {
      await api.put(`/Services/${currentId.value}`, form.value)
    } else {
      await api.post('/Services', form.value)
    }
    closeModal()
    fetchServices() // Tải lại danh sách sau khi lưu thành công
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.response?.data?.title || 'Có lỗi xảy ra khi lưu.'
  } finally {
    isSaving.value = false
  }
}

// 4. XÓA DỮ LIỆU (DELETE)
const deleteService = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?')) {
    try {
      await api.delete(`/Services/${id}`)
      fetchServices() // Tải lại danh sách
    } catch (error) {
      // Bắt lỗi khi dịch vụ đã có người đặt (lỗi InvalidOperationException từ Backend)
      const errorMsg = error.response?.data?.error || 'Không thể xóa dịch vụ này.'
      alert(errorMsg)
    }
  }
}

// Chạy fetchServices khi component được render
onMounted(() => {
  fetchServices()
})
</script>
