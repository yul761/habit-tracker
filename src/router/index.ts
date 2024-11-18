import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: () => import('@/views/WelcomeView.vue')
    },
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      children: [
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/UserProfileView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'user/:userId/habit/:habitId',
          name: 'HabitDetail',
          component: () => import('@/components/HabitForm/HabitInfoDetailView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'habit/new',
          name: 'NewHabit',
          component: () => import('@/components/HabitForm/NewHabitView.vue'),
          meta: { requiresAuth: true }
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('@/views/SignUpView.vue')
    },
    {
      path: '/passwordReset',
      name: 'Password Reset',
      component: () => import('@/views/PasswordResetView.vue')
    }
  ]
})

// Add a global navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // This route requires authentication, check if logged in
    // If not, redirect to login page.
    if (!useAuthStore().isAuthenticated) {
      next({
        path: '/welcome',
        query: { redirect: to.fullPath } // Save the location to redirect to after login
      })
    } else {
      next() // Proceed to the route
    }
  } else {
    next() // Proceed to the route
  }
})

export default router
