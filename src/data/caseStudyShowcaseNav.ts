import type { NavSection } from '../components/caseStudy/useCaseStudyScrollspy'

/** Scroll targets for the showcase case study layout (components reference + Carbon production). */
export const CASE_STUDY_SHOWCASE_NAV: NavSection[] = [
  { id: 'hero-heading', label: 'Hero' },
  { id: 'overview-section', label: 'Overview' },
  { id: 'problem-statement', label: 'Problem' },
  { id: 'problem-title', label: 'Problem & features' },
  { id: 'components-stepper', label: 'Timeline' },
  { id: 'design-title', label: 'Design' },
  { id: 'quote-block', label: 'Quote' },
  { id: 'components-comparison', label: 'Comparison' },
  { id: 'feature-pair', label: 'Feature pair' },
  { id: 'decision-grid-title', label: 'Decisions' },
  { id: 'components-kpi', label: 'KPIs' },
  { id: 'retro-title', label: 'Retrospective' },
]

/** Carbon Neutral Club production page — TOC only for sections built so far. */
export const CARBON_CASE_STUDY_SHOWCASE_NAV: NavSection[] = [
  { id: 'hero-heading', label: 'Top of page' },
  { id: 'overview-section', label: 'Overview' },
  { id: 'problem-statement', label: 'The problem' },
  { id: 'user-test-findings', label: 'User test findings' },
  { id: 'user-vs-business-needs', label: 'User vs business needs' },
  { id: 'system-we-designed', label: 'The system we designed' },
]
