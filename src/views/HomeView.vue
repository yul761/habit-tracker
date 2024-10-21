<template>
  <main class="mt-4 w-100 grid-container" v-if="isRootPath">
    <habit-table class="w-100 card-container" />
    <reminder-list class="w-100 card-container" />
  </main>
  <router-view v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import HabitTable from '@/components/Datatable/HabitTable.vue'
import ReminderList from '@/components/Reminder/ReminderList.vue'

const route = useRoute()

const isRootPath = computed(() => route.path === '/')
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  gap: 5rem; /* Optional: Add some space between columns */
  padding: 0 2rem;
  width: 100%;
  grid-column: span 2; /* Make the grid item span two columns */
}

.grid-item {
  width: 100%; /* Ensure the grid item takes up full width of its column */
}

.card-container {
  background: white;
  padding: 30px;
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
