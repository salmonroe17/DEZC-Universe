import { createContext } from 'react'

export type SiteTheme = import('../design-system/theme').ThemeId

export type SiteThemeContextValue = {
  theme: SiteTheme
  setTheme: (t: SiteTheme) => void
}

export const SiteThemeContext = createContext<SiteThemeContextValue | null>(null)
