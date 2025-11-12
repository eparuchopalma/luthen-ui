<script lang="ts" setup></script>

<template>
  <section class="section">
    <header>
      <div class="section__icon">
        <img src="../../assets/lupe.png" alt="lupe icon" class="icon__img">
      </div>
      <h1>Records</h1>
    </header>
    <table class="table">
      <thead>
        <tr>
          <th class="table__header">Date</th>
          <th class="table__header">Amount</th>
          <th class="table__header">Fund</th>
          <th class="table__header">Tag</th>
          <th class="table__header">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="table__cell table__cell_text-sm">Aug-16 (Fri)</td>
          <td class="table__cell table__cell_text-lg">-$5</td>
          <td class="table__cell">Fondo I</td>
          <td class="table__cell">Vehículo</td>
          <td class="table__cell table__cell_flex">
            <button type="button" class="table__button table__button_edit"></button>
            <button type="button" class="table__button table__button_delete"></button>
          </td>
        </tr>
        <tr>
          <td class="table__cell table__cell_text-sm">Aug-16 (Fri)</td>
          <td class="table__cell table__cell_text-lg">-$5</td>
          <td class="table__cell">Fondo I</td>
          <td class="table__cell">Vehículo</td>
          <td class="table__cell table__cell_flex">
            <button type="button" class="table__button table__button_edit"></button>
            <button type="button" class="table__button table__button_delete"></button>
          </td>
        </tr>
        <tr>
          <td class="table__cell table__cell_text-sm">Aug-16 (Fri)</td>
          <td class="table__cell table__cell_text-lg">-$5</td>
          <td class="table__cell">Fondo I</td>
          <td class="table__cell">Vehículo</td>
          <td class="table__cell table__cell_flex">
            <button type="button" class="table__button table__button_edit"></button>
            <button type="button" class="table__button table__button_delete"></button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>

.table {
  width: 100%;
  margin: 48px auto;
  border-collapse: separate;
  border-spacing: 0 48px;
}

.table__header {
  display: none;
}

.table__cell {
  margin: 6px 0;
  width: 48%;
  display: inline-block;
}

.table__cell_text-sm {
  font-size: 1.6rem;
}

.table__cell_text-lg {
  font-size: 2.4rem;
}

.table__cell_flex {
  display: flex;
  justify-content: space-around;
  gap: 12px;
  width: 100%;
}

.table__button {
  width: 48px;
  height: 24px;
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

@media (width >= 640px) {

  .table {
    border-spacing: 2px;
  }

  .table__header {
    background-color: var(--dark);
    display: table-cell;
    border: none;
    border-radius: 2px;
  }

  .table__cell {
    width: 120px;
    border: 1px solid var(--dark);
    display: table-cell;
    font-size: 1.6rem;
  }

  .table__button {
    height: 20px;
    margin: 0 4px;
  }

}

</style>