import type { Fund } from "../store/fundStore"
import { api, handleError, handleResponse } from "./api"

export function createFund(name: string, demo: boolean) {
  return api.post(demo ? "/public/fund" : "/fund", { name })
    .then(handleResponse)
    .catch(handleError)
}

export function readFunds(demo: boolean) {
  return api.get(demo ? "/public/fund" : "/fund")
    .then(handleResponse)
    .catch(handleError)
}

export function updateFund({ id, name }: Partial<Fund>, demo: boolean) {
  return api.patch(demo ? `/public/fund/${id}` : `/fund/${id}`, { name })
    .then(handleResponse)
    .catch(handleError)
}

export function deleteFund(id: string, demo: boolean) {
  return api.delete(demo ? `/public/fund/${id}` : `/fund/${id}`)
    .then(handleResponse)
    .catch(handleError)
}
