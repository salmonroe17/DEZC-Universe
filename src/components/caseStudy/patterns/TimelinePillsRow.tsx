import { ArrowDown } from '@phosphor-icons/react'

const pillClassSingle =
  'inline-flex shrink-0 items-center justify-center rounded-full border-[0.5px] border-solid border-[#414141] bg-transparent px-4 py-2 text-[12px] font-normal leading-none tracking-[0.02em] text-fg md:px-5 md:py-2.5'

const pillClassMultiline =
  'inline-flex max-w-[5.5rem] shrink-0 items-center justify-center self-center rounded-full border-[0.5px] border-solid border-[#414141] bg-transparent px-4 py-3.5 text-center text-[12px] font-normal leading-snug tracking-[0.02em] text-fg whitespace-pre-line sm:max-w-[6rem] md:px-5 md:py-4'

const mobileStackPillMultiline =
  'inline-flex w-auto max-w-full shrink-0 items-center justify-center self-center rounded-full border-[0.5px] border-solid border-[#414141] bg-transparent px-4 py-3.5 text-center text-[12px] font-normal leading-snug tracking-[0.02em] text-fg whitespace-pre-line md:px-5 md:py-4'

type TimelinePillsRowProps = {
  stepLabels: readonly string[]
  /** Must match an `id` on the section title for `aria-labelledby`. */
  ariaLabelledBy?: string
  /**
   * `multiline` uses narrower, stacked text so horizontal connectors can use more room.
   * Use `\\n` in step label strings for line breaks (e.g. number, then two words on separate lines).
   */
  pillTextMode?: 'single' | 'multiline'
}

function TimelineConnector() {
  return (
    <div
      className="flex min-h-[12px] min-w-[2rem] flex-1 items-center pl-[24px] text-fg"
      aria-hidden
    >
      {/*
        min-w-2rem: the arrow keyframes use left: max(0, 100% - 22px). With min-w-0, flex could shrink
        the track below 22px and the sweep looked backwards. See index.css @keyframes.
      */}
      <div className="relative flex min-h-[18px] w-full min-w-0 flex-1 items-center">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-fg/40"
          viewBox="0 0 100 12"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0"
            y1="6"
            x2="100"
            y2="6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 8"
            strokeLinecap="round"
            vectorEffect="nonScalingStroke"
          />
        </svg>
        <div className="timeline-pills-connector-arrow pointer-events-none absolute top-1/2 left-0 w-[22px] -translate-y-1/2">
          <svg
            className="block h-[13px] w-[22px]"
            viewBox="0 0 24 14"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 5.25h10.5V3L22 7L10.5 11V8.75H0V5.25z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function MobileStepArrow() {
  return (
    <span className="flex w-full min-w-0 items-center justify-center" aria-hidden>
      <ArrowDown className="shrink-0 text-fg" size={22} weight="bold" />
    </span>
  )
}

/** Full-width stepper: vertical stack with Phosphor arrows (sm); horizontal pills + animated connectors (md+). */
export function TimelinePillsRow({ stepLabels, ariaLabelledBy, pillTextMode = 'single' }: TimelinePillsRowProps) {
  const pillClassName = pillTextMode === 'multiline' ? pillClassMultiline : pillClassSingle
  const mobilePillClassName =
    pillTextMode === 'multiline' ? mobileStackPillMultiline : `${pillClassSingle} self-center`

  return (
    <div className="col-span-12 w-full min-w-0">
      <ol
        aria-labelledby={ariaLabelledBy}
        className="flex w-full min-w-0 list-none flex-col items-center gap-4 py-0 md:hidden"
      >
        {stepLabels.map((label, i) => (
          <li
            key={`${label}-stack-${i}`}
            className="flex w-full min-w-0 max-w-full flex-col items-center gap-4"
          >
            {i > 0 ? <MobileStepArrow /> : null}
            <span className={mobilePillClassName}>{label}</span>
          </li>
        ))}
      </ol>

      <ol
        aria-labelledby={ariaLabelledBy}
        className="hidden w-full min-w-0 list-none flex-row items-center py-1 md:flex"
      >
        {stepLabels.map((label, i) => (
          <li
            key={`${label}-row-${i}`}
            className={`flex min-w-0 max-w-full items-center ${i === 0 ? 'shrink-0' : 'flex-1 gap-[24px]'}`}
          >
            {i > 0 ? <TimelineConnector /> : null}
            <span className={pillClassName}>{label}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
