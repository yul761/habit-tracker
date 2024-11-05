<template>
  <div class="dropdown">
    <span
      class="dropdown-toggle"
      id="dropdownMenuButton"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <slot name="selected">{{ defaultText }}</slot>
    </span>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
      <li v-for="(item, index) in items" :key="index">
        <a class="dropdown-item" href="#" @click.prevent="selectItem(item)">{{ item }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps({
  items: {
    type: Array as () => string[],
    required: true
  },
  defaultText: {
    type: String,
    default: 'Select an item'
  }
})

const emits = defineEmits(['select'])

const selectItem = (item: string) => {
  emits('select', item)
}
</script>

<style scoped>
.dropdown-toggle {
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  color: inherit;
  font: inherit;
  outline: inherit;
}

.dropdown-menu {
  cursor: pointer;
}
</style>
