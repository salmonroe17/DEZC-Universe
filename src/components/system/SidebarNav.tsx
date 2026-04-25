import type { NavSection } from '../caseStudy/useCaseStudyScrollspy'

/** Dotted trail after the active label (Figma TOC). */
const ACTIVE_DOTS = '\u00B7\u00B7\u00B7\u00B7\u00B7\u00B7'

type SidebarNavProps = {
  sections: NavSection[]
  activeId: string | null
  onNavigate: (id: string) => void
  className?: string
  /** e.g. "On this page" for non–case-study rails */
  ariaLabel?: string
  /**
   * When the nav sits inside an already-sticky aside (e.g. components reference page),
   * omit outer `sticky` / backdrop so positioning isn’t double-stacked.
   */
  embedded?: boolean
}

export function SidebarNav({
  sections,
  activeId,
  onNavigate,
  className = '',
  ariaLabel = 'Case study sections',
  embedded = false,
}: SidebarNavProps) {
  if (sections.length === 0) return null

  return (
    <nav
      aria-label={ariaLabel}
      className={
        embedded
          ? `min-w-0 max-w-full font-mono ${className}`
          : `sticky top-[5.5rem] z-10 min-w-0 max-w-full bg-bg py-1 font-mono md:top-24 ${className}`
      }
    >
      <ul className="flex min-w-0 flex-col gap-4 border-l border-cell-border pl-4 md:gap-[1.125rem]">
        {sections.map(({ id, label }) => {
          const isActive = activeId === id
          return (
            <li key={id} className="min-w-0">
              <button
                type="button"
                onClick={() => onNavigate(id)}
                className={`flex w-full min-w-0 flex-nowrap items-start gap-x-1.5 text-left text-[10px] leading-snug tracking-[0.02em] text-fg md:text-[11px] md:leading-snug ${
                  isActive
                    ? 'sidebar-nav-active-breathe'
                    : 'opacity-[0.55] transition-opacity hover:opacity-90'
                }`}
              >
                <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                  {label}
                </span>
                {isActive ? (
                  <span
                    className="shrink-0 select-none text-[10px] leading-normal tracking-[0.35em] text-fg md:text-[11px]"
                    aria-hidden
                  >
                    {ACTIVE_DOTS}
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
