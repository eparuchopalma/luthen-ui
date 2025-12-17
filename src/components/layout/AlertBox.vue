<script setup lang="ts">
import { onMounted } from 'vue';
import Button from './Button.vue'
import Dialog from './Dialog.vue';

export type Alert = {
  text: string,
  title?: string,
  autoDismiss: boolean,
  onConfirm?: () => any
}

const props = defineProps<Alert>()
const emit = defineEmits(['dismiss'])

onMounted(() => {
  if (props.autoDismiss) setTimeout(() => emit('dismiss'), 3000)
  else document.getElementById('alert-dismiss-button')?.focus()
})

function handleConfirmation() {
  props.onConfirm!()
  emit('dismiss')
}

</script>

<template>
  <div role="alert" open v-if="autoDismiss" class="alert-box">
    <p class="alert-box__text alert-box__text_light">{{ text }}</p>
  </div>
  <Dialog v-else @click.self="emit('dismiss')" @keydown.esc="emit('dismiss')">
    <div class="alert-box alert-box_lg">
      <h4 class="alert-box__title">{{ title }}</h4>
      <p class="alert-box__text">{{ text }}</p>
      <div>
        <Button
        id="alert-dismiss-button"
        type="button"
        :modifiers="['secondary', 'sm']"
        text="Volver"
        @click="emit('dismiss')" />
        <Button
        v-if="onConfirm !== undefined"
        type="button"
        :modifiers="['secondary', 'sm']"
        text="Confirmar"
        @click="handleConfirmation" />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>

.alert-box {
  bottom: 20px;
  width: 90%;
  max-width: 400px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  position: fixed;
  top: 14px;
  left: 14px;
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: -2px 3px 4px var(--accent);
  background-color: var(--darkest);
  animation: grow-wider 1.2s ease-in-out;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 10;
}

.alert-box_lg {
  height: 200px;
  padding: 20px;
  flex-direction: column;
  animation: none;
  justify-content: space-between;
  white-space: wrap;
  text-align: left;
  background-color: var(--primary);
  position: relative;
  box-shadow: 0 1px 4px 1px var(--accent);
}

.alert-box__title {
  font-size: 1.8rem;
  color: var(--tertiary);
}

.alert-box__text {
  margin: 0;
  font-size: 1.6rem;
  color: var(--font-color);
  animation: fade-in 1s ease-in-out;
  animation-fill-mode: forwards;
}

.alert-box__text_light {
  color: var(--light);
}

@keyframes grow-wider {
  from {
    width: 0;
  }
  to {
    width: 90%;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

</style>