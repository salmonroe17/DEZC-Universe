const KEY = 'dezc-design-system-editor-v1'

/** Convenience gate in local Vite only; production never includes the editor route. */
export function hasDesignSystemAccess() {
  if (!import.meta.env.DEV) return false
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}

export function unlockDesignSystem() {
  if (!import.meta.env.DEV) return false
  try { sessionStorage.setItem(KEY, '1'); return true } catch { return false }
}

export function lockDesignSystem() {
  try { sessionStorage.removeItem(KEY) } catch { /* Storage unavailable */ }
}
