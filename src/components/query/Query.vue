<script lang="ts" setup>
import { ref, watch, onMounted } from "vue"
import { recordStore, type Record } from "../../store/recordStore"
import RecordForm from "../status/RecordForm.vue"
import { amountFormatter, tableDateFormatter } from '../../utils/formatter';

onMounted(() => setRecords())

const loading = ref(false)

async function setRecords() {
  loading.value = true
  const { errorMessage } = await recordStore.getRecords()
  if (errorMessage) alert(errorMessage)
  document.getElementById("records-section")?.scrollIntoView({ behavior: "smooth" })
  loading.value = false
}

const screenHeight = ref(window.innerHeight)

const totalPages = ref(1)
const currentPage = ref(1)
const rowsPerPage = ref(10)
const pageRecords = ref()
const totalCredit = ref(0)
const totalDebit = ref(0)
const queryBalance = ref(0)
const recordEditing = ref<Record | null>(null)
const recordFormIsOpen = ref(false)

function setColumnsBalance() {
  totalDebit.value = 0
  totalCredit.value = 0
  queryBalance.value = 0
  for (const record of recordStore.records) {
    if (record.type == 0) continue
    else if (record.type == 2) totalDebit.value += Number(record.amount)
    else if (record.type == 1) totalCredit.value += Number(record.amount)
    queryBalance.value += Number(record.amount)
  }
}

function setPageRecords() {
  const startingIndex = (currentPage.value - 1) * rowsPerPage.value
  const endingIndex = startingIndex + rowsPerPage.value
  pageRecords.value = recordStore.records.slice(startingIndex, endingIndex)
}

function setNextPage() {
  currentPage.value++
  setPageRecords()
}

function setPreviousPage() {
  currentPage.value--
  setPageRecords()
}

function handleResize() {
  screenHeight.value = window.innerHeight
}

function openRecordForm(record: Record) {
  recordEditing.value = record
  recordFormIsOpen.value = true
}

function dismissRecordForm() {
  recordFormIsOpen.value = false
  recordEditing.value = null
}

watch([screenHeight, () => recordStore.records], ([newHeight, newRecords]) => {
  const rowsToFit = Math.floor(newHeight / 44)
  rowsPerPage.value = rowsToFit
  totalPages.value = Math.ceil(newRecords.length / rowsToFit)
  setPageRecords()
  setColumnsBalance()
}, { immediate: true, deep: true }
)

window.addEventListener('resize', handleResize)

</script>

<template>
  <header id="records-section">
    <div class="section__icon">
      <img src="../../assets/lupe.png" alt="lupe icon" class="icon__img">
    </div>
    <h1>Query</h1>
  </header>
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
        <tr
        v-for="record in pageRecords"
        :key="record.id"
        class="table__body-row"
        @click="openRecordForm(record)">
          <td class="table__cell table__cell_text-left">{{ tableDateFormatter(record.date) }}</td>
          <td class="table__cell table__cell_text-left">{{ record.tag }}</td>
          <td class="table__cell table__cell_text-right">{{ amountFormatter(record.amount) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="table__footer-row">
          <td>
            <div class="table__footer-data">
              <span>{{ amountFormatter(totalCredit) }}</span>
            </div>
          </td>
          <td>
            <div class="table__footer-data">
              <span>{{ amountFormatter(totalDebit) }}</span>
            </div>
          </td>
          <td>
            <div class="table__footer-data">
              <span>{{ amountFormatter(queryBalance) }}</span>
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
  <div class="button-container">
    <button
    class="button button_secondary"
    type="button"
    >Export</button>
    <button
    class="button"
    type="button"
    >Query</button>
  </div>
  <Transition>
    <RecordForm
    :record="recordEditing"
    v-if="recordFormIsOpen"
    @dismiss-form="dismissRecordForm" />
  </Transition>
</template>

<style scoped>

.table-container {
  margin: 48px auto;
  width: 100%;
  max-width: 500px;
  height: 62vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
  
.table {
  width: 100%;
  margin: 0 auto;
  border-spacing: 2px;
  border-collapse: separate;
  font-size: 1.4rem;
  table-layout: fixed;
}

.table__caption {
  margin: 8px 0;
  font-style: italic;
  font-size: 1.2rem;
  text-align: center;
  color: var(--light);
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

.table__footer-row {
  background-color: var(--dark);
}

.table__footer-data {
  text-align: right;
  padding: 0 4px;
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