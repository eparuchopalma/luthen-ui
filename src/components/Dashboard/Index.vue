<script setup lang="ts">
import Logo from "../Auth/Logo.vue"
import Status from "./Status.vue"
import Records from "./Records.vue"
import Insights from "./Insights.vue"
</script>

<template>
  <aside class="app-bar">
    <Logo :sm="true" />
  </aside>
  <main>
    <Status />
    <Records />
    <Insights />
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
  padding-top: 48px;
  min-height: 94vh;
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