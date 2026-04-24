import { ArrowDown } from '@phosphor-icons/react'

/**
 * Step connectors for case study team rows (horizontal) and tradeoff flows
 * (horizontal desktop / Phosphor arrow on small screens). Use with `flex` / `grid` on parent.
 */
export const caseStudyTeamConnectorHorizontal = (
  <span className="relative block h-full min-h-[5px] w-full min-w-0" aria-hidden>
    <span className="pointer-events-none absolute left-0 top-1/2 h-px w-[calc(100%-6px)] -translate-y-1/2 bg-fg/35" />
    <svg
      className="absolute right-0 top-1/2 h-[5px] w-[6px] -translate-y-1/2 text-fg/35"
      viewBox="0 0 6 5"
      fill="currentColor"
      aria-hidden
    >
      <path d="M0 0 L6 2.5 L0 5 Z" />
    </svg>
  </span>
)

export const caseStudyTradeConnectorHorizontal = (
  <span
    className="relative flex w-full min-w-[2rem] max-w-full items-center md:min-h-[1.25em]"
    aria-hidden
  >
    <span className="h-px min-w-0 flex-1 bg-fg" />
    <svg
      className="-ml-px h-[5px] w-[6px] shrink-0 text-fg"
      viewBox="0 0 6 5"
      fill="currentColor"
      aria-hidden
    >
      <path d="M0 0 L6 2.5 L0 5 Z" />
    </svg>
  </span>
)

/** Mobile tradeoff: single Phosphor arrow (avoids a stretched 1px rail + tiny head). */
export const caseStudyTradeConnectorVertical = (
  <span className="inline-flex w-full min-w-0 items-start py-0.5" aria-hidden>
    <ArrowDown className="shrink-0 text-fg" size={22} weight="bold" />
  </span>
)
