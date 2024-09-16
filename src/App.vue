<template>
  <ViewHeader>
    <template #left>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
    </template>
    <template #right>
      <LogInDropdown v-if="!isAuthenticated" />
      <UserProfileHeader v-if="isAuthenticated" />
    </template>
  </ViewHeader>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LogInDropdown from '@/components/Authentication/LogInDropdown.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import UserProfileHeader from '@/components/UserProfile/UserProfileHeader.vue'
import ViewHeader from '@/components/Header/ViewHeader.vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
