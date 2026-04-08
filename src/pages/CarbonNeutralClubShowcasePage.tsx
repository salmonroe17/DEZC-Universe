import { useEffect, useRef, useState, type ReactNode } from 'react'
import carbonHeroC1 from '../../CNC photos/c1.png'
import carbonOverviewC2 from '../../CNC photos/c2.png'
import carbonOverviewC3 from '../../CNC photos/c3.png'
import carbonProblemProductSurface from '../../CNC photos/c4.png'
import carbonProblemProductSurfaceStruggles from '../../CNC photos/c4.1.png'
import carbonWhatWeLearnedC5 from '../../CNC photos/c5.png'
import carbonUserBusinessVennC6 from '../../CNC photos/c6.png'
import carbonSystemDesignedC7 from '../../CNC photos/c7.png'
import carbonPrincipleC8 from '../../CNC photos/c8.png'
import carbonPrincipleC9 from '../../CNC photos/c9.png'
import carbonPrincipleC10 from '../../CNC photos/c10.png'
import carbonPrincipleC11 from '../../CNC photos/c11.png'
import carbonCalculatorMockup from '../../CNC photos/c12.png'
import carbonCalculatorWhyMockup from '../../CNC photos/c12.1.png'
import carbonPrototypeVideo from '../../CNC photos/cnc video portfolio prototype 720p30.mp4'
import { PRIMARY_CASE_STUDY } from '../constants/caseStudyCatalog'
import { CARBON_CASE_STUDY_SHOWCASE_NAV } from '../data/caseStudyShowcaseNav'
import {
  ComparisonShowcase,
  ProblemStatementFrame,
  TimelinePillsRow,
  caseStudyScrollAnchorClass,
} from '../components/caseStudy/patterns'
import { CaseStudyShowcaseScaffold } from '../components/caseStudy/CaseStudyShowcaseScaffold'
import { KPISection } from '../components/sections/KPISection'
import { ExperimentalCaseStudiesPanel } from '../components/ExperimentalCaseStudiesPanel'
import { ChamferFrame } from '../components/system/ChamferFrame'
import { FigmaGrid12 } from '../components/system/FigmaGrid'
import { PlaceholderVisual } from '../components/system/PlaceholderVisual'
import {
  RotatingGradientCircle,
  RotatingGradientCircleDotPlaceholder,
} from '../components/system/RotatingGradientCircle'

const SYSTEM_DESIGNED_FLOW_PILLS = [
  '1. Calculator',
  '2. Result',
  '3. Plan',
  '4. Checkout',
] as const

const SYSTEM_DESIGNED_STAGES: { step: number; title: string; question: string }[] = [
  { step: 1, title: 'Calculator', question: 'What is my impact?' },
  { step: 2, title: 'Result', question: 'What does that impact mean?' },
  { step: 3, title: 'Plan', question: 'What should I do about it?' },
  { step: 4, title: 'Checkout', question: 'What am I actually paying for?' },
]

const DESIGN_PRINCIPLES: {
  title: string
  bullets: string[]
  visual: string
  visualAlt: string
}[] = [
  {
    title: 'Make the number meaningful',
    bullets: [
      'Users need context before a footprint score becomes actionable.',
      'Add national average for comparison; have the footprint tracker move up and down based on calculator decisions.',
    ],
    visual: carbonPrincipleC8,
    visualAlt:
      'UI mockup: footprint result with range bar, national average, and Canadian flag for comparison',
  },
  {
    title: 'Build trust before payment',
    bullets: [
      'Transparency must come before financial commitment.',
      'Show a full breakdown of what is included and why.',
    ],
    visual: carbonPrincipleC9,
    visualAlt: 'UI mockup: cost breakdown and offset plan options before checkout',
  },
  {
    title: 'Reduce decision friction',
    bullets: [
      'Choices should feel guided, not overwhelming.',
      'Use a progress stepper so expectations stay clear.',
    ],
    visual: carbonPrincipleC10,
    visualAlt: 'UI mockup: horizontal progress stepper across estimate, plan, and join steps',
  },
  {
    title: 'Connect cost to impact',
    bullets: [
      'Users should understand what they are paying for and why.',
      'Surface what membership includes on the choose-your-plan step.',
    ],
    visual: carbonPrincipleC11,
    visualAlt: 'UI mockup: offset projects grid explaining where fees go',
  },
]

const CALCULATOR_INTRO_COLUMNS: { body: ReactNode }[] = [
  {
    body: 'The calculator had to gather meaningful data without making users feel buried in complexity.',
  },
  {
    body: (
      <>
        <p className="m-0">We broke the flow into structured, progressive steps that:</p>
        <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 marker:text-fg-subtle">
          <li>Focused on one concept</li>
          <li>Reduced cognitive load</li>
          <li>Reinforced progress</li>
        </ul>
      </>
    ),
  },
  {
    body: 'The goal was not just accuracy. It was maintaining confidence and completion throughout the flow.',
  },
]

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

const tradeRowConnector = (
  <span
    className="relative flex w-full min-w-[2rem] max-w-full items-center md:min-h-[1.25em]"
    aria-hidden
  >
    <span className="h-px min-w-0 flex-1 bg-fg" />
    <svg
      className="-ml-px h-[5px] w-[6px] shrink-0 text-fg"
      viewBox="0 0 6 5"
      fill="currentColor"
      aria-hidden
    >
      <path d="M0 0 L6 2.5 L0 5 Z" />
    </svg>
  </span>
)

const TEAM_ROWS: { role: string; responsibility: string }[] = [
  {
    role: 'Lead product designer (me)',
    responsibility: 'Design workshops, wireframing, prototyping, etc.',
  },
  { role: 'UX researcher', responsibility: 'Pricing, conversion, & dropoff metrics' },
  { role: 'Co-founder / Product manager', responsibility: 'Requirements / main stakeholder' },
  { role: 'Full stack engineer', responsibility: 'Front & back end integration' },
]

const PROBLEM_EXISTING_SCREEN_ASKS = [
  "Trust a number they didn't fully understand",
  'Make a financial decision based on that number',
  'Commit to a membership before the value felt concrete',
] as const

const PROBLEM_MAJOR_ISSUES: { title: string; body: string }[] = [
  {
    title: 'The footprint felt abstract',
    body: "Users got a number, but not enough meaning.",
  },
  {
    title: 'The price felt disconnected',
    body: "The cost existed, but its logic wasn't immediately clear.",
  },
  {
    title: 'Checkout created hesitation',
    body: 'The final step asked for commitment before full confidence had been built.',
  },
]

const WHAT_WE_SAW_ITEMS = [
  'Strong engagement with the calculator itself',
  'Confusion around the final footprint number',
  'Uncertainty when choosing between plans',
  'Hesitation when entering the payment stage',
] as const

const USER_VS_BUSINESS_TRADEOFFS: { label: string; body: string }[] = [
  {
    label: 'Clarity vs speed',
    body: 'More explanation could build trust, but also slow users down.',
  },
  {
    label: 'Simplicity vs transparency',
    body: 'Fewer details reduced friction, but also weakened confidence.',
  },
  {
    label: 'Education vs conversion',
    body: 'Users needed context, but the business still needed them to complete checkout.',
  },
]

function CarbonPrototypeAutoplayVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          video.currentTime = 0
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className="block h-auto w-full max-w-full align-middle"
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Screen recording of the Carbon Neutral Club product prototype"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

export default function CarbonNeutralClubShowcasePage() {
  const [seeWhereUsersStruggled, setSeeWhereUsersStruggled] = useState(false)
  const [showCalculatorWhyWorks, setShowCalculatorWhyWorks] = useState(false)

  return (
    <CaseStudyShowcaseScaffold
      sidebarKicker={PRIMARY_CASE_STUDY.title}
      caseStudiesModifierTo="/case-study/components"
      navSections={CARBON_CASE_STUDY_SHOWCASE_NAV}
    >
      <ChamferFrame
        className="chamfer-media-border w-full"
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <img
          src={carbonHeroC1}
          alt="Carbon Neutral Club — hero"
          decoding="async"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>

      <div className="flex w-full min-w-0 flex-col items-stretch gap-8 md:gap-10 lg:flex-row lg:items-center lg:gap-x-6 lg:gap-y-0 xl:gap-x-8">
        <h1
          id="hero-heading"
          className={`min-w-0 flex-1 text-left text-[40px] font-normal leading-[1.12] tracking-[-0.03em] text-fg ${caseStudyScrollAnchorClass}`}
        >
          Redesigning the carbon footprint to checkout flow that shifted the product from
          direct-to-consumer to company-funded memberships.
        </h1>
        <RotatingGradientCircle
          className="aspect-square w-[min(52vw,11rem)] shrink-0 self-center md:w-[min(42vw,15rem)] lg:ml-auto lg:w-[min(34vw,17.5rem)]"
          innerClassName="bg-bg"
          aria-hidden
        >
          <RotatingGradientCircleDotPlaceholder />
        </RotatingGradientCircle>
      </div>

      <ChamferFrame
        className="chamfer-media-border w-full"
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <CarbonPrototypeAutoplayVideo src={carbonPrototypeVideo} />
      </ChamferFrame>

      <section aria-labelledby="overview-section">
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="overview-section"
            className={`col-span-12 text-[24px] font-normal leading-snug tracking-[-0.02em] text-fg ${caseStudyScrollAnchorClass}`}
          >
            Overview
          </h2>

          <div className="col-span-12 md:col-span-4">
            <h3 className="text-sm font-normal leading-none text-fg md:text-base">
              What does the company do?
            </h3>
            <ChamferFrame
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 text-xs leading-[1.55] text-fg md:p-6 md:text-sm md:leading-relaxed"
            >
              <p className="m-0">
                Carbon Neutral Club helps users understand and offset their carbon footprint through a
                paid membership.
              </p>
              <p className="mb-0 mt-4 md:mt-5">
                What started as a conversion and clarity problem became something much bigger:
              </p>
              <p className="mb-0 mt-4 md:mt-5">
                The flow revealed a better business model, and helped shift the company from individual
                purchase → employer-funded memberships.
              </p>
            </ChamferFrame>
          </div>

          <div className="col-span-12 md:col-span-4">
            <h3 className="text-sm font-normal leading-none text-fg md:text-base">What I did</h3>
            <ChamferFrame
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 text-xs leading-[1.55] text-fg md:p-6 md:text-sm md:leading-relaxed"
            >
              <p className="m-0">I led the redesign of the core journey:</p>
              <ul className="mb-0 mt-3 list-disc space-y-1.5 pl-[1.15rem] md:mt-4 md:space-y-2 md:pl-5">
                <li>Calculating a user&apos;s footprint</li>
                <li>Interpreting the result</li>
                <li>Choosing a plan</li>
                <li>Completing checkout</li>
              </ul>
            </ChamferFrame>
          </div>

          <div className="col-span-12 md:col-span-4">
            <h3 className="text-sm font-normal leading-none text-fg md:text-base">Scope</h3>
            <ChamferFrame
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 text-xs leading-[1.55] text-fg md:p-6 md:text-sm md:leading-relaxed"
            >
              <p className="m-0">Timeline: 7 weeks</p>
              <p className="mb-0 mt-4 font-normal md:mt-5">Scope details:</p>
              <ul className="mb-0 mt-2 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5">
                <li>Carbon footprint calculator redesign</li>
                <li>Carbon footprint reveal / results</li>
                <li>Payment plan selection</li>
                <li>Quick &amp; understandable checkout</li>
                <li>System thinking</li>
                <li>Design QA</li>
              </ul>
            </ChamferFrame>
          </div>

          <div className="col-span-12">
            <h3 className="mt-2 text-base font-normal leading-none text-fg md:mt-6 md:text-lg">
              Team
            </h3>
            <ul className="mt-7 flex flex-col gap-6 md:mt-8 md:gap-7">
              {TEAM_ROWS.map((row) => (
                <li key={row.role} className="flex items-center gap-3 text-xs md:gap-5 md:text-sm">
                  <span className="shrink-0 whitespace-nowrap text-fg">{row.role}</span>
                  {teamConnector}
                  <span className="min-w-0 shrink-0 text-right text-fg">{row.responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          <ChamferFrame
            className="chamfer-media-border col-span-12 w-full"
            innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
          >
            <img
              src={carbonOverviewC2}
              alt="Carbon Neutral Club case study — supporting visual 1"
              decoding="async"
              className="block h-auto w-full max-w-full align-middle"
            />
          </ChamferFrame>
          <ChamferFrame
            className="chamfer-media-border col-span-12 w-full"
            innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
          >
            <img
              src={carbonOverviewC3}
              alt="Carbon Neutral Club case study — supporting visual 2"
              decoding="async"
              className="block h-auto w-full max-w-full align-middle"
            />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <ProblemStatementFrame
        id="problem-statement"
        className={caseStudyScrollAnchorClass}
        label="Problem"
        afterRule={
          <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
            <div className="col-span-12 md:col-span-5">
              <h3 className="m-0 text-sm font-normal leading-snug text-fg md:text-base">
                The existing screens asked them to:
              </h3>
              <ul className="mb-0 mt-4 list-disc space-y-2 pl-[1.15rem] text-xs leading-[1.55] text-fg md:mt-5 md:space-y-2.5 md:pl-5 md:text-sm md:leading-relaxed">
                {PROBLEM_EXISTING_SCREEN_ASKS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 md:col-span-7">
              <h3 className="m-0 text-sm font-normal leading-snug text-fg md:text-base">
                That created three major problems:
              </h3>
              <div className="mt-4 flex flex-col gap-4 md:mt-5 md:gap-5">
                {PROBLEM_MAJOR_ISSUES.map((item) => (
                  <ChamferFrame
                    key={item.title}
                    className="w-full"
                    innerClassName="flex flex-col bg-surface/20 p-5 text-left md:p-6"
                  >
                    <p className="m-0 text-base font-normal leading-snug text-fg md:text-lg">
                      {item.title}
                    </p>
                    <p className="mb-0 mt-2 text-xs leading-relaxed text-fg-muted md:mt-3 md:text-sm">
                      {item.body}
                    </p>
                  </ChamferFrame>
                ))}
              </div>
            </div>
          </FigmaGrid12>
        }
      >
        <>
          <p className="m-0 text-balance">Millions of people want to take climate action.</p>
          <p className="m-0 text-balance">
            But wanting to help and knowing what to do are very different things.
          </p>
        </>
      </ProblemStatementFrame>

      <ChamferFrame
        className="chamfer-media-border w-full"
        innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
      >
        <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
          <button
            type="button"
            role="switch"
            aria-checked={seeWhereUsersStruggled}
            aria-labelledby="struggle-toggle-label"
            onClick={() => setSeeWhereUsersStruggled((v) => !v)}
            className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
              seeWhereUsersStruggled
                ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_rgba(0,0,0,0.12)]'
                : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.35)]'
            }`}
          >
            <span
              className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                seeWhereUsersStruggled
                  ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                  : 'left-1 bg-white'
              }`}
              aria-hidden
            />
          </button>
          <span
            id="struggle-toggle-label"
            className="font-mono text-sm font-normal leading-none text-fg md:text-base"
          >
            See where users struggled
          </span>
        </div>
        <div className="relative isolate w-full">
          <img
            src={carbonProblemProductSurface}
            alt="Carbon Neutral Club — problem and product surface context"
            decoding="async"
            className={`relative z-0 block h-auto w-full max-w-full align-middle transition-opacity duration-100 ease-out motion-reduce:transition-none ${
              seeWhereUsersStruggled ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <img
            src={carbonProblemProductSurfaceStruggles}
            alt="Carbon Neutral Club — where users struggled (annotated)"
            decoding="async"
            className={`pointer-events-none absolute left-0 top-0 z-10 block h-auto w-full max-w-full align-middle transition-opacity duration-100 ease-out motion-reduce:transition-none ${
              seeWhereUsersStruggled ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </ChamferFrame>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="user-test-findings"
        aria-labelledby="what-we-learned-title"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start">
          <div className="col-span-12 flex flex-col gap-6 md:col-span-6 md:gap-8">
            <h2
              id="what-we-learned-title"
              className="m-0 text-[24px] font-normal leading-snug text-fg"
            >
              What we learned
            </h2>
          <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
            <p>User testing made the shape of the problem clear.</p>
            <p>The users were not rejecting climate action.</p>
            <p>They were unsure how to evaluate what they were seeing.</p>
            <p>The strongest pattern was this:</p>
            <p className="relative mt-4 pl-4 before:absolute before:left-0 before:text-fg before:content-['•']">
              Users were willing to complete the flow, but they needed more context and trust before
              paying.
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <ChamferFrame
            className="chamfer-media-border w-full"
            innerClassName="flex flex-col gap-4 bg-surface/20 p-5 text-left font-mono text-fg md:gap-5 md:p-6"
          >
            <p className="m-0 text-[22px] font-normal leading-snug">We saw:</p>
            <ul className="m-0 list-none space-y-3 p-0 text-[16px] font-normal leading-relaxed md:space-y-3.5">
              {WHAT_WE_SAW_ITEMS.map((line) => (
                <li
                  key={line}
                  className="relative pl-4 before:absolute before:left-0 before:text-fg before:content-['•']"
                >
                  {line}
                </li>
              ))}
            </ul>
          </ChamferFrame>
        </div>
        </FigmaGrid12>

        <ChamferFrame
          className="chamfer-media-border mt-[32px] w-full"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <img
            src={carbonWhatWeLearnedC5}
            alt="Carbon Neutral Club — supporting detail for what we learned in research"
            decoding="async"
            className="block h-auto w-full max-w-full align-middle"
          />
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="user-vs-business-needs"
        aria-labelledby="user-business-needs-title"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <h2
            id="user-business-needs-title"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            User needs vs Business needs
          </h2>
          <p className="col-span-12 mb-2 mt-2 font-mono text-sm font-normal leading-relaxed text-fg md:mb-3 md:mt-3 md:text-base">
            This flow sat between multiple competing goals:
          </p>
          <div className="col-span-12 flex flex-col gap-4 md:gap-5">
            {USER_VS_BUSINESS_TRADEOFFS.map((row) => (
              <ChamferFrame
                key={row.label}
                className="chamfer-tradeoff-outline w-full"
                innerClassName="grid min-w-0 grid-cols-1 gap-3 bg-transparent px-4 py-3.5 md:grid-cols-[17rem_minmax(2.5rem,0.38fr)_minmax(0,1fr)] md:items-center md:gap-x-5 md:gap-y-0 md:px-5 md:py-4"
              >
                <p className="m-0 min-w-0 w-full text-left font-mono text-sm font-normal leading-snug text-fg md:text-base">
                  {row.label}
                </p>
                <div className="flex min-h-0 min-w-0 w-full items-center">{tradeRowConnector}</div>
                <p className="m-0 min-w-0 w-full text-left font-mono text-xs font-normal leading-relaxed text-fg md:w-auto md:text-sm">
                  {row.body}
                </p>
              </ChamferFrame>
            ))}
          </div>
          <div className="col-span-12 mt-10 font-mono text-sm font-normal leading-relaxed text-fg md:mt-12 md:text-base">
            <p className="m-0">
              The solution could not optimize one at the expense of everything else.
            </p>
            <p className="mb-0 mt-3 md:mt-4">It needed balance.</p>
          </div>
        </FigmaGrid12>

        <ChamferFrame
          className="chamfer-media-border mt-10 w-full md:mt-12"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <img
            src={carbonUserBusinessVennC6}
            alt="Diagram: user needs and business needs overlapping at the solution — clarity, transparency, education, speed, simplicity, and conversion"
            decoding="async"
            className="block h-auto w-full max-w-full align-middle"
          />
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="system-we-designed"
        aria-labelledby="flow-system-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <h2
            id="flow-system-heading"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug text-fg"
          >
            The System We Designed
          </h2>
          <div className="col-span-12 -mx-1 w-full min-w-0 overflow-x-auto px-1 pb-1 md:overflow-visible md:pb-0">
            <TimelinePillsRow
              stepLabels={SYSTEM_DESIGNED_FLOW_PILLS}
              ariaLabelledBy="flow-system-heading"
            />
          </div>
          <p className="col-span-12 mt-6 font-mono text-sm font-normal leading-relaxed text-fg md:mt-8 md:text-base">
            We restructured the experience into four distinct stages, each answering a different
            question:
          </p>
          <div className="col-span-12 mt-8 grid grid-cols-1 gap-4 font-mono md:grid-cols-2 md:gap-5">
            {SYSTEM_DESIGNED_STAGES.map((stage) => (
              <ChamferFrame
                key={stage.step}
                className="chamfer-tradeoff-outline w-full"
                innerClassName="flex gap-4 bg-transparent p-5 md:gap-5 md:p-6"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-[0.5px] border-solid border-[#414141] text-sm font-normal tabular-nums text-fg md:size-10 md:text-base">
                  {stage.step}
                </span>
                <div className="min-w-0">
                  <p className="m-0 text-sm font-medium text-fg md:text-base">{stage.title}</p>
                  <p className="mb-0 mt-2 text-xs leading-relaxed text-fg-muted md:text-sm">
                    {stage.question}
                  </p>
                </div>
              </ChamferFrame>
            ))}
          </div>
          <div className="col-span-12 mt-8 font-mono text-sm font-normal leading-relaxed text-fg md:mt-10 md:text-base">
            <p className="m-0">This structure gave the journey rhythm and purpose.</p>
            <p className="mb-0 mt-3 md:mt-4">
              Instead of asking the user to decide too early, the system gradually built
              understanding.
            </p>
          </div>
        </FigmaGrid12>

        <ChamferFrame
          className="chamfer-media-border mt-8 w-full md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <img
            src={carbonSystemDesignedC7}
            alt="Carbon Neutral Club — visual for the four-stage system: calculator, result, plan, and checkout"
            decoding="async"
            className="block h-auto w-full max-w-full align-middle"
          />
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="design-principles"
        aria-labelledby="design-principles-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <div className="col-span-12 flex flex-col gap-[16px]">
            <h2
              id="design-principles-heading"
              className="m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
            >
              Design principles
            </h2>
            <p className="m-0 font-mono text-sm font-normal leading-relaxed text-fg md:text-base">
              We anchored the redesign around four principles:
            </p>
          </div>
          <div className="col-span-12 grid grid-cols-1 items-start gap-4 font-mono md:grid-cols-2 md:gap-5">
            {DESIGN_PRINCIPLES.map((principle) => (
              <ChamferFrame
                key={principle.title}
                fitContentHeight
                className="chamfer-tradeoff-outline figma-frame-static w-full self-start"
                innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-elevated/25"
              >
                <div className="px-4 pb-0 pt-4 md:px-5 md:pt-5">
                  <h3 className="m-0 text-[16px] font-medium leading-snug text-fg">
                    {principle.title}
                  </h3>
                  <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 text-[12px] leading-relaxed text-fg-muted marker:text-fg-subtle md:mt-4">
                    {principle.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 w-full shrink-0 leading-[0] md:mt-5">
                  <img
                    src={principle.visual}
                    alt={principle.visualAlt}
                    decoding="async"
                    loading="lazy"
                    className="block h-auto w-full max-w-full"
                  />
                </div>
              </ChamferFrame>
            ))}
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="the-calculator"
        aria-labelledby="the-calculator-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <h2
            id="the-calculator-heading"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            The Calculator
          </h2>
          <div className="col-span-12 mt-[var(--figma-gutter)] grid grid-cols-1 gap-[var(--figma-gutter)] font-mono text-sm font-normal leading-relaxed text-fg md:grid-cols-3 md:text-base">
            {CALCULATOR_INTRO_COLUMNS.map((col, i) => (
              <div key={i} className="min-w-0">
                {col.body}
              </div>
            ))}
          </div>
        </FigmaGrid12>

        <ChamferFrame
          className="chamfer-media-border mt-[var(--figma-gutter)] w-full"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={showCalculatorWhyWorks}
              aria-labelledby="calculator-why-toggle-label"
              onClick={() => setShowCalculatorWhyWorks((v) => !v)}
              className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
                showCalculatorWhyWorks
                  ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_rgba(0,0,0,0.12)]'
                  : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.35)]'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                  showCalculatorWhyWorks
                    ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                    : 'left-1 bg-white'
                }`}
                aria-hidden
              />
            </button>
            <span
              id="calculator-why-toggle-label"
              className="font-mono text-sm font-normal leading-none text-fg md:text-base"
            >
              Show why this works
            </span>
          </div>
          <div className="relative isolate w-full">
            <img
              src={carbonCalculatorMockup}
              alt="Carbon Neutral Club calculator landing: estimate footprint hero, stepper, and laptop mockup"
              decoding="async"
              className={`relative z-0 block h-auto w-full max-w-full align-middle transition-opacity duration-100 ease-out motion-reduce:transition-none ${
                showCalculatorWhyWorks ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={carbonCalculatorWhyMockup}
              alt="Carbon Neutral Club calculator — rationale for progressive steps and flow structure"
              decoding="async"
              className={`pointer-events-none absolute left-0 top-0 z-10 block h-auto w-full max-w-full align-middle transition-opacity duration-100 ease-out motion-reduce:transition-none ${
                showCalculatorWhyWorks ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </ChamferFrame>
      </section>

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
            Design
          </h2>
          <p className="col-span-12 max-w-3xl text-sm leading-relaxed text-fg-muted md:text-base">
            The system prioritized expectations up front, structured clarity over dumps of copy, and
            transparency at decision points — especially where money moved at checkout.
          </p>
        </FigmaGrid12>
        <FigmaGrid12 className="mt-10 md:mt-[var(--figma-gutter)]">
          <div className="col-span-12 md:order-1 md:col-span-7">
            <PlaceholderVisual
              className="min-h-[min(72vw,340px)] md:min-h-[431px]"
              label="Results screen + plan selection with offset tiers"
            />
          </div>
          <div className="col-span-12 max-w-none text-sm leading-relaxed text-fg md:order-2 md:col-span-5 md:text-base">
            <p className="font-medium text-fg">Results &amp; plan</p>
            <p className="mt-4 text-fg-muted">
              Footprint with comparison to average so the number landed, then tiered offset depth tied
              to commitment.
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
              Users weren&apos;t confused by climate action. They were confused by what their number
              meant and whether it was worth paying for.
            </p>
          </div>
        </FigmaGrid12>
      </div>

      <div className="figma-rule my-[32px]" aria-hidden />

      <ComparisonShowcase
        title="Business model shift"
        titleId="components-comparison"
        titleAlign="center"
        bullets={[
          'Individual checkout → company-funded membership',
          'New pricing and onboarding paths',
          'Product value reframed around workforce benefit',
        ]}
        before={
          <PlaceholderVisual
            className="min-h-[200px] md:min-h-[220px]"
            label="B2C: user calculates, selects plan, pays individually"
          />
        }
        after={
          <PlaceholderVisual
            className="min-h-[200px] md:min-h-[220px]"
            label="B2B2C: employer covers cost; employees still complete core flow"
          />
        }
        caption="Toggle before/after: same calculator experience, different funding model and go-to-market."
      />

      <div className="figma-rule my-[32px]" aria-hidden />

      <FigmaGrid12 aria-labelledby="feature-pair">
        <h2
          id="feature-pair"
          className={`col-span-12 text-base font-normal text-fg md:text-lg ${caseStudyScrollAnchorClass}`}
        >
          Research &amp; checkout
        </h2>
        <div className="col-span-12 flex flex-col gap-4 md:col-span-6">
          <PlaceholderVisual
            className="min-h-[280px] md:min-h-[340px]"
            label="Research themes — footprint value, pay hesitation"
          />
          <p className="text-xs leading-relaxed text-fg-muted md:text-sm">
            People engaged deeply with understanding their footprint but hesitated at pay — we
            doubled down on pricing transparency and the “why this number” story.
          </p>
        </div>
        <div className="col-span-12 flex flex-col gap-4 md:col-span-6">
          <PlaceholderVisual
            className="min-h-[280px] md:min-h-[340px]"
            label="Checkout UI with breakdown and trust cues"
          />
          <p className="text-xs leading-relaxed text-fg-muted md:text-sm">
            Checkout spelled allocation and pricing so the last step felt fair — the same surface
            later informed B2B2C pricing experiments.
          </p>
        </div>
      </FigmaGrid12>

      <div className="figma-rule my-[32px]" aria-hidden />

      <FigmaGrid12 aria-labelledby="decision-grid-title">
        <h2
          id="decision-grid-title"
          className={`col-span-12 text-base font-normal text-fg md:text-lg ${caseStudyScrollAnchorClass}`}
        >
          Key decisions
        </h2>
        <ChamferFrame className="col-span-12 md:col-span-4" innerClassName="flex flex-col bg-elevated/15">
          <div className="flex min-h-[140px] items-center justify-center bg-surface/50 p-4 md:min-h-[160px]">
            <p className="text-center text-[11px] leading-relaxed text-fg-muted">
              Employer-funded pilot: same calculator, $0 employee contribution — validated B2B2C
              demand.
            </p>
          </div>
          <div className="border-t border-cell-border/60 p-4">
            <h3 className="text-sm font-medium text-fg">B2B2C pilot</h3>
            <p className="mt-2 text-xs leading-relaxed text-fg-muted">
              Companies wanted offsets as a benefit, not only individual pay.
            </p>
          </div>
        </ChamferFrame>
        <ChamferFrame className="col-span-12 md:col-span-4" innerClassName="flex flex-col bg-elevated/15">
          <div className="flex min-h-[140px] items-center justify-center bg-surface/50 p-4 md:min-h-[160px]">
            <p className="text-center text-[11px] leading-relaxed text-fg-muted">
              Kept explicit steps instead of collapsing the journey — trust beat faux simplicity.
            </p>
          </div>
          <div className="border-t border-cell-border/60 p-4">
            <h3 className="text-sm font-medium text-fg">Flow depth</h3>
            <p className="mt-2 text-xs leading-relaxed text-fg-muted">
              Fewer “what am I buying?” moments at checkout after iteration.
            </p>
          </div>
        </ChamferFrame>
        <ChamferFrame className="col-span-12 md:col-span-4" innerClassName="flex flex-col bg-elevated/15">
          <div className="flex min-h-[140px] items-center justify-center bg-surface/50 p-4 md:min-h-[160px]">
            <p className="text-center text-[11px] leading-relaxed text-fg-muted">
              Checkout became the experiment surface for pricing and packaging — product + GTM
              aligned.
            </p>
          </div>
          <div className="border-t border-cell-border/60 p-4">
            <h3 className="text-sm font-medium text-fg">Checkout as lab</h3>
            <p className="mt-2 text-xs leading-relaxed text-fg-muted">
              Informed membership pricing and employer onboarding.
            </p>
          </div>
        </ChamferFrame>
      </FigmaGrid12>

      <div className="figma-rule my-[32px]" aria-hidden />

      <KPISection
        title="Impact"
        headingId="components-kpi"
        metrics={[
          {
            value: 'High',
            label: 'Calculator engagement',
            description: 'Majority entered the flow',
          },
          {
            value: '↓',
            label: 'Structured drop-off',
            description: 'Clearer funnel after iteration',
          },
          {
            value: '1000+',
            label: 'Members (year one)',
            description: 'Including company-funded paths',
          },
          {
            value: 'B2B2C',
            label: 'Model expansion',
            description: 'Checkout informed pricing strategy',
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
            More steps bought clarity; slower flow bought trust; more explanation supported better
            decisions. In complex domains, legibility beats faux simplicity — and a well instrumented
            flow can steer business strategy, not only UX.
          </p>
          <ChamferFrame
            className="mx-auto mt-12 w-full max-w-full"
            innerClassName="flex min-h-[185px] items-center justify-center bg-surface/30 px-4"
          >
            <span className="text-center text-[11px] text-fg-subtle">
              Outcome diagram / funnel (replace with final asset)
            </span>
          </ChamferFrame>
        </ChamferFrame>
      </FigmaGrid12>

      <div className="figma-rule my-[32px]" aria-hidden />
      <ExperimentalCaseStudiesPanel layout="footer" />
    </CaseStudyShowcaseScaffold>
  )
}
