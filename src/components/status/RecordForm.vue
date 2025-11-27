<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Dialog from '../layout/Dialog.vue';
import { recordStore, type Record } from '../../store/recordStore'
import { fundStore } from '../../store/fundStore'

onMounted(() => document.getElementById('record-date-field')?.focus())
const emit = defineEmits(['dismissForm'])

const props = defineProps<{ record?: Record | null }>()

const [mm, dd, yyyy] = new Date().toLocaleString().slice(0, 10).split('/')

const form = ref<Record & { time?: string }>({
  amount: 0,
  date: `${yyyy}-${mm}-${dd}`,
  time: new Date().toTimeString().slice(0, 5),
  fund_id: fundStore.funds.find(fund => fund.is_main)!.id,
  note: '',
  tag: '',
  type: 2
})

const originalValues = ref<null | Record & { time: string }>(null)
const loading = ref(false)
const typeNames = ['Fund to fund', 'Credit', 'Debit']

if (props.record) startEditing()

const dateIsValid = computed(() => new Date(form.value.date) <= new Date())

const timeIsValid = computed(() => {
  if (!form.value.time) return false
  return new Date(form.value.date) <= new Date() && new Date(`${form.value.date}T${form.value.time}:00`) <= new Date()
})

const amountIsValid = computed(() => {
  if (isNaN(form.value.amount)) return false
  return form.value.amount > 0
})

const correlatedFundIsValid = computed(() => {
  if (form.value.type !== 0) return true
  return form.value.correlated_fund_id !== form.value.fund_id && form.value.correlated_fund_id
})

const typeIsValid = computed(() => [0, 1, 2].includes(form.value.type!))

const changesOnUpdate = computed(() => {
  if (!props.record) return null
  const updates = {} as Partial<Record>

  Object.entries(form.value).forEach(([key, value]) => {
    const k = key as keyof Record
    const originalValue = originalValues.value![k]
    if (value !== originalValue) updates[k] = value as any
  })

  if (JSON.stringify(updates) === '{}') return null
  else return updates
})

const formInvalid = computed(() => {
  return [
    dateIsValid.value,
    timeIsValid.value,
    amountIsValid.value,
    correlatedFundIsValid.value,
    typeIsValid.value,
    (changesOnUpdate.value !== null || !props.record)
  ]
    .some(isValid => !isValid)
})

function startEditing() {
  originalValues.value = JSON.parse(JSON.stringify(props.record!))
  const [m, d, yyyy] = new Date(props.record!.date).toLocaleString().split(',')[0]!.split('/')
  originalValues.value!.date = `${yyyy}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`
  originalValues.value!.time = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false  }).format(new Date(props.record!.date))
  originalValues.value!.amount = (props.record!.type !== 1)
    ? -Number(props.record!.amount)
    : Number(props.record!.amount)
  form.value = JSON.parse(JSON.stringify(originalValues.value))
}

function clearCorrelated() {
  const notFundToFund = form.value.type != 0
  const fundsAreEqual = form.value.correlated_fund_id === form.value.fund_id
  if (notFundToFund || fundsAreEqual) delete form.value.correlated_fund_id
}

async function handleSubmit() {
  loading.value = true
  const { errorMessage } = props.record ? await update() : await create()
  alert(errorMessage ? errorMessage : 'Record saved!')
  if (!errorMessage) emit('dismissForm')
  else loading.value = false
}

async function onDelete() {
  const confirmDelete = confirm('Are you sure you want to delete this record? This action cannot be undone.')
  if (!confirmDelete) return
  loading.value = true
  const { errorMessage } = await recordStore.deleteRecord(props.record!.id!)
  alert(errorMessage ? errorMessage : 'Record deleted!')
  if (!errorMessage) emit('dismissForm')
  else loading.value = false
}

function update() {
  const payload = normalizePayload(changesOnUpdate.value!)
  return recordStore.updateRecord(props.record!.id!, payload)
}

function create() {
  const payload = normalizePayload(form.value)
  return recordStore.createRecord(payload)
}

function normalizePayload(data: Partial<Record & { time: string }>) {
  const payload = JSON.parse(JSON.stringify(data))
  if (payload.date || payload.time) setDateAPIFormat(payload)
  if (payload.type !== undefined || payload.amount !== undefined) setAmountAPIFormat(payload)
  return payload
}

function setDateAPIFormat(data: Partial<Record & { time: string }>) {
  const date = data.date || originalValues.value!.date
  const time = data.time || originalValues.value!.time
  data.date = new Date(`${date}T${time}:00`).toISOString()
  delete data.time
  return
}

function setAmountAPIFormat(data: Partial<Record>) {
  const type = data.type ?? originalValues.value!.type
  const amount = data.amount ?? props.record!.amount
  if (type !== 1 && amount > 0) data.amount = -Number(amount)
  else if (type === 1 && amount < 0) data.amount = -Number(amount)
  return
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
        v-model="form.date"
        required>
        <input
        id="record-time-field"
        type="time"
        class="input input_w-half"
        v-model="form.time"
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
        min="0"
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
        v-model.trim="form.tag">
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
        v-model.trim="form.note">
      </fieldset>
      <div class="button-container">
        <button
        type="button"
        class="button button_secondary button_sm"
        @click="$emit('dismissForm')"
        :disabled="loading"
        >Dismiss</button>
        <button
        v-if="props.record"
        type="button"
        class="button button_secondary button_sm"
        @click="onDelete"
        :disabled="loading"
        >Delete</button>
        <button
        type="button"
        class="button button_sm"
        :disabled="formInvalid || loading"
        @click="handleSubmit"
        >{{ props.record ? 'Update' : 'Create' }}</button>
      </div>
    </form>
  </Dialog>
</template>