import {
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  type AnimationEvent,
} from 'react'
import { Link } from 'react-router-dom'
import {
  DS_CASE_STUDY,
  IBM_ENVIZI_CASE_STUDY,
  PRIMARY_CASE_STUDY,
  SUPER_CASE_STUDY,
} from '../constants/caseStudyCatalog'

export const CASE_AUTO_ROTATE_MS = 4000

type CaseStudyItem = {
  title: string
  id: number
  to?: string
}

const CASE_STUDIES: CaseStudyItem[] = [
  {
    title: PRIMARY_CASE_STUDY.title,
    id: 0,
    to: PRIMARY_CASE_STUDY.path,
  },
  { title: SUPER_CASE_STUDY.title, id: 1, to: SUPER_CASE_STUDY.path },
  { title: IBM_ENVIZI_CASE_STUDY.title, id: 2, to: IBM_ENVIZI_CASE_STUDY.path },
  { title: DS_CASE_STUDY.title, id: 3, to: DS_CASE_STUDY.path },
]

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
  useLayoutEffect(() => {
    pausedRef.current = paused
  }, [paused])

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
  const noTopListBorder = activeCaseIndex === 0
  const listShellClass = [
    'chamfer-case-study-list-clip flex w-full shrink-0 flex-col',
    noTopListBorder ? 'border-t-0' : 'border-t border-cell-border/60',
  ].join(' ')

  return (
    <div
      className={listShellClass}
      onMouseEnter={() => onCaseListPointerInsideChange(true)}
      onMouseLeave={() => onCaseListPointerInsideChange(false)}
    >
      <ul className="flex flex-col gap-0" role="list">
        {CASE_STUDIES.map((item, i) => {
          const isActive = item.id === activeCaseIndex
          const isLast = i === CASE_STUDIES.length - 1
          const isImmediatelyAboveActive =
            item.id === activeCaseIndex - 1 && activeCaseIndex > 0
          const collapseBottomTrackForLast =
            isLast && !isActive
          const row = (
            <div
              className={`flex items-start justify-between gap-3 px-4 py-2.5 text-[11px] leading-snug tracking-[0.06em] transition-[color,background-color,box-shadow] duration-200 ease-out md:gap-4 md:text-xs md:tracking-[0.05em] ${
                isActive
                  ? 'bg-fg/[0.07] text-fg shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_14%,transparent),0_0_16px_color-mix(in_srgb,var(--color-hud)_10%,transparent)]'
                  : 'text-fg/90'
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
          )
          return (
            <li
              key={item.id}
              className={`relative flex min-h-0 flex-col ${item.to ? '' : 'cursor-default'}`}
            >
              {item.to ? (
                <Link
                  to={item.to}
                  className="flex min-h-0 cursor-pointer flex-col no-underline outline-none focus-visible:ring-2 focus-visible:ring-fg/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  onMouseEnter={() => onActiveCaseChange(item.id)}
                >
                  {row}
                </Link>
              ) : (
                <div onMouseEnter={() => onActiveCaseChange(item.id)}>{row}</div>
              )}
              <div
                className={[
                  'pointer-events-none relative w-full shrink-0 overflow-hidden rounded-full bg-fg/[0.1]',
                  isImmediatelyAboveActive || collapseBottomTrackForLast
                    ? 'h-0 min-h-0'
                    : 'h-[2px]',
                ].join(' ')}
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
