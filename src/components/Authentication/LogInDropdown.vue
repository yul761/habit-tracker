<template>
  <Dropdown>
    <template #button-text> Login </template>
    <template #dropdown-menu>
      <li>
        <form class="px-4 py-3">
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="email" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" required />
          </div>
          <button type="submit" class="btn btn-primary">Log-in</button>
        </form>
      </li>
      <li><hr class="dropdown-divider" /></li>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import Dropdown from '@/components/Dropdown/ButtonDropdown.vue'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted } from 'vue'
import { UserProfile, type User } from '@/types/user'
import { jwtDecode } from 'jwt-decode'
import googleOneTap from 'google-one-tap'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
