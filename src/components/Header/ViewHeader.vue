<template>
  <header class="navbar navbar-expand-lg navbar-light bg-light fixed-top w-100 custom-header">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <div class="navbar-brand">
        <slot name="left"></slot>
      </div>
      <div class="d-flex justify-content-center flex-grow-1">
        <slot name="middle"></slot>
      </div>
      <div class="d-flex">
        <slot name="right"></slot>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// No script needed for this component
</script>

<style scoped>
.custom-header {
  height: 50px;
  padding: 0.5rem 1rem; /* Adjust padding to make the header smaller */
  font-size: 0.875rem; /* Optional: Adjust font size if needed */
}
</style>
