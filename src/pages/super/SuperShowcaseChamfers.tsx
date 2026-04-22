/**
 * Shared chamfer toggles for the Super case study page and presentation deck.
 */
import { useId, useState } from 'react'
import superSuperCashHomeSection from '../../../Super assets/s10.png'
import superSuperCashDedicated from '../../../Super assets/s10.1.png'
import superTrueHomeOld from '../../../Super assets/s9.png'
import superTrueHomeNew from '../../../Super assets/s9.1.png'
import { caseStudyChamferToggleLabelClassName } from '../../components/caseStudy/patterns/caseStudyPatternStyles'
import { ChamferFrame } from '../../components/system/ChamferFrame'

export const superChamferToggleStackSpacerClass =
  'block h-auto w-full max-w-full select-none pointer-events-none opacity-0'

export const superChamferToggleStackLayerClass =
  'pointer-events-none absolute inset-0 h-full w-full max-w-full object-contain object-left object-top align-middle'

export const SUPER_PROBLEM_TOGGLE_LABEL_OFF = 'Show user struggles'

export const SUPER_TOGGLE_LABEL_ON = 'Hide annotations'

export const SUPER_TRUE_HOME_TOGGLE_OFF = 'Show what works'

export const SUPER_SUPERCASH_TOGGLE_OFF = 'Show what works'
export const SUPER_NOTIFICATIONS_TOGGLE_OFF = 'Show what works'
export const SUPER_REWARDS_PROFILE_TOGGLE_OFF = 'Show what works'
export const SUPER_REWARDS_SYSTEM_TOGGLE_OFF = 'Show what works'
export const SUPER_IMPACT_TOGGLE_OFF = 'Show what works'

export function SuperToggleImageChamfer({
  presentationMediaIndex,
  toggleLabelOff,
  toggleLabelOn,
  baseSrc,
  toggledSrc,
  baseAlt,
  toggledAlt,
}: {
  presentationMediaIndex?: number
  toggleLabelOff: string
  toggleLabelOn: string
  baseSrc: string
  toggledSrc: string
  baseAlt: string
  toggledAlt: string
}) {
  const toggleId = useId()
  const [showWhatWorks, setShowWhatWorks] = useState(false)

  return (
    <ChamferFrame
      presentationMediaIndex={presentationMediaIndex}
      className="chamfer-media-border w-full"
      innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
    >
      <div className="flex w-full shrink-0 flex-col items-stretch border-b border-fg/[0.12] bg-surface">
        <div className="flex w-full shrink-0 items-center justify-center gap-3 py-3 md:gap-4 md:py-3.5">
          <button
            type="button"
            role="switch"
            aria-checked={showWhatWorks}
            aria-labelledby={toggleId}
            onClick={() => setShowWhatWorks((v) => !v)}
            className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
              showWhatWorks
                ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
            }`}
          >
            <span
              className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                showWhatWorks
                  ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                  : 'left-1 bg-white'
              }`}
              aria-hidden
            />
          </button>
          <span id={toggleId} className={caseStudyChamferToggleLabelClassName}>
            {showWhatWorks ? toggleLabelOn : toggleLabelOff}
          </span>
        </div>
      </div>
      <div className="relative isolate w-full bg-gradient-to-b from-[#d8d8d8]/95 via-[#dedede]/90 to-[#e6e6e6]">
        <img
          src={baseSrc}
          alt=""
          aria-hidden
          decoding="async"
          className={superChamferToggleStackSpacerClass}
        />
        <img
          src={baseSrc}
          alt={baseAlt}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className={`${superChamferToggleStackLayerClass} z-0 ${
            showWhatWorks ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <img
          src={toggledSrc}
          alt={toggledAlt}
          decoding="async"
          loading="eager"
          className={`${superChamferToggleStackLayerClass} z-10 ${
            showWhatWorks ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </ChamferFrame>
  )
}

export function SuperSuperCashRelocatedComparison({ presentationMediaIndex }: { presentationMediaIndex?: number }) {
  return (
    <SuperToggleImageChamfer
      presentationMediaIndex={presentationMediaIndex}
      toggleLabelOff={SUPER_SUPERCASH_TOGGLE_OFF}
      toggleLabelOn={SUPER_TOGGLE_LABEL_ON}
      baseSrc={superSuperCashHomeSection}
      toggledSrc={superSuperCashDedicated}
      baseAlt="Super app — home with SuperCash section embedded on the overview"
      toggledAlt="Super app — SuperCash as its own destination in the tab bar"
    />
  )
}

export function SuperTrueHomeComparison({ presentationMediaIndex }: { presentationMediaIndex?: number }) {
  return (
    <SuperToggleImageChamfer
      presentationMediaIndex={presentationMediaIndex}
      toggleLabelOff={SUPER_TRUE_HOME_TOGGLE_OFF}
      toggleLabelOn={SUPER_TOGGLE_LABEL_ON}
      baseSrc={superTrueHomeOld}
      toggledSrc={superTrueHomeNew}
      baseAlt="Super app — legacy home screen centered on SuperCash"
      toggledAlt="Super app — redesigned home as cross-product overview"
    />
  )
}

export function SuperProblemOldScreensChamfer({
  presentationMediaIndex,
  baseSrc,
  strugglesSrc,
  altBase,
  altStruggles,
}: {
  presentationMediaIndex?: number
  baseSrc: string
  strugglesSrc: string
  altBase: string
  altStruggles: string
}) {
  const toggleId = useId()
  const [showStruggles, setShowStruggles] = useState(false)

  return (
    <ChamferFrame
      presentationMediaIndex={presentationMediaIndex}
      className="chamfer-media-border w-full"
      innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
    >
      <div className="flex w-full shrink-0 flex-col items-stretch border-b border-fg/[0.12] bg-surface">
        <div className="flex w-full shrink-0 items-center justify-center gap-3 py-3 md:gap-4 md:py-3.5">
          <button
            type="button"
            role="switch"
            aria-checked={showStruggles}
            aria-labelledby={toggleId}
            onClick={() => setShowStruggles((v) => !v)}
            className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
              showStruggles
                ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
            }`}
          >
            <span
              className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                showStruggles
                  ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                  : 'left-1 bg-white'
              }`}
              aria-hidden
            />
          </button>
          <span id={toggleId} className={caseStudyChamferToggleLabelClassName}>
            {showStruggles ? SUPER_TOGGLE_LABEL_ON : SUPER_PROBLEM_TOGGLE_LABEL_OFF}
          </span>
        </div>
      </div>
      <div className="relative isolate w-full bg-gradient-to-b from-[#eaeaea]/35 via-surface/25 to-bg">
        <img
          src={baseSrc}
          alt=""
          aria-hidden
          decoding="async"
          className={superChamferToggleStackSpacerClass}
        />
        <img
          src={baseSrc}
          alt={altBase}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className={`${superChamferToggleStackLayerClass} z-0 ${
            showStruggles ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <img
          src={strugglesSrc}
          alt={altStruggles}
          decoding="async"
          loading="eager"
          className={`${superChamferToggleStackLayerClass} z-10 ${
            showStruggles ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </ChamferFrame>
  )
}
