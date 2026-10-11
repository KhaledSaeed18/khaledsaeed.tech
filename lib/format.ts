const full = new Intl.NumberFormat("en")
const dayMonthYear = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})
const monthYear = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

/** 9898 -> "9,898" */
export const formatNumber = (n: number) => full.format(n)
/** ISO date -> "18 Jul 2025" */
export const formatDate = (iso: string) => dayMonthYear.format(new Date(iso))
/** "2025-09" -> "Sep 2025". A bare year ("2027") stays as it is. */
export const formatMonth = (iso: string) =>
  /^\d{4}$/.test(iso) ? iso : monthYear.format(new Date(iso))
/** Any ISO precision: "2025-05-30" -> "30 May 2025", "2024-05" -> "May 2024". */
export const formatIso = (iso: string) =>
  iso.length > 7 ? formatDate(iso) : formatMonth(iso)
/** The year of an ISO date, month or bare year. */
export const yearOf = (iso: string) => Number(iso.slice(0, 4))
