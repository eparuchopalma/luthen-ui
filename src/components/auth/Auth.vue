<script setup lang="ts">
import Logo from "../layout/Logo.vue";
import { authStore } from "../../store/authStore"

async function startDemo() {
  authStore.loginForDemo()
}

</script>

<template>
  <Logo :centered="true" />
  <header>
    <h1 class="headline">Squirrel</h1>
    <p>Financial Log</p>
  </header>
  <div class="button-container">
    <button
    class="button button_secondary"
    type="button"
    @click="startDemo">Start Demo</button>
  </div>
  <footer class="footer">
    <ul class="link-container">
      <li>
        <img src="../../assets/brand_light.svg" alt="Brand logo" class="brand-logo">
      </li>
      <li>
        <a href="#" class="link">Website</a>
      </li>
      <li>
        <a href="#" class="link">LinkedIn</a>
      </li>
    </ul>
    <p class="footer__text">
      Thank you for being here.
      <br>
      Edgar
    </p>
  </footer>
</template>

<style scoped>

.main {
  padding-top: 40px;
}

.brand-logo {
  width: 24px;
  height: auto;
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

.footer__text {
  padding-right: 20px;
  display: inline-block;
  font-size: 2.4rem;
  font-family: "Sacramento", cursive;
  font-weight: 400;
  font-style: normal;
  transform: rotate(-25deg);
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
  color: var(--light);
}

.link:hover {
  color: var(--lightest);
  text-decoration-color: var(--accent);
}

</style>