import { api, handleError, handleResponse } from "./api"
import { type Record } from "../store/recordStore"

export function createRecord(token: string | null, payload: Partial<Record>, demo: boolean) {
  const config = demo ? {} : { headers: { Authorization: `Bearer ${token}`} }
  return api.post(demo ? "/public/record" : "/record", payload, config)
    .then(handleResponse)
    .catch(handleError)
}

export function readRecords(token: string | null, filters: Partial<Record> & { fromDate?: string; toDate?: string }, demo: boolean) {
  const config = demo ? {} : { headers: { Authorization: `Bearer ${token}`} }
  return api.get(demo ? "/public/record" : "/record", { params: filters, ...config })
    .then(handleResponse)
    .catch(handleError)
}

export function updateRecord(token: string | null, id: string, payload: Partial<Record>, demo: boolean) {
  const config = demo ? {} : { headers: { Authorization: `Bearer ${token}`} }
  return api.patch(demo ? `/public/record/${id}` : `/record/${id}`, payload, config)
    .then(handleResponse)
    .catch(handleError)
}

export function deleteRecord(token: string | null, id: string, demo: boolean) {
  const config = demo ? {} : { headers: { Authorization: `Bearer ${token}`} }
  return api.delete(demo ? `/public/record/${id}` : `/record/${id}`, config)
    .then(handleResponse)
    .catch(handleError)
}
