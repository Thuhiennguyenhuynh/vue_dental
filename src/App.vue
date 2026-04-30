<!-- src/App.vue -->
<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

onMounted(() => {
  // Lấy lịch sử giao diện người dùng đã chọn
  const theme = localStorage.getItem('theme')
  // Hoặc lấy theo cấu hình của hệ điều hành nếu chưa chọn
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (theme === 'dark' || (!theme && prefersDark)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <div class="min-h-screen">
    <RouterView />
  </div>
</template>
