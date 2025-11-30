<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Dialog from '../layout/Dialog.vue';
import Button from '../layout/Button.vue';
import { recordStore, type Record } from '../../store/recordStore'
import { fundStore } from '../../store/fundStore'
import { formDateFormatter } from '../../utils/formatter';

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
  originalValues.value!.time = formDateFormatter(new Date(props.record!.date))
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
  loading.value = false
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
    <form class="record-form" @submit.prevent="handleSubmit">
      <h3 class="record-form__title">Record Form</h3>
      <fieldset class="record-form__fieldset">
        <label
        for="record-date-field"
        class="record-form__label record-form__label_zero"
        :class="{ 'record-form__label_alert': !dateIsValid }"
        >Date</label>
        <label
        for="record-time-field"
        class="record-form__label record-form__label_zero"
        :class="{ 'record-form__label_alert': !timeIsValid }"
        >Time</label>
        <input
        type="date"
        class="record-form__input"
        id="record-date-field"
        v-model="form.date"
        required>
        <input
        id="record-time-field"
        type="time"
        class="record-form__input"
        v-model="form.time"
        required>
        <label
        for="record-type-field"
        class="record-form__label"
        :class="{ 'record-form__label_alert': !typeIsValid }"
        >Type</label>
        <label
        for="record-amount-field"
        class="record-form__label"
        :class="{ 'record-form__label_alert': !amountIsValid }"
        >Amount</label>
        <select
        id="record-type-field"
        class="record-form__select"
        v-model="form.type"
        @change="clearCorrelated">
          <option
          v-for="type in [0, 1, 2]"
          :key="type"
          :value="type">{{ typeNames[type] }}</option>
        </select>
        <input
        id="record-amount-field"
        type="number"
        class="record-form__input record-form__input_text-right"
        placeholder="0"
        min="0"
        v-model.number="form.amount"
        required>
        <label
        for="record-fund-field"
        class="record-form__label"
        >Fund</label>
        <label
        for="record-correlated-field"
        class="record-form__label"
        :class="{ 'record-form__label_alert': !correlatedFundIsValid }"
        >Correlated Fund</label>
        <select
        id="record-fund-field"
        class="record-form__select"
        v-model="form.fund_id"
        @change="clearCorrelated"
        required>
          <option v-for="fund in fundStore.funds" :value="fund.id">{{ fund.name }}</option>
        </select>
        <select
        id="record-correlated-field"
        class="record-form__select"
        @change="clearCorrelated"
        v-model="form.correlated_fund_id"
        :disabled="form.type !== 0"
        :required="form.type === 0">
          <option
          v-for="fund in fundStore.funds.filter(f => f.id !== form.fund_id)"
          :value="fund.id"
          >{{ fund.name }}</option>
        </select>
        <label
        for="record-tag-field"
        class="record-form__label record-form__label_w-full"
        >Tag</label>
        <input
        id="record-tag-field"
        type="text"
        class="record-form__input record-form__block"
        placeholder="Vehicle"
        maxlength="250"
        v-model.trim="form.tag">
        <label
        for="record-note-field"
        class="record-form__label record-form__label_w-full"
        >Note</label>
        <input
        id="record-note-field"
        type="text"
        class="record-form__input record-form__input_w-full"
        placeholder="Fuel"
        maxlength="250"
        v-model.trim="form.note">
      </fieldset>
      <div class="record-form__actions">
        <Button
        type="submit"
        :disabled="formInvalid || loading"
        :modifiers="['sm']"
        :text="props.record ? 'Update' : 'Create'" />
        <Button
        type="button"
        :modifiers="['secondary', 'sm']"
        :disabled="loading"
        text="Dismiss"
        @click="$emit('dismissForm')" />
        <Button
        v-if="props.record"
        type="button"
        :disabled="loading"
        :modifiers="['secondary', 'sm']"
        text="Delete"
        @click="onDelete" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>

.record-form {
  width: 100%;
  height: 100%;
  max-width: 360px;
  max-height: 440px;
  border-radius: 4px;
  padding: 24px;
  background-color: var(--darkest);
  color: var(--lightest);
}

.record-form__fieldset {
  margin: 24px 0;
}

.record-form__label {
  margin: 24px 6px 0;
  width: 45%;
  display: inline-block;
  text-align: left;
  font-size: 1.2rem;
  color: var(--light);
}

.record-form__label_w-full {
  width: 100%;
  margin-left: 12px;
}

.record-form__label_zero {
  margin-top: 0;
}

.record-form__label_alert::after {
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
  color: var(--darkest);
}

.record-form__input {
  margin: 0 6px;
  width: 45%;
  background-color: var(--darkest);
  color: var(--lightest);
  border: none;
  border-bottom: 1px solid var(--light);
}

.record-form__input_w-full {
  display: inline-block;
  width: calc(90% + 12px);
}

.record-form__input_text-right {
  text-align: right;
}

.record-form__block {
  display: block;
  margin: 0 0 0 12px;
}

.record-form__input::selection, .record-form__input:focus {
  border-color: var(--accent);
  outline: none;
}

.record-form__select {
  margin: 4px 6px 0;
  width: 45%;
  height: 28px;
  border: 1px solid var(--dark);
  padding: 0 2px;
  background-color: var(--darkest);
  border-radius: 20px;
  outline: none;
}

.record-form__select::selection, .record-form__select:focus {
  border-color: var(--accent);
}

.record-form__actions {
  display: flex;
  justify-content: center;
  gap: 48px;
}

@media (width <= 600px) {
  .record-form__actions {
    flex-direction: row-reverse;
  }
}

</style>