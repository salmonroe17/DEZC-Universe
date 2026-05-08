/** localStorage key shared with previous text-field version (JSON array or legacy comma string). */
export const EXCLUDED_CITIES_STORAGE_KEY = 'dezc-leaderboard-excluded-cities-v1'

/** Kept for backwards compatibility / copy only; default filter is empty (show all). */
export const DEFAULT_EXCLUDED_CITY = 'Stouffville'

export function getDefaultExcludedCities(): string[] {
  return []
}

/** Split comma string, trim, dedupe case-insensitively (keeps first casing). */
export function parseExcludedCityNames(raw: string): string[] {
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean)
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of parts) {
    const k = p.toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    out.push(p)
  }
  return out
}

export function loadExcludedCitiesFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(EXCLUDED_CITIES_STORAGE_KEY)
    if (raw == null || raw === '') return getDefaultExcludedCities()
    const t = raw.trim()
    try {
      const j = JSON.parse(t) as unknown
      if (Array.isArray(j) && j.every((x): x is string => typeof x === 'string')) {
        return dedupeCitiesPreserveCase(j)
      }
    } catch {
      /* legacy plain string */
    }
    return parseExcludedCityNames(t)
  } catch {
    return getDefaultExcludedCities()
  }
}

function dedupeCitiesPreserveCase(labels: string[]): string[] {
  return parseExcludedCityNames(labels.join(','))
}

export function saveExcludedCitiesToStorage(cities: string[]) {
  localStorage.setItem(EXCLUDED_CITIES_STORAGE_KEY, JSON.stringify(cities))
}

export function toExcludedCityLowerSet(cities: string[]): Set<string> {
  return new Set(
    cities.map((c) => c.trim().toLowerCase()).filter(Boolean),
  )
}

export function cityRowIsExcluded(city: string | null, excludedLower: Set<string>): boolean {
  if (!city?.trim()) return false
  return excludedLower.has(city.trim().toLowerCase())
}
