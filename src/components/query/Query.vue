<script lang="ts" setup>
import { nextTick, ref, watch } from "vue"
import Exceljs from 'exceljs'
import { recordStore, type Record } from "../../store/recordStore"
import RecordForm from "../status/RecordForm.vue"
import Button from "../layout/Button.vue"
import { amountFormatter, tableDateFormatter } from '../../utils/formatter'
import QueryForm from "./QueryForm.vue"
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
const queryFormIsOpen = ref(false)
const typeNames = {
  0: 'Fund to Fund',
  1: 'Credit',
  2: 'Debit'
};

function setColumnsBalance() {
  totalDebit.value = recordStore.getDebits().reduce((sum, record) => sum + Number(record.amount), 0)
  totalCredit.value = recordStore.getCredits().reduce((sum, record) => sum + Number(record.amount), 0)
  queryBalance.value = totalDebit.value + totalCredit.value
}

function setPageRecords() {
  const rowHeight = 28
  const nonDataRows = 6
  const rowsToFit = Math.floor(screenHeight.value / rowHeight) - nonDataRows
  rowsPerPage.value = rowsToFit
  totalPages.value = Math.ceil(recordStore.records.length / rowsToFit)
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

function dismissQueryForm() {
  queryFormIsOpen.value = false
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

watch(screenHeight, () => {
  setPageRecords()
}, { immediate: true, deep: true })

watch(() => recordStore.records, () => {
  console.log('launching');
  setPageRecords()
  setColumnsBalance()
  nextTick(() => focusTable())
}, { immediate: true, deep: true })

window.addEventListener('resize', handleResize)

</script>

<template>
  <header class="header">
    <div class="section__icon">
      <img src="../../assets/lupe.png" alt="lupe icon" class="icon__img">
    </div>
    <h1>Consulta</h1>
  </header>
  <Transition>
    <div class="table-container" v-if="recordStore.records.length">
      <table class="table">
        <caption id="table" class="table__caption">Pulsa sobre un registro para ver detalles y acciones.</caption>
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
  <Button
  type="button"
  text="Exportar"
  :modifiers="['secondary']"
  :disabled="!recordStore.records.length"
  @click="formatToXls" />
  <Button
  type="button"
  text="Consultar"
  @click="queryFormIsOpen = true" />
  <Transition>
    <RecordForm
    :record="recordEditing"
    v-if="recordFormIsOpen"
    @dismiss-form="dismissRecordForm" />
    <QueryForm
    v-else-if="queryFormIsOpen"
    @dismiss-form="dismissQueryForm" />
  </Transition>
</template>

<style scoped>

.header {
  margin-bottom: 48px;
}

.table-container {
  margin: 48px auto;
  width: 100%;
  max-width: 500px;
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
  color: var(--tertiary);
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

.table__footer-row {
  background-color: var(--secondary);
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
    opacity: .7;
  }
  
}

</style>