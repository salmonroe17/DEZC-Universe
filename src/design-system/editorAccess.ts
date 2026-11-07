const KEY = 'dezc-design-system-editor-v1'

/** Hidden session-scoped discovery gate; theme previews affect this browser only. */
export function hasDesignSystemAccess() {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}

export function unlockDesignSystem() {
  try { sessionStorage.setItem(KEY, '1'); return true } catch { return false }
}

export function lockDesignSystem() {
  try { sessionStorage.removeItem(KEY) } catch { /* Storage unavailable */ }
}
