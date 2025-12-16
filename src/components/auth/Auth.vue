<script setup lang="ts">
import Button from "../layout/Button.vue"
import { authStore } from "../../store/authStore"
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect, isLoading } = useAuth0()

const handleLogin = () => {
  loginWithRedirect()
}

async function startDemo() {
  authStore.loginForDemo()
}

</script>

<template>
  <header>
    <img src="../../assets/logo.svg" alt="Logo Luthen: Buho sobre la cornucopia" class="app-logo">
    <h1 class="headline">Luthen</h1>
    <p>Registro financiero</p>
  </header>
  <div class="button-container">
    <Button
    :modifiers="['secondary']"
    type="button"
    :disabled="isLoading"
    @click="startDemo"
    text="Iniciar Demo" />
    <Button
    type="button"
    :disabled="isLoading"
    @click="handleLogin"
    text="Iniciar Sesión" />
  </div>
  <footer class="footer">
    <ul class="link-container">
      <li>
        <img src="../../assets/brand-logo.svg" alt="Logo / marca personal" class="brand-logo">
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
</template>

<style scoped>

  .app-logo {
    margin: 48px auto 0;
    width: 220px;
  }

  .owl, .cornucopia {
    fill: var(--tertiary);
  }

  .main {
    padding-top: 40px;
  }

  .headline {
    margin: 40px 0 10px;
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
    padding: 2px;
    background-color: var(--light);
    border-radius: 50%;
    width: 24px;
    height: auto;
  }

  .link-container {
    padding: 0 12px;
    display: flex;
    justify-self: start;
    align-self: end;
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