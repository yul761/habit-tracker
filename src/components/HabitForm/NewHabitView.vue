<template>
  <div v-if="isLoading" class="loading-container">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  <div v-else class="form-container">
    <habit-form :habit="habit" :units="units" :frequencies="frequencies" @submit="NewHabit">
      <template #submit-button>
        <v-btn :disabled="!isModified" type="submit" color="primary">Create Habit</v-btn>
      </template>
    </habit-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Unit, Frequency, type HabitTableData } from '@/types/habitTableData'
import _ from 'lodash'
import { onBeforeRouteLeave } from 'vue-router'
import HabitForm from '@/components/HabitForm/HabitForm.vue'
import { defaultHabitData, emptyHabitData } from '@/firebase/habit.template'
import { useAuthStore } from '@/stores/auth'
import { auth } from '@/firebase/firebase.base'
import { onAuthStateChanged } from 'firebase/auth'
import { createHabit } from '@/firebase/firebase.habit.db'

const authStore = useAuthStore()
const habit = reactive<HabitTableData>(emptyHabitData())
let initialHabit = emptyHabitData()

const units = Object.values(Unit)
const frequencies = Object.values(Frequency)

const isModified = computed(() => {
  return !_.isEqual(habit, initialHabit)
})

const isLoading = computed(() => {
  return _.isEmpty(habit)
})

const NewHabit = async () => {
  console.log({ habit })
  if (!authStore.user) {
    return
  }
  createHabit(authStore.user.uid, habit)
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
    initialHabit = _.cloneDeep(habit)
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
