import type { ReactNode, CSSProperties } from 'react'
import { gradientRecipes, type GradientRecipe } from './gradientTokens'
import { LiquidGlassLayer } from './LiquidGlassLayer'
import { OpticalField, type OpticalShape } from './OpticalField'
import './gradients.css'

/** Shared optical surface. CSS recipes are a fallback; the primary renderer is 3D geometry. */
export function GradientField({variant='azure',shape='blob',interactive=true,motion=false,stretch=0,glass=false,className='',children}:{variant?:GradientRecipe;shape?:OpticalShape|'field'|'ring';interactive?:boolean;motion?:boolean;stretch?:number;glass?:boolean;className?:string;children?:ReactNode}) {
 return <div className={`gradient-field ${className}`} data-gradient={variant} data-shape={shape} style={{'--gradient-paint':gradientRecipes[variant].paint} as CSSProperties}>
  {!glass&&<OpticalField shape={shape==='ring'?'torus':shape==='field'?'blob':shape} family={gradientRecipes[variant].family} motion={motion} stretch={stretch} interactive={interactive} light={glass} ambient={glass}/>}
  {glass&&<LiquidGlassLayer/>}
  {children&&<div className="gradient-field-content" data-liquid-ignore={glass||undefined}>{children}</div>}
 </div>
}
