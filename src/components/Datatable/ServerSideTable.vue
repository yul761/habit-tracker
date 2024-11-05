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
        <v-btn class="mb-2" color="primary" dark @click="$emit('new')" v-bind="props">
          New Item
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template #item.name="{ item }">
      <slot name="item.name" :item="item"></slot>
    </template>
    <template #item.isActive="{ item }">
      <v-row align="center" justify="end">
        <v-checkbox v-model="item.isActive" disabled />
      </v-row>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts" generic="T extends TableData">
import { ref, type Ref } from 'vue'
import type { Header, FetchItemsParams, FetchItemsResult } from './interfaces/serverSideTable'
import type { TableData } from '@/types/tableData'
import { useAuthStore } from '@/stores/auth'
import { auth } from '@/firebase/firebase.base'
import { onAuthStateChanged } from 'firebase/auth'
import _ from 'lodash'

// Define props with types
const props = defineProps<{
  fetchItems: <T>(params: FetchItemsParams) => Promise<FetchItemsResult<T>>
  headers: Header[]
  itemValue?: string
}>()

const emits = defineEmits<{
  <T>(e: 'update:items', items: T[]): void
  (e: 'new'): void
}>()

const authStore = useAuthStore()
const itemsPerPage = ref(0)
const serverItems: Ref<T[]> = ref([])
const loading = ref(true)
const totalItems = ref(0)

function loadItems({ page, itemsPerPage, sortBy }: FetchItemsParams) {
  if (!authStore.user) {
    console.log('User is not signed in, skipping loadItems.')
    return
  }

  const userId = authStore.user.uid
  props
    .fetchItems<T>({
      page,
      itemsPerPage,
      sortBy,
      userId
    })
    .then(({ items, total }: FetchItemsResult<T>) => {
      serverItems.value = items
      totalItems.value = total
      loading.value = false
      emits('update:items', items)
    })
}

onAuthStateChanged(auth, (user) => {
  loading.value = true
  if (user) {
    console.log('User is signed in:', user)
    authStore.user = user
    itemsPerPage.value = 5
  } else {
    console.log('No user is signed in')
    loading.value = false
  }
})
</script>
