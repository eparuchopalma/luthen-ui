<script lang="ts" setup>
defineProps<{
  title: string,
  description: string,
  icon: string
}>()
</script>

<template>
  <section class="section">
    <header class="header">
      <div class="section__icon-container">
        <img :src="icon" :alt="icon" class="section__icon">
      </div>
      <h1>{{ title }}</h1>
      <p class="section__description">{{ description }}</p>
    </header>
    <slot />
  </section>    
</template>

<style scoped>

.section {
  margin-top: 24px;
  margin-bottom: 72px;
  min-height: 88vh;
}

.header {
  margin-bottom: 48px;
}

.section__description {
  font-size: 1.4rem;
}

.section__icon-container {
  margin: 24px auto;
  width: 32px;
  height: 32px;
  padding: 6px;
  border-radius: 50%;
  background-color: var(--dark);
}

.section__icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

</style>