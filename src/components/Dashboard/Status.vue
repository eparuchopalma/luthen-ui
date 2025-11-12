<script setup lang="ts">
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
      <div v-for="fund in fundStore.funds" :key="fund.id" class="card card_background">
        <dd class="card__balance card__balance_text-right">{{ fund.balance }}</dd>
        <dt class="card__description card__description_text-left">{{ fund.name }}</dt>
        <div class="card__actions">
          <button class="card__action card__action_edit"></button>
          <button class="card__action card__action_delete"></button>
        </div>
      </div>
    </dl>
    <div class="button-container">
      <button
      class="button"
      type="button"
      >Add record</button>
      <button
      class="button button_secondary"
      type="button"
      >Add fund</button>
    </div>
  </section>
</template>