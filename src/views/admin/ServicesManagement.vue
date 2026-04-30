<template>
  <div class="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-md border border-teal-200">
    <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý dịch vụ</h2>
      <button @click="openModal()" class="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium shadow-md">
        + Thêm dịch vụ
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-teal-50 border-b-2 border-teal-200">
            <th class="p-4 font-semibold">ID</th>
            <th class="p-4 font-semibold">Tên dịch vụ</th>
            <th class="p-4 font-semibold">Thời lượng</th>
            <th class="p-4 font-semibold">Đơn giá</th>
            <th class="p-4 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="isLoading">
            <td colspan="5" class="p-4 text-center text-gray-500 py-8">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="services.length === 0">
            <td colspan="5" class="p-4 text-center text-gray-500 py-12">Chưa có dịch vụ nào trong hệ thống.</td>
          </tr>
          <tr v-for="service in services" :key="service.id" class="hover:bg-teal-50 transition-colors">
            <td class="p-4 text-gray-600">#{{ service.id }}</td>
            <td class="p-4 font-medium text-gray-800">{{ service.name }}</td>
            <td class="p-4 text-gray-700">{{ service.duration }} phút</td>
            <td class="p-4 text-teal-600 font-semibold">{{ formatCurrency(service.price) }}</td>
            <td class="p-4 text-right space-x-2">
              <button @click="openModal(service)" class="text-yellow-600 bg-yellow-50 px-3 py-1 rounded">Sửa</button>
              <button @click="deleteService(service.id)" class="text-red-600 bg-red-50 px-3 py-1 rounded">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
          {{ isEditing ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới' }}
        </h3>
        <form @submit.prevent="saveService" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ <span class="text-red-500">*</span></label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút) <span class="text-red-500">*</span></label>
              <input v-model.number="form.duration" type="number" min="15" step="15" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VNĐ) <span class="text-red-500">*</span></label>
              <input v-model.number="form.price" type="number" min="0" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
          </div>

          <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>

          <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Hủy</button>
            <button type="submit" :disabled="isSaving" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
              {{ isSaving ? 'Đang lưu...' : 'Lưu' }}
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

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const fetchServices = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/Services')
    services.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách:', error)
  } finally {
    isLoading.value = false
  }
}

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
    fetchServices()
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Có lỗi xảy ra khi lưu'
  } finally {
    isSaving.value = false
  }
}

const deleteService = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?')) {
    try {
      await api.delete(`/Services/${id}`)
      fetchServices()
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Không thể xóa dịch vụ do đang có lịch hẹn gắn với dịch vụ này.')
    }
  }
}

onMounted(() => {
  fetchServices()
})
</script>
