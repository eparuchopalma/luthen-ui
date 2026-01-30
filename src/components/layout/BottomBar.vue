<script setup lang="ts">
import Button from './Button.vue'

const emit = defineEmits(['openQueryForm', 'openRecordForm'])

</script>

<template>
  <div class="bottom-bar">
    <Button
    type="button"
    :modifiers="['secondary']"
    text="Consultar"
    @click="emit('openQueryForm')" />
    <Button
    type="button"
    text="Crear registro"
    @click="emit('openRecordForm')" />
  </div>
</template>

<style scoped>
  .bottom-bar {
    width: 100%;
    padding: 12px 0;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    background-color: var(--primary);
    box-shadow: 0 -1px 4px var(--secondary);
  }
</style>