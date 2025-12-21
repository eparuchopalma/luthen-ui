<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { recordStore } from "../../store/recordStore"
import BarChart from './BarChart.vue';
import LineChart from './LineChart.vue';
import { amountFormatter } from '../../utils/formatter';

const listType = ref<1 | 2>(2)
const balanceByMonth = ref<Record<string, number>>({})

const tagsData = computed(() => {
  let typeSelectedSum = 0
  const typeRecords = listType.value === 2 ? recordStore.getDebits() : recordStore.getCredits()
  const balanceByTag: Record<string, number> = {}
  typeRecords.forEach((record) => {
    const tag = record.tag ?? 'Sin etiqueta'
    const amount = Number(record.amount)
    if (balanceByTag[tag]) balanceByTag[tag] += amount
    else balanceByTag[tag] = amount
    typeSelectedSum += amount
  })
  return { balanceByTag, typeSelectedSum }
})

function setMonthsData() {
  balanceByMonth.value = {}
  for (const record of recordStore.records) {
    if (record.type === 0) continue
    const month = new Date(record.date)!
      .toLocaleString('es-VE', { month: 'short', year: 'numeric' })
    const balance = Number(record.amount)
    if (balanceByMonth.value[month]) balanceByMonth.value[month]! += balance
    else balanceByMonth.value[month] = balance
  }
}

watch(() => recordStore.records, () => {
  setMonthsData()
}, { immediate: true })

</script>

<template>
  <select id="tag-list-type" class="select-field" v-model.number="listType">
    <option value="2" class="option">Débito</option>
    <option value="1" class="option">Crédito</option>
  </select>
  <div class="flex-container">
    <table class="table">
      <thead>
        <tr class="table__header-row">
          <th>Nota</th>
          <th>Balance</th>
          <th>Equivalencia</th>
        </tr>
      </thead>
      <tbody>
        <tr
        v-for="[tagName, balanceByTag] in Object.entries(tagsData.balanceByTag)"
        :key="tagName">
          <td class="table__cell table__cell_text-left">{{ tagName }}</td>
          <td class="table__cell table__cell_text-right">{{ amountFormatter(balanceByTag) }}</td>
          <td class="table__cell">{{ Math.round((balanceByTag / tagsData.typeSelectedSum) * 100) }}%</td>
        </tr>
      </tbody>
    </table>
    <div class="chart-container">
      <BarChart :tag-names="Object.keys(tagsData.balanceByTag)" :tag-balances="Object.values(tagsData.balanceByTag)" />
    </div>
  </div>
  <div class="flex-container">
    <div class="chart-container">
      <LineChart :months="Object.keys(balanceByMonth)" :months-balance="Object.values(balanceByMonth)" />
    </div>
    <table class="table">
      <thead>
        <tr class="table__header-row">
          <th>Month</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[month, monthBalance] in Object.entries(balanceByMonth)" :key="month">
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
  border-color: var(--secondary);
  border-radius: 2px;
  width: 80px;
}

.option {
  background-color: var(--primary);
  color: var(--font-color);
}

.flex-container {
  margin-top: 20px;
  gap: 8px;
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
  background-color: var(--secondary);
}

.table__cell {
  width: 120px;
  padding: 0 4px;
  border: 1px solid var(--secondary);
  height: 24px;
  max-height: 24px;
  line-height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
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