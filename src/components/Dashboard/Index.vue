<script setup lang="ts">
import Logo from "../Auth/Logo.vue"
import { onMounted, ref, computed } from "vue"
import { fundStore } from "../../store/fundStore"

onMounted(() => setFunds())

const loading = ref(false)

const totalBalance = computed(() => {
  return fundStore.funds.reduce((acc, fund) => acc + Number(fund.balance), 0)
})

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
    <section class="section">
      <header>
        <div class="section__icon">
          <img src="../../assets/balance.png" alt="balance icon" class="icon__img">
        </div>
        <h1>Status</h1>
      </header>
      <p v-if="loading">...Loading</p>
      <div class="card card_sm">
        <strong class="card__balance card__balance_lg">${{ totalBalance.toFixed(2) }}</strong>
        <p class="card__description">Balance</p>
      </div>
      <dl
      v-if="fundStore.funds.length"
      class="card-container"
      :class="{ 'card-container_three-columns': fundStore.funds.length >= 3 }">
        <div v-for="fund in fundStore.funds" :key="fund.id" class="card">
          <dd class="card__balance card__balance_text-right">{{ fund.balance }}</dd>
          <dt class="card__description card__description_text-left">{{ fund.name }}</dt>
          <div class="card__actions">
            <button class="card__action card__action_edit"></button>
            <button class="card__action card__action_delete"></button>
          </div>
        </div>
      </dl>
    </section>
  </main>
</template>

<style scoped>

.app-bar {
  display: flex;
  justify-content: start;
  align-items: center;
  position: sticky;
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

@media (480px <= width) {
  .card-container {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
}

@media (640px <= width) {
  .card-container_three-columns {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }
}

</style>