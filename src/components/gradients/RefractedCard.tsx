import type { ReactNode } from 'react'
import { GradientField } from './GradientField'
import type { GradientRecipe } from './gradientTokens'
import type { OpticalShape } from './OpticalField'

/** Nonlinear cylindrical UV stretching and RGB-rich reflected geometry, not a turbulence filter. */
export function RefractedCard({variant='azure',shape='torus',reflections=true,motion=false,children}:{variant?:GradientRecipe;shape?:OpticalShape;reflections?:boolean;motion?:boolean;children:ReactNode}) {
 return <div className="refracted-stage" data-reflections={reflections}>
  {reflections&&(['left','right'] as const).map(side=><div key={side} className={`refracted-wing refracted-wing-${side}`} aria-hidden><GradientField variant={side==='left'?'iris':variant} shape={shape} motion={motion} stretch={side==='left'?-1.8:1.8}/></div>)}
  <GradientField variant={variant} shape={shape} motion={motion} glass className="refracted-card">{children}</GradientField>
 </div>
}
