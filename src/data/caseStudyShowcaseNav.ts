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

/** Design Systems (DS) — same section ids as Carbon for layout parity; placeholder copy. */
export const DS_CASE_STUDY_SHOWCASE_NAV: NavSection[] = [
  { id: 'hero-heading', label: 'Intro' },
  { id: 'overview-section', label: 'DS philosophy' },
  { id: 'problem-statement', label: 'The problem' },
  { id: 'my-philosophy', label: 'Saving time' },
  { id: 'foundations-first', label: 'Foundations first' },
  { id: 'components-at-scale', label: 'Components at scale' },
  { id: 'states-variants-edge-cases', label: 'States, variants, and edge cases' },
  { id: 'rules-that-prevent-chaos', label: 'Rules that prevent chaos' },
  { id: 'built-for-real-world-products', label: 'Built for real-world products' },
  { id: 'design-engineering-bridge', label: 'Design ↔ Engineering bridge' },
  { id: 'information-architecture-for-ds', label: 'Information architecture for DS' },
  { id: 'retro-title', label: 'Retrospective' },
]

/** Carbon Neutral Club production page — TOC only for sections built so far. */
export const CARBON_CASE_STUDY_SHOWCASE_NAV: NavSection[] = [
  { id: 'hero-heading', label: 'Intro + demo video' },
  { id: 'overview-section', label: 'Overview' },
  { id: 'problem-statement', label: 'The problem' },
  { id: 'user-test-findings', label: 'User test findings' },
  { id: 'user-vs-business-needs', label: 'User vs business needs' },
  { id: 'system-we-designed', label: 'The system we designed' },
  { id: 'design-principles', label: 'Design principles' },
  { id: 'the-calculator', label: 'The calculator' },
  { id: 'making-result-meaningful', label: 'Making the result meaningful' },
  { id: 'pricing-plan-design', label: 'Pricing & plan design' },
  { id: 'checkout-trust-building', label: 'Checkout transparency' },
  { id: 'turning-point', label: 'The turning point' },
  { id: 'final-experience', label: 'Final experience' },
  { id: 'impact-outcomes', label: 'Impact' },
  { id: 'retro-title', label: 'Retrospective' },
]

/** IBM Envizi page — same scroll ids as {@link CARBON_CASE_STUDY_SHOWCASE_NAV} for structure parity. */
export const IBM_ENVIZI_CASE_STUDY_SHOWCASE_NAV: NavSection[] = [
  { id: 'hero-heading', label: 'Intro + demo video' },
  { id: 'overview-section', label: 'Overview' },
  { id: 'problem-statement', label: 'The problem' },
  { id: 'user-vs-business-needs', label: 'Business vs user needs' },
  { id: 'alignment-brief-to-system', label: 'Brief to product system' },
  { id: 'system-we-designed', label: 'Workflows > Dashboards' },
  { id: 'design-principles', label: 'Action layer' },
  { id: 'criteria-selection', label: 'Criteria selection' },
  { id: 'define-measurable-success', label: 'Define measurable success' },
  { id: 'execute-actions', label: 'Execute actions' },
  { id: 'track-progress', label: 'Track progress' },
  { id: 'making-emissions-changes-understandable', label: 'Understandable emissions' },
  { id: 'the-other-half-of-the-system', label: 'The other half' },
  { id: 'four-methods-one-experience', label: '4 methods, 1 experience' },
  { id: 'before-vs-after-action-plans', label: 'Before vs after' },
  { id: 'impact-outcomes', label: 'Impact' },
  { id: 'retro-title', label: 'Retrospective' },
]

/** Super app case study — full page TOC. */
export const SUPER_CASE_STUDY_SHOWCASE_NAV: NavSection[] = [
  { id: 'super-hero-heading', label: 'Intro + demo video' },
  { id: 'super-overview-section', label: 'Overview' },
  { id: 'super-problem-statement', label: 'Problem' },
  { id: 'super-alignment-section', label: 'Alignment, not iteration' },
  { id: 'super-workshop-section', label: 'Workshop' },
  { id: 'super-navigation-section', label: 'Navigation change' },
  { id: 'super-true-home-section', label: 'A true home' },
  { id: 'super-supercash-relocated-section', label: 'SuperCash relocated' },
  { id: 'super-notifications-section', label: 'Notifications' },
  { id: 'super-rewards-profile-section', label: 'Rewards & profile' },
  { id: 'super-prioritization-section', label: 'Prioritization' },
  { id: 'super-turning-point-section', label: 'Turning Point' },
  { id: 'super-outcome-section', label: 'Outcome' },
  { id: 'super-impact-section', label: 'Impact' },
  { id: 'super-retrospective-section', label: 'Retrospective' },
]
