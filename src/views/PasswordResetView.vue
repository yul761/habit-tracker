<template>
  <div class="reset-container">
    <div class="reset">
      <h1>Reset Password</h1>

      <!-- Success Message -->
      <div v-if="isSuccess" class="alert alert-success" role="alert">
        Password reset email sent! Please check your inbox.
      </div>

      <form v-if="!isSuccess" @submit.prevent="handlePasswordReset">
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
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span style="color: white">Reset Password</span>
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm ms-2"
            role="status"
            aria-hidden="true"
          ></span>
        </button>
      </form>

      <!-- Return to Login -->
      <div v-if="isSuccess" class="text-center mt-3">
        <button @click="resetForm" class="btn btn-link">Send another reset email</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase/firebase.base'
import { useHead } from '@unhead/vue'

const email = ref('')
const loading = ref(false)
const emailError = ref('')
const isSuccess = ref(false)

useHead({
  title: 'Reset Password',
  meta: [
    {
      name: 'description',
      content:
        'Securely reset your password for your Habit-Hub account. Follow the simple steps to receive a password reset link via email.'
    }
  ]
})

const resetForm = () => {
  isSuccess.value = false
  email.value = ''
  emailError.value = ''
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const handlePasswordReset = async () => {
  emailError.value = ''

  if (!emailPattern.test(email.value)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  loading.value = true
  try {
    await sendPasswordResetEmail(auth, email.value)
    isSuccess.value = true
    return { success: true }
  } catch (error) {
    console.error(error)
    emailError.value = 'Failed to send password reset email'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-container {
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

.reset {
  max-width: 400px;
  width: 100%;
}

.reset h1 {
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

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.btn-link {
  color: #007bff;
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
}

/* Add fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
