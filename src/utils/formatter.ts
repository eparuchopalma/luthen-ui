export const formDateFormatter = (date: Date) => new Intl
  .DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false  })
  .format(date)

export const tableDateFormatter = (date: string) => new Intl
  .DateTimeFormat('es-VE', { weekday: "short", year: "numeric", month: "short", day: "2-digit" })
  .format(new Date(date))

export const amountFormatter = (amount: number) => new Intl
  .NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  .format(amount)