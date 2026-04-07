import type { ReactNode } from 'react'

/** Outer shell: max 1440px, 24px horizontal margin (matches Figma frame). */
export function FigmaFrame({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`figma-frame ${className}`}>{children}</div>
}

/** 12 columns with 24px gutters (Figma layout grid). Use `col-span-*` on children. */
export function FigmaGrid12({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`figma-grid-12 ${className}`}>{children}</div>
}

/**
 * Sidebar + main split that matches the five-band background guides (1 track + 4 tracks).
 * At `lg`: first child = left rail (~20%), second child = main (~80%). Below `lg`: stacks.
 */
export function FigmaRailGrid({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`figma-rail-grid ${className}`}>{children}</div>
}
