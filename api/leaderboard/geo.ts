import type { VercelRequest } from '@vercel/node'

/**
 * Approximate city from Vercel edge (IP-derived, not GPS). Empty locally / off-platform.
 * @see https://vercel.com/docs/headers/request-headers
 */
export function inferCityFromVercelRequest(req: VercelRequest): string | undefined {
  const raw = req.headers['x-vercel-ip-city']
  if (raw == null) return undefined
  const s = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? ''
  if (!s) return undefined
  try {
    const decoded = decodeURIComponent(s).trim()
    return decoded ? decoded.slice(0, 80) : undefined
  } catch {
    return s.slice(0, 80)
  }
}
