<script lang="ts" setup>
import Logo from './Logo.vue'

defineProps({
  theme: String
})

const emit = defineEmits(['toggleTheme'])

</script>

<template>
  <aside class="app-bar">
    <Logo :sm="true" />
    <button
    type="button"
    :class="['theme-button', `theme-button_${theme}`]" @click="emit('toggleTheme')" />
  </aside>
</template>

<style scoped>

.app-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
}

.theme-button {
  width: 24px;
  height: 24px;
  background-color: var(--primary);
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: contain;
}

.theme-button_dark {
  background-image: url('../../assets/moon.png');
}

.theme-button_light {
  background-image: url('../../assets/sun.png');
}

</style>