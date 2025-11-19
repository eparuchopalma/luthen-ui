import { reactive } from "vue"
import { authStore } from "./authStore"
import { readRecords } from "../services/recordService"

export type Record = {
  amount: number
  correlated_fund_id: string
  date: string
  fund_id: string
  id: string
  note: string
  tag: string
  type: 0 | 1 | 2
}

export const recordStore = reactive({
  records: [] as Record[],
  async getRecords() {
    const response = await readRecords(authStore.inDemo)
    if (!response.errorMessage) this.setRecords(response.data)
    return response
  },
  setRecords(records: Record[]) {
    this.records = records
  }
})