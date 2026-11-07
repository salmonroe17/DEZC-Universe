import type { ReactNode, CSSProperties } from 'react'
import { gradientRecipes, type GradientRecipe } from './gradientTokens'
import { OpticalField, type OpticalShape } from './OpticalField'
import './gradients.css'

/** Shared optical surface. CSS recipes are a fallback; the primary renderer is 3D geometry. */
export function GradientField({variant='azure',shape='blob',interactive=true,motion=false,stretch=0,className='',children}:{variant?:GradientRecipe;shape?:OpticalShape|'field'|'ring';interactive?:boolean;motion?:boolean;stretch?:number;className?:string;children?:ReactNode}) {
 return <div className={`gradient-field ${className}`} data-gradient={variant} data-shape={shape} style={{'--gradient-paint':gradientRecipes[variant].paint} as CSSProperties}>
  <OpticalField shape={shape==='ring'?'torus':shape==='field'?'blob':shape} family={variant==='azure'?0:variant==='iris'?1:2} motion={motion} stretch={stretch} interactive={interactive}/>
  {children&&<div className="gradient-field-content">{children}</div>}
 </div>
}
