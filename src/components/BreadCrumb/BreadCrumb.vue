<template>
  <nav aria-label="breadcrumb" class="breadcrumb">
    <ol class="breadcrumb">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === breadcrumbs.length - 1 }"
      >
        <router-link v-if="index < breadcrumbs.length - 1" :to="crumb.path">{{
          crumb.label
        }}</router-link>
        <span v-else>{{ crumb.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const matched = route.matched
  return matched.map((routeRecord) => ({
    path: routeRecord.path,
    label: routeRecord.name
  }))
})
</script>

<style scoped>
.breadcrumb {
  background-color: transparent;
  padding: 1rem;
  margin: 0;
  list-style: none;
  position: fixed;
  top: 50px;
  right: 0;
  left: 0;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: '>';
  padding: 0 0.5rem;
}
</style>
