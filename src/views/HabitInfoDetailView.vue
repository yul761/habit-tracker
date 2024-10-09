<template>
  <habit-form :habit="habit" :units="units" :frequencies="frequencies" @submit="saveHabit">
    <template #submit-button>
      <v-btn :disabled="!isModified" type="submit" color="primary">Save Habit</v-btn>
    </template>
  </habit-form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { habits } from '@/dummyData'
import { Unit, Frequency, type HabitTableData } from '@/types/habitTableData'
import _ from 'lodash'
import { onBeforeRouteLeave } from 'vue-router'
import HabitForm from '@/components/HabitForm/HabitForm.vue'

const habit = reactive<HabitTableData>(habits[0]) // Replace with logic to get the specific habit by ID
const initialHabit = _.cloneDeep(habit)

const units = Object.values(Unit)
const frequencies = Object.values(Frequency)

const isModified = computed(() => {
  return !_.isEqual(habit, initialHabit)
})

const saveHabit = async () => {
  console.log({ habit })
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
</script>

<style scoped>
.habit-detail-container {
  grid-column: span 2;
}
</style>
