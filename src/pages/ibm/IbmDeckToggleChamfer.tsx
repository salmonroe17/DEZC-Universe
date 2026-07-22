import { useState } from 'react'
import {
  caseStudyChamferToggleKnobClassName,
  caseStudyChamferToggleLabelClassName,
  caseStudyChamferToggleTrackClassName,
} from '../../components/caseStudy/patterns'
import { IbmToggleAspectSpacer } from '../../components/caseStudy/IbmChamferMediaPlaceholder'
import { ChamferFrame } from '../../components/system/ChamferFrame'

const deckMaxW = 'mx-auto w-full max-w-[min(100%,1156px)]'

const chamferToggleStackLayerClass =
  'pointer-events-none absolute inset-0 h-full w-full max-w-full object-contain object-left object-top align-middle'

export function IbmDeckToggleChamfer({
  baseSrc,
  toggledSrc,
  baseAlt,
  toggledAlt,
  toggleLabelOff,
  toggleLabelOn,
}: {
  baseSrc: string
  toggledSrc: string
  baseAlt: string
  toggledAlt: string
  toggleLabelOff: string
  toggleLabelOn: string
}) {
  const [toggled, setToggled] = useState(false)
  return (
    <ChamferFrame
      className={`chamfer-media-border ${deckMaxW}`}
      innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
    >
      <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
        <button
          type="button"
          role="switch"
          aria-checked={toggled}
          onClick={() => setToggled((v) => !v)}
          className={caseStudyChamferToggleTrackClassName(toggled)}
        >
          <span
            className={caseStudyChamferToggleKnobClassName(toggled)}
            aria-hidden
          />
        </button>
        <span className={caseStudyChamferToggleLabelClassName}>
          {toggled ? toggleLabelOn : toggleLabelOff}
        </span>
      </div>
      <div className="relative isolate w-full">
        <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
        <img
          src={baseSrc}
          alt={baseAlt}
          decoding="async"
          loading="eager"
          className={`${chamferToggleStackLayerClass} z-0 ${toggled ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src={toggledSrc}
          alt={toggledAlt}
          decoding="async"
          loading="eager"
          className={`${chamferToggleStackLayerClass} z-10 ${toggled ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </ChamferFrame>
  )
}
