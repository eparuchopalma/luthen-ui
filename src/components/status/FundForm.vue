<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Dialog from '../layout/Dialog.vue';
import Button from '../layout/Button.vue';
import { fundStore, type Fund } from '../../store/fundStore'

onMounted(() => document.getElementById('fund-name-field')?.focus())
const emit = defineEmits(['dismissForm'])

const props = defineProps<{ fund?: Fund | null }>()

const fundName = ref(props.fund?.name || '')
const loading = ref(false)

const invalidForm = computed(() => {
  return fundName.value === '' || props.fund?.name === fundName.value
})

async function onSubmit() {
  loading.value = true
  const { errorMessage } = props.fund ? await update() : await create()
  alert(errorMessage ? errorMessage : 'Fund saved!')
  if (!errorMessage) emit('dismissForm')
  else loading.value = false
}

function create() {
  return fundStore.createFund(fundName.value)
}

function update() {
  return fundStore.updateFund({ id: props.fund!.id, name: fundName.value })
}

async function onDelete() {
  const confirmDelete = confirm('Are you sure you want to delete this record? This action cannot be undone.')
  if (!confirmDelete) return
  loading.value = true
  const { errorMessage } = await fundStore.deleteFund(props.fund!.id!)
  alert(errorMessage ? errorMessage : 'Fund deleted successfully!')
  if (!errorMessage) emit('dismissForm')
  else loading.value = false
}

</script>

<template>
  <Dialog @click.self="emit('dismissForm')" @keydown.esc="emit('dismissForm')">
    <form class="fund-form" @submit.prevent="onSubmit">
      <h3 class="title">Fund Form</h3>
      <fieldset class="fund-form__fieldset">
        <label
        for="fund-name-field"
        class="fund-form__label"
        :class="{ 'fund-form__label_alert': invalidForm }"
        >Name</label>
        <input
        type="text"
        class="fund-form__input"
        placeholder="Savings"
        id="fund-name-field"
        maxlength="50"
        required
        v-model="fundName">
      </fieldset>
      <div class="fund-form__actions">
        <Button
        type="submit"
        :disabled="invalidForm || loading"
        :modifiers="['sm']"
        :text="props.fund ? 'Update' : 'Create'" />
        <Button
        type="button"
        :modifiers="['secondary', 'sm']"
        :disabled="loading"
        text="Dismiss"
        @click="$emit('dismissForm')" />
        <Button
        v-if="props.fund"
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

.fund-form {
  width: 100%;
  height: 100%;
  max-width: 300px;
  max-height: 220px;
  border-radius: 4px;
  padding: 0 32px;
  display: grid;
  place-items: center;
  background-color: var(--darkest);
  color: var(--lightest);
}

.fund-form__fieldset {
  justify-self: start;
}

.fund-form__label {
  margin: 6px 8px;
  width: 100%;
  display: block;
  text-align: left;
  font-size: 1.2rem;
  color: var(--light);
}

.fund-form__label_alert::after {
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

.fund-form__input {
  margin: 0 6px;
  width: calc(90% + 12px);
  background-color: var(--darkest);
  color: var(--lightest);
  border: none;
  border-bottom: 1px solid var(--light);
}

.fund-form__input::selection, .fund-form__input:focus {
  border-color: var(--accent);
  outline: none;
}

.fund-form__actions {
  display: flex;
  justify-content: center;
  gap: 48px;
}

@media (width <= 600px) {
  .fund-form__actions {
    flex-direction: row-reverse;
  }
}

</style>