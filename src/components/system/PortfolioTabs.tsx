import type { ReactNode } from 'react'

export function PortfolioTab({
  id,
  controls,
  selected,
  children,
  onSelect,
}: {
  id: string
  controls: string
  selected: boolean
  children: ReactNode
  onSelect: () => void
}) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={controls}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      className={
        selected
          ? 'flex-1 min-w-[10rem] rounded border border-cell-border bg-bg px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-fg shadow-[0_1px_0_rgba(0,0,0,0.04)] md:min-w-0 md:flex-none md:px-4'
          : 'flex-1 min-w-[10rem] rounded border border-transparent bg-transparent px-3 py-2.5 text-left text-[11px] font-normal uppercase tracking-[0.08em] text-fg-muted transition-colors hover:border-cell-border/50 hover:bg-elevated/40 hover:text-fg md:min-w-0 md:flex-none md:px-4'
      }
    >
      <span className="portfolio-control-content">{children}</span>
    </button>
  )
}
