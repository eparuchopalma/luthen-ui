<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs'

const props = defineProps(['months', 'monthsBalance'])

const chartData = computed(() => {
  return {
    labels: props.months,
    datasets: [{
      data: props.monthsBalance,
      label: 'Total',
      maxBarThickness: 32,
      borderColor: '#BC5536',
      hoverBackgroundColor: '#545456',
      borderRadius: 2,
      borderWidth: 1
    }]
  }
})

const chartOptions = {
  responsive: true
}

</script>

<template>
  <Line
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>