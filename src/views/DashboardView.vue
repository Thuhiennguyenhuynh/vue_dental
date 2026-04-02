<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 bg-blue-800 text-white flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-blue-700 text-center">
        Nha Khoa Thu Hiền
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <a href="#" class="block px-4 py-2 bg-blue-700 rounded-lg font-medium">🏠 Trang chủ</a>
        <a href="#" class="block px-4 py-2 hover:bg-blue-700 rounded-lg transition">📅 Lịch khám</a>
        <a href="#" class="block px-4 py-2 hover:bg-blue-700 rounded-lg transition">👥 Bệnh nhân</a>
        <a href="#" class="block px-4 py-2 hover:bg-blue-700 rounded-lg transition">👨‍⚕️ Nha sĩ</a>
      </nav>
      <div class="p-4 border-t border-blue-700">
        <button
          @click="handleLogout"
          class="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-bold transition"
        >
          Đăng xuất
        </button>
      </div>
    </aside>

    <main class="flex-1 p-8 overflow-y-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Tổng quan hệ thống</h1>
        <div class="text-gray-600 font-medium">
          Xin chào, <span class="text-blue-600 font-bold">{{ userRole }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 font-medium">Lịch khám hôm nay</h3>
          <p class="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 font-medium">Bệnh nhân mới</h3>
          <p class="text-3xl font-bold text-green-500 mt-2">5</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-gray-500 font-medium">Nha sĩ đang rảnh</h3>
          <p class="text-3xl font-bold text-purple-500 mt-2">2</p>
        </div>
      </div>

      <div class="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Hoạt động gần đây</h2>
        <p class="text-gray-500 italic">Dữ liệu sẽ được hiển thị ở đây...</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userRole = ref('')

// Khi trang load lên, lấy thông tin Role từ LocalStorage để hiển thị
onMounted(() => {
  const role = localStorage.getItem('role')
  if (!role) {
    // Nếu chưa đăng nhập mà cố tình vào trang này -> Đuổi ra trang Login
    alert('Vui lòng đăng nhập trước!')
    router.push('/')
  } else {
    userRole.value = role
  }
})

// Hàm đăng xuất
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/')
}
</script>
