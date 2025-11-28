<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { recordStore } from "../../store/recordStore"
import BarChart from './BarChart.vue';
import LineChart from './LineChart.vue';
import { amountFormatter } from '../../utils/formatter';

const listType = ref<1 | 2>(2)
const monthsBalance = ref<Record<string, number>>({})

const tagsData = computed(() => {
  let tagListBalance = 0
  const typeRecords = listType.value === 2 ? recordStore.getDebits() : recordStore.getCredits()
  const tagsData: Record<string, number> = {}
  typeRecords.forEach((record) => {
    const tag = record.tag ?? 'Untagged'
    const amount = Number(record.amount)
    if (tagsData[tag]) tagsData[tag] += amount
    else tagsData[tag] = amount
    tagListBalance += amount
  })
  return { tagsData, tagListBalance }
})

function setMonthsData() {
  monthsBalance.value = {}
  recordStore.records.forEach((record) => {
    const month = new Date(record.date)!
      .toLocaleString('default', { month: 'short', year: 'numeric' })
    const balance = Number(record.amount)
    if (monthsBalance.value[month]) (monthsBalance.value[month]! += balance)
    else monthsBalance.value[month] = balance
  })

}

watch(() => recordStore.records, () => {
  setMonthsData()
}, { immediate: true })

</script>

<template>
  <header>
    <div class="section__icon">
      <img src="../../assets/lupe-chart.png" alt="lupe on chart icon" class="icon__img">
    </div>
    <h1>Insights</h1>
  </header>
  <select id="tag-list-type" class="select-field" v-model.number="listType">
    <option value="2" class="option">Debit</option>
    <option value="1" class="option">Credit</option>
  </select>
  <div class="flex-container">
    <table class="table">
      <thead>
        <tr class="table__header-row">
          <th>Tag</th>
          <th>Balance</th>
          <th>Equivalence</th>
        </tr>
      </thead>
      <tbody>
        <tr
        v-for="[tagName, tagBalance] in Object.entries(tagsData.tagsData)"
        :key="tagName">
          <td class="table__cell table__cell_text-left">{{ tagName }}</td>
          <td class="table__cell table__cell_text-right">{{ amountFormatter(tagBalance) }}</td>
          <td class="table__cell">{{ Math.round((tagBalance / tagsData.tagListBalance) * 100) }}%</td>
        </tr>
      </tbody>
    </table>
    <div class="chart-container">
      <BarChart :tag-names="Object.keys(tagsData.tagsData)" :tag-balances="Object.values(tagsData.tagsData)" />
    </div>
  </div>
  <div class="flex-container">
    <div class="chart-container">
      <LineChart :months="Object.keys(monthsBalance)" :months-balance="Object.values(monthsBalance)" />
    </div>
    <table class="table">
      <thead>
        <tr class="table__header-row">
          <th>Month</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[month, monthBalance] in Object.entries(monthsBalance)" :key="month">
          <td class="table__cell table__cell_text-left">{{ month }}</td>
          <td class="table__cell table__cell_text-right">{{ amountFormatter(monthBalance) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

.select-field {
  margin-top: 48px;
  border-radius: 2px;
  width: 80px;
}

.option {
  background-color: var(--darkest);
  color: var(--lightest);
}

.flex-container {
  margin-top: 20px;
  display: flex;
  align-items: start;
  justify-content: space-between;
  flex-direction: column;
}

.chart-container {
  margin: 14px auto 0;
  height: 100%;
  width: 100%;
  max-width: 700px;
  border-radius: 2px;
  padding: 2px 6px;
  display: flex;
  justify-content: center;
  box-shadow: 0 1px 4px var(--accent);
}

.table {
  margin: 12px auto 0;
  width: 100%;
  height: 100%;
  max-width: 400px;
  border-spacing: 2px;
  border-collapse: separate;
  font-size: 1.4rem;
  table-layout: fixed;
}

.table__header-row {
  background-color: var(--dark);
}

.table__cell {
  width: 120px;
  padding: 0 4px;
  border: 1px solid var(--dark);
}

.table__cell_text-left {
  text-align: left;
}

.table__cell_text-right {
  text-align: right;
}

@media (width >= 800px) {
  .flex-container {
    flex-direction: row;
  }
}

</style>