<script lang="ts" setup>
import { ref, watch } from "vue"
import Exceljs from 'exceljs'
import { recordStore, type Record } from "../../store/recordStore"
import RecordForm from "../status/RecordForm.vue"
import Button from "../layout/Button.vue"
import { amountFormatter, tableDateFormatter } from '../../utils/formatter'
import { fundStore } from "../../store/fundStore"

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
const typeNames = {
  0: 'Fund to Fund',
  1: 'Credit',
  2: 'Debit'
};

const startX = ref(0)
const threshold = ref(50)

function onTouchStart(e: any) {
  startX.value = e.changedTouches[0].clientX
}

function onTouchEnd(e: any) {
  const endX = e.changedTouches[0].clientX

  const diffX = endX - startX.value

  if (Math.abs(diffX) > threshold.value) {
    if (diffX > 0) onSwipeRight()
    else onSwipeLeft()
  }
}

function onSwipeLeft() {
  setNextPage()
}

function onSwipeRight() {
  setPreviousPage()
}

function setColumnsBalance() {
  totalDebit.value = recordStore.getDebits().reduce((sum, record) => sum + Number(record.amount), 0)
  totalCredit.value = recordStore.getCredits().reduce((sum, record) => sum + Number(record.amount), 0)
  queryBalance.value = totalDebit.value + totalCredit.value
}

function setPageRecords() {
  const rowHeight = 36
  const nonDataRows = 8
  rowsPerPage.value = Math.floor(screenHeight.value / rowHeight) - nonDataRows
  totalPages.value = Math.ceil(recordStore.records.length / rowsPerPage.value)
  const startingIndex = (currentPage.value - 1) * rowsPerPage.value
  const endingIndex = startingIndex + rowsPerPage.value
  pageRecords.value = recordStore.records.slice(startingIndex, endingIndex)
}

function setNextPage() {
  if (currentPage.value === totalPages.value) return
  currentPage.value++
  setPageRecords()
}

function setPreviousPage() {
  if (currentPage.value === 1) return
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

function focusTable() {
  currentPage.value = 1
  document.getElementById("table")?.scrollIntoView({ behavior: "smooth" })
}

async function formatToXls() {
  const workbook = new Exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  worksheet.columns = [
    { header: "Fecha", key: "date" },
    { header: "Tipo", key: "type" },
    { header: "Monto", key: "amount" },
    { header: "Fondo", key: "fund" },
    { header: "Correlacionado", key: "correlated" },
    { header: "Etiqueta", key: "tag" },
    { header: "Nota", key: "note" },
  ]

  recordStore.records.forEach(({ date, type, amount, fund_id, correlated_fund_id, tag, note }) => {
    worksheet.addRow({
      date: tableDateFormatter(date),
      type: typeNames[type],
      amount,
      fund: getFundName(fund_id),
      correlated: (correlated_fund_id) ? getFundName(correlated_fund_id) : '',
      tag,
      note,
    })
  })
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob(
    [buffer], 
    { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
  );

  const url = URL.createObjectURL(blob);

  const tempLink = document.createElement("a")
  tempLink.href = url
  tempLink.download = 'data.xlsx'
  tempLink.click()
}

function getFundName (id: string) {
  return fundStore.funds.find(f => f.id === id)!.name;
}

watch(() => recordStore.records, () => {
  focusTable()
  setPageRecords()
  setColumnsBalance()
}, { immediate: true, deep: true })

window.addEventListener('resize', handleResize)

</script>

<template>
  <Transition>
    <div
    class="table-container"
    v-if="recordStore.records.length"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @keydown.left="setPreviousPage"
    @keydown.right="setNextPage"
    tabindex="0">
      <Button
      type="button"
      text="Exportar"
      :modifiers="['secondary']"
      :disabled="!recordStore.records.length"
      @click="formatToXls" />
      <table class="table">
        <caption class="table__caption">Pulsa sobre un registro para ver detalles y acciones.</caption>
        <thead>
          <tr class="table__header-row">
            <th>Fecha</th>
            <th>Etiqueta</th>
            <th>Monto</th>
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
      </table>
      <div class="query-summary">
        <div class="query-summary__row">
          <span>Credit:</span>
          <span>{{ amountFormatter(totalCredit) }}</span>
        </div>
        <div class="query-summary__row">
          <span>Debit:</span>
          <span>{{ amountFormatter(totalDebit) }}</span>
        </div>
        <div class="query-summary__row">
          <span>Balance:</span>
          <span>{{ amountFormatter(queryBalance) }}</span>
        </div>
      </div>
      <div class="table__controls">
        <Button
        type="button"
        :modifiers="['sm', 'dark']"
        :disabled="currentPage == 1"
        text="&lt;"
        @click="setPreviousPage" />
        <small
        class="table__caption"
        >Pagina {{ currentPage }}/{{ totalPages }}. Registros: {{ recordStore.records.length }}
        </small>
        <Button
        type="button"
        :modifiers="['sm', 'dark']"
        :disabled="currentPage == totalPages"
        text="&gt;"
        @click="setNextPage" />
      </div>
    </div>
  </Transition>
  <Transition>
    <RecordForm
    :record="recordEditing"
    v-if="recordFormIsOpen"
    @dismiss-form="dismissRecordForm" />
  </Transition>
</template>

<style scoped>

.table-container {
  margin: 0 auto 96px;
  width: 100%;
  min-height: 70vh;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
  
.table {
  width: 100%;
  margin: 0 auto;
  border-spacing: 2px;
  border-collapse: separate;
  table-layout: fixed;
}

.table__caption {
  margin: 8px 0;
  font-style: italic;
  font-size: 1.2rem;
  text-align: center;
  color: var(--tertiary);
}

.table__header-row {
  background-color: var(--secondary);
}

.table__cell {
  width: 120px;
  padding: 0 4px;
  border: 1px solid var(--secondary);
  font-size: 1.4rem;
  max-height: 24px;
  line-height: 20px;
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

.query-summary {
  width: 100%;
  margin-top: auto;
}

.query-summary__row {
  background-color: var(--secondary);
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
}

.table__controls {
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: space-between;
}

@media (hover: hover) and (pointer: fine) {

  .table__body-row:hover {
    cursor: pointer;
    opacity: .7;
  }
  
}

</style>