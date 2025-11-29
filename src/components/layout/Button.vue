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
  height: 24px;
  width: 120px;
  border: none;
  border-radius: 2px;
  background-color: var(--accent);
  color: var(--lightest);
  box-shadow: 0 1px 4px #111;
  transition: all 0.6s ease;
}

.button_secondary {
  background-color: var(--darkest);
}

.button_dark {
  background-color: var(--dark);
}

.button_sm {
  width: 72px;
}

@media (hover: hover) and (pointer: fine) {
  .button:hover {
    box-shadow: 0 1px 4px var(--dark);
  }
}

.button:disabled {
  background-color: var(--darkest);
  color: var(--dark)
}

.button:disabled:hover {
  box-shadow: none;
  cursor: auto;
}

</style>