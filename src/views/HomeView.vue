<template>
  <main class="mt-4 w-100" v-if="isRootPath">
    <habit-table />
  </main>
  <router-view v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import HabitTable from '@/components/Datatable/HabitTable.vue'

const route = useRoute()

const isRootPath = computed(() => route.path === '/')
</script>

<style scoped>
/* Add your styles here */
</style>
