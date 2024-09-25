import { defineStore } from 'pinia'
import { auth } from '@/firebase/firebase.auth'
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  type User
} from 'firebase/auth'
import router from '@/router'

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
      setPersistence(auth, browserSessionPersistence).then(() => {
        signInWithPopup(auth, provider).then((result) => {
          this.user = result.user
          router.push('/')
        })
      })
    },
    async createUserWithEmailAndPassword(email: string, password: string) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        router.push('/')
      } catch (error) {
        console.error('Error during sign-up:', error)
      }
    },
    async signInWithEmailAndPassword(email: string, password: string) {
      try {
        await setPersistence(auth, browserSessionPersistence)
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
      } catch (error) {
        console.error('Error during sign-in:', error)
      }
    },
    initializeAuth() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user
          console.log('User is signed in:', user)
        } else {
          this.user = null
          console.log('No user is signed in')
        }
      })
    }
  }
})
