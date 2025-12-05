<script setup lang="ts">
import { onMounted } from 'vue';
import Button from './Button.vue'
import Dialog from './Dialog.vue';

const props = defineProps<{
  text: string,
  title?: string,
  textOnly?: boolean,
  loading?: boolean,
  confirmationRequired?: boolean,
}>()

const emit = defineEmits(['dismiss', 'onConfirm'])

onMounted(() => {
  if (props.textOnly) setTimeout(() => emit('dismiss'), 3000)
})

</script>

<template>
  <dialog role="dialog" open v-if="textOnly" class="alert-box">
    <p class="alert-box__text">{{ text }}</p>
  </dialog>
  <Dialog v-else>
    <div class="alert-box alert-box_lg">
      <h4 class="alert-box__title">{{ title }}</h4>
      <p class="alert-box__text">{{ text }}</p>
      <div>
        <Button
        type="button"
        :disabled="loading"
        :modifiers="['secondary', 'sm']"
        text="Dismiss"
        @click="emit('dismiss')" />
        <Button
        v-if="confirmationRequired"
        type="button"
        :disabled="loading"
        :modifiers="['secondary', 'sm']"
        text="Confirm"
        @click="emit('onConfirm')" />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>

.alert-box {
  bottom: 20px;
  width: 90%;
  max-width: 400px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 var(--accent);
  background-color: var(--darkest);
  background-image: url('../../assets/squirrel.svg');
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: 10px 6px;
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
  justify-content: space-between;
}

.alert-box__title {
  font-size: 1.8rem;
  color: var(--lightest);
}

.alert-box__text {
  margin: 0;
  font-size: 1.6rem;
  color: var(--light);
  animation: fade-in 1s ease-in-out;
  animation-fill-mode: forwards;
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