<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    item-value="task"
    @update:options="loadItems"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineEmits } from 'vue'
import type { Header, FetchItemsParams, FetchItemsResult } from './interfaces/serverSideTable'

// Define props with types
const props = defineProps<{
  fetchItems: <T>(params: FetchItemsParams) => Promise<FetchItemsResult<T>>
  headers: Header[]
  itemValue?: string
}>()

const emits = defineEmits<{
  <T>(e: 'update:items', items: T[]): void
}>()

const itemsPerPage = ref(5)
const serverItems = ref<any[]>([])
const loading = ref(true)
const totalItems = ref(0)

function loadItems({ page, itemsPerPage, sortBy }: FetchItemsParams) {
  loading.value = true
  props
    .fetchItems({
      page,
      itemsPerPage,
      sortBy
    })
    .then(({ items, total }) => {
      serverItems.value = items
      totalItems.value = total
      loading.value = false
      emits('update:items', items)
    })
}
</script>
