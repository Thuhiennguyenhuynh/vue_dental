<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <aside class="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white flex flex-col shadow-xl">
      <div class="p-6 text-2xl font-bold border-b border-blue-700 text-center flex flex-col items-center">
        <span>🦷 Dental Clinic</span>
        <span class="text-xs font-medium mt-2 px-3 py-1 bg-blue-700 rounded-full text-blue-100">
          Vai trò: {{ userRole }}
        </span>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="block px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-blue-700 hover:translate-x-1 flex items-center gap-3"
          active-class="bg-blue-600 shadow-md"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-blue-700">
        <button
          @click="handleLogout"
          class="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5"
        >
          🚪 Đăng xuất
        </button>
      </div>
    </aside>

    <main class="flex-1 p-8 overflow-y-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-800">Tổng quan hệ thống</h1>
          <p class="text-gray-500 mt-1">Chào mừng bạn quay trở lại, <span class="font-bold text-blue-600">{{ username }}</span>!</p>
        </div>
      </div>

      <div v-if="userRole === 'Patient'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 flex items-center justify-between">
          <div>
            <h3 class="text-gray-500 font-medium mb-1">Lịch khám sắp tới</h3>
            <p class="text-2xl font-bold text-gray-800">Chưa có lịch</p>
          </div>
          <div class="p-3 bg-blue-50 rounded-full text-blue-500 text-2xl">📅</div>
        </div>

        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl shadow-md text-white flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow" @click="router.push('/booking')">
          <div>
            <h3 class="font-medium mb-1 opacity-90">Cần khám răng?</h3>
            <p class="text-2xl font-bold">Đặt lịch ngay ➔</p>
          </div>
          <div class="text-4xl opacity-80">🦷</div>
        </div>
      </div>

      <div v-else-if="userRole === 'Admin' || userRole === 'Receptionist'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 font-medium">Lịch khám hôm nay</h3>
          <p class="text-4xl font-bold text-blue-600 mt-2">12</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 font-medium">Bệnh nhân chờ duyệt</h3>
          <p class="text-4xl font-bold text-yellow-500 mt-2">5</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 font-medium">Nha sĩ đang rảnh</h3>
          <p class="text-4xl font-bold text-green-500 mt-2">2</p>
        </div>
      </div>

      <div v-else-if="userRole === 'Dentist'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 font-medium">Ca khám của tôi hôm nay</h3>
          <p class="text-4xl font-bold text-purple-600 mt-2">4</p>
        </div>
      </div>

      <div class="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
        <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Khu vực làm việc</h2>
        <p class="text-gray-500 italic">Dữ liệu từ API sẽ được hiển thị ở đây trong các bước tiếp theo...</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userRole = ref('')
const username = ref('Bạn')

// Danh sách Menu cấu hình trước cho từng Role
const roleMenus = {
  Patient: [
    { name: 'Trang chủ', path: '/dashboard', icon: '🏠' },
    { name: 'Đặt lịch khám mới', path: '/booking', icon: '📅' }, // Link chuẩn bị làm
    { name: 'Lịch sử khám', path: '/history', icon: '📜' },
    { name: 'Hồ sơ của tôi', path: '/profile', icon: '👤' }
  ],
  Admin: [
    { name: 'Tổng quan', path: '/dashboard', icon: '📊' },
    { name: 'Quản lý lịch hẹn', path: '/admin/appointments', icon: '📅' },
    { name: 'Quản lý Bác sĩ', path: '/admin/dentists', icon: '👨‍⚕️' },
    { name: 'Quản lý Dịch vụ', path: '/admin/services', icon: '💉' }
  ],
  Dentist: [
    { name: 'Ca làm việc', path: '/dashboard', icon: '📅' },
    { name: 'Danh sách bệnh nhân', path: '/dentist/patients', icon: '👥' }
  ],
  Receptionist: [
    { name: 'Lễ tân tổng đài', path: '/dashboard', icon: '📞' },
    { name: 'Duyệt lịch hẹn', path: '/receptionist/appointments', icon: '✅' }
  ]
}

// Lấy menu tương ứng dựa vào Role, nếu không có mặc định lấy của Patient
const menuItems = computed(() => {
  return roleMenus[userRole.value] || roleMenus['Patient']
})

onMounted(() => {
  // Lấy quyền từ localStorage do lúc Login ta đã lưu
  const role = localStorage.getItem('role')
  if (role) {
    userRole.value = role
  }

  // (Tùy chọn) Có thể bóc tách username từ token JWT nếu bạn muốn hiển thị tên thật
})

const handleLogout = () => {
  if(confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    router.push('/')
  }
}
</script>
