<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

onMounted(() => hideScrollbar())
onUnmounted(() => showScrollbar())

function hideScrollbar() {
  const documentBody = document.getElementsByTagName("body")[0]
  documentBody!.setAttribute("style", "overflow: hidden;")
}

function showScrollbar() {
  const documentBody = document.getElementsByTagName("body")[0]
  documentBody!.setAttribute("style", "overflow: auto;")
}

</script>

<template>
  <dialog role="form" class="dialog" open>
    <slot></slot>
  </dialog>
</template>

<style scoped>

.dialog {
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  background-color: rgba(0, 0, 0, .8);
  display: grid;
  place-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}

</style>