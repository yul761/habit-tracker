<template>
  <div class="d-flex align-items-center">
    <p class="mb-0 me-2">Welcome, {{ user?.displayName }}</p>
    <button class="btn btn-outline-secondary btn-sm" @click="signOutUser">Sign out</button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

const user = computed(() => authStore.user)
const signOutUser = () => authStore.signOutUser()
</script>
