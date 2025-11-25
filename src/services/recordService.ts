import { api, handleError, handleResponse } from "./api"
import { type Record } from "../store/recordStore"

export function createRecord(payload: Partial<Record>, demo: boolean) {
  return api.post(demo ? "/public/record" : "/record", payload)
    .then(handleResponse)
    .catch(handleError)
}

export function readRecords(demo: boolean) {
  return api.get(demo ? "/public/record" : "/record")
    .then(handleResponse)
    .catch(handleError)
}

export function updateRecord(id: string, payload: Partial<Record>, demo: boolean) {
  return api.patch(demo ? `/public/record/${id}` : `/record/${id}`, payload)
    .then(handleResponse)
    .catch(handleError)
}

export function deleteRecord(id: string, demo: boolean) {
  return api.delete(demo ? `/public/record/${id}` : `/record/${id}`)
    .then(handleResponse)
    .catch(handleError)
}
