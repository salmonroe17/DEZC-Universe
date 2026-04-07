import { useId } from 'react'
import type { StepperSectionProps } from '../../types/caseStudy'
import { TimelinePillsRow } from '../caseStudy/patterns/TimelinePillsRow'
import {
  caseStudyNarrowProseClass,
  caseStudyScrollAnchorClass,
  caseStudySectionHeadingTimelineClass,
} from '../caseStudy/patterns/caseStudyPatternStyles'
import { FigmaGrid12 } from '../system/FigmaGrid'

export function StepperSection({
  title,
  steps,
  variant = 'vertical',
  narrative,
  headingId: headingIdProp,
}: StepperSectionProps) {
  const autoTitleId = useId()
  const titleId = headingIdProp ?? autoTitleId

  if (variant === 'timeline') {
    return (
      <FigmaGrid12 aria-labelledby={titleId}>
        <h2
          id={titleId}
          className={`${caseStudySectionHeadingTimelineClass} ${caseStudyScrollAnchorClass}`}
        >
          {title}
        </h2>
        <TimelinePillsRow
          stepLabels={steps.map((s) => s.title)}
          ariaLabelledBy={titleId}
        />
        {narrative ? <p className={caseStudyNarrowProseClass}>{narrative}</p> : null}
      </FigmaGrid12>
    )
  }

  return (
    <div>
      <h2
        id={headingIdProp}
        className="text-2xl font-bold tracking-tight text-zinc-50 md:text-3xl"
      >
        {title}
      </h2>
      <ol className="mt-8 flex flex-col gap-8 md:mt-10 lg:flex-row lg:gap-0 lg:divide-x lg:divide-zinc-800">
        {steps.map((step, i) => (
          <li key={`${i}-${step.title}`} className="relative flex-1 lg:px-6 lg:first:pl-0 lg:last:pr-0">
            <div className="flex gap-3 lg:block lg:gap-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs font-semibold tabular-nums text-zinc-300">
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5 lg:mt-4 lg:pt-0">
                <p className="text-sm font-semibold text-zinc-200 md:text-base">{step.title}</p>
                {step.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500 lg:mt-1.5">
                    {step.description}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
