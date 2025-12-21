<script setup lang="ts">
import { authStore } from "./store/authStore"
import AppBar from "./components/layout/AppBar.vue";
import AuthenticationView from "./views/AuthenticationView.vue"
import DashboardView from "./views/DashboardView.vue"
</script>

<template>
  <AppBar />
  <DashboardView v-if="authStore.isAuthenticated" />
  <AuthenticationView v-else />
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

</style>