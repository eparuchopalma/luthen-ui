<script lang="ts" setup>

defineProps({
  text: {
    type: String,
    required: true
  },
  modifiers: {
    type: Array as () => string[],
    default: []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  submit: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
  <button
  :type="submit ? 'submit' : 'button'"
  :class="['button', ...modifiers.map(mod => `button_${mod}`)]"
  :disabled="disabled"
  >{{ text }}</button>
</template>

<style scoped>

.button {
  margin: 0 2px;
  height: 24px;
  width: 120px;
  border: none;
  border-radius: 2px;
  background-color: var(--accent);
  color: var(--lightest);
  box-shadow: 0 1px 2px var(--secondary);
  transition: box-shadow 0.2s ease-in-out;
}

.button_secondary {
  color: var(--font-color);
  background-color: var(--primary);
}

.button_dark {
  color: var(--font-color);
  background-color: var(--secondary);
}

.button_sm {
  width: 80px;
}

.button_pill {
  width: 72px;
  height: 20px;
  border-radius: 12px;
  font-size: 1.1rem;
  background-color: var(--accent);
  color: var(--lightest);
}

@media (hover: hover) and (pointer: fine) {

  .button:hover {
    box-shadow: 1px 1px 2px var(--tertiary);
  }

  .button_secondary:hover {
    box-shadow: -1px 1px 2px var(--tertiary);
  }

}

.button:disabled {
  background-color: var(--primary);
  color: var(--secondary);
  cursor: auto;
  box-shadow: none;
}

</style>