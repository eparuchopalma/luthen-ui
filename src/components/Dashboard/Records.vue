<script lang="ts" setup>
import { ref, watch, onMounted, computed } from "vue"
import { recordStore } from "../../store/recordStore"

onMounted(() => setRecords())

const loading = ref(false)

async function setRecords() {
  loading.value = true
  const { errorMessage } = await recordStore.getRecords()
  if (errorMessage) alert(errorMessage)
  loading.value = false
}

const screenHeight = ref(window.innerHeight)

const totalPages = ref(1)
const currentPage = ref(1)
const rowsPerPage = ref(10)

const pageRecords = computed(() => {
  const startingIndex = (currentPage.value - 1) * rowsPerPage.value
  const endingIndex = startingIndex + rowsPerPage.value
  return recordStore.records.slice(startingIndex, endingIndex)
})

function setNextPage() {
  currentPage.value++
}

function setPreviousPage() {
  currentPage.value--
}

function handleResize() {
  screenHeight.value = window.innerHeight
}

watch([screenHeight, () => recordStore.records], ([newHeight, newRecords]) => {
  const rowsToFit = Math.floor(newHeight / 44)
  rowsPerPage.value = rowsToFit
  totalPages.value = Math.ceil(newRecords.length / rowsToFit)
}, { immediate: true, deep: true }
)

window.addEventListener('resize', handleResize)

</script>

<template>
  <section class="section">
    <header>
      <div class="section__icon">
        <img src="../../assets/lupe.png" alt="lupe icon" class="icon__img">
      </div>
      <h1>Records</h1>
    </header>
    <div class="button-container">
      <button
      class="button"
      type="button"
      >Query</button>
      <button
      class="button button_secondary"
      type="button"
      >Export</button>
    </div>
    <div class="table-container">
      <table class="table">
        <caption class="table__caption">Click on a record for details and actions.</caption>
        <thead>
          <tr class="table__header-row">
            <th>Date</th>
            <th>Tag</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in pageRecords" :key="record.id" class="table__body-row">
            <td class="table__cell table__cell_text-left">{{ record.date.slice(0, 10) }}</td>
            <td class="table__cell table__cell_text-left">{{ record.tag }}</td>
            <td class="table__cell table__cell_text-right">$ {{ record.amount }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="table__footer-row">
            <td>
              <div class="table__footer-data">
                <span>Credit</span>
                <span>$ 0</span>
              </div>
            </td>
            <td>
              <div class="table__footer-data">
                <span>Debit</span>
                <span>$ -15</span>
              </div>
            </td>
            <td>
              <div class="table__footer-data">
                <span>Total</span>
                <span>$ -15</span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      <div class="table-actions">
        <button
        class="button button_sm button_dark"
        type="button"
        @click="setPreviousPage"
        :disabled="currentPage == 1">&lt</button>
        <small>Page {{ currentPage }} / {{ totalPages }}. Records: {{ recordStore.records.length }}</small>
        <button
        class="button button_sm button_dark"
        type="button"
        @click="setNextPage"
        :disabled="currentPage == totalPages">&gt;</button>
      </div>
    </div>
  </section>
</template>

<style scoped>

.table {
  width: 100%;
  margin: 0 auto;
  border-spacing: 2px;
  border-collapse: separate;
  font-size: 1.4rem;
  table-layout: fixed;
}

.table-container {
  margin: 48px auto 32px;
  width: 100%;
  max-width: 500px;
  height: 64vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
  
.table__caption {
  margin: 8px 0;
  font-style: italic;
  font-size: 1.2rem;
  text-align: center;
  color: var(--light);
}

.table__header-row {
  font-size: 1.4rem;
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

.table__footer-row {
  background-color: var(--dark);
}

.table__footer-data {
  padding: 0 4px;
  display: flex;
  justify-content: space-between;
}

.table-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

@media (hover: hover) and (pointer: fine) {

  .table__body-row:hover {
    cursor: pointer;
    color: var(--light);
  }
  
}

</style>