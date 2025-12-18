import { reactive } from "vue"
import { deleteData } from "../services/userService"

export const authStore = reactive({
  isAuthenticated: false,
  inDemo: false,

  loginForDemo() {
    this.inDemo = true
  },

  async deleteUser(token: string) {
    const response = await deleteData(token)
    return response
  }

})