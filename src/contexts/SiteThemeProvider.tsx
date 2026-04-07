import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SiteThemeContext, type SiteTheme } from './siteThemeContext'

const STORAGE_KEY = 'dezc-site-theme'

function readStoredTheme(): SiteTheme {
  if (typeof window === 'undefined') return 'grey'
  const s = localStorage.getItem(STORAGE_KEY)
  if (s === 'cyan' || s === 'magenta' || s === 'blue' || s === 'grey') return s
  return 'grey'
}

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>(readStoredTheme)

  const setTheme = useCallback((t: SiteTheme) => {
    setThemeState(t)
  }, [])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore quota / private mode */
    }
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return (
    <SiteThemeContext.Provider value={value}>{children}</SiteThemeContext.Provider>
  )
}
