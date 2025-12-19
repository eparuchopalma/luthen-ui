<script setup lang="ts">
import { onMounted, provide, ref, watch } from "vue"
import { useAuth0 } from '@auth0/auth0-vue'
import Auth from "./components/auth/Auth.vue"
import Insights from "./components/insights/Insights.vue"
import AppBar from "./components/layout/AppBar.vue"
import Query from "./components/query/Query.vue"
import Status from "./components/status/Status.vue"
import Button from "./components/layout/Button.vue"
import { authStore } from "./store/authStore"
import { recordStore } from "./store/recordStore"
import AlertBox, { type Alert } from "./components/layout/AlertBox.vue"
import { fundStore } from "./store/fundStore"

onMounted(() => setTheme())

const { isAuthenticated, getAccessTokenSilently, logout } = useAuth0()

const alertData = ref<{
  text: string,
  title?: string,
  autoDismiss: boolean,
  onConfirm?: () => any
}>()

const errorLoadingFunds = ref(false)
const loading = ref(false)

const showingAlert = ref(false)
const preferredTheme = ref()

function setAlertData(newAlert: Alert) {
  showingAlert.value = true
  alertData.value = newAlert
}

function setTheme() {
  const storedPreference = localStorage.getItem('theme')
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

async function getToken() {
  try {
    const token = await getAccessTokenSilently()
    return token
  } catch (error) {
    setAlertData({
      title: 'Error cargando fondos',
      text: 'Algo no salió como se esperaba al tratar de recuperar los datos.',
      autoDismiss: false
    })
    console.error(error)
  } finally {
    loading.value = false  
  }
}

async function getFunds() {
  loading.value = true
  const token = authStore.inDemo ? null : await getToken()
  const { errorMessage } = await fundStore.getFunds(token!)
  setAlertData({
    text: errorMessage || 'Fondos cargados',
    title: errorMessage ? 'Error cargando fondos' : '',
    autoDismiss: !Boolean(errorMessage)
  })
  loading.value = false
}

function showActionsOnError() {
  errorLoadingFunds.value = true
}

provide('showAlert', setAlertData)

watch(isAuthenticated, isAuth => authStore.isAuthenticated = isAuth)

</script>

<template>
  <main class="main">
    <Auth v-if="!authStore.isAuthenticated && !authStore.inDemo" />
    <div v-else-if="errorLoadingFunds">
      <section class="section">
        <p>Sus datos no pudieron ser cargados.</p>
        <Button text="Reintentar" :disabled="loading" @click="getFunds" />
        <Button text="Cerrar sesion" :disabled="loading" @click="logout" :modifiers="['secondary']" />
      </section>
    </div>
    <div v-else>
      <AppBar :theme="preferredTheme" @toggle-theme="toggleTheme" />
      <section class="section">
        <Status @showActionsOnError="showActionsOnError" />
      </section>
      <section class="section">
        <Query />
      </section>
      <section class="section" v-if="recordStore.records.length">
        <Insights />
      </section>
    </div>
  </main>
  <Transition>
    <AlertBox
    v-if="showingAlert"
    :text="alertData!.text"
    :title="alertData!.title"
    :auto-dismiss="alertData!.autoDismiss"
    :on-confirm="alertData!.onConfirm"
    @dismiss="showingAlert = false" />
  </Transition>
</template>

<style>
/* Default styles for transitioning dialogs */
.v-enter-active,
.v-leave-active {
  transition: opacity .4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.section {
  padding-top: 48px;
  min-height: 94vh;
}

.section__icon {
  margin: 24px auto;
  width: 32px;
  height: 32px;
  padding: 6px;
  background-color: var(--dark);
  border-radius: 50%;
}

.icon__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

</style>