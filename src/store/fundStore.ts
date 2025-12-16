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

  async getFunds(token: string | null) {
    const response = await readFunds(token, authStore.inDemo)
    if (!response.errorMessage) this.setFunds(response.data)
    return response
  },

  async createFund(token: string | null, name: string) {
    const response = await createFund(token, name, authStore.inDemo)
    if (!response.errorMessage) this.addFund(response.data)
    return response
  },

  async updateFund(token: string | null, payload: Partial<Fund>) {
    const response = await updateFund(token, payload, authStore.inDemo)
    if (!response.errorMessage) this.replaceFund(response.data)
    return response
  },

  async deleteFund(token: string | null, id: string) {
    const response = await deleteFund(token, id, authStore.inDemo)
    if (!response.errorMessage) this.removeFund(id)
    return response
  }
})