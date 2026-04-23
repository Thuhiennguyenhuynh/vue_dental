<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <aside
      class="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white flex flex-col shadow-xl"
    >
      <div
        class="p-6 text-2xl font-bold border-b border-blue-700 text-center flex flex-col items-center"
      >
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

        <router-link
  v-if="userRole === 'Dentist' || userRole === 'Admin'"
  to="/dentist/schedule"
  class="p-3 rounded-lg hover:bg-blue-50 text-gray-700 flex items-center gap-2"
>
  <span>👨‍⚕️ Lịch khám của tôi</span>
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
          <h1 class="text-3xl font-extrabold text-gray-800">Hệ thống quản lý</h1>
          <p class="text-gray-500 mt-1">
            Chào mừng bạn quay trở lại, <span class="font-bold text-blue-600">{{ username }}</span
            >!
          </p>
        </div>
      </div>

      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userRole = ref('')
const username = ref('Bạn')

const roleMenus = {
  Patient: [
    { name: 'Trang chủ', path: '/dashboard', icon: '🏠' },
    { name: 'Đặt lịch khám mới', path: '/booking', icon: '📅' },
    { name: 'Lịch sử khám', path: '/history', icon: '📜' },
    { name: 'Hồ sơ của tôi', path: '/profile', icon: '👤' },
  ],
  Admin: [
    { name: 'Tổng quan', path: '/dashboard', icon: '📊' },
    { name: 'Quản lý lịch hẹn', path: '/admin/appointments', icon: '📅' },
    { name: 'Quản lý Bác sĩ', path: '/admin/dentists', icon: '👨‍⚕️' }, // Mình đổi tên lại cho rõ ràng
    { name: 'Quản lý Lễ tân', path: '/admin/receptionists', icon: '👩‍💼' }, // <-- THÊM DÒNG NÀY VÀO ĐÂY
    { name: 'Quản lý Dịch vụ', path: '/admin/services', icon: '💉' },
  ],
  Dentist: [
    { name: 'Ca làm việc', path: '/dashboard', icon: '📅' },
    { name: 'Danh sách bệnh nhân', path: '/dentist/patients', icon: '👥' },
  ],
  Receptionist: [
    { name: 'Lễ tân tổng đài', path: '/dashboard', icon: '📞' },
    { name: 'Duyệt lịch hẹn', path: '/receptionist/appointments', icon: '✅' },
  ],
}

const menuItems = computed(() => {
  return roleMenus[userRole.value] || roleMenus['Patient']
})

onMounted(() => {
  const role = localStorage.getItem('role')
  if (role) {
    userRole.value = role
  }
})

const handleLogout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    router.push('/')
  }
}
</script>
