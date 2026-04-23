import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

import DashboardHome from '../views/DashboardHome.vue'
import CreateStaff from '../views/admin/CreateStaff.vue'
import ServicesManagement from '../views/admin/ServicesManagement.vue'
import DentistsManagement from '../views/admin/DentistsManagement.vue'
import ReceptionistsManagement from '../views/admin/ReceptionistsManagement.vue'
import ProfileView from '../views/patient/ProfileView.vue'

// Import các màn hình nghiệp vụ
import BookingView from '../views/patient/BookingView.vue'
import MyAppointments from '../views/patient/MyAppointments.vue'
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
    // Chú ý: Đã xóa phần redirect của /profile ở đây
    {
      path: '/history',
      redirect: '/my-appointments'
    },
    // Route Dashboard: Chứa Layout chung (Sidebar, Header)
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '', // Default của /dashboard
          name: 'dashboard-home',
          component: DashboardHome,
        },
        {
          path: '/profile', // Định nghĩa duy nhất cho /profile ở đây
          name: 'profile',
          component: ProfileView,
        },
        // Đưa các route của Patient vào làm con của Dashboard
        {
          path: '/booking',
          name: 'booking',
          component: BookingView,
        },
        {
          path: '/my-appointments',
          name: 'my-appointments',
          component: MyAppointments,
        },
        // Các route của Admin / Lễ tân
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

// Navigation Guard
router.beforeEach((to, from) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/'
  } else if (to.meta.requiresGuest && isAuthenticated) {
    return '/dashboard'
  }

  return true
})

export default router
