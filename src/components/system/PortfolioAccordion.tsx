import type { ReactNode } from 'react'

export function PortfolioAccordion({ summary, children, className = '', defaultOpen = false, disabled = false }: { summary: ReactNode; children: ReactNode; className?: string; defaultOpen?: boolean; disabled?: boolean }) {
  return <details className={className} open={defaultOpen || undefined} data-disabled={disabled || undefined}><summary aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : undefined} onClick={(event) => { if (disabled) event.preventDefault() }}>{summary}</summary>{children}</details>
}
