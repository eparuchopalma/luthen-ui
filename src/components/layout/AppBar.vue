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
    <button
    type="button"
    @click="toggleTheme"
    class="bar__theme-button"
    :class="preferredTheme === 'light' ? 'bar__theme-button_light' : 'bar__theme-button_dark'">
    </button>
    <div role="alert" class="demo-alert" v-if="authStore.inDemo">
      Demo
    </div>
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
          text="Eliminar datos" />
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
    width: 100%;
    padding: 16px 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: var(--primary);
    transition: background-color .5s;
  }

  .bar__theme-button {
    margin-right: auto;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transition: all 1s ease-in-out;
    position: relative;
  }

  .bar__theme-button_dark {
    box-shadow: -6px 3px 6px var(--accent);
  }

  .bar__theme-button_light {
    background-color: var(--accent);
    box-shadow: 0 0 6px var(--accent);
  }

  .bar__theme-button_dark::after {
    position: absolute;
    top: 0;
    right: 2px;
    content: "*";
    font-size: 1rem;
    color: var(--accent);
    transform-origin: -8px 10px;
    transition: transform 2s ease;
  }

  .bar__theme-button_light::before {
    position: absolute;
    top: 4px;
    right: -1px;
    content: "*";
    width: 10px;
    height: 4px;
    border-radius: 40%;
    color: transparent;
    background-color: var(--secondary);
    box-shadow: 0 0 4px var(--dark);
    transition: transform 2s ease;
  }

  .bar__theme-button_light::after {
    position: absolute;
    top: 2px;
    right: 0;
    content: "*";
    width: 6px;
    height: 3px;
    border-radius: 50%;
    color: transparent;
    background-color: var(--secondary);
    transition: transform 2s ease;
  }

  @media (hover: hover) and (pointer: fine) {
    .bar__theme-button_dark:hover::after {
      transform: rotate(360deg);
    }

    .bar__theme-button_light:hover::before {
      transform: translateX(-10px)
    }

    .bar__theme-button_light:hover::after {
      transform: translateX(-12px)
    }

    .bar__menu-button:hover {
      box-shadow: 0 0 10px 2px var(--secondary);
    }
  }

  .demo-alert {
    position: fixed;
    top: 16px;
    left: calc(50% - 35px);
    width: 70px;
    background-color: var(--accent);
    border-radius: 20px;
    color: var(--lightest);
  }
  
  .bar__menu {
    width: 132px;
    display: grid;
    position: absolute;
    top: 16px;
    right: 64px;
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