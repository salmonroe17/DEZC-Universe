import type { ReactNode } from 'react'

export type TextSectionProps = {
  title: string
  description?: string
  bullets?: string[]
}

export type SplitSectionProps = {
  title: string
  description?: string
  bullets?: string[]
  visual?: ReactNode
  reverse?: boolean
}

export type StatementSectionProps = {
  statement: string
  subtext?: string
}

export type StepperSectionProps = {
  title: string
  steps: { title: string; description?: string }[]
  /**
   * `timeline` = horizontal pills + connectors (case study canvas reference).
   * Default `vertical` = numbered column layout.
   */
  variant?: 'vertical' | 'timeline'
  /** Shown under the timeline row when `variant` is `timeline`. */
  narrative?: string
  /** Stable DOM id for the section title (e.g. in-page nav / scrollspy). */
  headingId?: string
}

export type KPISectionProps = {
  title?: string
  metrics: { value: string; label: string; description?: string }[]
  /** Stable DOM id for the title when present (scroll targets). */
  headingId?: string
}

export type ComparisonSectionProps = {
  title?: string
  before: ReactNode
  after: ReactNode
  bullets?: string[]
  caption?: string
  titleAlign?: 'center' | 'left'
}

export type DecisionSectionProps = {
  title?: string
  items: { insight: string; decision: string; outcome: string }[]
}

type SectionBase = {
  id: string
  /** Shown in sidebar; omit to skip scrollspy entry */
  navLabel?: string
}

export type CaseStudySection =
  | (SectionBase & { type: 'text'; props: TextSectionProps })
  | (SectionBase & { type: 'split'; props: SplitSectionProps })
  | (SectionBase & { type: 'statement'; props: StatementSectionProps })
  | (SectionBase & { type: 'stepper'; props: StepperSectionProps })
  | (SectionBase & { type: 'kpi'; props: KPISectionProps })
  | (SectionBase & { type: 'comparison'; props: ComparisonSectionProps })
  | (SectionBase & { type: 'decision'; props: DecisionSectionProps })

export type CaseStudy = {
  slug: string
  title: string
  subtitle?: string
  sections: CaseStudySection[]
}
