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

        // --- CHUYÊN MỤC BỆNH NHÂN (PATIENT) ---
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

        // --- CHUYÊN MỤC LỄ TÂN (RECEPTIONIST) ---
        {
          path: '/receptionist/appointments',
          name: 'receptionist-appointments',
          component: ReceptionistAppointments,
        },

        // --- CHUYÊN MỤC BÁC SĨ (DENTIST) ---
        {
          path: '/dentist/schedule',
          name: 'dentist-schedule',
          component: () => import('../views/dentist/DentistSchedule.vue'),
        },
        {
          path: '/dentist/patients', // Đã sửa lỗi Vue Router warn missing path
          name: 'dentist-patients',
          component: () => import('../views/dentist/DentistSchedule.vue'), // Tạm trỏ về Schedule hoặc tạo Component mới
        },

        // --- CHUYÊN MỤC QUẢN TRỊ (ADMIN) ---
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

// Navigation Guard kết hợp Phân Quyền (RBAC) chuẩn SRS[cite: 3]
router.beforeEach((to, from) => {
  const isAuthenticated = !!localStorage.getItem('token')
  const userRole = localStorage.getItem('role') // Lấy quyền: 'Admin', 'Receptionist', 'Dentist', 'Patient'

  // 1. Chặn người chưa đăng nhập
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/'
  }

  // 2. Chặn người đã đăng nhập quay lại màn hình Login/Register
  if (to.meta.requiresGuest && isAuthenticated) {
    return '/dashboard'
  }

  // 3. Phân quyền truy cập các đường dẫn dựa trên 4 Role
  if (isAuthenticated && to.meta.requiresAuth) {

    // Ràng buộc cho Quản trị viên (Admin)
    if (to.path.startsWith('/admin')) {
      if (userRole !== 'Admin') {
        alert('Từ chối truy cập: Chỉ Quản trị viên (Admin) mới có quyền truy cập tính năng này!')
        return '/dashboard'
      }
    }

    // Ràng buộc cho Lễ tân (Receptionist)
    if (to.path.startsWith('/receptionist')) {
      if (userRole !== 'Receptionist' && userRole !== 'Admin') {
        alert('Từ chối truy cập: Khu vực này chỉ dành cho Lễ tân!')
        return '/dashboard'
      }
    }

    // Ràng buộc cho Bác sĩ (Dentist)
    if (to.path.startsWith('/dentist')) {
      if (userRole !== 'Dentist') {
        alert('Từ chối truy cập: Khu vực làm việc dành riêng cho Bác sĩ!')
        return '/dashboard'
      }
    }

    // Ràng buộc cho Bệnh nhân (Patient)
    const patientOnlyRoutes = ['/booking', '/my-appointments', '/history']
    if (patientOnlyRoutes.includes(to.path)) {
      if (userRole !== 'Patient') {
        alert('Từ chối truy cập: Tính năng đặt lịch chỉ dành cho Bệnh nhân!')
        return '/dashboard'
      }
    }
  }

  // Hợp lệ -> Cho phép chuyển trang
  return true
})

export default router
