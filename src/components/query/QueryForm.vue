<script setup lang="ts">
import { computed, ref, inject } from 'vue';
import Dialog from '../layout/Dialog.vue'
import Button from '../layout/Button.vue'
import { type Alert } from '../layout/AlertBox.vue'
import { fundStore } from '../../store/fundStore'
import { recordStore } from '../../store/recordStore'
import { formDateFormatter } from '../../utils/formatter';

const emit = defineEmits(['dismissForm'])
const showAlert = inject('showAlert') as (arg: Alert) => void

const currentYear = Number(new Date().getFullYear())
const currentMonth = Number(new Date().getMonth())

const form = ref({
  type: '',
  fund_id: '',
  fromDate: '',
  toDate: '',
  tag: '',
  note: ''
})
const typeNames = ['Fondo a Fondo', 'Credito', 'Débito']
const loading = ref(false)

const fromDateIsValid = computed(() => {
  return !form.value.fromDate || new Date(form.value.fromDate) <= new Date()
})

const toDateIsValid = computed(() => {
  return !form.value.toDate || new Date(form.value.toDate) <= new Date() && new Date(form.value.fromDate) <= new Date(form.value.toDate)
})

const formInvalid = computed(() => !fromDateIsValid.value || !toDateIsValid.value)

async function onSubmit() {
  loading.value = true
  const filters = normalizeData()
  const { errorMessage } = await recordStore.getRecords(filters)
  showAlert({
    text: errorMessage || `Consulta realizada. Registros encontrados: ${recordStore.records.length}`,
    title: errorMessage ? 'Ocurrió un problema' : '',
    autoDismiss: !Boolean(errorMessage)
  })
  if (!errorMessage) emit('dismissForm')
  else loading.value = false
}

function normalizeData() {
  const normalized: any = { ...form.value }
  if (normalized.type === '') delete normalized.type
  if (normalized.fromDate === '') delete normalized.fromDate
  if (normalized.toDate === '') delete normalized.toDate
  if (normalized.fund_id === '') delete normalized.fund_id
  if (normalized.tag === '') delete normalized.tag
  if (normalized.note === '') delete normalized.note
  return normalized
}

function setCurrentYear() {
  form.value.fromDate = formDateFormatter(new Date(currentYear, 0, 1))
}

function setCurrentMonth() {
  form.value.fromDate = formDateFormatter(new Date(currentYear, currentMonth, 1))
}

function setPastMonth() {
  form.value.fromDate = formDateFormatter(new Date(currentYear, currentMonth - 1, 1))
  form.value.toDate = formDateFormatter(new Date(currentYear, currentMonth, 1))
}

</script>

<template>
  <Dialog @click.self="emit('dismissForm')" @keydown.esc="emit('dismissForm')">
    <form class="query-form" @submit.prevent="onSubmit">
      <h3 class="query-form__title">Formulario de consulta</h3>
      <fieldset class="query-form__fieldset">
        <label
        for="query-type-field"
        class="query-form__label"
        >Tipo</label>
        <label
        for="query-fund-field"
        class="query-form__label"
        >Fondo</label>
        <select
        id="query-type-field"
        class="query-form__select"
        v-model="form.type">
          <option value="">Todos</option>
          <option
          v-for="type in [0, 1, 2]"
          :key="type"
          :value="type">{{ typeNames[type] }}</option>
        </select>
        <select
        id="query-fund-field"
        class="query-form__select"
        v-model="form.fund_id">
          <option value="">Todos</option>
          <option
          v-for="fund in fundStore.funds"
          :value="fund.id"
          >{{ fund.name }}</option>
        </select>
        <div class="pill-container">
          <Button
          :disabled="loading"
          :modifiers="['secondary', 'sm', 'pill']"
          @click="setCurrentYear"
          :text="new Date().getFullYear().toString()" />
          <Button
          :disabled="loading"
          :modifiers="['secondary', 'sm', 'pill']"
          @click="setCurrentMonth"
          text="Este mes" />
          <Button
          :disabled="loading"
          :modifiers="['secondary', 'sm', 'pill']"
          @click="setPastMonth"
          text="Mes pasado" />
        </div>
        <label
        for="query-from-date"
        class="query-form__label"
        :class="{ 'query-form__label_alert': !fromDateIsValid }"
        >Desde</label>
        <label
        for="query-to-date"
        class="query-form__label"
        :class="{ 'query-form__label_alert': !toDateIsValid }"
        >Hasta</label>
        <input
        type="date"
        class="query-form__input"
        id="query-from-date"
        v-model="form.fromDate">
        <input
        type="date"
        class="query-form__input"
        id="query-to-date"
        v-model="form.toDate">
        <label
        for="query-tag-field"
        class="query-form__label query-form__label_w-full"
        >Etiqueta</label>
        <input
        id="query-tag-field"
        type="text"
        class="query-form__input query-form__block"
        maxlength="250"
        v-model.trim="form.tag">
        <label
        for="query-note-field"
        class="query-form__label query-form__label_w-full"
        >Nota</label>
        <input
        id="query-note-field"
        type="text"
        class="query-form__input query-form__input_w-full"
        maxlength="250"
        v-model.trim="form.note">
      </fieldset>
      <div class="query-form__actions">
        <Button
        type="submit"
        :disabled="formInvalid || loading"
        :modifiers="['sm']"
        text="Consultar" />
        <Button
        type="button"
        :modifiers="['secondary', 'sm']"
        :disabled="loading"
        text="Volver"
        @click="$emit('dismissForm')" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>

.query-form {
  width: 100%;
  height: 100%;
  max-width: 360px;
  max-height: 400px;
  border-radius: 4px;
  padding: 24px;
  background-color: var(--primary);
  color: var(--font-color);
}

.query-form__fieldset {
  margin: 24px 0;
}

.query-form__label {
  margin: 0 6px;
  width: 45%;
  display: inline-block;
  text-align: left;
  font-size: 1.2rem;
  color: var(--tertiary);
}

.query-form__label_w-full {
  width: 100%;
  margin-left: 12px;
}

.query-form__label_alert::after {
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
  color: var(--primary);
}

.query-form__input {
  margin: 4px 6px 18px;
  width: 45%;
  background-color: var(--primary);
  color: var(--font-color);
  border: none;
  border-bottom: 1px solid var(--tertiary);
}

.query-form__input_w-full {
  display: inline-block;
  width: calc(90% + 12px);
}

.query-form__input_text-right {
  text-align: right;
}

.query-form__block {
  display: block;
  margin: 0 0 0 12px;
}

.query-form__input::selection, .query-form__input:focus {
  border-color: var(--accent);
  outline: none;
}

.query-form__select {
  margin: 4px 6px 12px;
  width: 45%;
  height: 28px;
  border: 1px solid var(--secondary);
  padding: 0 2px;
  background-color: var(--primary);
  border-radius: 20px;
  outline: none;
}

.query-form__select::selection, .query-form__select:focus {
  border-color: var(--accent);
}

.query-form__actions {
  display: flex;
  justify-content: center;
  gap: 48px;
}

@media (width <= 600px) {
  .query-form__actions {
    flex-direction: row-reverse;
  }
}

.pill-container {
  margin: 8px 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

</style>