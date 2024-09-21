<template>
  <Dropdown>
    <template #button-text> Login </template>
    <template #dropdown-menu>
      <li>
        <form class="px-4 py-3" @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="email" required v-model="email" />
            <div v-if="email && !isEmailValid" class="text-danger">Invalid email format</div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="d-flex">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control no-right-radius"
                id="password"
                v-model="password"
                required
              />
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm"
                @click.stop="togglePasswordVisibility"
                style="border-top-left-radius: 0; border-bottom-left-radius: 0"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-outline-secondary w-100"
            :disabled="!isEmailValid || isLoading"
          >
            <span>Log In</span>
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm ms-2"
              role="status"
              aria-hidden="true"
            ></span>
          </button>
          <router-link class="btn btn-link" to="/signup">Don't have an account?</router-link>
        </form>
      </li>
      <li><hr class="dropdown-divider" /></li>
      <li class="d-flex justify-content-center align-items-center">
        <button @click="authStore.googleSignIn()" class="btn btn-google">
          <img src="@/assets/google-icon.png" alt="Google icon" class="google-icon" />
          Sign in with google
        </button>
      </li>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import Dropdown from '@/components/Dropdown/ButtonDropdown.vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink, RouterView } from 'vue-router'
import { computed, onMounted, watch, ref } from 'vue'
import { UserProfile, type User } from '@/types/user'
import { jwtDecode } from 'jwt-decode'
import googleOneTap from 'google-one-tap'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const isAuthenticated = computed(() => authStore.isAuthenticated)
const googleIsAuthenticated = computed(() => authStore.googleIsAuthenticated)

watch(isAuthenticated, (isAuthenticated) => {
  console.log('isAuthenticated', isAuthenticated)
  console.log(authStore.user)
})

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    await authStore.signInWithEmailAndPassword(email.value, password.value)
  } catch (error) {
    errorMessage.value = 'Failed to log in. Please check your credentials and try again.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
// Reactive state for password visibility
const showPassword = ref(false)

// Function to toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const isEmailValid = computed(() => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email.value)
})
</script>

<style scoped>
.no-right-radius {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.btn-google {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: none;
}

.google-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}

.text-danger {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

button:disabled {
  cursor: not-allowed;
  pointer-events: none;
}
</style>
