type TimelinePillsRowProps = {
  stepLabels: readonly string[]
  /** Must match an `id` on the section title for `aria-labelledby`. */
  ariaLabelledBy?: string
}

function TimelineConnector() {
  return (
    <div
      className="flex min-h-[12px] min-w-0 flex-1 items-center pl-[24px] text-fg"
      aria-hidden
    >
      <div className="relative flex min-h-[18px] min-w-0 flex-1 items-center">
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

const pillClassName =
  'inline-flex shrink-0 items-center rounded-full border-[0.5px] border-solid border-[#414141] bg-transparent px-4 py-2 text-[11px] font-normal leading-none tracking-[0.02em] text-fg md:px-5 md:py-2.5 md:text-xs'

/** Full-width horizontal stepper: pills + growing dotted connectors (case study canvas). */
export function TimelinePillsRow({ stepLabels, ariaLabelledBy }: TimelinePillsRowProps) {
  return (
    <div className="col-span-12 w-full min-w-0">
      <ol
        aria-labelledby={ariaLabelledBy}
        className="flex w-full min-w-0 list-none flex-row items-center py-1"
      >
        {stepLabels.map((label, i) => (
          <li
            key={`${label}-${i}`}
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
