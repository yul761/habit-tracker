<template>
  <main class="container mt-4 custom-container" v-if="isRootPath">
    <template>
      <span>Home View</span>
      <button @click="() => router.push('/home/test')">go to next</button>
    </template>
  </main>
  <router-view v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()

const isRootPath = computed(() => route.path === '/')
</script>

<style scoped>
/* Add your styles here */
</style>
