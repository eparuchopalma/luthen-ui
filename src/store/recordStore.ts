import { reactive } from "vue"
import { authStore } from "./authStore"
import { createRecord, updateRecord, readRecords } from "../services/recordService"

export type Record = {
  amount: number
  correlated_fund_id?: string
  date: string
  fund_id: string
  id?: string
  note: string
  tag: string
  type: 0 | 1 | 2
}

export const recordStore = reactive({
  records: [] as Record[],

  setRecords(records: Record[]) {
    this.records = records
  },

  replaceRecord(record: Record) {
    const index = this.records.findIndex(r => r.id === record.id)
    this.records[index] = record
  },

  async createRecord(record: Partial<Record>) {
    const response = await createRecord(record, authStore.inDemo)
    return response
  },

  async updateRecord(id: string, payload: Partial<Record>) {
    const response = await updateRecord(id, payload, authStore.inDemo)
    if (!response.errorMessage) this.replaceRecord(response.data)
    return response
  },

  async getRecords() {
    const response = await readRecords(authStore.inDemo)
    if (!response.errorMessage) this.setRecords(response.data)
    return response
  },
})
