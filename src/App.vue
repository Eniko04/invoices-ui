<script setup lang="ts">
import Toasts from './components/Toasts.vue'
</script>

<template>
  <div class="container">
    <router-view />
    <Toasts />
  </div>
</template>

<style>
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
}
</style>
