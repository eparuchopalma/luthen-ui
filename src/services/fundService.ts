import type { Fund } from "../store/fundStore"
import { api, handleError, handleResponse } from "./api"

export function createFund(token: string | null, name: string, demo: boolean) {
  const config = demo ? {} : { headers: { Authorization: `Bearer ${token}`} }
  return api.post(demo ? "/public/fund" : "/fund", { name }, config)
    .then(handleResponse)
    .catch(handleError)
}

export function readFunds(token: string | null, demo: boolean) {
  const config = demo ? {} : { headers: { Authorization: `Bearer ${token}`} }
  return api.get(demo ? "/public/fund" : "/fund", config)
    .then(handleResponse)
    .catch(handleError)
}

export function updateFund(token: string | null, { id, name }: Partial<Fund>, demo: boolean) {
  const config = demo ? {} : { headers: { Authorization: `Bearer ${token}`} }
  return api.patch(demo ? `/public/fund/${id}` : `/fund/${id}`, { name }, config)
    .then(handleResponse)
    .catch(handleError)
}

export function deleteFund(token: string | null, id: string, demo: boolean) {
  const config = demo ? {} : { headers: { Authorization: `Bearer ${token}`} }
  return api.delete(demo ? `/public/fund/${id}` : `/fund/${id}`, config)
    .then(handleResponse)
    .catch(handleError)
}
