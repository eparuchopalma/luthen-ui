<script setup lang="ts">
import Auth from "./components/auth/Auth.vue"
import Insights from "./components/insights/Insights.vue"
import AppBar from "./components/layout/AppBar.vue"
import Query from "./components/query/Query.vue"
import Status from "./components/status/Status.vue"
import { authStore } from "./store/authStore"
import { recordStore } from "./store/recordStore"

</script>

<template>
  <main class="main">
    <Auth v-if="!authStore.isAuthenticated && !authStore.inDemo" />
    <div v-else>
      <AppBar />
      <section class="section">
        <Status />
      </section>
      <section class="section">
        <Query />
      </section>
      <section class="section" v-if="recordStore.records.length">
        <Insights />
      </section>
    </div>
  </main>
</template>

<style>
/* Default styles for transitioning dialogs */
.v-enter-active,
.v-leave-active {
  transition: opacity .3s ease;
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
  border-radius: 50%;
}

.icon__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

</style>