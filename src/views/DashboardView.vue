<script setup lang="ts">
import { onMounted, provide, ref } from "vue"
import { useAuth0 } from '@auth0/auth0-vue'
import { recordStore } from "../store/recordStore"
import { authStore } from "../store/authStore"
import { fundStore } from "../store/fundStore"
import Insights from "../components/insights/Insights.vue"
import Button from "../components/layout/Button.vue"
import Section from "../components/layout/Section.vue"
import Query from "../components/query/Query.vue"
import Status from "../components/status/Status.vue"
import BottomBar from "../components/layout/BottomBar.vue"
import RecordForm from '../components/status/RecordForm.vue'
import QueryForm from '../components/status/QueryForm.vue'
import AlertBox, { type Alert } from "../components/layout/AlertBox.vue"
import balance from '../assets/balance.png'
import lupe from '../assets/lupe.png'
import lupeChart from '../assets/lupe-chart.png'

onMounted(() => getFunds())

const { getAccessTokenSilently } = useAuth0()

const alertData = ref<Alert>()
const showingAlert = ref(false)
const dataLoaded = ref(false)
const loading = ref(false)
const recordFormIsOpen = ref(false)
const queryFormIsOpen = ref(false)

function dismissRecordForm() {
  recordFormIsOpen.value = false
}

function dismissQueryForm() {
  queryFormIsOpen.value = false
}

function setAlertData(newAlert: Alert) {
  showingAlert.value = true
  alertData.value = newAlert
}

async function getToken() {
  try {
    const token = await getAccessTokenSilently()
    return token
  } catch (error) {
    setAlertData({
      title: 'Error de autenticación',
      text: 'Algo no salió como se esperaba al solicitar los datos.',
      autoDismiss: false
    })
    console.error(error)
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
  dataLoaded.value = !Boolean(errorMessage)
  loading.value = false
}

provide('showAlert', setAlertData)
</script>

<template>
  <main>
    <div v-if="loading" class="skeleton"></div>
    <div v-else-if="dataLoaded">
      <Section title="Estado" description="Balance general y fondos" :icon="balance">
        <Status />
      </Section>
      <Section
      id="table"
      v-if="recordStore.records.length"
      title="Registros"
      description="Resultados de su búsqueda"
      :icon="lupe">
        <Query />
      </section>
      <Section
      v-if="recordStore.records.length"
      title="Estadísticas"
      description="Gráficas y listas"
      :icon="lupeChart">
        <Insights />
      </section>
    </div>
    <div v-else>
      <section class="section">
        <p class="error-message">Su data no pudo obtenerse.</p>
        <Button text="Reintentar" :disabled="loading" @click="getFunds" />
      </section>
    </div>
    <Transition>
      <RecordForm v-if="recordFormIsOpen" @dismiss-form="dismissRecordForm" />
      <QueryForm v-else-if="queryFormIsOpen" @dismiss-form="dismissQueryForm" />
    </Transition>
    <Transition>
      <AlertBox
      v-if="showingAlert"
      :text="alertData!.text"
      :title="alertData!.title"
      :auto-dismiss="alertData!.autoDismiss"
      :on-confirm="alertData!.onConfirm"
      @dismiss="showingAlert = false" />
    </Transition>
  </main>
  <BottomBar
  @open-query-form="queryFormIsOpen = true"
  @open-record-form="recordFormIsOpen = true" />
</template>

<style scoped>
  .skeleton {
    height: 90vh;
    display: grid;
    justify-content: center;
    justify-items: center;
  }

  .skeleton::before {
    content: ".";
    align-self: center;
    color: transparent;
    height: 38px;
    width: 38px;
    border-radius: 50%;
    background-color: var(--secondary);
    animation-name: skeleton;
    animation-duration: .5s;
    animation-iteration-count: infinite;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }
  
  .skeleton::after {
    align-self: start;
    content: ".";
    border-radius: 4px;
    width: 160px;
    height: 80px;
    padding: 8px;
    box-sizing: border-box;
    color: transparent;
    background-color: var(--secondary);
    animation-name: skeleton;
    animation-duration: .5s;
    animation-iteration-count: infinite;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }

  .error-message {
    margin-top: 24px;
  }

  @keyframes skeleton {
    from {
      opacity: .3;
    }
    to {
      opacity: 1;
    }
  }
</style>