<script setup lang="ts">
import { ref, watch } from 'vue';
import { recordStore } from "../../store/recordStore"
import type { Record } from '../../store/recordStore';
import BarChart from './BarChart.vue';

const listType = ref<1 | 2>(2)
const tagListBalance = ref(0)
const tagNames = ref<String[]>([])
const tagBalances = ref<Number[]>([])

function setTagsData(newListType: 1 | 2, newRecords: Record[]) {
  tagListBalance.value = 0
  const typeRecords = newRecords.filter(r => r.type == newListType)
  const tagsData = typeRecords.reduce((acc: any, current) => {
    if (acc[current.tag]) acc[current.tag] += Number(current.amount)
    else acc[current.tag] = Number(current.amount)
    tagListBalance.value += Number(current.amount)
    return acc
  }, {})
  tagNames.value = Object.keys(tagsData)
  tagBalances.value = Object.values(tagsData)
}

watch([listType, () => recordStore.records], ([newListType, newRecords]) => {
  setTagsData(newListType, newRecords)
}, { immediate: true })

</script>

<template>
  <section class="section">
    <header>
      <div class="section__icon">
        <img src="../../assets/lupe-chart.png" alt="lupe on chart icon" class="icon__img">
      </div>
      <h1>Insights</h1>
    </header>
    <select id="tag-list-type" class="select-field" v-model="listType">
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
          <tr v-for="tagName, index in tagNames" :key="index">
            <td class="table__cell table__cell_text-left">{{ tagName }}</td>
            <td class="table__cell table__cell_text-right">$ {{ tagBalances[index] }}</td>
            <td class="table__cell">{{ Math.round((Number(tagBalances[index]) / tagListBalance) * 100) }}%</td>
          </tr>
        </tbody>
      </table>
      <div class="chart-container">
        <BarChart :tag-names="tagNames" :tag-balances="tagBalances" />
      </div>
    </div>
  </section>
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