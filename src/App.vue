<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
  >
    <RouterView :key="$route.path" />
  </div>
</template>
