import { defineStore } from 'pinia'
import { auth } from '@/firebase/firebase.auth'
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: true,
    googleIsAuthenticated: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
    IsGoogleAuthenticated: (state) => state.googleIsAuthenticated
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
    googleSignIn() {
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider).then((result) => {
        this.user = result.user
      })
    },
    initializeAuth() {
      onAuthStateChanged(auth, () => {
        this.user = null
        this.loading = false
      })
    }
  }
})
