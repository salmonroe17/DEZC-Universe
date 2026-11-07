import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { gradientRecipes, type GradientRecipe } from './gradientTokens'
import './gradients.css'

/** Gradient surface with optional pointer response. Content stays in a separate readable layer. */
export function GradientField({ variant = 'azure', shape = 'field', interactive = false, motion = false, className = '', children }: {
  variant?: GradientRecipe; shape?: 'field' | 'ring'; interactive?: boolean; motion?: boolean; className?: string; children?: ReactNode
}) {
  const host = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  return <div ref={host} className={`gradient-field ${className}`} data-gradient={variant} data-shape={shape} data-motion={motion} style={{ '--gradient-paint': gradientRecipes[variant].paint } as CSSProperties}
    onPointerMove={interactive ? event => {
      if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const rect = event.currentTarget.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width - .5) * 2
      const y = ((event.clientY - rect.top) / rect.height - .5) * 2
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => { host.current?.style.setProperty('--gradient-x', `${x * 9}%`); host.current?.style.setProperty('--gradient-y', `${y * 9}%`) })
    } : undefined}
    onPointerLeave={() => { cancelAnimationFrame(frame.current); host.current?.style.setProperty('--gradient-x', '0%'); host.current?.style.setProperty('--gradient-y', '0%') }}>
    <div className="gradient-field-paint" aria-hidden><div className="gradient-field-color"/></div><div className="gradient-field-grain" aria-hidden/>
    {children && <div className="gradient-field-content">{children}</div>}
  </div>
}
