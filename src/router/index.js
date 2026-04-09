import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import DashboardHome from '../views/DashboardHome.vue' // Bạn có thể tách phần thống kê cũ ra file này
import CreateStaff from '../views/admin/CreateStaff.vue' // File mình đã viết ở trên

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      // Đánh dấu route này chỉ dành cho khách (chưa đăng nhập)
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      // Đánh dấu route này chỉ dành cho khách (chưa đăng nhập)
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      component: DashboardView, // DashboardView giờ đóng vai trò là Layout
      meta: { requiresAuth: true },
      children: [
        {
          path: '', // Mặc định khi vào /dashboard
          name: 'dashboard-home',
          component: DashboardHome, // Render các khối thống kê (Box vuông)
        },
        {
          path: '/admin/dentists', // Khớp với path trong menu Admin của bạn
          name: 'create-staff',
          component: CreateStaff,
        }
      ]
    },
  ],
})

// --- ĐÂY LÀ CHÌA KHÓA: NAVIGATION GUARD CHẶN NÚT BACK ---
router.beforeEach((to, from, next) => {
  // Kiểm tra xem trong LocalStorage có Token không (nghĩa là đã đăng nhập chưa)
  const isAuthenticated = !!localStorage.getItem('token')

  // 1. Đã đăng xuất (không có token) MÀ cố ấn Back về trang Dashboard
  // -> Đá văng ra trang Login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  }
  // 2. Đã đăng nhập (có token) MÀ cố ấn Back về trang Login
  // -> Ép ở lại trang Dashboard
  else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  }
  // 3. Hợp lệ thì cho đi tiếp bình thường
  else {
    next()
  }
})

export default router
