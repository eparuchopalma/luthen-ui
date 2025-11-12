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

.card-container {
  display: grid;
  grid-template-columns: 1fr;
}

.card {
  margin: 32px auto;
  width: 220px;
  height: 100px;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 2px 2px 1px #191817;
  text-align: center;
}

.card_sm {
  width: 200px;
  height: 90px;
}

.card_background {
  background-image: url('../../assets/seed-bag.png');
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: 16px 16px;
}

.card__balance {
  font-weight: 400;
  font-size: 1.8rem;
}

.card__balance_text-right {
  text-align: right;
}

.card__balance_lg {
  font-size: 2.4rem;
}

.card__description {
  color: var(--light);
  margin-top: 8px;
  font-size: 1.6rem;
}

.card__description_text-left {
  text-align: left;
}

.card__actions {
  display: flex;
  gap: 8px;
}

.card__action {
  margin-top: 8px;
  flex: 1;
  height: 20px;
  border: none;
  background-color: var(--darkest);
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 1px 1px #191817;
  transition: box-shadow 0.3s;
  background-repeat: no-repeat;
  background-size: 12px;
  background-position: center;
}

.card__action_edit {
  background-image: url('../../assets/edit.png');
}

.card__action_delete {
  background-image: url('../../assets/trash.png');
}

.card__action:hover {
  box-shadow: 0 1px 1px var(--accent);
}

@media (width >= 480px) {
  .card-container {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
}

@media (width >= 640px) {
  .card-container_three-columns {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }
}

</style>