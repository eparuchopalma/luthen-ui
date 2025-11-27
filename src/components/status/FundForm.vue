<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Dialog from '../layout/Dialog.vue';
import { fundStore, type Fund } from '../../store/fundStore'

onMounted(() => document.getElementById('fund-name-field')?.focus())
const emit = defineEmits(['dismissForm'])

const props = defineProps<{ fund?: Fund | null }>()

const fundName = ref(props.fund?.name || '')
const loading = ref(false)

const invalidForm = computed(() => {
  if (!props.fund) return fundName.value === ''
  return fundName.value === '' || props.fund.name === fundName.value
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
  <Dialog>
    <form class="form form_sm">
      <h3 class="title">Fund Form</h3>
      <input
      type="text"
      class="input"
      placeholder="Savings"
      id="fund-name-field"
      maxlength="50"
      required
      v-model="fundName">
      <div class="button-container">
        <button
        type="button"
        class="button button_sm button_secondary"
        @click="$emit('dismissForm')"
        :disabled="loading"
        >Dismiss</button>
        <button
        v-if="props.fund"
        type="button"
        class="button button_secondary button_sm"
        @click="onDelete"
        :disabled="loading"
        >Delete</button>
        <button
        type="button"
        class="button button_sm"
        :disabled="invalidForm || loading"
        @click="onSubmit"
        >{{ props.fund ? 'Update' : 'Create' }}</button>
      </div>
    </form>
  </Dialog>
</template>