/**
 * Case study canvas reference — same section/pattern components production case studies use
 * (`components/sections` → `components/caseStudy/patterns`). Adjust patterns to update both.
 *
 * Sidebar entries must stay in sync with {@link CASE_STUDY_SHOWCASE_NAV}.
 */
import {
  CaseStudyShowcaseScaffold,
  type CaseStudyPresentationSlide,
} from '../components/caseStudy/CaseStudyShowcaseScaffold'
import { PRIMARY_CASE_STUDY } from '../constants/caseStudyCatalog'
import {
  ComparisonShowcase,
  ProblemStatementFrame,
  caseStudyScrollAnchorClass,
} from '../components/caseStudy/patterns'
import { KPISection } from '../components/sections/KPISection'
import { StepperSection } from '../components/sections/StepperSection'
import { ExperimentalCaseStudiesPanel } from '../components/ExperimentalCaseStudiesPanel'
import { ChamferFrame } from '../components/system/ChamferFrame'
import { FigmaGrid12 } from '../components/system/FigmaGrid'
import {
  RotatingGradientCircle,
  RotatingGradientCircleDotPlaceholder,
} from '../components/system/RotatingGradientCircle'

const TIMELINE_STEP_LABELS = ['[Step 1]', '[Step 2]', '[Step 3]', '[Step 4]'] as const

const COMPONENTS_REFERENCE_PRESENTATION_SLIDES: CaseStudyPresentationSlide[] = [
  {
    content: (
      <>
        <ChamferFrame
          className="chamfer-media-border w-full max-w-[min(100%,1156px)]"
          innerClassName="flex min-h-[min(52vw,240px)] items-center justify-center bg-transparent md:min-h-[min(52vh,530px)]"
        >
          <span className="px-4 text-center text-[10px] text-fg-subtle md:text-[11px]">
            Hero media — chamfered top-right &amp; bottom-left (10-col width)
          </span>
        </ChamferFrame>
        <div className="mx-auto mt-8 flex w-full max-w-[min(100%,1156px)] min-w-0 flex-col items-stretch gap-8 md:mt-10 md:gap-10 lg:flex-row lg:items-center lg:gap-x-6 lg:gap-y-0 xl:gap-x-8">
          <h1
            className={`min-w-0 flex-1 text-left text-[clamp(1.875rem,5.5vw,3.75rem)] font-normal leading-[1.1] tracking-[-0.03em] text-fg md:leading-[1.08] lg:text-[clamp(2.5rem,4.8vw,4.25rem)] ${caseStudyScrollAnchorClass}`}
          >
            [Fancy one liner about the project lorem ipsum dolor]
          </h1>
          <RotatingGradientCircle
            className="aspect-square w-[min(52vw,11rem)] shrink-0 self-center md:w-[min(42vw,15rem)] lg:ml-auto lg:w-[min(34vw,17.5rem)]"
            innerClassName="bg-bg"
            aria-hidden
          >
            <RotatingGradientCircleDotPlaceholder />
          </RotatingGradientCircle>
        </div>
      </>
    ),
  },
  {
    content: (
      <ComparisonShowcase
        title="[Section title]"
        titleId="components-comparison-deck"
        titleAlign="center"
        before={<span className="text-sm text-fg-subtle">Before state visual</span>}
        after={<span className="text-sm text-fg-subtle">After state visual</span>}
        caption="[Caption — single image area swaps with toggle, centered note below.]"
      />
    ),
  },
]

export default function CaseStudyComponentsPage() {
  const teamConnector = (
    <span className="relative flex min-h-px min-w-[2.5rem] flex-1 items-center" aria-hidden>
      <span className="h-px w-full bg-fg/35" />
      <svg
        className="-ml-px h-[5px] w-[6px] shrink-0 text-fg/35"
        viewBox="0 0 6 5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M0 0 L6 2.5 L0 5 Z" />
      </svg>
    </span>
  )

  const teamRowChamfer = (
    <ChamferFrame
      className="size-10 shrink-0 [--quadrant-chamfer:clamp(3px,0.55vmin,6px)]"
      innerClassName="bg-surface/40"
    />
  )

  return (
    <CaseStudyShowcaseScaffold
      sidebarKicker="[Case study name lorem ipsum dolor]"
      caseStudiesModifierTo={PRIMARY_CASE_STUDY.path}
      presentationSlides={COMPONENTS_REFERENCE_PRESENTATION_SLIDES}
    >
      <ChamferFrame presentationMediaIndex={0}
        className="chamfer-media-border w-full"
        innerClassName="flex min-h-[min(52vw,240px)] items-center justify-center bg-transparent md:min-h-[min(52vh,530px)]"
      >
        <span className="px-4 text-center text-[10px] text-fg-subtle md:text-[11px]">
          Hero media — chamfered top-right &amp; bottom-left (10-col width)
        </span>
      </ChamferFrame>
      <div className="flex w-full min-w-0 flex-col items-stretch gap-8 md:gap-10 lg:flex-row lg:items-center lg:gap-x-6 lg:gap-y-0 xl:gap-x-8">
        <h1
          id="hero-heading"
          className={`min-w-0 flex-1 text-left text-[clamp(1.875rem,5.5vw,3.75rem)] font-normal leading-[1.1] tracking-[-0.03em] text-fg md:leading-[1.08] lg:text-[clamp(2.5rem,4.8vw,4.25rem)] ${caseStudyScrollAnchorClass}`}
        >
          [Fancy one liner about the project lorem ipsum dolor]
        </h1>
        <RotatingGradientCircle
          className="aspect-square w-[min(52vw,11rem)] shrink-0 self-center md:w-[min(42vw,15rem)] lg:ml-auto lg:w-[min(34vw,17.5rem)]"
          innerClassName="bg-bg"
          aria-hidden
        >
          <RotatingGradientCircleDotPlaceholder />
        </RotatingGradientCircle>
      </div>

      <ProblemStatementFrame
        id="problem-statement"
        className={caseStudyScrollAnchorClass}
        label="Problem"
      >
        <p className="text-balance">
          Problem one liner about the project lorem ipsum dolor sit amid consecteur
        </p>
      </ProblemStatementFrame>

      <FigmaGrid12
        aria-labelledby="overview-section"
        className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]"
      >
        <div className="col-span-12 md:col-span-5">
          <h2
            id="overview-section"
            className={`text-base font-normal leading-none text-fg md:text-lg ${caseStudyScrollAnchorClass}`}
          >
            Overview
          </h2>
          <ChamferFrame
            className="mt-7 w-full md:mt-8 md:max-w-[min(100%,26rem)]"
            innerClassName="min-h-[180px] p-5 text-xs leading-[1.55] text-fg md:min-h-[200px] md:p-6 md:text-sm md:leading-relaxed"
          >
            [my role description lorem ipsum dolor sit amid consecteur lorem ipsum dolor sit amid
            consecteur lorem ipsum dolor sit amid consecteur]
          </ChamferFrame>
        </div>
        <div className="col-span-12 md:col-span-7">
          <h2 className="text-base font-normal leading-none text-fg md:text-lg">Team</h2>
          <ul className="mt-7 flex flex-col gap-6 md:mt-8 md:gap-7">
            {['Designer', 'PM', 'Engineer'].map((role) => (
              <li
                key={role}
                className="flex items-center gap-3 text-xs md:gap-5 md:text-sm"
              >
                {teamRowChamfer}
                <span className="shrink-0 whitespace-nowrap text-fg">[team member role]</span>
                {teamConnector}
                <span className="min-w-0 shrink-0 text-right text-fg">Team member responsibility</span>
                {teamRowChamfer}
              </li>
            ))}
          </ul>
        </div>
      </FigmaGrid12>

      <div className="figma-rule my-[32px]" aria-hidden />

      <FigmaGrid12 aria-labelledby="problem-title">
        <h2
          id="problem-title"
          className={`col-span-12 text-base font-normal text-fg md:text-lg ${caseStudyScrollAnchorClass}`}
        >
          [Section title]
        </h2>
        <div className="col-span-12 flex w-full flex-col items-center gap-12 md:flex-row md:items-center md:gap-8">
          <RotatingGradientCircle
            className="aspect-square w-[min(64vw,223px)] shrink-0 md:w-[223px]"
            innerClassName="bg-bg"
            aria-hidden
          >
            <RotatingGradientCircleDotPlaceholder />
          </RotatingGradientCircle>
          <p className="w-full min-w-0 flex-1 max-w-none text-base font-normal leading-relaxed text-fg md:w-auto md:text-xl">
            [Section statement, quote, problem, description, etc. lorem ipsum dolor sit amid
            consecteur lorem ipsum dolor sit amid consecteur lorem ipsum dolor sit amid consecteur]
          </p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="col-span-12 flex flex-col gap-4 md:col-span-4">
            <ChamferFrame
              innerClassName="flex min-h-[201px] items-center justify-center bg-surface/40"
            >
              <span className="text-[10px] text-fg-subtle">Feature visual {i}</span>
            </ChamferFrame>
            <p className="text-xs leading-relaxed text-fg-muted md:text-sm">
              [Caption lorem ipsum dolor sit amid consecteur — short supporting line.]
            </p>
          </div>
        ))}
      </FigmaGrid12>

      <div className="figma-rule my-[32px]" aria-hidden />

      <StepperSection
        title="[Section title]"
        variant="timeline"
        headingId="components-stepper"
        narrative="[bullet point text lorem ipsum dolor sit amid consecteur — narrative that sits under the timeline row and spans the same content width as the mock.]"
        steps={TIMELINE_STEP_LABELS.map((title) => ({ title }))}
      />

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="design-title"
        aria-labelledby="design-title-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <h2
            id="design-title-heading"
            className="col-span-12 text-base font-normal text-fg md:text-lg"
          >
            [Design title]
          </h2>
          <p className="col-span-12 max-w-3xl text-sm leading-relaxed text-fg-muted md:text-base">
            Intro paragraph for the design section — context before the alternating image rows.
          </p>
        </FigmaGrid12>
        <FigmaGrid12 className="mt-10 md:mt-[var(--figma-gutter)]">
          <div className="col-span-12 max-w-none text-sm leading-relaxed text-fg md:col-span-5 md:text-base">
            <p className="font-medium text-fg">Row 1 — copy</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-fg-muted marker:text-fg-subtle">
              <li>Zigzag: text 5 cols, visual 7 cols.</li>
              <li>Matches ~2fr / ~3fr split on 12-col grid.</li>
            </ul>
          </div>
          <ChamferFrame
            className="col-span-12 md:col-span-7"
            innerClassName="min-h-[min(72vw,340px)] w-full bg-surface/40 md:min-h-[431px]"
          />
        </FigmaGrid12>
        <FigmaGrid12 className="mt-10 md:mt-16">
          <ChamferFrame
            className="col-span-12 md:order-1 md:col-span-7"
            innerClassName="min-h-[min(72vw,340px)] w-full bg-surface/40 md:min-h-[431px]"
          />
          <div className="col-span-12 max-w-none text-sm leading-relaxed text-fg md:order-2 md:col-span-5 md:text-base">
            <p className="font-medium text-fg">Row 2 — reversed</p>
            <p className="mt-4 text-fg-muted">
              Visual 7 cols first, copy 5 cols — chamfer matches homepage cells.
            </p>
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <div id="quote-block" className={caseStudyScrollAnchorClass}>
        <FigmaGrid12 aria-labelledby="quote-heading">
          <h2 id="quote-heading" className="sr-only">
            Quote
          </h2>
          <div className="col-span-12 flex w-full flex-col items-center gap-12 md:flex-row md:items-center md:gap-8">
            <RotatingGradientCircle
              className="size-[223px] shrink-0"
              innerClassName="bg-surface/30"
              aria-hidden
            >
              <RotatingGradientCircleDotPlaceholder />
            </RotatingGradientCircle>
            <p className="min-w-0 flex-1 text-center text-lg font-medium leading-snug text-fg md:text-left md:text-xl">
              [Section statement, quote, problem, description, etc. lorem ipsum dolor sit amid
              consecteur — pulled quote styled for high contrast.]
            </p>
          </div>
        </FigmaGrid12>
      </div>

      <div className="figma-rule my-[32px]" aria-hidden />

      <ComparisonShowcase
        title="[Section title]"
        titleId="components-comparison"
        titleAlign="center"
        presentationMediaIndex={1}
        before={<span className="text-sm text-fg-subtle">Before state visual</span>}
        after={<span className="text-sm text-fg-subtle">After state visual</span>}
        caption="[Caption — single image area swaps with toggle, centered note below.]"
      />

      <div className="figma-rule my-[32px]" aria-hidden />

      <FigmaGrid12 aria-labelledby="feature-pair">
        <h2
          id="feature-pair"
          className={`col-span-12 text-base font-normal text-fg md:text-lg ${caseStudyScrollAnchorClass}`}
        >
          [Section title]
        </h2>
        {[1, 2].map((i) => (
          <div key={i} className="col-span-12 flex flex-col gap-4 md:col-span-6">
            <ChamferFrame
              innerClassName="min-h-[280px] bg-surface/40 md:min-h-[340px]"
            />
            <p className="text-xs leading-relaxed text-fg-muted md:text-sm">
              [Feature detail caption {i} — six columns each, 24px gutter.]
            </p>
          </div>
        ))}
      </FigmaGrid12>

      <div className="figma-rule my-[32px]" aria-hidden />

      <FigmaGrid12 aria-labelledby="decision-grid-title">
        <h2
          id="decision-grid-title"
          className={`col-span-12 text-base font-normal text-fg md:text-lg ${caseStudyScrollAnchorClass}`}
        >
          [Section title]
        </h2>
        {[1, 2, 3].map((i) => (
          <ChamferFrame
            key={i}
            className="col-span-12 md:col-span-4"
            innerClassName="flex flex-col bg-elevated/15"
          >
            <div className="aspect-[4/5] bg-surface/50" />
            <div className="border-t border-cell-border/60 p-4">
              <h3 className="text-sm font-medium text-fg">Decision card {i}</h3>
              <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                Short description under the title — Figma decision column cards.
              </p>
            </div>
          </ChamferFrame>
        ))}
      </FigmaGrid12>

      <div className="figma-rule my-[32px]" aria-hidden />

      <KPISection
        title="[Section title]"
        headingId="components-kpi"
        metrics={[
          {
            value: '88%',
            label: 'Engagement',
            description: 'Short outcome line lorem ipsum.',
          },
          {
            value: '3×',
            label: 'Iteration lift',
            description: 'Supporting metric description.',
          },
          {
            value: '24',
            label: 'Shipped modules',
            description: 'Narrative under the KPI.',
          },
        ]}
      />

      <div className="figma-rule my-[32px]" aria-hidden />

      <FigmaGrid12 aria-labelledby="retro-title">
        <ChamferFrame
          meteorTrail
          className="col-span-12 md:col-span-8 md:col-start-3"
          innerClassName="px-4 py-12 md:px-6 md:py-16"
        >
          <h2
            id="retro-title"
            className={`text-center text-base font-normal text-fg md:text-[40px] ${caseStudyScrollAnchorClass}`}
          >
            Retrospective
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-fg-muted md:text-xs md:leading-[1.4]">
            Centered retrospective body copy — what shipped, what we&apos;d revisit, and how the
            case study closes. Keep it short and legible inside the bordered container.
          </p>
          <ChamferFrame
            className="mx-auto mt-12 w-full max-w-full"
            innerClassName="flex min-h-[185px] items-center justify-center bg-surface/30 px-4"
          >
            <span className="text-center text-[11px] text-fg-subtle">
              Small centered image / diagram at foot of retrospective
            </span>
          </ChamferFrame>
        </ChamferFrame>
      </FigmaGrid12>

      <div className="figma-rule my-[32px]" aria-hidden />
      <ExperimentalCaseStudiesPanel layout="footer" />
    </CaseStudyShowcaseScaffold>
  )
}
