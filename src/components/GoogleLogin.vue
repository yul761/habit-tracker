<template>
  <div>
    <p v-if="loading">Loading...</p>
    <div v-else>
      <p v-if="isAuthenticated">Welcome, {{ user.name }}</p>
      <button v-if="isAuthenticated" @click="signOutUser">Sign out</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted } from 'vue'
import googleOneTap from 'google-one-tap'
import { jwtDecode } from 'jwt-decode'
import { UserProfile } from '@/types/user'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.getUser)
const loading = computed(() => authStore.loading)

const signOutUser = authStore.signOutUser

onMounted(() => {
  googleAuthenticationHandler()
})

const googleAuthenticationHandler = () => {
  if (authStore.isAuthenticated) {
    return
  } else {
    const gisOption = {
      client_id: import.meta.env.VITE_APP_GIS_CLIENT_ID,
      auto_select: false,
      cancel_on_tap_outside: false,
      context: 'signin'
    }

    googleOneTap(gisOption, (response) => {
      const decode = jwtDecode(response.credential)
      const user = new UserProfile({ ...decode })
      authStore.setUser(user)
    })
  }
}
</script>
