import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import ServicesManagement from '../views/admin/ServicesManagement.vue'

// --- THÊM 2 COMPONENT MỚI VÀO ĐÂY ---
import DashboardHome from '../views/DashboardHome.vue'
import CreateStaff from '../views/admin/CreateStaff.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      component: DashboardView, // DashboardView giờ là cái khung (Layout)
      meta: { requiresAuth: true },
      children: [
        {
          path: '', // Mặc định khi vào /dashboard sẽ load DashboardHome
          name: 'dashboard-home',
          component: DashboardHome,
        },
        {
          // Khớp với path trong menu cấu hình Admin của bạn
          path: '/admin/dentists',
          name: 'create-staff',
          component: CreateStaff,
        },
        {
          path: '/admin/services', // Đảm bảo khớp với path trong menu Admin của bạn
          name: 'services-management',
          component: ServicesManagement,
        }
      ]
    },
  ],
})

// --- NAVIGATION GUARD CHẶN NÚT BACK (GIỮ NGUYÊN) ---
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
