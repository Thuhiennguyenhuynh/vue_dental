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
        <router-view></router-view>
</div>

    </main>

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
    { name: 'Hồ sơ của tôi', path: '/profile', icon: '👤' },
  ],
  Admin: [
    { name: 'Tổng quan', path: '/dashboard', icon: '📊' },
    { name: 'Quản lý lịch hẹn', path: '/admin/appointments', icon: '📅' },
    { name: 'Quản lý Bác sĩ', path: '/admin/dentists', icon: '👨‍⚕️' },
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
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    router.push('/')
  }
}
</script>
