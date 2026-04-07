import { createContext } from 'react'

export type SiteTheme = 'grey' | 'cyan' | 'magenta' | 'blue'

export type SiteThemeContextValue = {
  theme: SiteTheme
  setTheme: (t: SiteTheme) => void
}

export const SiteThemeContext = createContext<SiteThemeContextValue | null>(null)
