import type { LumaPreviewOptions } from '../design-system/lumaPreview'
import { createContext } from 'react'

export type SiteTheme = import('../design-system/theme').ThemeId

export type SiteThemeContextValue = {
  previewOptions:LumaPreviewOptions
  setPreviewOptions:(options:LumaPreviewOptions)=>void
  theme: SiteTheme
  setTheme: (t: SiteTheme) => void
}

export const SiteThemeContext = createContext<SiteThemeContextValue | null>(null)
