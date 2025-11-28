<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { fundStore, type Fund } from "../../store/fundStore"
import FundForm from "./FundForm.vue"
import RecordForm from "./RecordForm.vue"
import { amountFormatter } from "../../utils/formatter"

onMounted(() => setFunds())

const loading = ref(false)
const fundFormIsOpen = ref(false)
const recordFormIsOpen = ref(false)
const fundEditing = ref<Fund | null>(null)

const totalBalance = computed(() => {
  return fundStore.funds.reduce((acc, fund) => acc + Number(fund.balance), 0)
})

async function setFunds() {
  loading.value = true
  const { errorMessage } = await fundStore.getFunds()
  if (errorMessage) alert(errorMessage)
  loading.value = false
}

function selectFund(fund: Fund) {
  fundEditing.value = fund
  fundFormIsOpen.value = true
}

function dismissFundForm() {
  fundFormIsOpen.value = false
}

function dismissRecordForm() {
  recordFormIsOpen.value = false
}

</script>

<template>
  <header>
    <div class="section__icon">
      <img src="../../assets/balance.png" alt="balance icon" class="icon__img">
    </div>
    <h1>Status</h1>
  </header>
  <p v-if="loading">...Loading</p>
  <div class="card card_sm">
    <strong class="card__balance card__balance_lg">{{ amountFormatter(totalBalance) }}</strong>
    <p class="card__description">Balance</p>
  </div>
  <dl
  v-if="fundStore.funds.length"
  class="card-container"
  :class="{ 'card-container_three-columns': fundStore.funds.length >= 3 }">
    <div
    v-for="fund in fundStore.funds"
    :key="fund.id" class="card card_background"
    @click="selectFund(fund)">
      <dd class="card__balance card__balance_text-right">{{ amountFormatter(fund.balance) }}</dd>
      <dt class="card__description card__description_text-left">{{ fund.name }}</dt>
    </div>
  </dl>
  <div class="button-container">
    <button
    class="button button_secondary"
    type="button"
    @click="fundFormIsOpen = true"
    >Add fund</button>
    <button
    class="button"
    type="button"
    @click="recordFormIsOpen = true"
    >Add record</button>
  </div>
  <Transition>
    <FundForm v-if="fundFormIsOpen" @dismiss-form="dismissFundForm" :fund="fundEditing" />
    <RecordForm v-else-if="recordFormIsOpen" @dismiss-form="dismissRecordForm" />
  </Transition>
</template>

<style>

.card-container {
  display: grid;
  grid-template-columns: 1fr;
}

.card {
  margin: 32px auto;
  width: 220px;
  height: 80px;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 2px 2px 1px #191817;
  text-align: center;
}

@media (hover: hover) and (pointer: fine) {

  .card {
    transition: box-shadow 0.3s;
  }
  
  .card:hover {
    cursor: pointer;
    box-shadow: -2px 2px 6px var(--accent);
  }

}

.card_sm {
  width: 200px;
  height: 90px;
}

.card_background {
  background-image: url('../../assets/seed-bag.png');
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: 8px 8px;
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
  margin-top: 20px;
  font-size: 1.4rem;
}

.card__description_text-left {
  text-align: left;
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

.form {
  width: 100%;
  max-width: 360px;
  height: 100%;
  max-height: 600px;
  border-radius: 4px;
  padding: 0 32px;
  display: grid;
  place-items: center;
  background-color: var(--darkest);
  color: var(--lightest);
}

.form_sm {
  max-width: 300px;
  max-height: 220px;
}

.fieldset {
  border: none;
}

.label {
  margin: 0 6px;
  width: 45%;
  display: inline-block;
  text-align: left;
  font-size: 1.2rem;
  color: var(--light);
}

.label_w-full {
  width: 100%;
}

.label_mt {
  margin-top: 24px;
}

.label-alert::after {
  content: '!';
  margin-left: 4px;
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
  text-align: center;
  font-weight: bold;
  background-color: var(--accent);
  color: var(--darkest);
}

.input {
  margin: 0 6px;
  width: calc(90% + 12px);
  background-color: var(--darkest);
  color: var(--lightest);
  border: none;
  border-bottom: 1px solid var(--light);
}

.input_w-half {
  display: inline-block;
  width: 45%;
}

.input_text-right {
  text-align: right;
}

.input::selection, .input:focus {
  border-color: var(--accent);
  outline: none;
}

.select {
  margin: 4px 6px 0;
  width: 45%;
  height: 28px;
  border: 1px solid var(--dark);
  padding: 0 2px;
  background-color: var(--darkest);
  border-radius: 20px;
  outline: none;
}

.select::selection, .select:focus {
  border-color: var(--accent);
}

::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

/* Remove the default arrows from input number fields */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
  appearance: inherit;
}

</style>