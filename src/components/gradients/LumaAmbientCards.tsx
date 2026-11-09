import { useSiteTheme } from '../../contexts/useSiteTheme'
import { lumaPaletteOptions } from '../../design-system/lumaPreview'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { LumaShapeDefs } from './LumaShapeDefs'
import { LumaGlassSurfaces } from './LumaGlassSurfaces'
import { OpticalField } from './OpticalField'

/** One continuous scene behind the page. Glass surfaces sample this same backdrop. */
export function LumaAmbientCards() {
 const {theme,previewOptions}=useSiteTheme()
 const palette=lumaPaletteOptions[previewOptions.palette]
 const colors=useMemo(()=>[palette.start,palette.mid,palette.end] as const,[palette])
 return <><LumaShapeDefs/><LumaGlassSurfaces/>{createPortal(<div className="luma-page-atmosphere" aria-hidden><OpticalField shape={theme==='luma-c'?'collision':'blob'} family={theme==='luma-c'?lumaPaletteOptions[previewOptions.palette].family:3} colors={theme==='luma-c'?colors:undefined} ambient light nocturnal={theme==='luma-c'&&previewOptions.mode==='dark'} motion interactive={false} diffusion={24} motionSpeed={theme==='luma-c'?.7:.18}/></div>,document.body)}</>
}
