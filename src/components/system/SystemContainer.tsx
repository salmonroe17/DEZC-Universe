import type { ReactNode } from 'react'

type SystemContainerProps = {
  children: ReactNode
  className?: string
}

/** Chamfered module frame (homepage `quadrant-cell` + `system-container` inset glow). */
export function SystemContainer({ children, className = '' }: SystemContainerProps) {
  return (
    <div
      className={`quadrant-cell system-container relative min-h-0 min-w-0 w-full ${className}`}
    >
      <div className="relative z-10 px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-16">
        {children}
      </div>
    </div>
  )
}
