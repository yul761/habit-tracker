<!-- eslint-disable vue/valid-v-slot -->
<template>
  <ServerSideTable
    :fetch-items="fetchItems"
    :headers="headers"
    item-value="id"
    @update:items="handleItemsUpdate"
  >
    <template #item.name="{ item }">
      <a @click="onOpen(item.id)" href="javascript:void(0)">{{ item.task }}</a>
    </template>
  </ServerSideTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ServerSideTable from './ServerSideTable.vue'
import { type HabitTableData } from '@/types/habitTableData'
import type { Header, FetchItemsParams, FetchItemsResult } from './interfaces/serverSideTable'
import { habits } from '@/dummyData'
import router from '@/router'

const headers = ref<Header[]>([
  { title: 'Task', align: 'start', sortable: false, key: 'name' },
  { title: 'Target', key: 'target', align: 'end' },
  { title: 'Habit Streak', key: 'daysKept', align: 'end' }
])

const fetchItems = async ({
  page,
  itemsPerPage,
  sortBy
}: FetchItemsParams): Promise<FetchItemsResult<HabitTableData>> => {
  // Combine target value and unit into a single string
  const formattedHabits = habits.map((habit) => ({
    ...habit,
    target: `${habit.targetValue} ${habit.targetUnit} / ${habit.frequency}`
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

const onOpen = (id: string) => {
  console.log('Open habit', id)
  router.push({ name: 'HabitDetail', params: { habitId: id } })
}
</script>
