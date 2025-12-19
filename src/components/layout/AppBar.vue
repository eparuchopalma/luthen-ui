<script lang="ts" setup>
  import { useAuth0 } from '@auth0/auth0-vue'
  import Button from './Button.vue'
  import SignOut from '../user/SignOut.vue'

  import { ref } from 'vue'

  defineProps({ theme: String })
  const emit = defineEmits(['toggleTheme'])
  const { logout } = useAuth0()
  const showingSignoutForm = ref(false)
  const showingMenu = ref(false)

</script>

<template>
  <aside class="bar">
    <img src="../../assets/icon.png" alt="Logo: Buho sobre la cornucopia" class="bar__icon">
    <button
    type="button"
    @click="emit('toggleTheme')"
    class="bar__theme-button theme-button"
    :class="theme === 'light' ? 'theme-button_light' : 'theme-button_dark'">
    </button>
    <div class="bar__menu" @mouseleave="showingMenu = false">
      <Button
      @click="showingMenu = true"
      :modifiers="['secondary', 'sm']"
      text="Cuenta" />
      <Transition>
        <div v-if="showingMenu">
          <Button
          @click="showingSignoutForm = true"
          :modifiers="['secondary']"
          class="menu__item"
          text="Eliminar" />
          <Button
          v-if="showingMenu"
          @click="logout"
          class="menu__item"
          :modifiers="['secondary']"
          text="Cerrar sesión" />
        </div>
      </Transition>
    </div>
  </aside>
  <Transition>
    <SignOut v-if="showingSignoutForm" @dismiss-form="showingSignoutForm = false" />
  </Transition>
</template>

<style scoped>

  .bar {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .bar__icon {
    width: 24px;
    height: 24px;
  }

  .bar__theme-button {
    margin-left: 18px;
    margin-right: auto;
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
  
  .bar__menu {
    width: 132px;
    display: grid;
    position: absolute;
    right: 0;
  }

  .menu__item {
    padding-left: 8px;
    text-align-last: left;
    margin-top: 8px;
  }


</style>