import {
  ds1Hero,
  ds10Hero,
  ds11Hero,
  ds12Hero,
  ds2Hero,
  ds3Hero,
  ds4Hero,
  ds5Hero,
  ds6Hero,
  ds7Hero,
  ds8Hero,
  ds9Hero,
} from './dsCaseStudyHeroAssets'

const COLLAGE_ALT =
  'Collage of design system documentation screens, component libraries, and UI sheets in isometric perspective.'

/**
 * Top-of-page hero: full `ds1.png` at its natural aspect ratio (no `object-cover` crop).
 */
export function DsCaseStudyChamferCollage() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds1Hero}
        alt={COLLAGE_ALT}
        decoding="async"
        fetchPriority="high"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}

const DS2_ALT =
  'Design system case study image: screens, components, and documentation in context.'

/**
 * Second chamfer: full `ds2.png` at its natural aspect ratio.
 */
export function DsCaseStudyChamferDs2() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds2Hero}
        alt={DS2_ALT}
        decoding="async"
        loading="lazy"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}

const DS3_ALT =
  'Design system case study image: system documentation, patterns, and product UI.'

/**
 * Third chamfer: full `ds3.png` at its natural aspect ratio.
 */
export function DsCaseStudyChamferDs3() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds3Hero}
        alt={DS3_ALT}
        decoding="async"
        loading="lazy"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}

const DS4_ALT =
  'Design system documentation across multiple products: component libraries, navigation patterns, and button systems.'

/**
 * Problem section: full `ds4.png` at its natural aspect ratio.
 */
export function DsCaseStudyChamferDs4() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds4Hero}
        alt={DS4_ALT}
        decoding="async"
        loading="lazy"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}

const DS5_ALT =
  'Design system documentation: typography scale and input field anatomy from Room DS 1.0.'

/**
 * Saving time section: full `ds5.png` at its natural aspect ratio.
 */
export function DsCaseStudyChamferDs5() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds5Hero}
        alt={DS5_ALT}
        decoding="async"
        loading="lazy"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}

const DS6_ALT =
  'Design system foundations: spacing, typography, brand color palette, and shadow documentation.'

/**
 * Foundations section: full `ds6.png` at its natural aspect ratio.
 */
export function DsCaseStudyChamferDs6() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds6Hero}
        alt={DS6_ALT}
        decoding="async"
        loading="lazy"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}

const DS7_ALT =
  'Design system component documentation: buttons, navigation, modal anatomy, dropdown trigger, and tables.'

/**
 * Components at scale: full `ds7.png` at its natural aspect ratio.
 */
export function DsCaseStudyChamferDs7() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds7Hero}
        alt={DS7_ALT}
        decoding="async"
        loading="lazy"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}

const DS8_ALT =
  'Component state documentation: checkboxes, tabs, responsive modals, toggle switches, and input validation.'

/**
 * States, variants, and edge cases: full `ds8.png` at its natural aspect ratio.
 */
export function DsCaseStudyChamferDs8() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds8Hero}
        alt={DS8_ALT}
        decoding="async"
        loading="lazy"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}

const DS9_ALT =
  "Design system documentation: crop tool behavior, responsive media viewer breakpoints, and lightbox do and don't patterns."

/**
 * Rules that prevent chaos: full `ds9.png` at its natural aspect ratio.
 */
export function DsCaseStudyChamferDs9() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds9Hero}
        alt={DS9_ALT}
        decoding="async"
        loading="lazy"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}

const DS10_ALT =
  'Global product UI: localized headers, dark mode, RTL dropdowns, and enterprise component variants.'

/**
 * Built for real-world products: full `ds10.png` at its natural aspect ratio.
 */
export function DsCaseStudyChamferDs10() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds10Hero}
        alt={DS10_ALT}
        decoding="async"
        loading="lazy"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}

const DS11_ALT =
  'Design handoff documentation: primary button spec sheets with tokens, inverse dark theme, and global header anatomy.'

/**
 * Design ↔ Engineering bridge: full `ds11.png` at its natural aspect ratio.
 */
export function DsCaseStudyChamferDs11() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds11Hero}
        alt={DS11_ALT}
        decoding="async"
        loading="lazy"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}

const DS12_ALT =
  'Design system file architecture: top navigation states, user flows, menu hierarchy, and component documentation with screen links.'

/**
 * Information architecture for DS: full `ds12.png` at its natural aspect ratio.
 */
export function DsCaseStudyChamferDs12() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-[#0a0a0a]">
      <img
        src={ds12Hero}
        alt={DS12_ALT}
        decoding="async"
        loading="lazy"
        className="block h-auto w-full max-w-full align-middle"
      />
    </div>
  )
}
