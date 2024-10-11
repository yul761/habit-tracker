<template>
  <div v-if="isLoading" class="loading-container">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  <div v-else class="form-container">
    <habit-form :habit="habit" :units="units" :frequencies="frequencies" @submit="NewHabit">
      <template #submit-button>
        <v-btn :disabled="!isModified || isCreating" type="submit" color="primary"
          ><template v-if="isCreating">
            <v-progress-circular indeterminate size="20" color="white"></v-progress-circular>
          </template>
          <template v-else> Create Habit </template>
        </v-btn>
      </template>
    </habit-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { Unit, Frequency, type HabitTableData } from '@/types/habitTableData'
import _ from 'lodash'
import { onBeforeRouteLeave } from 'vue-router'
import HabitForm from '@/components/HabitForm/HabitForm.vue'
import { defaultHabitData, emptyHabitData } from '@/firebase/habit.template'
import { useAuthStore } from '@/stores/auth'
import { auth } from '@/firebase/firebase.base'
import { onAuthStateChanged } from 'firebase/auth'
import { createHabit } from '@/firebase/firebase.habit.db'
import router from '@/router'

const authStore = useAuthStore()
const habit = reactive<HabitTableData>(emptyHabitData())
const initialHabit = reactive<HabitTableData>(emptyHabitData())

const units = Object.values(Unit)
const frequencies = Object.values(Frequency)

const findDifferences = (obj1, obj2) => {
  const differences = {}
  for (const key in obj1) {
    if (!_.isEqual(obj1[key], obj2[key])) {
      differences[key] = { obj1: obj1[key], obj2: obj2[key] }
    }
  }
  return differences
}

const isModified = computed(() => {
  const differences = findDifferences(habit, initialHabit)
  console.log('Differences:', differences)
  return !_.isEqual(habit, initialHabit)
})

const isLoading = computed(() => {
  return _.isEmpty(habit)
})

const isCreating = ref(false)

const NewHabit = async () => {
  console.log({ habit })
  let habitId = null
  if (!authStore.user) {
    return
  }
  isCreating.value = true
  try {
    habitId = await createHabit(authStore.user.uid, habit)
    Object.assign(initialHabit, habit)
  } finally {
    isCreating.value = false // Set loading state to false after the function completes
    if (habitId) {
      router.replace({ name: 'HabitDetail', params: { habitId, userId: authStore.user.uid } })
    }
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (isModified.value) {
    const answer = window.confirm('You have unsaved changes. Are you sure you want to leave?')
    if (answer) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user)
    authStore.user = user
    Object.assign(habit, defaultHabitData(authStore.user.uid))
    Object.assign(initialHabit, habit)
  } else {
    console.log('No user is signed in')
  }
})
</script>

<style scoped>
.form-container {
  grid-column: span 2;
}
.habit-detail-container {
  grid-column: span 2;
}
</style>
