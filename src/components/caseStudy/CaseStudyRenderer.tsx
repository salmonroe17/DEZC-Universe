/**
 * Renders case study sections via `components/sections/*` — those wrap shared canvas patterns in
 * `caseStudy/patterns`. Prefer editing patterns so `/case-study/components` and production stay in sync.
 */
import type { CaseStudy, CaseStudySection } from '../../types/caseStudy'
import { ExperimentalCaseStudiesPanel } from '../ExperimentalCaseStudiesPanel'
import { ComparisonSection } from '../sections/ComparisonSection'
import { DecisionSection } from '../sections/DecisionSection'
import { KPISection } from '../sections/KPISection'
import { SplitSection } from '../sections/SplitSection'
import { StatementSection } from '../sections/StatementSection'
import { StepperSection } from '../sections/StepperSection'
import { TextSection } from '../sections/TextSection'
import { SectionWrapper } from '../system/SectionWrapper'
import { SidebarNav } from '../system/SidebarNav'
import { SystemContainer } from '../system/SystemContainer'
import { CaseStudyRailShell } from './CaseStudyRailShell'
import { useCaseStudyScrollspy } from './useCaseStudyScrollspy'

const SECTION_GAP = 'mb-16 md:mb-20'

function renderSectionContent(section: CaseStudySection) {
  switch (section.type) {
    case 'text':
      return <TextSection {...section.props} />
    case 'split':
      return <SplitSection {...section.props} />
    case 'statement':
      return <StatementSection {...section.props} />
    case 'stepper':
      return <StepperSection {...section.props} />
    case 'kpi':
      return <KPISection {...section.props} />
    case 'comparison':
      return <ComparisonSection {...section.props} />
    case 'decision':
      return <DecisionSection {...section.props} />
    default: {
      const _exhaustive: never = section
      return _exhaustive
    }
  }
}

type CaseStudyRendererProps = {
  study: CaseStudy
}

export function CaseStudyRenderer({ study }: CaseStudyRendererProps) {
  const navSections =
    study.sections
      .filter((s): s is typeof s & { navLabel: string } => Boolean(s.navLabel))
      .map((s) => ({ id: s.id, label: s.navLabel })) ?? []

  const { activeId, onNavigate, navSections: sidebarSections } = useCaseStudyScrollspy(navSections)

  return (
    <div className="relative min-h-0 w-full min-w-0 max-w-full overflow-x-clip text-fg">
      <CaseStudyRailShell
        frameClassName="pb-20 pt-4 max-lg:pt-2 md:pb-28 md:pt-8 lg:pb-32 lg:pt-10"
        gridClassName="items-start"
        sidebar={
          <SidebarNav
            sections={sidebarSections}
            activeId={activeId}
            onNavigate={onNavigate}
          />
        }
      >
        <header className={`max-w-3xl ${SECTION_GAP}`}>
          <p className="font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-fg-subtle md:text-[11px]">
            Case study
          </p>
          <h1 className="mt-2 font-mono text-2xl font-bold tracking-tight text-fg md:text-3xl lg:text-4xl">
            {study.title}
          </h1>
          {study.subtitle ? (
            <p className="mt-4 text-sm leading-relaxed text-fg-muted md:text-base md:leading-relaxed lg:text-lg">
              {study.subtitle}
            </p>
          ) : null}
        </header>

        <div className="flex flex-col">
          {study.sections.map((section) => (
            <SectionWrapper key={section.id} id={section.id} className={SECTION_GAP}>
              <SystemContainer>{renderSectionContent(section)}</SystemContainer>
            </SectionWrapper>
          ))}
        </div>

        {/* Same chamfered cell as home — not wrapped in SystemContainer (that hid the “real” quadrant). */}
        <div className={SECTION_GAP} aria-label="More case studies">
          <div
            className="mb-10 border-t border-cell-border/80 md:mb-12"
            role="separator"
            aria-hidden
          />
          <ExperimentalCaseStudiesPanel layout="footer" />
        </div>
      </CaseStudyRailShell>
    </div>
  )
}
