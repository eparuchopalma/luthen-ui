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
  const NETWORK_ERROR_MESSAGE = "Network Error"
  const errorStatusCode = error.response?.status

  if (error.message === NETWORK_ERROR_MESSAGE) errorMessage = "Unable to connect to the server."
  else if (errorStatusCode === 401) errorMessage = "Unauthorized access."
  else if (errorStatusCode === 403) errorMessage = "Forbidden access."
  else if (errorStatusCode === 404) errorMessage = "Resource not found."
  else if (errorStatusCode === 409) errorMessage = error.response?.data?.message || "Something went wrong validating the consistency in the form."
  else if (errorStatusCode === 500) errorMessage = "Internal server error."
  else errorMessage = "An unexpected error occurred."

  return { data: null, errorMessage }
}
