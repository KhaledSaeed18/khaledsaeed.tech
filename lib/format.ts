const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en")
const monthYear = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})
const dayMonthYear = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

/** 48213 -> "48.2K" */
export const formatCompact = (n: number) => compact.format(n)
/** 9898 -> "9,898" */
export const formatNumber = (n: number) => full.format(n)
/** ISO date -> "Jul 2025" */
export const formatMonth = (iso: string) => monthYear.format(new Date(iso))
/** ISO date -> "18 Jul 2025" */
export const formatDate = (iso: string) => dayMonthYear.format(new Date(iso))
