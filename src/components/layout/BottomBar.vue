<script setup lang="ts">
import { ref } from 'vue';
import RecordForm from '../status/RecordForm.vue'
import QueryForm from '../status/QueryForm.vue'
import Button from './Button.vue'

const recordFormIsOpen = ref(false)
const queryFormIsOpen = ref(false)

function dismissRecordForm() {
  recordFormIsOpen.value = false
}

function dismissQueryForm() {
  queryFormIsOpen.value = false
}

</script>

<template>
  <div class="bottom-bar">
    <Button
    type="button"
    :modifiers="['secondary']"
    text="Consultar"
    @click="queryFormIsOpen = true" />
    <Button
    type="button"
    text="Crear registro"
    @click="recordFormIsOpen = true" />
  </div>
  <Transition>
    <RecordForm v-if="recordFormIsOpen" @dismiss-form="dismissRecordForm" />
    <QueryForm
    v-else-if="queryFormIsOpen"
    @dismiss-form="dismissQueryForm" />
  </Transition>
</template>

<style scoped>
  .bottom-bar {
    width: 100%;
    padding-bottom: 4px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    background-color: var(--primary);
  }
</style>