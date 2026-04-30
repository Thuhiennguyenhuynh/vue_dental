// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Kích hoạt dark mode thông qua class 'dark'
  theme: {
    extend: {
      colors: {
        // Khai báo tông màu chủ đạo là xanh biển (có thể dùng bảng màu blue của tailwind)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Màu nhấn chính
          600: '#2563eb', // Màu khi hover
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Cấu hình thêm màu nền cho chế độ dark mode để dịu mắt hơn
        darkbg: '#0f172a', // slate-900
        darksurface: '#1e293b', // slate-800
      }
    },
  },
  plugins: [],
}
