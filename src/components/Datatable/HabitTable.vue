<!-- eslint-disable vue/valid-v-slot -->
<template>
  <ServerSideTable
    :fetch-items="fetchItems"
    :headers="headers"
    item-value="id"
    @update:items="handleItemsUpdate"
    @new="Create"
  >
    <template #item.name="{ item }">
      <a @click="onOpen(item.id, item.userId)" href="javascript:void(0)">{{ item.task }}</a>
    </template>
  </ServerSideTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ServerSideTable from './ServerSideTable.vue'
import { type HabitTableData } from '@/types/habitTableData'
import type { Header, FetchItemsParams, FetchItemsResult } from './interfaces/serverSideTable'
import router from '@/router'
import { getUserHabits } from '@/firebase/firebase.habit.db'

const headers = ref<Header[]>([
  { title: 'Task', align: 'start', sortable: false, key: 'name' },
  { title: 'Target', key: 'target', align: 'end' },
  { title: 'Habit Streak', key: 'daysKept', align: 'end' }
])

const fetchItems = async ({
  page,
  itemsPerPage,
  sortBy,
  userId
}: FetchItemsParams): Promise<FetchItemsResult<HabitTableData>> => {
  if (!userId) {
    return { items: [], total: 0 }
  }
  const habits = await getUserHabits(userId)
  console.log('Habits:', habits)
  if (habits.length === 0) {
    return { items: [], total: 0 }
  }

  // Combine target value and unit into a single string
  const formattedHabits = habits.map((habit) => ({
    ...habit,
    target: `${habit.targetValue} ${habit.targetUnit} / ${habit.frequency}`
  }))

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
        return sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue)
      }
      return 0
    })
  }

  const paginated = formattedHabits.slice(start, end)
  return { items: paginated, total: formattedHabits.length }
}

const handleItemsUpdate = (items: HabitTableData[]): void => {
  console.log('Items updated:', items)
}

const onOpen = (id: string, userId: string) => {
  console.log('Open habit', id, userId)
  router.push({ name: 'HabitDetail', params: { habitId: id, userId } })
}

const Create = () => {
  console.log('Create new habit')
  router.push({ name: 'NewHabit' })
}
</script>
