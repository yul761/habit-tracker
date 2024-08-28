// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBJ-1T0RWIssf0PPFoeYkF39vdrgEqgzes',
  authDomain: 'habit-tracker-a6b59.firebaseapp.com',
  projectId: 'habit-tracker-a6b59',
  storageBucket: 'habit-tracker-a6b59.appspot.com',
  messagingSenderId: '974692616153',
  appId: '1:974692616153:web:033a522da232138e55bbc8',
  measurementId: 'G-J6BD5PZC8Z'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)

export { auth, analytics }
