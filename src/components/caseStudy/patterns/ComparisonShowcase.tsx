import type { ReactNode } from 'react'
import { useId, useState } from 'react'
import { ChamferFrame } from '../../system/ChamferFrame'
import { FigmaGrid12 } from '../../system/FigmaGrid'
import type { BeforeAfterMode } from './BeforeAfterToggle'
import { BeforeAfterToggle } from './BeforeAfterToggle'
import {
  caseStudyScrollAnchorClass,
  caseStudySectionHeadingCenteredClass,
  caseStudySectionHeadingClass,
} from './caseStudyPatternStyles'

type ComparisonShowcaseProps = {
  /** Accessible title id; defaults to `useId()`. */
  titleId?: string
  title?: string
  titleAlign?: 'center' | 'left'
  before: ReactNode
  after: ReactNode
  bullets?: string[]
  /** Centered note under the main visual. */
  caption?: string
  /** Minimum height for the swap region (matches reference canvas). */
  visualMinClassName?: string
  /** Case study presentation mode slot (see {@link ChamferFrame} `presentationMediaIndex`). */
  presentationMediaIndex?: number
}

/**
 * Before/after comparison module for the case study canvas.
 * Used by the components reference page and by {@link ComparisonSection} in production.
 */
export function ComparisonShowcase({
  titleId: titleIdProp,
  title,
  titleAlign = 'center',
  before,
  after,
  bullets,
  caption,
  visualMinClassName = 'min-h-[min(52vw,280px)] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[567px]',
  presentationMediaIndex,
}: ComparisonShowcaseProps) {
  const autoTitleId = useId()
  const titleId = titleIdProp ?? autoTitleId
  const [mode, setMode] = useState<BeforeAfterMode>('before')

  const titleClass =
    titleAlign === 'center' ? caseStudySectionHeadingCenteredClass : caseStudySectionHeadingClass

  return (
    <FigmaGrid12 aria-labelledby={title ? titleId : undefined}>
      {title ? (
        <h2 id={titleId} className={`${titleClass} ${caseStudyScrollAnchorClass}`}>
          {title}
        </h2>
      ) : null}
      {bullets && bullets.length > 0 ? (
        <ul className="col-span-12 mx-auto max-w-2xl list-disc space-y-2 pl-5 text-left text-sm leading-relaxed text-fg-muted md:text-base">
          {bullets.map((b, i) => (
            <li key={`${i}-${b}`}>{b}</li>
          ))}
        </ul>
      ) : null}
      <div className="col-span-12 flex w-full min-w-0 justify-center px-0">
        <BeforeAfterToggle mode={mode} onModeChange={setMode} />
      </div>
      <ChamferFrame
        presentationMediaIndex={presentationMediaIndex}
        className="chamfer-media-border col-span-12"
        innerClassName={`flex ${visualMinClassName} min-h-0 w-full items-center justify-center bg-surface/40`}
      >
        <div className="w-full min-w-0">{mode === 'before' ? before : after}</div>
      </ChamferFrame>
      {caption ? (
        <p className="col-span-12 mx-auto max-w-2xl text-center text-xs text-fg-muted md:text-sm">
          {caption}
        </p>
      ) : null}
    </FigmaGrid12>
  )
}
