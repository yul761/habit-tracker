<template>
  <div class="reminder-list">
    <h2>{{ currentDate }}</h2>
    <v-list lines="two">
      <v-list-item v-for="task in todayTasks" :key="task.id">
        <v-list-item-title>{{ task.task }}</v-list-item-title>
        <v-list-item-subtitle>{{ task.reminderTime }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Frequency } from '@/types/habitTableData'
import { habits } from '@/dummyData'
import { formatDate } from '@/utils/DateHandler'
import { IsDueToday } from '@/components/Reminder/ReminderHandler'

const today = new Date().getDay()
const currentDate = ref(formatDate(new Date()))

const todayTasks = computed(() => {
  return habits.filter((task) => IsDueToday(task))
})
</script>

<style scoped>
.reminder-list {
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reminder-list h2 {
  margin-bottom: 1rem;
}

.reminder-list ul {
  list-style-type: none;
  padding: 0;
}

.reminder-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

.reminder-list li:last-child {
  border-bottom: none;
}
</style>
