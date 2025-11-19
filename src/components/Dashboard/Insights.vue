<script setup lang="ts">
import { ref, watch } from 'vue';
import { recordStore } from "../../store/recordStore"

const tagsData = ref()
const listType = ref<1 | 2>(2)
const tagListBalance = ref(0)

function setTagsData() {
  const typeRecords = recordStore.records.filter(r => r.type === listType.value)
  tagListBalance.value = 0
  tagsData.value = Object.entries(typeRecords.reduce((acc: any, current) => {
    if (acc[current.tag]) acc[current.tag] += Number(current.amount)
    else acc[current.tag] = Number(current.amount)
    tagListBalance.value += Number(current.amount)
    return acc
  }, {}))
}

watch([listType, () => recordStore.records], (newListType, newRecords) => {
  setTagsData()
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
    <table class="table">
      <thead>
        <tr class="table__header-row">
          <th>Tag</th>
          <th>Balance</th>
          <th>Equivalence</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[tagName, tagBalance] in tagsData" :key="tagName">
          <td class="table__cell table__cell_text-left">{{ tagName }}</td>
          <td class="table__cell table__cell_text-right">- ${{ tagBalance }}</td>
          <td class="table__cell">{{ Math.round((tagBalance / tagListBalance) * 100) }}%</td>
        </tr>
      </tbody>
    </table>
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

.table {
  margin: 12px auto 0;
  width: 100%;
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

</style>