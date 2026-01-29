<script setup lang="ts">
import Button from "../components/layout/Button.vue"
import { authStore } from "../store/authStore"
import { useAuth0 } from "@auth0/auth0-vue"
import { watchEffect } from "vue"

const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()

const emit = defineEmits(['showActionsOnError'])

function handleLogin(inDemo: boolean = false) {
  authStore.login(inDemo)
}

watchEffect(() => {
  if (isAuthenticated.value) handleLogin()
})

</script>

<template>
  <main>
    <header>
      <img src="../assets/logo.svg" alt="Logo de Luthen: Buho sobre una cornucopia" class="app-logo">
      <h1 class="headline">Luthen</h1>
      <p>Registro financiero</p>
    </header>
    <div class="button-container">
      <Button
      type="button"
      text="Iniciar Demo"
      :modifiers="['secondary']"
      :disabled="isLoading"
      @click="() => handleLogin(true)" />
      <Button
      type="button"
      text="Iniciar Sesión"
      :disabled="isLoading"
      @click="loginWithRedirect" />
    </div>
    <footer class="footer">
      <img src="../assets/brand-logo.svg" alt="Logo / marca personal" class="footer__img">
      <p class="footer__text">
        Gracias por estar aquí.
        <br>
        Edgar Parucho Palma
      </p>
    </footer>
  </main>
</template>

<style scoped>

  .app-logo {
    margin: 20px auto 12px;
    width: 220px;
  }

  .headline {
    margin: 20px 0 10px;
    font-size: 6.4rem;
  }

  .footer {
    width: 98%;
    position: absolute;
    bottom: 24px;
    left: 0;
    display: flex;
    align-items: end;
    justify-content: end;
  }

  .footer__img {
    position: absolute;
    right: 12px;
    bottom: 8px;
    width: 24px;
    height: 24px;
    padding: 2px;
    border: 1px solid var(--light);
    background-color: var(--lightest);
    border-radius: 50%;
  }

  .footer__text {
    margin-right: 12px;
    font-size: 2.4rem;
    font-family: "Sacramento", cursive;
    font-weight: 400;
    font-style: normal;
    transform: rotate(-15deg);
  }

</style>