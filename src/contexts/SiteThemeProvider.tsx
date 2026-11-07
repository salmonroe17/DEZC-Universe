import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SiteThemeContext, type SiteTheme } from './siteThemeContext'
import { hasDesignSystemAccess } from '../design-system/editorAccess'
import { isThemeId, portfolioTheme, themeVariables } from '../design-system/theme'

const STORAGE_KEY = 'dezc-site-theme'

function readStoredTheme(): SiteTheme {
  if (hasDesignSystemAccess()) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (isThemeId(stored)) return stored
    } catch { /* Use the owner configuration when storage is unavailable. */ }
  }
  return portfolioTheme.activeTheme
}

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>(readStoredTheme)

  const setTheme = useCallback((t: SiteTheme) => {
    if (hasDesignSystemAccess()) setThemeState(t)
  }, [])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark'
    for (const [key, value] of Object.entries(themeVariables(theme))) {
      document.documentElement.style.setProperty(key, value)
    }
    try {
      if (hasDesignSystemAccess()) localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore quota / private mode */
    }
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return (
    <SiteThemeContext.Provider value={value}>{children}</SiteThemeContext.Provider>
  )
}
