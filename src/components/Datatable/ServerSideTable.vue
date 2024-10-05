<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :items-per-page-options="[5, 10, 15]"
    :loading="loading"
    :item-value="itemValue"
    @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-btn class="mb-2" color="primary" dark v-bind="props"> New Item </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template #item.name="{ item }">
      <slot name="item.name" :item="item"></slot>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts" generic="T extends TableData">
import { ref, type Ref } from 'vue'
import { defineEmits } from 'vue'
import type { Header, FetchItemsParams, FetchItemsResult } from './interfaces/serverSideTable'
import type { TableData } from '@/types/tableData'

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
const serverItems: Ref<T[]> = ref([])
const loading = ref(true)
const totalItems = ref(0)

function loadItems({ page, itemsPerPage, sortBy }: FetchItemsParams) {
  loading.value = true
  props
    .fetchItems<T>({
      page,
      itemsPerPage,
      sortBy
    })
    .then(({ items, total }: FetchItemsResult<T>) => {
      serverItems.value = items
      totalItems.value = total
      loading.value = false
      emits('update:items', items)
    })
}
</script>
