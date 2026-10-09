const full = new Intl.NumberFormat("en")
const dayMonthYear = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

/** 9898 -> "9,898" */
export const formatNumber = (n: number) => full.format(n)
/** ISO date -> "18 Jul 2025" */
export const formatDate = (iso: string) => dayMonthYear.format(new Date(iso))
