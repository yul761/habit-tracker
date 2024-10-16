<template>
  <div class="reminder-list">
    <h2>{{ currentDate }}</h2>
    <div v-if="isLoading" class="loading-container">
      <v-progress-circular
        indeterminate
        color="primary"
        class="loading-indicator"
      ></v-progress-circular>
    </div>
    <v-list v-else lines="two" class="task-list">
      <v-list-item
        v-for="(task, i) in todayTasks"
        :key="i"
        :value="task"
        :title="task.task"
        :class="{ 'completed-task': task.isCompleted }"
        :disabled="task.isCompleted"
        @click="openModal(task)"
      >
      </v-list-item>
    </v-list>
    <v-dialog v-model="isModalOpen" max-width="500px">
      <v-card>
        <v-card-title>{{ selectedTask?.task }}</v-card-title>
        <v-card-text>
          <v-textarea v-model="selectedTaskNotes" label="Notes" outlined rows="4"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="markTaskAsCompleted">Complete</v-btn>
          <v-btn color="secondary" @click="closeModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { formatDate } from '@/utils/DateHandler'
import { IsCompletedToday, IsDueToday } from '@/components/Reminder/ReminderHandler'
import type { HabitTableData } from '@/types/habitTableData'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/firebase.base'
import { getUserHabits, addCompletionLog, getCompletionLogs } from '@/firebase/firebase.habit.db'
import { Timestamp } from 'firebase/firestore'

const currentDate = ref(formatDate(new Date()))
const habits = reactive<HabitTableData[]>([])
const todayTasks = ref<HabitTableData[]>([])
const isLoading = ref(true)

async function fetchTodayTasks() {
  isLoading.value = true
  const tasksForToday = []
  for (const task of habits) {
    if (IsDueToday(task) && task.userId && task.id) {
      const completionLogs = await getCompletionLogs(task.userId, task.id)
      tasksForToday.push({ ...task, isCompleted: IsCompletedToday(completionLogs) })
    }
  }
  todayTasks.value = tasksForToday
  isLoading.value = false
}

watchEffect(() => {
  fetchTodayTasks()
})

const isModalOpen = ref(false)
const selectedTask = ref<HabitTableData | null>(null)
const selectedTaskNotes = ref('')

function openModal(task: HabitTableData) {
  selectedTask.value = task
  isModalOpen.value = true
}

function closeModal() {
  selectedTask.value = null
  selectedTaskNotes.value = ''
  isModalOpen.value = false
}

async function markTaskAsCompleted() {
  if (selectedTask.value) {
    selectedTask.value.notes = selectedTaskNotes.value
    const completionLog = {
      Date: Timestamp.fromDate(new Date()),
      notes: selectedTaskNotes.value
    }
    if (selectedTask.value.userId && selectedTask.value.id) {
      addCompletionLog(selectedTask.value.userId, selectedTask.value.id, completionLog)
    } else {
      console.error('User ID or Task ID is undefined')
    }
    isModalOpen.value = false
    selectedTask.value = null
    selectedTaskNotes.value = ''
    await fetchTodayTasks()
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user)
    getUserHabits(user.uid).then((data) => {
      habits.push(...data)
    })
  } else {
    console.log('No user is signed in')
  }
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

.task-list {
  max-height: 450px;
  overflow-y: auto;
}

.completed-task {
  text-decoration: line-through;
  color: gray;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px; /* Adjust height as needed */
}
</style>
