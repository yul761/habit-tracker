import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      children: [
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/UserProfileView.vue')
        },
        {
          path: 'habit/:habitId',
          name: 'HabitDetail',
          component: () => import('@/components/HabitForm/HabitInfoDetailView.vue')
        },
        {
          path: 'habit/new',
          name: 'NewHabit',
          component: () => import('@/components/HabitForm/NewHabitView.vue')
        }
      ]
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('@/views/SignUpView.vue')
    }
  ]
})

export default router
