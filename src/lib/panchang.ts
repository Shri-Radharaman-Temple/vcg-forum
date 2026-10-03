/**
 * Tithi / panchang labels.
 *
 * The design shows the tithi alongside every Gregorian date ("Saturday,
 * 26 September · Ashwin Krishna Pratipada"). Deriving a tithi correctly needs
 * lunar ephemeris data and a location, which is not something to approximate in
 * the browser — a wrong tithi on a devotional calendar is worse than none.
 *
 * So this module is a *seam*, not a calculator: the backend is expected to
 * return panchang labels alongside each date, and `PANCHANG` below is the
 * lookup the mock data layer serves in the meantime. Swap `lookupTithi` for an
 * API read and nothing else in the UI changes.
 *
 * Each entry carries two forms. `full` is the complete label used in prose and
 * on detail screens; `short` is what fits a calendar cell, which is roughly
 * ten characters before it collides with the neighbouring day number. Only
 * days worth marking carry a `short` form — the design leaves ordinary days
 * blank rather than filling every cell.
 */

interface PanchangEntry {
  full: string
  short?: string
}

/** Keyed by ISO date (YYYY-MM-DD). */
const PANCHANG: Record<string, PanchangEntry> = {
  '2026-09-26': { full: 'Ashwin Krishna Pratipada' },
  '2026-10-03': { full: 'Ashwin Shukla Saptami' },
  '2026-10-10': { full: 'Ekadashi', short: 'Ekadashi' },
  '2026-10-11': { full: 'Dwadashi', short: 'Dwadashi' },
  '2026-10-17': { full: 'Ashwin Krishna Panchami' },
  '2026-10-20': { full: 'Dashami', short: 'Dashami' },
  '2026-10-24': { full: 'Chaturdashi', short: 'Chaturdashi' },
  '2026-10-26': { full: 'Purnima', short: 'Purnima' },
  '2026-10-27': { full: 'Kartik Krishna Pratipada', short: 'Pratipada' },
  '2026-11-03': { full: 'Kartik Krishna Ashtami', short: 'Ashtami' },
}

export function lookupTithi(iso: string): string {
  return PANCHANG[iso]?.full ?? ''
}

/**
 * Short, cell-safe labels for the calendar grid, keyed by day-of-month.
 * Days without a short form are omitted so the grid stays quiet.
 */
export function tithiForMonth(year: number, month: number): Record<number, string> {
  const out: Record<number, string> = {}
  for (const [iso, entry] of Object.entries(PANCHANG)) {
    if (!entry.short) continue
    const [y, m, d] = iso.split('-').map(Number)
    if (y === year && m === month) out[d] = entry.short
  }
  return out
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** "Saturday, 26 September" — the greeting line on the home feed. */
export function formatLongDate(date: Date): string {
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`
}

export function isoDate(date: Date): string {
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

export function monthName(month: number): string {
  return MONTHS[month - 1]
}

/**
 * Greeting + date line for the feed header. Takes the date explicitly so
 * server and client render the same string (no `new Date()` in a component).
 */
export function headerDateLine(date: Date): string {
  const tithi = lookupTithi(isoDate(date))
  const base = formatLongDate(date)
  return tithi ? `${base} · ${tithi}` : base
}
