import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

import DashboardHome from '../views/DashboardHome.vue'
import CreateStaff from '../views/admin/CreateStaff.vue'
import ServicesManagement from '../views/admin/ServicesManagement.vue'
import DentistsManagement from '../views/admin/DentistsManagement.vue'
import ReceptionistsManagement from '../views/admin/ReceptionistsManagement.vue'

// Import thêm 2 màn hình nghiệp vụ mới
import BookingView from '../views/patient/BookingView.vue'
import AppointmentsManagement from '../views/admin/AppointmentsManagement.vue'

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
    // Route Đặt lịch dành cho Bệnh nhân (Patient)
    {
      path: '/booking',
      name: 'booking',
      component: BookingView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-home',
          component: DashboardHome,
        },
        // Quản lý lịch hẹn (Cho Lễ tân / Admin)
        {
          path: '/admin/appointments',
          name: 'appointments-management',
          component: AppointmentsManagement,
        },
        {
          path: '/admin/dentists',
          name: 'dentists-management',
          component: DentistsManagement,
        },
        {
          path: '/admin/create-staff',
          name: 'create-staff',
          component: CreateStaff,
        },
        {
          path: '/admin/services',
          name: 'services-management',
          component: ServicesManagement,
        },
        {
          path: '/admin/receptionists',
          name: 'receptionists-management',
          component: ReceptionistsManagement,
        }
      ]
    },
  ],
})

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
