<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Dialog from '../layout/Dialog.vue';
import { fundStore, type Fund } from '../../store/fundStore'

onMounted(() => document.getElementById('fund-name-field')?.focus())
const emit = defineEmits(['dismissForm'])

const props = defineProps<{
  fund?: Fund
}>()

const fundName = ref('')
const loading = ref(false)

const invalidForm = computed(() => {
  if (!props.fund) return fundName.value === ''
  return fundName.value === '' || props.fund.name === fundName.value
})

async function createFund() {
  loading.value = true
  const { errorMessage } = await fundStore.createFund(fundName.value)
  if (errorMessage) alert(errorMessage)
  else emit('dismissForm')
  loading.value = false
}

</script>

<template>
  <Dialog>
    <form class="form">
      <h3 class="title">Fund Form</h3>
      <input
      type="text"
      class="input"
      placeholder="Savings"
      id="fund-name-field"
      maxlength="50"
      v-model="fundName">
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
        :disabled="invalidForm || loading"
        @click="createFund"
        >Confirm</button>
      </div>
    </form>
  </Dialog>
</template>

<style scoped>

.form {
  width: 100%;
  max-width: 300px;
  height: 100%;
  max-height: 220px;
  border-radius: 4px;
  padding: 0 32px;
  display: grid;
  place-items: center;
  background-color: var(--darkest);
  color: var(--lightest);
}

.input {
  background-color: var(--darkest);
  color: var(--lightest);
  border: none;
  border-bottom: 1px solid var(--light);
}

.input::selection, .input:focus {
  border-color: var(--accent);
  outline: none;
}

</style>