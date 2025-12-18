<script setup lang='ts'>
  import { computed, inject, onMounted, ref } from 'vue';
  import { useAuth0 } from '@auth0/auth0-vue'
  import Dialog from '../layout/Dialog.vue'
  import Button from '../layout/Button.vue';
  import type { Alert } from '../layout/AlertBox.vue'
  import { authStore } from '../../store/authStore';

  onMounted(() => document.getElementById('delete-confirmation-field')?.focus())

  const { getAccessTokenSilently, logout } = useAuth0()
  const showAlert = inject('showAlert') as (arg: Alert) => void
  const emit = defineEmits(['dismissForm'])

  const confirmationText = ref('')
  const loading = ref(false)

  const invalidForm = computed(() => {
    return confirmationText.value.toLowerCase() !== 'eliminar'
  })

  async function getToken() {
    try {
      const token = await getAccessTokenSilently()
      return token
    } catch (error) {
      showAlert({
        title: 'Error autenticando',
        text: 'Algo no salió como se esperaba.',
        autoDismiss: false
      })
      console.error(error)
    }
  }

  async function onSubmit() {
    loading.value = true
    const token = authStore.inDemo ? null : await getToken()
    const { errorMessage } = await authStore.deleteUser(token!)
    showAlert({
      text: errorMessage || 'Cuenta eliminada',
      title: errorMessage ? 'Error eliminando cuenta' : '',
      autoDismiss: !Boolean(errorMessage)
    })
    loading.value = false
    if (!errorMessage) {
      emit('dismissForm')
      logout()
    }
  }

</script>

<template>
  <Dialog @click.self="emit('dismissForm')" @keydown.esc="emit('dismissForm')">
    <form class="signout-form" @submit.prevent="onSubmit">
      <h3 class="title">Eliminar usuario</h3>
      <p class="instructions">Para eliminar permanentemente sus datos,
        escriba <kbd>eliminar</kbd> y pulse confirmar.
      </p>
      <fieldset class="signout-form__fieldset">
        <label
        for="delete-confirmation-field"
        class="signout-form__label"
        :class="{ 'signout-form__label_alert': invalidForm }"
        >Texto de confirmación</label>
        <input
        type="text"
        class="signout-form__input"
        id="delete-confirmation-field"
        maxlength="50"
        required
        v-model="confirmationText">
      </fieldset>
      <div class="signout-form__actions">
        <Button
        type="submit"
        :disabled="invalidForm || loading"
        :modifiers="['sm']"
        text="Confirmar" />
        <Button
        type="button"
        :modifiers="['secondary', 'sm']"
        :disabled="loading"
        text="Volver"
        @click="$emit('dismissForm')" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
  .signout-form {
  width: 100%;
  height: 100%;
  max-width: 300px;
  max-height: 240px;
  border-radius: 4px;
  padding: 12px 32px;
  display: grid;
  place-items: center;
  background-color: var(--primary);
  color: var(--font-color);
}

.signout-form__fieldset {
  justify-self: start;
}

.signout-form__label {
  margin: 6px 8px;
  width: 100%;
  display: block;
  text-align: left;
  font-size: 1.2rem;
  color: var(--tertiary);
}

.signout-form__label_alert::after {
  content: '!';
  margin-left: 4px;
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
  text-align: center;
  font-weight: bold;
  background-color: var(--accent);
  color: var(--primary);
}

.signout-form__input {
  margin: 0 6px;
  width: calc(90% + 12px);
  background-color: var(--primary);
  color: var(--font-color);
  border: none;
  border-bottom: 1px solid var(--tertiary);
}

.signout-form__input::selection, .signout-form__input:focus {
  border-color: var(--accent);
  outline: none;
}

.signout-form__actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (width <= 600px) {
  .signout-form__actions {
    flex-direction: row-reverse;
  }
}

</style>