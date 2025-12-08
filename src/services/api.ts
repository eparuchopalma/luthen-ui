import axios from "axios"

const baseURL = import.meta.env.VITE_API

export const api = axios.create({ baseURL })

export function handleResponse(response: any) {
  return {
    data: response.data,
    errorMessage: null,
  }
}

export function handleError(error: any) {
  console.error(error)
  let errorMessage
  const NETWORK_ERROR_MESSAGE = "Error de conexión"
  const errorStatusCode = error.response?.status

  if (error.message === NETWORK_ERROR_MESSAGE) errorMessage = "Problema para conectar con el servidor."
  else if (errorStatusCode === 401) errorMessage = "Acceso no autorizado."
  else if (errorStatusCode === 403) errorMessage = "Acceso prohibido."
  else if (errorStatusCode === 404) errorMessage = "Recurso no encontrado."
  else if (errorStatusCode === 409) errorMessage = error.response?.data?.message || "Algo en el formulario compromete la consistencia de la data."
  else if (errorStatusCode === 500) errorMessage = "Error interno del servidor."
  else errorMessage = "Ocurrió un error."

  return { data: null, errorMessage }
}
