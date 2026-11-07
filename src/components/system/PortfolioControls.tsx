import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react'

/** Native controls shared by the leaderboard gate and visual documentation. */
export function PortfolioButton({ className = '', variant = 'outline', size = 'default', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'solid'; size?: 'compact' | 'default' | 'large' }) {
  const dimensions = size === 'compact' ? 'px-3 py-1 text-[10px]' : size === 'large' ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'
  const colors = variant === 'solid' ? 'border-fg bg-fg text-bg hover:bg-fg/90 hover:text-bg data-[preview-state=hover]:bg-fg/90 data-[preview-state=hover]:text-bg' : 'border-cell-border/80 bg-bg text-fg hover:border-hud/60 hover:text-fg/90 data-[preview-state=hover]:border-hud/60 data-[preview-state=hover]:text-fg/90'
  return <button type="button" {...props} data-ui="button" data-variant={variant} className={`rounded border ${dimensions} font-mono font-medium transition-colors ${colors} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud data-[preview-state=focus-visible]:outline data-[preview-state=focus-visible]:outline-2 data-[preview-state=focus-visible]:outline-offset-2 data-[preview-state=focus-visible]:outline-hud disabled:cursor-not-allowed disabled:opacity-40 ${className}`} />
}
export { PresentationIconButton as PortfolioIconButton } from './PresentationIconButton'
export function PortfolioTextField({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} data-ui="field" className={`w-full rounded border border-cell-border/80 bg-bg px-3 py-2 font-mono text-sm text-fg outline-none ring-hud/40 transition-shadow placeholder:text-fg-subtle focus:ring-2 data-[preview-state=focus-visible]:ring-2 disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-hud ${className}`} />
}
export function PortfolioSelect({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`rounded border border-cell-border/80 bg-bg px-3 py-2 font-mono text-sm text-fg outline-none focus:ring-2 focus:ring-hud/40 disabled:opacity-40 ${className}`} />
}
export function PortfolioChoice({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} data-ui="field" className={`size-4 accent-[var(--color-fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud data-[preview-state=focus-visible]:outline data-[preview-state=focus-visible]:outline-2 data-[preview-state=focus-visible]:outline-offset-2 data-[preview-state=focus-visible]:outline-hud disabled:opacity-40 ${className}`} />
}
