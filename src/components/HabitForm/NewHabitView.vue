<template>
  <habit-form :habit="habit" :units="units" :frequencies="frequencies" @submit="createHabit">
    <template #submit-button>
      <v-btn :disabled="!isModified" type="submit" color="primary">Create Habit</v-btn>
    </template>
  </habit-form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Unit, Frequency, type HabitTableData } from '@/types/habitTableData'
import _ from 'lodash'
import { onBeforeRouteLeave } from 'vue-router'
import HabitForm from '@/components/HabitForm/HabitForm.vue'

const habit = reactive<HabitTableData>({
  task: '',
  targetValue: 0,
  targetUnit: Unit.Pages,
  frequency: Frequency.Daily,
  startDate: 0,
  daysKept: 0,
  id: ''
})
const initialHabit = _.cloneDeep(habit)

const units = Object.values(Unit)
const frequencies = Object.values(Frequency)

const isModified = computed(() => {
  return !_.isEqual(habit, initialHabit)
})

const createHabit = async () => {
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
