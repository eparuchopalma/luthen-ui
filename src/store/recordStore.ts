import { reactive } from "vue"
import { authStore } from "./authStore"
import { createRecord, deleteRecord, updateRecord, readRecords } from "../services/recordService"
import { fundStore, type Fund } from "./fundStore"

export type Record = {
  amount: number
  correlated_fund_id?: string
  date: string
  fund_id: string
  id?: string
  note: string | null
  tag: string | null
  type: 0 | 1 | 2
}

export const recordStore = reactive({
  records: [] as Record[],

  getCredits() {
    return this.records.filter(r => r.type === 1)
  },

  getDebits() {
    return this.records.filter(r => r.type === 2)
  },

  setRecords(records: Record[]) {
    this.records = records
  },

  handleUpdate(data: { record: Record, funds: Fund[] }) {
    this.replaceRecord(data.record)
    data.funds?.forEach(fund => fundStore.replaceFund(fund))
  },
  
  replaceRecord(record: Record) {
    const index = this.records.findIndex(r => r.id === record?.id)
    this.records.splice(index, 1, record)
  },

  removeRecord(id: string, funds: Fund[]) {
    this.records = this.records.filter(r => r.id !== id)
    funds?.forEach((fund: Fund) => fundStore.replaceFund(fund))
  },

  async createRecord(record: Partial<Record>) {
    const response = await createRecord(record, authStore.inDemo)
    if (!response.errorMessage) response.data.forEach((fund: Fund) => fundStore.replaceFund(fund))
    return response
  },

  async updateRecord(id: string, payload: Partial<Record>) {
    const response = await updateRecord(id, payload, authStore.inDemo)
    if (!response.errorMessage) this.handleUpdate(response.data)
    return response
  },

  async getRecords(filters: Partial<Record> & { fromDate?: string; toDate?: string }) {
    const response = await readRecords(filters, authStore.inDemo)
    if (!response.errorMessage) this.setRecords(response.data)
    return response
  },

  async deleteRecord(id: string) {
    const response = await deleteRecord(id, authStore.inDemo)
    if (!response.errorMessage) this.removeRecord(id, response.data)
    return response
  }
})
