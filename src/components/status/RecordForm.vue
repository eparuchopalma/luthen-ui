<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Dialog from '../layout/Dialog.vue';
import { recordStore, type Record } from '../../store/recordStore'
import { fundStore } from '../../store/fundStore'

onMounted(() => document.getElementById('record-date-field')?.focus())
const emit = defineEmits(['dismissForm'])

const props = defineProps<{ record?: Record }>()

const form = ref<Record>({
  amount: 0,
  date: '',
  fund_id: fundStore.funds.find(fund => fund.is_main)!.id,
  note: '',
  tag: '',
  type: 2
})

const [mm, dd, yyyy] = new Date().toLocaleString().slice(0, 10).split('/')
const date = ref(`${yyyy}-${mm}-${dd}`)
const time = ref(new Date().toTimeString().slice(0, 5))
const loading = ref(false)
const typeNames = ['Fund to fund', 'Credit', 'Debit']

if (props.record) startEditing()

const dateIsValid = computed(() => date.value && new Date(date.value) <= new Date())

const timeIsValid = computed(() => {
  if (!time.value) return false
  return new Date(date.value) <= new Date() && new Date(`${date.value}T${time.value}:00`) <= new Date()
})

const amountIsValid = computed(() => {
  if (isNaN(form.value.amount)) return false
  return form.value.amount > 0
})

const correlatedFundIsValid = computed(() => {
  if (form.value.type !== 0) return true
  return form.value.correlated_fund_id !== form.value.fund_id && form.value.correlated_fund_id !== ''
})

const typeIsValid = computed(() => [0, 1, 2].includes(form.value.type!))

const editingWithoutChanges = computed(() => {
  return JSON.stringify(props.record) === JSON.stringify(form.value)
})

const invalidForm = computed(() => {
  return [dateIsValid, timeIsValid, amountIsValid, correlatedFundIsValid, typeIsValid]
    .some(isValid => !isValid.value)
})

function startEditing() {
  form.value = JSON.parse(JSON.stringify(props.record!))
  date.value = props.record!.date.slice(0, 10)
  time.value = props.record!.date.slice(11, 16)
  if (props.record!.type !== 1) form.value.amount = -props.record!.amount
}

function clearCorrelated() {
  const notFundToFund = form.value.type != 0
  const fundsAreEqual = form.value.correlated_fund_id === form.value.fund_id
  if (notFundToFund || fundsAreEqual) delete form.value.correlated_fund_id
}

async function handleSubmit() {
  normalizeForm()
  loading.value = true
  const { errorMessage } = props.record ? await update() : await create()
  if (errorMessage) alert(errorMessage)
  else emit('dismissForm')
  loading.value = false
}

function update() {
  return recordStore.updateRecord(form.value)
}

function create() {
  return recordStore.createRecord(form.value)
}

function normalizeForm() {  
  form.value.date = new Date(`${date.value}T${time.value}:00`).toISOString()
  if (form.value.type !== 1) form.value.amount = -form.value.amount
}

</script>

<template>
  <Dialog>
    <form class="form">
      <h3 class="title">Record Form</h3>
      <fieldset class="fieldset">
        <label
        for="record-date-field"
        class="label"
        :class="{ 'label-alert': !dateIsValid }"
        >Date</label>
        <label
        for="record-time-field"
        class="label"
        :class="{ 'label-alert': !timeIsValid }"
        >Time</label>
        <input
        type="date"
        class="input input_w-half"
        id="record-date-field"
        v-model="date"
        required>
        <input
        id="record-time-field"
        type="time"
        class="input input_w-half"
        v-model="time"
        required>
        <label
        for="record-type-field"
        class="label label_mt"
        :class="{ 'label-alert': !typeIsValid }"
        >Type</label>
        <label
        for="record-amount-field"
        class="label"
        :class="{ 'label-alert': !amountIsValid }"
        >Amount</label>
        <select id="record-type-field" class="select" v-model="form.type" @change="clearCorrelated">
          <option v-for="type in [0, 1, 2]" :key="type" :value="type">{{ typeNames[type] }}</option>
        </select>
        <input
        id="record-amount-field"
        type="number"
        class="input input_w-half input_text-right"
        placeholder="0"
        :min="form.type === 1 ? 0 : undefined"
        :max="form.type === 1 ? undefined : 0"
        v-model.number="form.amount"
        required>
        <label
        for="record-fund-field"
        class="label label_mt"
        >Fund</label>
        <label
        for="record-correlated-field"
        class="label"
        :class="{ 'label-alert': !correlatedFundIsValid }"
        >Correlated Fund</label>
        <select
        id="record-fund-field"
        class="select"
        v-model="form.fund_id"
        @change="clearCorrelated">
          <option v-for="fund in fundStore.funds" :value="fund.id">{{ fund.name }}</option>
        </select>
        <select
        id="record-correlated-field"
        class="select"
        @change="clearCorrelated"
        v-model="form.correlated_fund_id"
        :disabled="form.type !== 0">
          <option
          v-for="fund in fundStore.funds.filter(f => f.id !== form.fund_id)"
          :value="fund.id"
          >{{ fund.name }}</option>
        </select>
        <label
        for="record-tag-field"
        class="label label_mt label_w-full"
        >Tag</label>
        <input
        id="record-tag-field"
        type="text"
        class="input"
        placeholder="Vehicle"
        maxlength="250"
        v-model="form.tag">
        <label
        for="record-note-field"
        class="label label_mt label_w-full"
        >Note</label>
        <input
        id="record-note-field"
        type="text"
        class="input"
        placeholder="Fuel"
        maxlength="250"
        v-model="form.note">
      </fieldset>
      <div class="button-container">
        <button
        type="button"
        class="button button_secondary"
        @click="$emit('dismissForm')"
        :disabled="loading"
        >Dismiss</button>
        <button
        type="button"
        class="button"
        :disabled="invalidForm || loading || editingWithoutChanges"
        @click="handleSubmit"
        >Confirm</button>
      </div>
    </form>
  </Dialog>
</template>