<template>
  <div v-if="loading" class="loading-container">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  <div v-else class="form-container">
    <habit-form :habit="habit" :units="units" :frequencies="frequencies" @submit="saveHabit">
      <template #submit-button>
        <v-btn :disabled="!isModified" type="submit" color="primary">Save Habit</v-btn>
      </template>
    </habit-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from 'vue'
import { habits } from '@/dummyData'
import { Unit, Frequency, type HabitTableData } from '@/types/habitTableData'
import _ from 'lodash'
import { onBeforeRouteLeave } from 'vue-router'
import HabitForm from '@/components/HabitForm/HabitForm.vue'
import { emptyHabitData } from '@/firebase/firebase.habit.db'
import { useRoute } from 'vue-router'
import { getHabit } from '@/firebase/firebase.habit.db'

const habit = reactive<HabitTableData>(emptyHabitData())
let initialHabit = {}
const loading = ref(true)

const units = Object.values(Unit)
const frequencies = Object.values(Frequency)

const router = useRoute()
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

onMounted(() => {
  const habitId = router.params.habitId as string
  const userId = router.params.userId as string
  console.log({ habitId, userId })
  if (habitId && userId) {
    getHabit(userId, habitId)
      .then((habitData) => {
        Object.assign(habit, habitData)
        Object.assign(initialHabit, habitData)
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    loading.value = false
  }
})
</script>

<style scoped>
.habit-detail-container {
  grid-column: span 2;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.form-container {
  grid-column: span 2;
}
</style>
