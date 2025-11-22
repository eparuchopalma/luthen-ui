<script lang="ts" setup>
import Logo from './Logo.vue';
</script>

<template>
  <aside class="app-bar">
    <Logo :sm="true" />
  </aside>
</template>

<style scoped>

.app-bar {
  display: flex;
  justify-content: start;
  align-items: center;
  position: sticky;
}

</style>