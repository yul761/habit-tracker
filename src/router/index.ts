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
          path: 'test',
          name: 'HomeTest',
          component: () => import('@/views/AboutView.vue')
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/UserProfileView.vue')
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
