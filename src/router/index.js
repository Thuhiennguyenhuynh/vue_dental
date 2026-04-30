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
import ReceptionistAppointments from '../views/receptionist/ReceptionistAppointments.vue'

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
          path: '/profile',
          name: 'profile',
          component: ProfileView,
        },
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
        // Trang riêng cho Lễ tân
        {
          path: '/receptionist/appointments', // Đã thêm dấu / ở đầu cho đồng bộ
          name: 'receptionist-appointments',
          component: () => import('../views/receptionist/ReceptionistAppointments.vue'),
        },
        // Các route của Admin / Lễ tân dùng chung cái cũ (nếu có)
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
        },

        {
          path: '/admin/appointments',
          name: 'appointments-management',
          component: AppointmentsManagement,
        },

        {
      path: '/dentist/schedule',
      name: 'dentist-schedule',
      component: () => import('../views/dentist/DentistSchedule.vue'),
    }
      ]
    },
  ],
})

// Navigation Guard kết hợp Phân Quyền (RBAC)
router.beforeEach((to, from) => {
  const isAuthenticated = !!localStorage.getItem('token')
  const userRole = localStorage.getItem('role') // Lấy quyền: 'Admin', 'Receptionist', 'Patient'

  // 1. Chặn người chưa đăng nhập
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/'
  }

  // 2. Chặn người đã đăng nhập quay lại màn hình Login
  if (to.meta.requiresGuest && isAuthenticated) {
    return '/dashboard'
  }

  // 3. Phân quyền truy cập các đường dẫn
  if (isAuthenticated) {
    // Nếu là đường dẫn của Lễ tân
    if (to.path.startsWith('/receptionist/')) {
      if (userRole !== 'Receptionist' && userRole !== 'Admin') {
        alert('Bạn không có quyền truy cập trang này!')
        return '/dashboard'
      }
    }

    // Nếu là đường dẫn của Admin
    if (to.path.startsWith('/admin/')) {
      // Cho phép Lễ tân dùng chung trang /admin/appointments (nếu bạn vẫn gắn link này)
      if (to.path === '/admin/appointments') {
        if (userRole !== 'Receptionist' && userRole !== 'Admin') {
          alert('Bạn không có quyền truy cập trang này!')
          return '/dashboard'
        }
      }
      // Chặn các trang còn lại của Admin (chỉ Admin được vào)
      else {
        if (userRole !== 'Admin') {
          alert('Chỉ Quản trị viên (Admin) mới có quyền truy cập!')
          return '/dashboard'
        }
      }
    }
  }

  // Hợp lệ -> Cho đi tiếp
  return true
})

export default router
