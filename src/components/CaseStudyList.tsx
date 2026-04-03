import {
  memo,
  useCallback,
  useRef,
  type AnimationEvent,
} from 'react'

export const CASE_AUTO_ROTATE_MS = 4000

const CASE_STUDIES = [
  { title: 'Carbon Neutral Club checkout', id: 0 },
  { title: 'Super app forecasting', id: 1 },
  { title: 'Sherpa unified search', id: 2 },
  { title: 'Design system philosophy', id: 3 },
] as const

type ProgressFillProps = {
  durationMs: number
  paused: boolean
  onComplete: () => void
}

/** CSS-driven progress; play-state pauses without React frame updates. */
const CaseStudyProgressFill = memo(function CaseStudyProgressFill({
  durationMs,
  paused,
  onComplete,
}: ProgressFillProps) {
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  const handleAnimationEnd = useCallback(
    (e: AnimationEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return
      if (pausedRef.current) return
      onComplete()
    },
    [onComplete],
  )

  return (
    <div
      className="absolute inset-0 origin-left bg-[color-mix(in_srgb,var(--color-hud)_58%,transparent)] will-change-transform"
      style={{
        animation: `case-study-progress ${durationMs}ms linear forwards`,
        animationPlayState: paused ? 'paused' : 'running',
      }}
      onAnimationEnd={handleAnimationEnd}
    />
  )
})

export type CaseStudyListProps = {
  activeCaseIndex: number
  onActiveCaseChange: (index: number) => void
  autoRotatePaused: boolean
  onAutoAdvance: () => void
  onCaseListPointerInsideChange: (inside: boolean) => void
}

export function CaseStudyList({
  activeCaseIndex,
  onActiveCaseChange,
  autoRotatePaused,
  onAutoAdvance,
  onCaseListPointerInsideChange,
}: CaseStudyListProps) {
  return (
    <div
      className="flex w-full shrink-0 flex-col border-t border-cell-border/60 pb-4 pt-3"
      onMouseEnter={() => onCaseListPointerInsideChange(true)}
      onMouseLeave={() => onCaseListPointerInsideChange(false)}
    >
      <ul className="flex flex-col gap-0 px-[16px]" role="list">
        {CASE_STUDIES.map((item) => {
          const isActive = item.id === activeCaseIndex
          return (
            <li
              key={item.id}
              className="relative flex min-h-0 cursor-default flex-col"
              onMouseEnter={() => onActiveCaseChange(item.id)}
            >
              <div
                className={`flex items-baseline justify-between gap-4 py-2.5 text-[11px] leading-snug tracking-[0.06em] transition-[color,background-color,box-shadow,padding] duration-200 ease-out md:text-xs md:tracking-[0.05em] ${
                  isActive
                    ? 'rounded-sm bg-fg/[0.07] px-[16px] text-fg shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_14%,transparent),0_0_16px_color-mix(in_srgb,var(--color-hud)_10%,transparent)]'
                    : 'px-0 text-fg/90'
                }`}
              >
                <span
                  className={`min-w-0 flex-1 text-left font-medium transition-colors duration-200 ${
                    isActive ? 'text-fg' : 'text-fg/85'
                  }`}
                >
                  {item.title}
                </span>
                <span
                  className={`shrink-0 underline underline-offset-[3px] transition-colors duration-200 ${
                    isActive
                      ? 'text-fg decoration-fg/50'
                      : 'text-fg-muted decoration-fg-muted/35'
                  }`}
                >
                  View
                </span>
              </div>
              <div
                className="pointer-events-none relative mb-0.5 h-[2px] w-full shrink-0 overflow-hidden rounded-full bg-fg/[0.1]"
                aria-hidden
              >
                {isActive ? (
                  <CaseStudyProgressFill
                    durationMs={CASE_AUTO_ROTATE_MS}
                    paused={autoRotatePaused}
                    onComplete={onAutoAdvance}
                  />
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
