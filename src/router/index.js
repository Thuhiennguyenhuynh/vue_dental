import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

// Import các màn hình con
import DashboardHome from '../views/DashboardHome.vue'
import CreateStaff from '../views/admin/CreateStaff.vue'
import ServicesManagement from '../views/admin/ServicesManagement.vue'
import DentistsManagement from '../views/admin/DentistsManagement.vue'

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
          path: '/admin/dentists', // Hiển thị danh sách Nha sĩ
          name: 'dentists-management', // Đổi tên cho khỏi trùng
          component: DentistsManagement, // Gán đúng component DentistsManagement
        },
        {
          path: '/admin/create-staff', // Form tạo tài khoản nhân sự
          name: 'create-staff',
          component: CreateStaff,
        },
        {
          path: '/admin/services', // Màn hình quản lý dịch vụ
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
