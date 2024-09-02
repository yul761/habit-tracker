<template>
  <div>
    <p v-if="loading">Loading...</p>
    <div v-else>
      <p v-if="isAuthenticated">Welcome, {{ user.displayName }}</p>
      <button v-if="!isAuthenticated" @click="signInWithGoogle">Sign in with Google</button>
      <button v-else @click="signOutUser">Sign out</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.getUser)
const loading = computed(() => authStore.loading)

const signInWithGoogle = authStore.signInWithGoogle
const signOutUser = authStore.signOutUser
</script>
