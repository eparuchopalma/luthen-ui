<script setup lang="ts">
import Logo from "../Auth/Logo.vue"
import Status from "./Status.vue"
import Records from "./Records.vue"
import { onMounted, ref } from "vue"
import { fundStore } from "../../store/fundStore"

onMounted(() => setFunds())

const loading = ref(false)

async function setFunds() {
  loading.value = true
  const { errorMessage } = await fundStore.getFunds()
  if (errorMessage) alert(errorMessage)
  loading.value = false
}

</script>

<template>
  <aside class="app-bar">
    <Logo :sm="true" />
  </aside>
  <main>
    <Status />
    <Records />
  </main>
</template>

<style>

.app-bar {
  display: flex;
  justify-content: start;
  align-items: center;
  position: sticky;
}

.section {
  min-height: 100vh;
}

.section__icon {
  margin: 24px auto;
  width: 32px;
  height: 32px;
  padding: 6px;
  border-radius: 50%;
}

.icon__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

</style>