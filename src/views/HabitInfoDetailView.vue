<template>
  <v-container class="habit-detail-container mt-4">
    <v-form @submit.prevent="saveHabit">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field label="Task" v-model="habit.task" outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Target Value"
            type="number"
            v-model="habit.targetValue"
            @input="habit.targetValue = Number(habit.targetValue)"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            label="Target Unit"
            :items="units"
            v-model="habit.targetUnit"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            label="Frequency"
            :items="frequencies"
            v-model="habit.frequency"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-menu
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            min-width="290px"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="formattedStartDate"
                label="Start Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="props"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker elevation="24" v-model="startDateArray"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="6">
          <v-menu
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="formattedEndDate"
                label="End Date"
                prepend-icon="mdi-calendar"
                v-bind="props"
                readonly
                outlined
              ></v-text-field>
            </template>
            <v-date-picker elevation="24" v-model="endDateArray"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12">
          <v-textarea label="Notes" v-model="habit.notes" outlined></v-textarea>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Days Kept"
            type="number"
            v-model="habit.daysKept"
            @input="habit.daysKept = Number(habit.daysKept)"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn :disabled="!isModified" type="submit" color="primary">Save</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import { habits } from '@/dummyData'
import { Unit, Frequency, type HabitTableData } from '@/types/habitTableData'
import _, { isDate } from 'lodash'
import { onBeforeRouteLeave } from 'vue-router'

const habit = reactive<HabitTableData>(habits[0]) // Replace with logic to get the specific habit by ID
const initialHabit = _.cloneDeep(habit)

const units = Object.values(Unit)
const frequencies = Object.values(Frequency)

const formattedStartDate = computed<string>({
  get: () => new Date(habit.startDate).toISOString().substr(0, 10),
  set: (value: string) => {
    habit.startDate = new Date(value).getTime()
  }
})

const formattedEndDate = computed<string>({
  get: () => (habit.endDate ? new Date(habit.endDate).toISOString().substr(0, 10) : ''),
  set: (value: string) => {
    habit.endDate = new Date(value).getTime()
  }
})

const startDateArray = computed({
  get: () => [new Date(habit.startDate)],
  set: (value: Date) => {
    console.log(isDate(value))
    habit.startDate = new Date(value).getTime()
  }
})

const endDateArray = computed({
  get: () => (habit.endDate ? [new Date(habit.endDate)] : []),
  set: (value: Date) => {
    habit.endDate = new Date(value).getTime()
  }
})

const isModified = ref(false)

watch(
  habit,
  (newVal) => {
    isModified.value = !_.isEqual(newVal, initialHabit)
  },
  { deep: true }
)

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
