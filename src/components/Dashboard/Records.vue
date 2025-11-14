<script lang="ts" setup>
import { ref, watch } from 'vue'

const screenSize = ref({
  width: window.innerWidth,
  height: window.innerHeight
})

const rowsQuantity = ref(10)

const handleResize = () => {
  screenSize.value.width = window.innerWidth
  screenSize.value.height = window.innerHeight
}

watch(screenSize, (newSize) => {
  if (newSize.width <= 640) rowsQuantity.value = Math.floor(newSize.height / 90)
  else rowsQuantity.value = Math.floor(newSize.height / 64)
}, { deep: true })

window.addEventListener('resize', handleResize)

</script>

<template>
  <section class="section">
    <header>
      <div class="section__icon">
        <img src="../../assets/lupe.png" alt="lupe icon" class="icon__img">
      </div>
      <h1>Records</h1>
    </header>
    <div class="button-container">
      <button
      class="button"
      type="button"
      >Query</button>
      <button
      class="button button_secondary"
      type="button"
      >Export</button>
    </div>
    <table class="table">
      <thead class="table__header">
        <tr>
          <th class="table__cell table__cell_text-center table__cell_sm">Date</th>
          <th class="table__cell table__cell_text-center table__cell_sm">Amount</th>
          <th class="table__cell table__cell_text-center">Fund</th>
          <th class="table__cell table__cell_text-center">Tag</th>
          <th class="table__cell table__cell_text-center table__cell_sm">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rowsQuantity" :key="row">
          <td class="table__cell table__cell_highlight table__cell_text-sm">Aug-16 (Fri)</td>
          <td class="table__cell table__cell_text-right">-$5</td>
          <td class="table__cell table__cell_text-sm table__cell_bg-bag">Fondo I</td>
          <td class="table__cell table__cell_text-sm table__cell_bg-leaf">Vehículo</td>
          <td class="table__cell table__cell_flex table__cell_mb-8 table__cell_w-full">
            <button type="button" class="table__button table__button_edit"></button>
            <button type="button" class="table__button table__button_delete"></button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="button-container button-container_justify-between button-container_m-0">
      <button
      class="button button_secondary button_sm button_dark"
      type="button"
      >
        <img src="../../assets/chevron.png" alt="chevron left icon" class="button__chevron">
      </button>
      <button
      class="button button_secondary button_sm button_dark"
      type="button"
      >
        <img src="../../assets/chevron.png" alt="chevron left icon" class="button__chevron button__chevron_right">
      </button>
    </div>
    <div class="balance-cell">
      <span>Credit</span>
      <span>$0</span>
    </div>
    <div class="balance-cell">
      <span>Debit</span>
      <span>-$15</span>
    </div>
    <div class="balance-cell">
      <span>Total</span>
      <span>-$15</span>
    </div>
  </section>
</template>

<style scoped>

.table {
  margin: 48px auto 32px;
  width: 100%;
  border-collapse: collapse;
}

.table__header {
  display: none;
}

.table__cell {
  margin: 4px 0;
  width: 48%;
  padding: 0;
  display: inline-block;
}

.table__cell_highlight {
  padding-left: 8px;
  background-color: var(--dark);
  text-align: left;
}

.table__cell_text-sm {
  font-size: 1.4rem;
}

.table__cell_text-right {
  text-align: right;
}

.table__cell_bg-bag {
  background-image: url('../../assets/seed-bag.png');
  background-repeat: no-repeat;
  background-size: 14px;
  background-position: 4px 1px;
}

.table__cell_bg-leaf {
  background-image: url('../../assets/leaf.png');
  background-repeat: no-repeat;
  background-size: 14px;
  background-position: 4px 1px;
}

.table__cell_flex {
  display: flex;
}

.table__cell_mb-8 {
  margin-bottom: 8px;
}

.table__cell_w-full {
  width: 100%;
}

.table__button {
  width: 100%;
  height: 20px;
  background-color: var(--darkest);
  border: none;
  border-radius: 4px;
  display: inline;  
  cursor: pointer;
  box-shadow: 0 1px 4px #111;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px;
}

.table__button:hover {
  box-shadow: 0 1px 4px var(--dark);
}

.table__button_edit {
  background-image: url('../../assets/edit.png');
}

.table__button_delete {
  background-image: url('../../assets/trash.png');
}

.balance-cell {
  margin: 16px 0;
  border: 1px solid var(--dark);
  padding: 8px 16px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 1.6rem;
}

.button__chevron {
  width: 16px;
  height: 16px;
  padding-top: 3px;
}

.button__chevron_right {
  padding-bottom: 3px;
  transform: rotate(180deg);
}

@media (width >= 640px) {

  .table {
    max-width: 900px;
    border-collapse: separate;
    table-layout: fixed;
  }

  .table__header {
    border-radius: 2px;
    display: table-header-group;
    background-color: var(--dark);
    font-size: 1.4rem;
    font-weight: 400;
  }
  
  .table__cell {
    padding: 0 8px;
    border: 1px solid var(--dark);
    border-radius: 2px;
    display: table-cell;
    text-align: left;
    font-size: 1.4rem;
    opacity: 1;
  }

  .table__cell_text-center {
    text-align: center;
  }

  .table__cell_text-right {
    text-align: right;
  }

  .table__cell_sm {
    width: 100px;
  }

  .table__cell_highlight {
    background-color: transparent;
  }

  .table__cell_bg-bag, .table__cell_bg-leaf {
    background-image: none;
  }
  
  .table__button {
    display: inline-block;
    width: 40%;
    height: 18px;
    margin: 0 4px;
  }

  .balance-cell {
    display: inline-flex;
    width: 20%;
    margin: 20px 12px;
  }

}

</style>