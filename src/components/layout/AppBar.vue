<script lang="ts" setup>
  import { useAuth0 } from '@auth0/auth0-vue'
  import Button from './Button.vue'

  defineProps({ theme: String })

  const emit = defineEmits(['toggleTheme'])
  const { logout } = useAuth0()

</script>

<template>
  <aside class="app-bar">
    <img src="../../assets/icon.png" alt="Logo Luthen: Buho sobre la cornucopia" class="app-bar__icon">
    <div class="app-bar__actions">
      <button
        type="button"
        @click="emit('toggleTheme')"
        class="theme-button"
        :class="theme === 'light' ? 'theme-button_light' : 'theme-button_dark'">
      </button>
      <Button @click="logout" :modifiers="['secondary']" text="Cerrar sesión" />
    </div>
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

  .app-bar__actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .theme-button {
    background-color: transparent;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transition: all 1s ease-in-out;
    background-repeat: no-repeat;
    background-size: contain;
    position: relative;
  }

  .theme-button_dark {
    background-image: url('../../assets/moon.png');
  }

  .theme-button_dark::after {
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

  .theme-button_light {
    background-image: url('../../assets/sun.png');
  }

  @media (hover: hover) and (pointer: fine) {
    .theme-button_dark:hover::after {
      transform: rotate(360deg);
    }

    .theme-button_light:hover {
      transform: rotate(90deg);
    }
  }

</style>