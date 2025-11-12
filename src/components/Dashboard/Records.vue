<script lang="ts" setup></script>

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
          <td class="table__cell table__cell_highlight">Aug-16 (Fri)</td>
          <td class="table__cell table__cell_text-lg">-$5</td>
          <td class="table__cell table__cell_bg-bag">Fondo I</td>
          <td class="table__cell table__cell_leaf">Vehículo</td>
          <td class="table__cell table__cell_flex">
            <button type="button" class="table__button table__button_edit"></button>
            <button type="button" class="table__button table__button_delete"></button>
          </td>
        </tr>
        <tr>
          <td class="table__cell table__cell_highlight">Aug-16 (Fri)</td>
          <td class="table__cell table__cell_text-lg">-$5</td>
          <td class="table__cell table__cell_bg-bag">Fondo I</td>
          <td class="table__cell table__cell_leaf">Vehículo</td>
          <td class="table__cell table__cell_flex">
            <button type="button" class="table__button table__button_edit"></button>
            <button type="button" class="table__button table__button_delete"></button>
          </td>
        </tr>
        <tr>
          <td class="table__cell table__cell_highlight">Aug-16 (Fri)</td>
          <td class="table__cell table__cell_text-lg">-$5</td>
          <td class="table__cell table__cell_bg-bag">Fondo I</td>
          <td class="table__cell table__cell_leaf">Vehículo</td>
          <td class="table__cell table__cell_flex">
            <button type="button" class="table__button table__button_edit"></button>
            <button type="button" class="table__button table__button_delete"></button>
          </td>
        </tr>
        <tr>
          <td class="table__cell table__cell_highlight">Aug-16 (Fri)</td>
          <td class="table__cell table__cell_text-lg">-$5</td>
          <td class="table__cell table__cell_bg-bag">Fondo I</td>
          <td class="table__cell table__cell_leaf">Vehículo</td>
          <td class="table__cell table__cell_flex">
            <button type="button" class="table__button table__button_edit"></button>
            <button type="button" class="table__button table__button_delete"></button>
          </td>
        </tr>
        <tr>
          <td class="table__cell table__cell_highlight">Aug-16 (Fri)</td>
          <td class="table__cell table__cell_text-lg">-$5</td>
          <td class="table__cell table__cell_bg-bag">Fondo I</td>
          <td class="table__cell table__cell_leaf">Vehículo</td>
          <td class="table__cell table__cell_flex">
            <button type="button" class="table__button table__button_edit"></button>
            <button type="button" class="table__button table__button_delete"></button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="button-container button-container_justify-between button-container_mt-30">
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
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 48px;
}

.table__header {
  display: none;
}

.table__cell {
  margin: 2px 0;
  width: 48%;
  padding: 0;
  display: inline-block;
}

.table__cell_highlight {
  padding-left: 8px;
  text-align: left;
  background-color: var(--accent);
  font-size: 1.6rem;
}

.table__cell_text-lg {
  font-size: 2.4rem;
}

.table__cell_bg-bag {
  background-image: url('../../assets/seed-bag.png');
  background-repeat: no-repeat;
  background-size: 20px;
  background-position: 4px 0;
}

.table__cell_leaf {
  background-image: url('../../assets/leaf.png');
  background-repeat: no-repeat;
  background-size: 20px;
  background-position: 4px 0;
}

.table__cell_flex {
  display: flex;
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
  padding: 8px 16px;
  margin: 8px 0;
  border: 1px solid var(--dark);
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
    margin: 48px auto;
    border-spacing: 2px;
  }

  .table__header {
    width: 120px;
    border: none;
    border-radius: 2px;
    display: table-cell;
    background-color: var(--dark);
  }
  
  .table__cell {
    display: table-cell;
    width: 120px;
    border: 1px solid var(--dark);
    border-radius: 2px;
    font-size: 1.6rem;
    opacity: 1;
  }

  .table__cell_highlight {
    background-color: var(--darkest);
  }

  .table__button {
    display: inline-block;
    width: 44px;
    margin: 0 4px;
  }

  .balance-cell {
    display: inline-flex;
    width: 20%;
    margin: 0 12px;
  }

}

</style>