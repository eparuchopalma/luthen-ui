<script setup lang="ts">
import { ref, computed } from "vue"
import { fundStore, type Fund } from "../../store/fundStore"
import { amountFormatter } from "../../utils/formatter"
import Button from "../layout/Button.vue"
import RecordForm from "./RecordForm.vue"
import FundForm from "./FundForm.vue"

const fundFormIsOpen = ref(false)
const recordFormIsOpen = ref(false)
const fundEditing = ref<Fund | null>(null)

const totalBalance = computed(() => {
  return fundStore.funds.reduce((acc, fund) => acc + Number(fund.balance), 0)
})

function selectFund(fund: Fund) {
  fundEditing.value = fund
  fundFormIsOpen.value = true
}

function dismissFundForm() {
  fundEditing.value = null
  fundFormIsOpen.value = false
}

function dismissRecordForm() {
  recordFormIsOpen.value = false
}

</script>

<template>
  <div class="card card_sm">
    <strong class="card__balance card__balance_lg">{{ amountFormatter(totalBalance) }}</strong>
    <p class="card__description">Balance</p>
  </div>
  <dl v-if="fundStore.funds.length" class="card-container">
    <div
    v-for="fund in fundStore.funds"
    :key="fund.id" class="card card_background card_hover"
    @click="selectFund(fund)">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="card__icon">
        <path d="M24 11.4999C12 11.5 4 8.2796 3.01848 12.8908C2.86099 13.6306 3.68105 14.8738 6.6 15.4672C3.01135 27.1495 3.14188 33.1994 6.6 43.2461C5.18297 44.9233 4.7662 45.7494 4.45421 47H44.5089C44.6456 45.4274 43.8357 44.6534 42.4242 43.3044L42.3632 43.2461C45.8308 32.5231 46.1608 26.4572 41.6479 15.4672C44.5329 14.4615 44.5064 12.8908 44.5064 12.1509C44.5064 9.19149 37 11.4999 24 11.4999Z" stroke="var(--font-color)" stroke-width="2"/>
        <path d="M24.5498 20.3816C31.2996 20.3816 36.6288 25.4043 36.6289 31.4314C36.6289 37.4586 31.2996 42.4812 24.5498 42.4812C17.8 42.4812 12.4707 37.4586 12.4707 31.4314C12.4708 25.4043 17.8 20.3816 24.5498 20.3816Z" stroke="var(--font-color)" stroke-width="2"/>
        <line x1="25.1851" y1="41.9756" x2="25.1851" y2="31.4318" stroke="var(--font-color)" stroke-width="2"/>
        <path d="M22.098 26.9131C23.3946 28.4792 23.7927 29.621 24.0394 32.0201C21.8159 31.8272 20.5767 31.688 18.8279 29.9257C17.4087 28.4494 17.1969 27.6258 17.1933 26.16C20.0749 26.2027 21.1814 26.3649 22.098 26.9131Z" stroke="var(--font-color)" stroke-width="2"/>
        <path d="M26.3045 26.7662C28.2475 25.9445 29.5439 25.8373 32.1385 26.1422C31.4462 28.0984 31.0268 29.1818 28.7767 30.3668C26.9019 31.3184 25.9833 31.328 24.4303 31.0095C25.108 28.4287 25.5227 27.4698 26.3045 26.7662Z" stroke="var(--font-color)" stroke-width="2"/>
        <path d="M4.99986 10.8158C4.18241 10.8158 8.07559 6.60182 10.6538 6.57768C12.93 3.66777 14.7253 4.052 18.8282 3.99976C24.5012 1.02691 26.8341 2.21006 31.0899 3.99976C35.8915 4.14952 43.6114 9.31001 43.6115 10.8161" stroke="var(--font-color)" stroke-width="2"/>
        <circle cx="14.5" cy="7.5" r="0.5" fill="var(--font-color)"/>
        <circle cx="22.5" cy="9.5" r="0.5" fill="var(--font-color)"/>
        <circle cx="23.5" cy="4.5" r="0.5" fill="var(--font-color)"/>
        <circle cx="31.5" cy="6.5" r="0.5" fill="var(--font-color)"/>
        <circle cx="35.5" cy="7.5" r="0.5" fill="var(--font-color)"/>
      </svg>
      <dd class="card__balance card__balance_text-right">{{ amountFormatter(fund.balance) }}</dd>
      <dt class="card__description card__description_text-left">{{ fund.name }}</dt>
    </div>
  </dl>
  <div>
    <Button
    :modifiers="['secondary']"
    type="button"
    text="Crear fondo"
    @click="fundFormIsOpen = true" />
    <Button
    type="button"
    text="Crear registro"
    @click="recordFormIsOpen = true" />
  </div>
  <Transition>
    <FundForm v-if="fundFormIsOpen" @dismiss-form="dismissFundForm" :fund="fundEditing" />
    <RecordForm v-else-if="recordFormIsOpen" @dismiss-form="dismissRecordForm" />
  </Transition>
</template>

<style>

.card-container {
  margin: 0 auto 24px;
  max-width: 600px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.card {
  margin: 32px auto;
  width: 160px;
  height: 64px;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  text-align: center;
  position: relative;
  box-shadow: 0 0 8px 1px var(--secondary);
}

.card_hover {
  border: none;
  box-shadow: 0 2px 6px var(--secondary);
}

@media (hover: hover) and (pointer: fine) {

  .card {
    transition: box-shadow 0.3s;
  }

  .card_hover:hover {
    cursor: pointer;
    box-shadow: -1px 2px 6px var(--accent);
  }

}

.card_sm {
  width: 200px;
  height: 80px;
}

.card__icon {
  position: absolute;
  left: 8px;
  height: 24px;
  width: 24px;
}

.card__balance {
  font-weight: 400;
  font-size: 1.6rem;
}

.card__balance_text-right {
  text-align: right;
}

.card__balance_lg {
  font-size: 2.4rem;
}

.card__description {
  color: var(--tertiary);
  margin-top: 12px;
  font-size: 1.4rem;
}

.card__description_text-left {
  text-align: left;
}

</style>