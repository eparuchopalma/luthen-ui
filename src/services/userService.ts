import { api, handleError, handleResponse } from "./api"

export function deleteData(token: string | null) {
  const config = { headers: { Authorization: `Bearer ${token}`} }
  return api.delete('/user/', config)
    .then(handleResponse)
    .catch(handleError)
}
