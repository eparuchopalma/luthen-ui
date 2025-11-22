<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement)
ChartJS.defaults.borderColor = 'transparent';

const props = defineProps(['tagNames', 'tagBalances'])

const chartData = computed(() => {
  return {
    labels: props.tagNames,
    datasets: [{
      data: props.tagBalances,
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
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>