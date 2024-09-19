<template>
  <div class="dropdown">
    <button
      class="btn btn-outline-secondary btn-sm dropdown-toggle custom-dropdown"
      type="button"
      id="dropdownMenuButton"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <slot name="button-text">Dropdown</slot>
    </button>
    <ul
      class="dropdown-menu dropdown-menu-end custom-dropdown-menu"
      aria-labelledby="dropdownMenuButton"
    >
      <slot name="dropdown-menu"></slot>
    </ul>
  </div>
</template>

<script setup lang="ts">
// No additional script needed for now
</script>

<style scoped>
.custom-dropdown {
  width: 100px;
}

.custom-dropdown-menu {
  width: 300px;
}
</style>
