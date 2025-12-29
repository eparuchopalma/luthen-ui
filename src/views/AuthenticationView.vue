<script setup lang="ts">
import Button from "../components/layout/Button.vue"
import { authStore } from "../store/authStore"
import { useAuth0 } from "@auth0/auth0-vue"
import { watch } from "vue"

const { isAuthenticated, loginWithRedirect } = useAuth0()

const emit = defineEmits(['showActionsOnError'])

function handleLogin(inDemo: boolean) {
  authStore.login(inDemo)
}

watch(isAuthenticated, (authenticated) => {
  if (authenticated) handleLogin(false)
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
      @click="() => handleLogin(true)" />
      <Button
      type="button"
      text="Iniciar Sesión"
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
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: end;
    justify-content: end;
  }

  .footer__img {
    position: absolute;
    right: 8px;
    bottom: 8px;
    width: 24px;
    height: 24px;
    padding: 2px;
    border: 1px solid var(--light);
    background-color: var(--lightest);
    border-radius: 50%;
  }

  .footer__text {
    padding-right: 20px;
    font-size: 2.4rem;
    font-family: "Sacramento", cursive;
    font-weight: 400;
    font-style: normal;
    transform: rotate(-15deg);
  }

</style>