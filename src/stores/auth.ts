import { defineStore } from 'pinia'
import { auth } from '@/firebase/firebase.base'
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
import { userExists, addUser } from '@/firebase/firebase.user.db'
import { sendWelcomeEmail } from '@/api/firebase.functions'

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
        signInWithPopup(auth, provider).then(async (result) => {
          this.user = result.user
          const ifUserExists = await userExists(this.user.uid)
          if (!ifUserExists) {
            addUser(this.user.uid, {
              displayName: this.user.displayName,
              email: this.user.email,
              notifyThroughEmail: false,
              phoneNumber: '',
              notifyThroughSms: false
            })
            if (this.user.email && this.user.displayName) {
              await sendWelcomeEmail(this.user.email, this.user.displayName)
            }
          }
          router.push('/')
        })
      })
    },
    async createUserWithEmailAndPassword(email: string, password: string) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      this.user = userCredential.user
      await addUser(this.user.uid, {
        displayName: this.user.displayName,
        email: this.user.email,
        notifyThroughEmail: false,
        phoneNumber: '',
        notifyThroughSms: false
      })
      router.push('/')
    },
    async signInWithEmailAndPassword(email: string, password: string) {
      try {
        await setPersistence(auth, browserSessionPersistence)
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        const ifUserExists = await userExists(this.user.uid)
        if (!ifUserExists) {
          addUser(this.user.uid, {
            displayName: this.user.displayName,
            email: this.user.email,
            notifyThroughEmail: false,
            phoneNumber: '',
            notifyThroughSms: false
          })
          if (this.user.email && this.user.displayName) {
            await sendWelcomeEmail(this.user.email, this.user.displayName)
          }
        }
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
