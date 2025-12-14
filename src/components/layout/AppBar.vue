<script lang="ts" setup>

  defineProps({
    theme: String
  })

  const emit = defineEmits(['toggleTheme'])

</script>

<template>
  <aside class="app-bar">
    <img src="../../assets/icon.png" alt="Logo Luthen: Buho sobre la cornucopia" class="app-bar__icon">
    <button
    type="button" @click="emit('toggleTheme')" class="app-bar__theme-button" :class="theme === 'light' ? 'app-bar__theme-button_light' : 'app-bar__theme-button_dark'">
    </button>
  </aside>
</template>

<style scoped>

  .app-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .app-bar__icon {
    width: 24px;
    height: 24px;
  }

  .app-bar__theme-button {
    background-color: transparent;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transition: all 1s ease-in-out;
    background-repeat: no-repeat;
    background-size: contain;
    position: relative;
  }

  .app-bar__theme-button_dark {
    background-image: url('../../assets/moon.png');
  }

  .app-bar__theme-button_dark::after {
    position: absolute;
    top: -4px;
    right: 2px;
    content: ".";
    color: transparent;
    background-size: 4px;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('../../assets/star.png');
    transform-origin: -8px 20px;
    transition: transform 4s ease;
  }

  .app-bar__theme-button_light {
    background-image: url('../../assets/sun.png');
  }

  @media (hover: hover) and (pointer: fine) {
    .app-bar__theme-button_dark:hover::after {
      transform: rotate(360deg);
    }

    .app-bar__theme-button_light:hover {
      transform: rotate(90deg);
    }
  }

</style>