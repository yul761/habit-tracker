import { defineStore } from 'pinia'
import { auth } from '@/firebase/firebase.auth'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User
} from 'firebase/auth'

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
    async signInWithGoogle() {
      const provider = new GoogleAuthProvider()
      try {
        const result = await signInWithPopup(auth, provider)
        this.user = result.user
      } catch (error) {
        console.error('Error during sign-in:', error)
      }
    },
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
      onAuthStateChanged(auth, (user) => {
        this.user = user
        this.loading = false
      })
    }
  }
})
