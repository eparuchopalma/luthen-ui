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