import { useId, type ReactNode } from 'react'
import { GradientField } from './GradientField'
import type { GradientRecipe } from './gradientTokens'

/** Side reflections bend the decorative surface; the central controls stay undistorted. */
export function RefractedCard({ variant = 'azure', reflections = true, motion = false, children }: { variant?: GradientRecipe; reflections?: boolean; motion?: boolean; children: ReactNode }) {
  const id = `refraction-${useId().replace(/:/g, '')}`
  return <div className="refracted-stage" data-reflections={reflections}>
    <svg width="0" height="0" aria-hidden className="gradient-filter-defs"><defs><filter id={id} x="-30%" y="-15%" width="160%" height="130%" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.009" numOctaves="1" seed="3" result="wave"/><feDisplacementMap in="SourceGraphic" in2="wave" scale="55" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>
    {reflections && <>{(['left', 'right'] as const).map(side => <div key={side} className={`refracted-wing refracted-wing-${side}`} aria-hidden style={{filter:`url(#${id})`}}><GradientField variant={side==='left'?'iris':'solar'} motion={motion}><span className="refracted-wing-label">LUMA / SPECTRUM</span><span className="refracted-wing-number">{side==='left'?'72':'95'}</span></GradientField></div>)}</>}
    <GradientField variant={variant} interactive motion={motion} className="refracted-card">{children}</GradientField>
  </div>
}
