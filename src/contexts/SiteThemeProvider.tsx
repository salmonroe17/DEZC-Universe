import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SiteThemeContext, type SiteTheme } from './siteThemeContext'
import { hasDesignSystemAccess } from '../design-system/editorAccess'
import { LumaAmbientCards } from '../components/gradients/LumaAmbientCards'
import { isThemeId, portfolioTheme, themeVariables } from '../design-system/theme'

import { defaultLumaPreview, lumaPreviewVariables, parseLumaPreview, type LumaPreviewOptions } from '../design-system/lumaPreview'
const PREVIEW_KEY='dezc-luma-preview-options'

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
  const [previewOptions,setPreviewOptionsState]=useState<LumaPreviewOptions>(()=>{try{return hasDesignSystemAccess()?parseLumaPreview(localStorage.getItem(PREVIEW_KEY)):defaultLumaPreview}catch{return defaultLumaPreview}})
  const setPreviewOptions=useCallback((options:LumaPreviewOptions)=>{if(!hasDesignSystemAccess())return;setPreviewOptionsState(options);try{localStorage.setItem(PREVIEW_KEY,JSON.stringify(options))}catch{/* Preview still works without persistence. */}},[])
  useEffect(()=>{const sync=(event:StorageEvent)=>{if(event.key===PREVIEW_KEY&&hasDesignSystemAccess())setPreviewOptionsState(parseLumaPreview(event.newValue))};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync)},[])
  const [theme, setThemeState] = useState<SiteTheme>(readStoredTheme)

  const setTheme = useCallback((t: SiteTheme) => {
    if (hasDesignSystemAccess()) setThemeState(t)
  }, [])

  useLayoutEffect(() => {
    if(theme!=='luma-c')for(const key of Object.keys(lumaPreviewVariables(defaultLumaPreview)))if(!['--font-sans','--font-mono','--color-hud','--color-cell-hover'].includes(key))document.documentElement.style.removeProperty(key)
    document.documentElement.dataset.lumaMode=previewOptions.mode
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = (theme === 'light' || theme.startsWith('luma')&&!(theme==='luma-c'&&previewOptions.mode==='dark')) ? 'light' : 'dark'
    for (const [key, value] of Object.entries({...themeVariables(theme),...(theme==='luma-c'?lumaPreviewVariables(previewOptions):{})})) {
      document.documentElement.style.setProperty(key, value)
    }
    try {
      if (hasDesignSystemAccess()) {localStorage.setItem(STORAGE_KEY, theme)}
    } catch {
      /* ignore quota / private mode */
    }
  }, [theme,previewOptions])

  const value = useMemo(() => ({ theme, setTheme,previewOptions,setPreviewOptions }), [theme, setTheme,previewOptions,setPreviewOptions])

  return (
    <SiteThemeContext.Provider value={value}>{children}{theme.startsWith('luma') && <LumaAmbientCards/>}</SiteThemeContext.Provider>
  )
}
