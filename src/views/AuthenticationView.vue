<script setup lang="ts">
import Button from "../components/layout/Button.vue"
import { authStore } from "../store/authStore"
import { useAuth0 } from "@auth0/auth0-vue"
import { watch } from "vue"

const {
  isAuthenticated,
  isLoading,
  loginWithRedirect,
} = useAuth0()

const emit = defineEmits(['showActionsOnError'])

function handleLogin(inDemo: boolean) {
  authStore.login(inDemo)
}

watch([isAuthenticated, isLoading], ([authenticated]) => {
  if (authenticated) handleLogin(false)
}, { immediate: true })

</script>

<template>
  <main>
    <header>
      <img src="../assets/logo.svg" alt="Logo Luthen: Buho sobre la cornucopia" class="app-logo">
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
      <ul class="link-container">
        <li>
          <img src="../assets/brand-logo.svg" alt="Logo / marca personal" class="brand-logo">
        </li>
        <li>
          <a href="#" class="link">Sitio web</a>
        </li>
        <li>
          <a href="#" class="link">LinkedIn</a>
        </li>
      </ul>
      <p class="footer__text">
        Gracias por estar aquí.
        <br>
        Edgar
      </p>
    </footer>
  </main>
</template>

<style scoped>

  .app-logo {
    margin: 20px auto 12px;
    width: 220px;
  }

  .owl, .cornucopia {
    fill: var(--tertiary);
  }

  .headline {
    margin: 20px 0 10px;
    font-size: 6.4rem;
  }

  .footer {
    height: 120px;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: right;
  }

  .brand-logo {
    width: 24px;
    height: 24px;
    padding: 2px;
    border: 1px solid var(--light);
    background-color: var(--lightest);
    border-radius: 50%;
  }

  .link-container {
    padding: 0 12px;
    align-self: end;
    align-items: center;
    display: flex;
    gap: 16px;
    list-style: none;
  }

  .link {
    font-weight: 400;
    font-size: 1.4rem;
    color: var(--tertiary);
  }

  .link:hover {
    color: var(--tertiary);
    text-decoration-color: var(--accent);
  }

  .footer__text {
    padding-right: 20px;
    display: inline-block;
    font-size: 2.4rem;
    font-family: "Sacramento", cursive;
    font-weight: 400;
    font-style: normal;
    transform: rotate(-25deg);
  }

</style>