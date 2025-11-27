import { reactive } from "vue"
import { authStore } from "./authStore"
import { createFund, deleteFund, readFunds, updateFund } from "../services/fundService"

export type Fund = {
  id: string
  name: string
  balance: number
  is_main: boolean
}

export const fundStore = reactive({
  funds: [] as Fund[],

  setFunds(funds: Fund[]) {
    this.funds = funds
  },

  addFund(fund: Fund) {
    this.funds.push(fund)
  },

  replaceFund(fund: Fund) {
    const index = this.funds.findIndex(f => f.id === fund.id)
    this.funds[index] = fund
  },

  removeFund(id: string) {
    this.funds = this.funds.filter(f => f.id !== id)
  },

  async getFunds() {
    const response = await readFunds(authStore.inDemo)
    if (!response.errorMessage) this.setFunds(response.data)
    return response
  },

  async createFund(name: string) {
    const response = await createFund(name, authStore.inDemo)
    if (!response.errorMessage) this.addFund(response.data)
    return response
  },

  async updateFund(payload: Partial<Fund>) {
    const response = await updateFund(payload, authStore.inDemo)
    if (!response.errorMessage) this.replaceFund(response.data)
    return response
  },

  async deleteFund(id: string) {
    const response = await deleteFund(id, authStore.inDemo)
    if (!response.errorMessage) this.removeFund(id)
    return response
  }
})