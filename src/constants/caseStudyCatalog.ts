/**
 * First case study in the home grid (top-right “Case Studies” quadrant) and matching production URL.
 * Keep copy in sync with sidebar kicker on the case-study showcase page.
 */
export const PRIMARY_CASE_STUDY = {
  title: 'Carbon Neutral Club, B2C → B2B',
  path: '/case-study/carbon-neutral-club',
} as const

export const SUPER_CASE_STUDY = {
  title: 'Super app unify verticals',
  path: '/case-study/super-app',
} as const

export const IBM_ENVIZI_CASE_STUDY = {
  title: 'IBM Envizi: From Reporting to Action',
  path: '/case-study/ibm-envizi',
} as const

/** Design Systems — “Systems behind the screens” (placeholder page). */
export const DS_CASE_STUDY = {
  title: 'Systems behind the screens',
  path: '/case-study/design-systems',
} as const

/**
 * `Fake3DCube` face order: Carbon (0°) → Super (90°) → IBM (180°) → DS (−90°).
 * Index matches `activeCaseIndex` in `CaseStudyList`.
 */
export const CASE_STUDY_FACE_PATHS: readonly [string, string, string, string] = [
  PRIMARY_CASE_STUDY.path,
  SUPER_CASE_STUDY.path,
  IBM_ENVIZI_CASE_STUDY.path,
  DS_CASE_STUDY.path,
] as const
