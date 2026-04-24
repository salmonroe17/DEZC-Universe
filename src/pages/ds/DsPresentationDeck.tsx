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
} from '../../components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia'
import type { CaseStudyPresentationSlide } from '../../components/caseStudy/CaseStudyPresentationOverlay'
import { ChamferFrame } from '../../components/system/ChamferFrame'
import { dsScrollOrderTextSlide } from './dsPresentationTextSlides'
import { DS_DECK_MAX_W } from './dsShowcaseData'

const deckMaxW = DS_DECK_MAX_W

function dsChamferShell(children: ReactNode) {
  return (
    <ChamferFrame
      className={`chamfer-media-border ${deckMaxW}`}
      innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
    >
      {children}
    </ChamferFrame>
  )
}

function imageSlideForChamfer(i: number): ReactNode {
  switch (i) {
    case 0:
      return dsChamferShell(<DsCaseStudyChamferCollage />)
    case 1:
      return dsChamferShell(<DsCaseStudyChamferDs2 />)
    case 2:
      return dsChamferShell(<DsCaseStudyChamferDs3 />)
    case 3:
      return dsChamferShell(<DsCaseStudyChamferDs4 />)
    case 4:
      return dsChamferShell(<DsCaseStudyChamferDs5 />)
    case 5:
      return dsChamferShell(<DsCaseStudyChamferDs6 />)
    case 6:
      return dsChamferShell(<DsCaseStudyChamferDs7 />)
    case 7:
      return dsChamferShell(<DsCaseStudyChamferDs8 />)
    case 8:
      return dsChamferShell(<DsCaseStudyChamferDs9 />)
    case 9:
      return dsChamferShell(<DsCaseStudyChamferDs10 />)
    case 10:
      return dsChamferShell(<DsCaseStudyChamferDs11 />)
    case 11:
      return dsChamferShell(<DsCaseStudyChamferDs12 />)
    default:
      return dsChamferShell(<DsCaseStudyChamferCollage />)
  }
}

const DS_HERO_IMAGES = [
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
] as const

/** Short labels for the image slide, then the text slide, per scroll-order section. */
const DS_PAIR_THUMBNAIL_LABELS: { image: string; text: string }[] = [
  { image: 'Collage', text: 'Intro' },
  { image: 'Ds2', text: 'Philosophy' },
  { image: 'Ds3', text: 'Problem' },
  { image: 'Ds4', text: 'Time' },
  { image: 'Ds5', text: 'Foundations' },
  { image: 'Ds6', text: 'Components' },
  { image: 'Ds7', text: 'States' },
  { image: 'Ds8', text: 'Rules' },
  { image: 'Ds9', text: 'Real world' },
  { image: 'Ds10', text: 'D×E' },
  { image: 'Ds11', text: 'IA' },
  { image: 'Ds12', text: 'Outcomes' },
]

const SECTION_COUNT = 12
const DECK_LEN = SECTION_COUNT * 2

/**
 * Interleaved (scroll order): image slide for section k, then the matching long-form text block
 * (same copy as the case study page, via {@link dsScrollOrderTextSlide}).
 */
function buildScrollOrderDeck(): CaseStudyPresentationSlide[] {
  const out: CaseStudyPresentationSlide[] = []
  for (let k = 0; k < SECTION_COUNT; k++) {
    const { image, text } = DS_PAIR_THUMBNAIL_LABELS[k]!
    out.push({
      content: imageSlideForChamfer(k),
      slideKind: 'image' as const,
      thumbnailLabel: image,
      thumbnailIsVideo: false,
    })
    out.push({
      content: dsScrollOrderTextSlide(k),
      slideKind: 'text' as const,
      thumbnailLabel: text,
    })
  }
  return out
}

export const DS_PRESENTATION_SLIDES: CaseStudyPresentationSlide[] = buildScrollOrderDeck()

/**
 * Map on-page `presentationMediaIndex` (0–11) to the **image** slide in this deck
 * (image at 2k, matching text at 2k+1).
 */
export const DS_PRESENTATION_MEDIA_TO_SLIDE: readonly number[] = Array.from(
  { length: SECTION_COUNT },
  (_, k) => k * 2,
)

/** One still per image section; both slides in a pair share the same preview still. */
export const DS_PRESENTATION_THUMBNAILS: readonly string[] = Array.from({ length: DECK_LEN }, (_, i) => {
  const section = Math.min(11, Math.floor(i / 2))
  return DS_HERO_IMAGES[section]!
})
