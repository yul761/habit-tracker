<template>
  <v-container class="habit-detail-container">
    <v-form @submit.prevent="handleSubmit">
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
        <v-col cols="12" class="py-1">
          <v-checkbox v-model="habit.isActive" label="Is Active"></v-checkbox>
        </v-col>
        <v-col cols="12">
          <slot name="submit-button" />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, defineProps, defineEmits } from 'vue'
import { Unit, Frequency, type HabitTableData } from '@/types/habitTableData'

const props = defineProps<{
  habit: HabitTableData
  units: Unit[]
  frequencies: Frequency[]
}>()

const emits = defineEmits(['submit'])

const habit = reactive(props.habit)

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

//@ts-ignore
const startDateArray = computed({
  get: () => [new Date(habit.startDate)],
  set: (value: Date) => {
    habit.startDate = new Date(value).getTime()
  }
})
//@ts-ignore
const endDateArray = computed({
  get: () => (habit.endDate ? [new Date(habit.endDate)] : []),
  set: (value: Date) => {
    habit.endDate = new Date(value).getTime()
  }
})

const handleSubmit = () => {
  emits('submit', habit)
}
</script>

<style scoped>
.habit-detail-container {
  grid-column: span 2;
  background: white;
  padding: 30px;
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 100px;
}
</style>
