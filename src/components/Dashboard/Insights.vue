<script setup lang="ts"></script>

<template>
  <section class="section">
    <header>
      <div class="section__icon">
        <img src="../../assets/lupe-chart.png" alt="lupe on chart icon" class="icon__img">
      </div>
      <h1>Insights</h1>
    </header>
    <!-- <div class="table-container"> -->
      <table class="table">
        <thead>
          <tr class="table__header-row">
            <th>Tag</th>
            <th>Balance</th>
            <th>Equivalence</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="table__cell table__cell_text-left">Home</td>
            <td class="table__cell table__cell_text-right">- $700.00</td>
            <td class="table__cell">70%</td>
          </tr>
          <tr>
            <td class="table__cell table__cell_text-left">Vehicle</td>
            <td class="table__cell table__cell_text-right">- $300.00</td>
            <td class="table__cell">30%</td>
          </tr>
        </tbody>
      </table>
    <!-- </div> -->
  </section>
</template>

<style scoped>

.table {
  margin: 48px auto 0;
  width: 100%;
  max-width: 400px;
  border-spacing: 2px;
  border-collapse: separate;
  font-size: 1.4rem;
  table-layout: fixed;
}

.table__header-row {
  background-color: var(--dark);
}

.table__cell {
  width: 120px;
  padding: 0 4px;
  border: 1px solid var(--dark);
}

.table__cell_text-left {
  text-align: left;
}

.table__cell_text-right {
  text-align: right;
}

</style>