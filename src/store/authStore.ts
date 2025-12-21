import { reactive } from "vue"
import { deleteData } from "../services/userService"
import { fundStore } from "./fundStore"
import { recordStore } from "./recordStore"

export const authStore = reactive({
  isAuthenticated: false,
  inDemo: false,

  login(inDemo: boolean) {
    this.inDemo = inDemo
    this.isAuthenticated = true
  },

  logout() {
    fundStore.setFunds([])
    recordStore.setRecords([])
    this.inDemo = false
    this.isAuthenticated = false
  },

  async deleteUser(token: string) {
    const response = await deleteData(token)
    return response
  },

})