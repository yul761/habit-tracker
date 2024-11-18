<template>
  <ViewHeader>
    <template #left>
      <img
        alt="Vue logo"
        class="logo clickable h-100"
        src="@/assets/logo-no-background.png"
        height="50"
        @click="() => router.push('/')"
      />
    </template>
    <template #right>
      <LogInDropdown v-if="!isAuthenticated" />
      <UserProfileHeader v-if="isAuthenticated" />
    </template>
  </ViewHeader>
  <BreadCrumb />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LogInDropdown from '@/components/Authentication/LogInDropdown.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import UserProfileHeader from '@/components/UserProfile/UserProfileHeader.vue'
import ViewHeader from '@/components/Header/ViewHeader.vue'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue'
import router from '@/router'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
body {
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.clickable {
  cursor: pointer;
}

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
