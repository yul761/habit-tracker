<template>
  <div class="d-flex align-items-center">
    <p class="mb-0 me-2">Welcome, {{ displayName }}</p>
    <button class="btn btn-outline-secondary btn-sm" @click="signOutUser">Sign out</button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

const user = computed(() => authStore.user)

const displayName = computed(() => {
  if (user.value?.displayName) {
    return user.value.displayName
  } else if (user.value?.email) {
    return user.value.email.split('@')[0]
  }
  return 'User'
})

const signOutUser = () => authStore.signOutUser()
</script>
