<template>
  <div v-if="loading" class="loading-container">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  <div v-else class="form-container">
    <habit-form :habit="habit" :units="units" :frequencies="frequencies" @submit="saveHabit">
      <template #submit-button>
        <v-btn :disabled="!isModified || isUpdating" type="submit" color="primary"
          ><template v-if="isUpdating">
            <v-progress-circular indeterminate size="20" color="white"></v-progress-circular>
          </template>
          <template v-else> Save Habit </template>
        </v-btn>
      </template>
    </habit-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from 'vue'
import { Unit, Frequency, type HabitTableData } from '@/types/habitTableData'
import _ from 'lodash'
import { onBeforeRouteLeave } from 'vue-router'
import HabitForm from '@/components/HabitForm/HabitForm.vue'
import { emptyHabitData } from '@/firebase/habit.template'
import { useRoute } from 'vue-router'
import { getHabit, updateHabit } from '@/firebase/firebase.habit.db'

const habit = reactive<HabitTableData>(emptyHabitData())
const initialHabit = reactive<HabitTableData>(emptyHabitData())
const loading = ref(true)
const isUpdating = ref(false)

const units = Object.values(Unit)
const frequencies = Object.values(Frequency)

const router = useRoute()
const isModified = computed(() => {
  const fieldsToIgnore = ['notificationPreferences', 'processLog'] // Replace with actual field names
  const habitToCompare = _.omit(habit, fieldsToIgnore)
  const initialHabitToCompare = _.omit(initialHabit, fieldsToIgnore)

  return !_.isEqual(habitToCompare, initialHabitToCompare)
})

const saveHabit = async () => {
  const habitId = router.params.habitId as string
  const userId = router.params.userId as string
  if (habitId && userId) {
    isUpdating.value = true
    try {
      await updateHabit(userId, habitId, habit)
      Object.assign(initialHabit, habit)
    } finally {
      isUpdating.value = false // Set updating state to false after the function completes
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

onMounted(() => {
  const habitId = router.params.habitId as string
  const userId = router.params.userId as string
  console.log({ habitId, userId })
  if (habitId && userId) {
    getHabit(userId, habitId)
      .then((habitData) => {
        console.log({ habitData })
        //initialHabit = LoadedInitialHabitData(habitData)
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
