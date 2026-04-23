import type { ReactNode } from 'react'
import {
  DsCaseStudyChamferCollage,
  DsCaseStudyChamferDs2,
  DsCaseStudyChamferDs3,
  DsCaseStudyChamferDs4,
  DsCaseStudyChamferDs5,
  DsCaseStudyChamferDs6,
  DsCaseStudyChamferDs7,
  DsCaseStudyChamferDs8,
  DsCaseStudyChamferDs9,
  DsCaseStudyChamferDs10,
  DsCaseStudyChamferDs11,
  DsCaseStudyChamferDs12,
  DS_HERO_MANIFEST_LINES,
  ds1Hero,
  ds2Hero,
  ds3Hero,
  ds4Hero,
  ds5Hero,
  ds6Hero,
  ds7Hero,
  ds8Hero,
  ds9Hero,
  ds10Hero,
  ds11Hero,
  ds12Hero,
  dsCalculatorGif,
} from '../../components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia'
import type { CaseStudyPresentationSlide } from '../../components/caseStudy/CaseStudyPresentationOverlay'
import { DS_WHITE_PLACEHOLDER as DS_WHITE } from '../../constants/dsWhitePlaceholder'
import { ChamferFrame } from '../../components/system/ChamferFrame'
import { FigmaGrid12 } from '../../components/system/FigmaGrid'
import { RotatingGradientCircle } from '../../components/system/RotatingGradientCircle'

const deckMaxW = 'mx-auto w-full max-w-[min(100%,1156px)]'

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

/** Same media → slide mapping as the Carbon deck (presentation mode parity). */
export const DS_PRESENTATION_MEDIA_TO_SLIDE: readonly number[] = [
  0, 2, 3, 8, 11, 13, 15, 17, 18, 19, 20, 22, 23, 25, 27, 29, 30, 32, 34, 35, 37,
]

const IMAGE_SLIDE_INDEX = new Set<number>(DS_PRESENTATION_MEDIA_TO_SLIDE)
const VIDEO_SLIDE_INDEX = new Set<number>([37])

const TEXT_THUMB_LABELS: Record<number, string> = {
  1: 'Intro',
  4: 'Philosophy',
  6: 'Climate',
  7: 'Problems',
  9: 'Research',
  11: 'Saving time',
  12: 'Foundations first',
  14: 'Components at scale',
  16: 'States, variants, edge cases',
  18: 'Rules that prevent chaos',
  19: 'Built for real-world',
  20: 'Design ↔ Engineering',
  21: 'Meaningful result',
  22: 'Information architecture',
  24: 'Result',
  26: 'Pricing',
  28: 'Trust',
  31: 'Checkout',
  33: 'Turning point',
  36: 'B2B shift',
  38: 'Impact',
  39: 'Retro',
}

function loremTextSlide(): ReactNode {
  return (
    <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
      <p className="col-span-12 text-sm font-normal leading-relaxed text-fg md:text-base">{LOREM}</p>
    </FigmaGrid12>
  )
}

function dsCaseStudyHeroSlide(): ReactNode {
  return (
    <ChamferFrame
      className={`chamfer-media-border ${deckMaxW}`}
      innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
    >
      <DsCaseStudyChamferCollage />
    </ChamferFrame>
  )
}

function whiteImageSlide(): ReactNode {
  return (
    <ChamferFrame
      className={`chamfer-media-border ${deckMaxW}`}
      innerClassName="flex min-w-0 justify-center overflow-hidden bg-white p-0"
    >
      <img
        src={DS_WHITE}
        alt=""
        decoding="async"
        className="block min-h-[min(40vh,280px)] w-full max-w-full bg-white object-cover"
      />
    </ChamferFrame>
  )
}

function deckSlide(i: number): ReactNode {
  if (VIDEO_SLIDE_INDEX.has(i)) {
    return (
      <ChamferFrame
        className={`chamfer-media-border ${deckMaxW}`}
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-white p-0"
      >
        <div className="aspect-video w-full bg-white" aria-hidden />
      </ChamferFrame>
    )
  }
  if (IMAGE_SLIDE_INDEX.has(i)) {
    if (i === 0) {
      return dsCaseStudyHeroSlide()
    }
    if (i === 2) {
      return (
        <ChamferFrame
          className={`chamfer-media-border ${deckMaxW}`}
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <DsCaseStudyChamferDs2 />
        </ChamferFrame>
      )
    }
    if (i === 3) {
      return (
        <ChamferFrame
          className={`chamfer-media-border ${deckMaxW}`}
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <DsCaseStudyChamferDs3 />
        </ChamferFrame>
      )
    }
    if (i === 8) {
      return (
        <ChamferFrame
          className={`chamfer-media-border ${deckMaxW}`}
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <DsCaseStudyChamferDs4 />
        </ChamferFrame>
      )
    }
    if (i === 11) {
      return (
        <ChamferFrame
          className={`chamfer-media-border ${deckMaxW}`}
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <DsCaseStudyChamferDs5 />
        </ChamferFrame>
      )
    }
    if (i === 13) {
      return (
        <ChamferFrame
          className={`chamfer-media-border ${deckMaxW}`}
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <DsCaseStudyChamferDs6 />
        </ChamferFrame>
      )
    }
    if (i === 15) {
      return (
        <ChamferFrame
          className={`chamfer-media-border ${deckMaxW}`}
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <DsCaseStudyChamferDs7 />
        </ChamferFrame>
      )
    }
    if (i === 17) {
      return (
        <ChamferFrame
          className={`chamfer-media-border ${deckMaxW}`}
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <DsCaseStudyChamferDs8 />
        </ChamferFrame>
      )
    }
    if (i === 18) {
      return (
        <ChamferFrame
          className={`chamfer-media-border ${deckMaxW}`}
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <DsCaseStudyChamferDs9 />
        </ChamferFrame>
      )
    }
    if (i === 19) {
      return (
        <ChamferFrame
          className={`chamfer-media-border ${deckMaxW}`}
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <DsCaseStudyChamferDs10 />
        </ChamferFrame>
      )
    }
    if (i === 20) {
      return (
        <ChamferFrame
          className={`chamfer-media-border ${deckMaxW}`}
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <DsCaseStudyChamferDs11 />
        </ChamferFrame>
      )
    }
    if (i === 22) {
      return (
        <ChamferFrame
          className={`chamfer-media-border ${deckMaxW}`}
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <DsCaseStudyChamferDs12 />
        </ChamferFrame>
      )
    }
    return whiteImageSlide()
  }

  if (i === 1) {
    return (
      <div
        data-presentation-split-root
        className={`flex ${deckMaxW} min-w-0 flex-col items-stretch gap-8 md:gap-10 lg:flex-row lg:items-center lg:gap-x-6 lg:gap-y-0 xl:gap-x-8`}
      >
        <h1
          data-presentation-text-region
          className="min-w-0 flex-1 whitespace-pre-line text-left text-[40px] font-normal leading-[1.12] tracking-[-0.03em] text-fg"
        >
          {DS_HERO_MANIFEST_LINES}
        </h1>
        <div data-presentation-media-region className="shrink-0 self-center lg:ml-auto">
          <RotatingGradientCircle
            className="aspect-square w-[min(52vw,11rem)] shrink-0 md:w-[min(42vw,15rem)] lg:w-[min(34vw,17.5rem)]"
            innerClassName="bg-bg p-0"
            aria-hidden
          >
            <img
              src={dsCalculatorGif}
              alt=""
              className="pointer-events-none block h-full w-full object-cover object-center select-none"
            />
          </RotatingGradientCircle>
        </div>
      </div>
    )
  }

  return loremTextSlide()
}

const SLIDE_COUNT = 40

export const DS_PRESENTATION_SLIDES: CaseStudyPresentationSlide[] = Array.from(
  { length: SLIDE_COUNT },
  (_, i) => ({
    content: deckSlide(i),
    slideKind: IMAGE_SLIDE_INDEX.has(i) ? ('image' as const) : ('text' as const),
    thumbnailLabel: TEXT_THUMB_LABELS[i],
    thumbnailIsVideo: VIDEO_SLIDE_INDEX.has(i),
  }),
)

export const DS_PRESENTATION_THUMBNAILS = Array.from(
  { length: SLIDE_COUNT },
  (_, i) =>
    i === 0
      ? ds1Hero
      : i === 2
        ? ds2Hero
        : i === 3
          ? ds3Hero
          : i === 8
            ? ds4Hero
            : i === 11
              ? ds5Hero
              : i === 13
                ? ds6Hero
                : i === 15
                  ? ds7Hero
                  : i === 17
                    ? ds8Hero
                    : i === 18
                      ? ds9Hero
                      : i === 19
                        ? ds10Hero
                        : i === 20
                          ? ds11Hero
                          : i === 22
                            ? ds12Hero
                            : DS_WHITE,
) as readonly string[]
