<template>
  <div class="signup-container">
    <div class="signup">
      <h1>Sign Up</h1>
      <!-- Error Alert -->
      <div v-if="signupError" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ signupError }}
        <button
          type="button"
          class="btn-close"
          @click="signupError = ''"
          aria-label="Close"
        ></button>
      </div>
      <form @submit.prevent="handleSignUp">
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="email"
            required
            :disabled="loading"
          />
          <div v-if="emailError" class="text-danger">{{ emailError }}</div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
            required
            :disabled="loading"
          />
          <div v-if="passwordError" class="text-danger">{{ passwordError }}</div>
          <div v-if="password" class="password-strength-bar">
            <div
              :class="passwordStrengthClass"
              :style="{ width: passwordStrengthPercentage + '%' }"
            ></div>
          </div>
          <div v-if="password" class="password-strength-text">{{ passwordStrengthText }}</div>
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            :disabled="loading"
          />
          <div v-if="confirmPasswordError" class="text-danger">{{ confirmPasswordError }}</div>
          <div v-if="confirmPassword" class="password-match-bar">
            <div :class="passwordMatchClass" :style="{ width: '100%' }"></div>
          </div>
          <div v-if="confirmPassword" class="password-match-text">{{ passwordMatchText }}</div>
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span style="color: white">Sign Up</span>
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm ms-2"
            role="status"
            aria-hidden="true"
          ></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { FirebaseError } from 'firebase/app'
import { useHead } from '@unhead/vue'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const signupError = ref('')

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

useHead({
  title: 'Sign Up',
  meta: [
    {
      name: 'description',
      content: 'Create a new account to start your self-improvement journey with Habit-Hub.'
    }
  ]
})
const handleSignUp = async () => {
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
  signupError.value = ''

  if (!emailPattern.test(email.value)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  if (!passwordPattern.test(password.value)) {
    passwordError.value =
      'Password must contain at least one uppercase letter, one lowercase letter, one special character and one number.'
    return
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  try {
    await authStore.createUserWithEmailAndPassword(email.value, password.value)
    // Handle successful sign-up logic here
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          signupError.value = 'This email is already registered.'
          break
        case 'auth/invalid-email':
          signupError.value = 'Invalid email address.'
          break
        case 'auth/operation-not-allowed':
          signupError.value = 'Email/password accounts are not enabled. Please contact support.'
          break
        case 'auth/weak-password':
          signupError.value = 'Password is too weak. Please choose a stronger password.'
          break
        default:
          signupError.value = 'Failed to create account. Please try again.'
      }
    } else {
      signupError.value = 'An unexpected error occurred. Please try again.'
    }
    console.error(error)
  } finally {
    loading.value = false
  }
}

const passwordStrength = computed(() => {
  let strength = 0
  if (password.value.length >= 6) strength += 1
  if (/[A-Z]/.test(password.value)) strength += 1
  if (/[a-z]/.test(password.value)) strength += 1
  if (/\d/.test(password.value)) strength += 1
  if (/[^A-Za-z0-9]/.test(password.value)) strength += 1
  return strength
})

const passwordStrengthPercentage = computed(() => {
  return (passwordStrength.value / 5) * 100
})

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value <= 2) return 'weak'
  if (passwordStrength.value === 3) return 'medium'
  if (passwordStrength.value >= 4) return 'strong'
  return 'weak'
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value <= 2) return 'Weak'
  if (passwordStrength.value === 3) return 'Medium'
  if (passwordStrength.value >= 4) return 'Strong'
  return 'Weak'
})

const passwordMatchClass = computed(() => {
  return password.value === confirmPassword.value ? 'match' : 'no-match'
})

const passwordMatchText = computed(() => {
  return password.value === confirmPassword.value ? 'Passwords match' : 'Passwords do not match'
})
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  grid-column: span 2;
  min-width: 400px;
}

.signup {
  max-width: 400px;
  width: 100%;
}

.signup h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.text-danger {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.password-strength-bar {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.password-strength-bar div {
  height: 100%;
  transition: width 0.3s;
}

.weak {
  background-color: #dc3545; /* Red */
}

.medium {
  background-color: #ffc107; /* Yellow */
}

.strong {
  background-color: #28a745; /* Green */
}

.password-strength-text {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.password-match-bar {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.password-match-bar div {
  height: 100%;
  transition: width 0.3s;
}

.match {
  background-color: #28a745; /* Green */
}

.no-match {
  background-color: #dc3545; /* Red */
}

.password-match-text {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.alert {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.25rem;
  position: relative;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-dismissible {
  padding-right: 4rem;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1.25rem 1rem;
  background: transparent;
  border: 0;
  opacity: 0.5;
  cursor: pointer;
}

.btn-close:hover {
  opacity: 0.75;
}

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
