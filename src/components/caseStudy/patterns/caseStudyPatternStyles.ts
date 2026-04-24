/**
 * Offset for in-page nav + sticky case-study chrome when scrolling to `#id`.
 * `--cs-components-header-h` is set on `.cs-showcase-body` in long-form case studies.
 */
export const caseStudyScrollAnchorClass =
  'scroll-mt-[calc(var(--cs-components-header-h,7.5rem)+0.75rem)]'

/** Shared headings for 12-col case study canvas blocks (reference + production). */
export const caseStudySectionHeadingClass =
  'col-span-12 text-base font-normal text-fg md:text-lg'

export const caseStudySectionHeadingCenteredClass =
  'col-span-12 text-center text-base font-normal text-fg md:text-lg'

/** Timeline stepper title (reference row). */
export const caseStudySectionHeadingTimelineClass =
  'col-span-12 text-base font-normal leading-snug text-fg md:text-lg'

export const caseStudyNarrowProseClass =
  'col-span-12 max-w-none text-base leading-relaxed text-fg md:text-xl'

/** Label beside pill crossfade toggles on chamfer stacks — shared across case study pages. */
export const caseStudyChamferToggleLabelClassName =
  'font-mono text-[clamp(0.8125rem,calc(0.35rem+1.5vw),1rem)] font-normal leading-snug text-fg sm:leading-none'

/** Team list under Overview – spacing only; font role/title is per page. */
export const caseStudyTeamRowListClass = 'mt-7 flex flex-col gap-6 md:mt-8 md:gap-7'

/**
 * Team row: role | flex-growing connector | responsibility. The center uses
 * `w-0 flex-1 min-w-0` so it always absorbs **remaining** width (grid `1fr` was
 * still losing space to intrinsic min-sizes). Narrow: cross-axis center. md+: top.
 */
export const caseStudyTeamRowLiClass =
  'flex w-full min-w-0 max-md:items-center md:items-start gap-x-2 sm:gap-x-3 md:gap-5'

/** Case study reference row — same flex; optional side chamfers are `shrink-0` in markup. */
export const caseStudyTeamRowLiChamferClass = caseStudyTeamRowLiClass

/** Caps how wide the side columns can grow so the rail keeps the rest. */
export const caseStudyTeamRoleColumnClass =
  'min-w-0 max-w-[min(38%,20rem)] shrink basis-auto [overflow-wrap:break-word]'

export const caseStudyTeamResponsibilityTextClass =
  'min-w-0 max-w-[min(38%,20rem)] shrink basis-auto break-words text-right text-[12px] font-normal leading-[1.5] text-fg sm:break-normal'

/** Fills all space between titles; the horizontal rule is positioned in CaseStudyFlowConnectors. */
export const caseStudyTeamRowConnectorCellClass =
  'relative w-0 min-w-0 flex-1 grow basis-0 self-stretch min-h-0'
