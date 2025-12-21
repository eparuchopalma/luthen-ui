<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { authStore } from '../../store/authStore'
import Button from './Button.vue'
import SignOut from '../user/SignOut.vue'

onMounted(() => setTheme())

const { logout, isAuthenticated } = useAuth0()

const showingSignoutForm = ref(false)
const showingMenu = ref(false)
const preferredTheme = ref<'dark' | 'light'>()

function setTheme() {
  const storedPreference = localStorage.getItem('theme') as 'dark' | 'light' | undefined
  const systemThemeIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  if (storedPreference) preferredTheme.value = storedPreference
  else if (systemThemeIsDark) preferredTheme.value = 'dark'
  else preferredTheme.value = 'light'
  document.body.setAttribute('class', preferredTheme.value)
}

function toggleTheme() {
  const newTheme = document.body.getAttribute('class') === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', newTheme)
  document.body.setAttribute('class', newTheme)
  preferredTheme.value = newTheme
}

function handleLogout() {
  authStore.logout()
  if (isAuthenticated.value) logout()
}

</script>

<template>
  <aside class="bar">
    <img
    v-if="authStore.isAuthenticated"
    src="../../assets/icon.png"
    alt="Logo: Buho sobre la cornucopia"
    class="bar__icon">
    <button
    type="button"
    @click="toggleTheme"
    class="bar__theme-button theme-button"
    :class="preferredTheme === 'light' ? 'theme-button_light' : 'theme-button_dark'">
    </button>
    <div v-if="authStore.isAuthenticated" class="bar__menu" @mouseleave="showingMenu = false">
      <button type="button" @click="showingMenu = !showingMenu" class="bar__menu-button">
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line class="menu-icon" x1="2" y1="6" x2="46" y2="6" stroke-width="4" stroke-linecap="round"/>
          <line class="menu-icon" x1="2" y1="24" x2="46" y2="24" stroke-width="4" stroke-linecap="round"/>
          <line class="menu-icon" x1="2" y1="42" x2="46" y2="42" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </button>
      <Transition>
        <div v-if="showingMenu">
          <Button
          @click="showingSignoutForm = true"
          :modifiers="['secondary']"
          class="menu__item"
          text="Eliminar" />
          <Button
          text="Cerrar sesión" 
          class="menu__item"
          :modifiers="['secondary']" 
          @click="handleLogout" />
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

    .bar__menu-button:hover {
      box-shadow: 0 0 10px 2px var(--secondary);
    }
  }
  
  .bar__menu {
    width: 132px;
    display: grid;
    position: absolute;
    right: 24px;
  }

  .bar__menu-button {
    padding: 2px 4px;
    border-radius: 2px;
    margin-left: auto;
    transition: box-shadow .5s;
  }

  .menu-icon {
    stroke: var(--font-color);
  }

  .menu__item {
    padding-left: 8px;
    text-align-last: left;
    margin-top: 8px;
  }


</style>