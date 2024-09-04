import { defineStore } from 'pinia'
import { auth } from '@/firebase/firebase.auth'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { type User } from '@/types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: true
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user
  },
  actions: {
    async signOutUser() {
      try {
        await signOut(auth)
        this.user = null
      } catch (error) {
        console.error('Error during sign-out:', error)
      }
    },
    setUser(user: User | null) {
      this.user = user
    },
    initializeAuth() {
      onAuthStateChanged(auth, () => {
        this.user = null
        this.loading = false
      })
    }
  }
})
