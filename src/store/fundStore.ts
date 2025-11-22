import { reactive } from "vue"
import { authStore } from "./authStore"
import { createFund, readFunds } from "../services/fundService"

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

  async getFunds() {
    const response = await readFunds(authStore.inDemo)
    if (!response.errorMessage) this.setFunds(response.data)
    return response
  },

  async createFund(name: string) {
    const response = await createFund(name, authStore.inDemo)
    if (!response.errorMessage) this.addFund(response.data)
    return response
  }
})