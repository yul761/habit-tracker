<template>
  <ServerSideTable
    :fetch-items="fetchItems"
    :headers="headers"
    item-value="name"
    @update:items="handleItemsUpdate"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ServerSideTable from './ServerSideTable.vue'
import { type HabitTableData, Unit, Frequency } from '@/types/habitTableData'
import type { Header, FetchItemsParams, FetchItemsResult } from './interfaces/serverSideTable'

const headers = ref<Header[]>([
  { title: 'Task', align: 'start', sortable: false, key: 'task' },
  { title: 'Target', key: 'target', align: 'end' },
  { title: 'Start Date', key: 'startDate', align: 'end' }
])

const fetchItems = async ({
  page,
  itemsPerPage,
  sortBy
}: FetchItemsParams): Promise<FetchItemsResult<HabitTableData>> => {
  // Replace with your actual data fetching logic
  const habits: HabitTableData[] = [
    {
      id: '1',
      task: 'Read book',
      targetValue: 5,
      targetUnit: Unit.Pages,
      frequency: Frequency.Daily,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      reminderTime: '20:00',
      notes: 'Read before bed',
      daysKept: 10
    },
    {
      id: '2',
      task: 'Run',
      targetValue: 30,
      targetUnit: Unit.Minutes,
      frequency: Frequency.Daily,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      reminderTime: '06:00',
      notes: 'Morning run',
      daysKept: 5
    },
    {
      id: '3',
      task: 'Meditate',
      targetValue: 15,
      targetUnit: Unit.Minutes,
      frequency: Frequency.Daily,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      reminderTime: '07:00',
      notes: 'Morning meditation',
      daysKept: 7
    },
    {
      id: '4',
      task: 'Write journal',
      targetValue: 1,
      targetUnit: Unit.Pages,
      frequency: Frequency.Daily,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      reminderTime: '21:00',
      notes: 'Reflect on the day',
      daysKept: 12
    },
    {
      id: '5',
      task: 'Exercise',
      targetValue: 45,
      targetUnit: Unit.Minutes,
      frequency: Frequency.Weekly,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      reminderTime: '18:00',
      notes: 'Evening workout',
      daysKept: 8
    },
    {
      id: '6',
      task: 'Learn coding',
      targetValue: 2,
      targetUnit: Unit.Hours,
      frequency: Frequency.Weekly,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      reminderTime: '19:00',
      notes: 'Practice coding skills',
      daysKept: 15
    }
  ]

  // Combine target value and unit into a single string
  const formattedHabits = habits.map((habit) => ({
    ...habit,
    target: `${habit.targetValue} ${habit.targetUnit}`
  }))

  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * itemsPerPage
      const end = start + itemsPerPage

      if (sortBy.length) {
        const sortKey = sortBy[0].key as keyof (typeof formattedHabits)[0]
        const sortOrder = sortBy[0].order
        formattedHabits.sort((a, b) => {
          const aValue = a[sortKey]
          const bValue = b[sortKey]
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
          } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'desc'
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue)
          }
          return 0
        })
      }
      const paginated = formattedHabits.slice(start, end)
      resolve({ items: paginated, total: formattedHabits.length })
    }, 500)
  })
}

const handleItemsUpdate = (items: HabitTableData[]): void => {
  console.log('Items updated:', items)
}
</script>
