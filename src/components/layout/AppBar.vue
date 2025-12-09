<script lang="ts" setup>
import Logo from './Logo.vue'
import Button from './Button.vue'

function toggleTheme() {
  const newTheme = document.body.getAttribute('class') === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', newTheme)
  document.body.setAttribute('class', newTheme)
}

</script>

<template>
  <aside class="app-bar">
    <Logo :sm="true" />
    <Button text="Tema" :modifiers="['secondary', 'sm']" @click="toggleTheme" />
  </aside>
</template>

<style scoped>

.app-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
}

</style>