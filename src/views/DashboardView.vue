<template>
  <div class="flex h-screen bg-gray-50 dark:bg-slate-900 font-sans transition-colors duration-300">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-gradient-to-b from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 text-white flex flex-col shadow-xl transition-all duration-300 z-10"
    >
      <!-- Logo Section -->
      <div
        class="p-6 text-2xl font-bold border-b border-teal-500/50 dark:border-teal-700/50 text-center flex flex-col items-center animate-slide-in"
      >
        <span class="text-3xl mb-2">🦷</span>
        <span>Dental Clinic</span>
        <span
          class="text-xs font-medium mt-3 px-3 py-1 bg-teal-500 dark:bg-teal-700 rounded-full text-teal-50"
        >
          {{ userRole || 'Người dùng' }}
        </span>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="block px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-teal-500 hover:shadow-md hover:translate-x-1 flex items-center gap-3 text-teal-50 active:bg-teal-400 dark:hover:bg-teal-700 dark:active:bg-teal-600"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span>{{ item.name }}</span>
        </router-link>
      </nav>

      <!-- Bottom Actions: Dark Mode & Logout -->
      <div class="p-4 border-t border-teal-500/50 dark:border-teal-700/50 space-y-3">
        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="w-full px-4 py-3 bg-teal-500 dark:bg-teal-700 hover:bg-teal-400 dark:hover:bg-teal-600 text-white rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <span v-if="isDarkMode">☀️ Chế độ sáng</span>
          <span v-else>🌙 Chế độ tối</span>
        </button>

        <!-- Logout Button -->
        <button
          @click="handleLogout"
          class="w-full px-4 py-3 bg-red-500/90 dark:bg-red-600/90 hover:bg-red-600 dark:hover:bg-red-500 text-white rounded-lg font-bold shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <span class="text-lg leading-none">🚪</span> Đăng xuất
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-y-auto transition-colors duration-300">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8 animate-fade-in">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-800 dark:text-gray-100">Hệ thống quản lý</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Chào mừng bạn quay trở lại,
            <span
              class="font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent"
            >
              {{ username }}
            </span>
          </p>
        </div>
      </div>

      <!-- Content Area (Nơi render các Component con) -->
      <div class="animate-slide-up">
        <router-view></router-view>
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
const isDarkMode = ref(false)

// Cấu hình Menu linh hoạt theo vai trò[cite: 3]
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
    { name: 'Quản lý Bác sĩ', path: '/admin/dentists', icon: '👨‍⚕️' },
    { name: 'Quản lý Lễ tân', path: '/admin/receptionists', icon: '👩‍💼' },
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

// Tự động nội suy menu dựa trên Role
const menuItems = computed(() => {
  return roleMenus[userRole.value] || roleMenus['Patient']
})

onMounted(() => {
  // 1. Lấy thông tin User Role từ LocalStorage
  const role = localStorage.getItem('role')
  if (role) {
    userRole.value = role
  }

  // 2. Khởi tạo trạng thái Dark Mode
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  }
})

// Xử lý chuyển đổi giao diện
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Xử lý Đăng xuất
const handleLogout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')

    // Đảm bảo đưa người dùng về đúng trang đăng nhập
    router.push('/')
  }
}
</script>
