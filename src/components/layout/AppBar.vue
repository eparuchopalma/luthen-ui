<script lang="ts" setup>
  import { useAuth0 } from '@auth0/auth0-vue'
  import Button from './Button.vue'
  import SignOut from '../user/SignOut.vue'

  import { ref } from 'vue'

  defineProps({ theme: String })
  const emit = defineEmits(['toggleTheme'])
  const { logout } = useAuth0()
  const showingSignoutForm = ref(false)

</script>

<template>
  <aside class="app-bar">
    <div class="app-bar__item">
      <img src="../../assets/icon.png" alt="Logo Luthen: Buho sobre la cornucopia" class="app-bar__icon">
    </div>
    <div class="app-bar__item app-bar__item_justify-center">
      <button
      type="button"
      @click="emit('toggleTheme')"
      class="theme-button"
      :class="theme === 'light' ? 'theme-button_light' : 'theme-button_dark'">
      </button>
    </div>
    <div class="app-bar__item app-bar__item_justify-end">
      <Button @click="showingSignoutForm = true" :modifiers="['secondary', 'sm']" text="Eliminar" />
      <Button @click="logout" :modifiers="['secondary', 'sm']" text="Salir" />
    </div>
  </aside>
  <Transition>
    <SignOut v-if="showingSignoutForm" @dismiss-form="showingSignoutForm = false" />
  </Transition>
</template>

<style scoped>

  .app-bar {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .app-bar__icon {
    width: 24px;
    height: 24px;
  }

  .app-bar__item {
    display: flex;
    width: 33%;
  }

  .app-bar__item_justify-center {
    justify-content: center;
  }

  .app-bar__item_justify-end {
    justify-content: end;
  }

  .theme-button {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: transparent;
    background-repeat: no-repeat;
    background-size: contain;
    transition: all 1s ease-in-out;
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