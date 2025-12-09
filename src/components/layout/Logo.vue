<script setup lang="ts">

defineProps({
  sm: {
    type: Boolean,
    default: false
  },
  centered: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
  <div class="app-logo" :class="{ 'app-logo_sm': sm, 'app-logo_mx-auto': centered }">
    <img src="../../assets/squirrel.svg" alt="Squirrel Logo" class="app-logo__img" />
  </div>
</template>

<style scoped>

.app-logo {
  width: 140px;
  padding: 12px 12px 6px;
  border-radius: 20px;
  box-shadow: 1px 1px 4px var(--secondary);
}

.app-logo_sm {
  width: 24px;
  padding: 2px 2px 0;
  border-radius: 6px;
}

.app-logo_mx-auto {
  margin-right: auto;
  margin-left: auto;
}

.app-logo__img {
  width: 100%;
  height: auto;
}

</style>