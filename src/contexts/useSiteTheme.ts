import { useContext } from 'react'
import { SiteThemeContext, type SiteThemeContextValue } from './siteThemeContext'

export function useSiteTheme(): SiteThemeContextValue {
  const ctx = useContext(SiteThemeContext)
  if (!ctx) {
    throw new Error('useSiteTheme must be used within SiteThemeProvider')
  }
  return ctx
}
