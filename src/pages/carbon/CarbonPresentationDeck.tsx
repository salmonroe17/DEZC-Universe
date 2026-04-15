import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import carbonHeroC1 from '../../../CNC photos/c1.png'
import carbonOverviewC2 from '../../../CNC photos/c2.png'
import carbonOverviewC3 from '../../../CNC photos/c3.png'
import carbonProblemProductSurface from '../../../CNC photos/c4.png'
import carbonProblemProductSurfaceStruggles from '../../../CNC photos/c4.1.png'
import carbonWhatWeLearnedC5 from '../../../CNC photos/c5.png'
import carbonUserBusinessVennC6 from '../../../CNC photos/c6.png'
import carbonSystemDesignedC7 from '../../../CNC photos/c7.png'
import carbonPrincipleC8 from '../../../CNC photos/c8.png'
import carbonPrincipleC9 from '../../../CNC photos/c9.png'
import carbonPrincipleC10 from '../../../CNC photos/c10.png'
import carbonPrincipleC11 from '../../../CNC photos/c11.png'
import carbonCalculatorMockup from '../../../CNC photos/c12.png'
import carbonCalculatorWhyMockup from '../../../CNC photos/c12.1.png'
import carbonCalculatorC13 from '../../../CNC photos/c13.png'
import carbonCalculatorC13Alt from '../../../CNC photos/c13.1.png'
import carbonResultMeaningfulC14 from '../../../CNC photos/c14.png'
import carbonResultMeaningfulC14Alt from '../../../CNC photos/c14.1.png'
import carbonPricingPlanC15 from '../../../CNC photos/c15.png'
import carbonPricingPlanC15Alt from '../../../CNC photos/c15.1.png'
import carbonTrustOffsetProjectsC16 from '../../../CNC photos/c16.png'
import carbonTrustOffsetProjectsC16Alt from '../../../CNC photos/c16.1.png'
import carbonCostBreakdownC17 from '../../../CNC photos/c17.png'
import carbonCostBreakdownC17Alt from '../../../CNC photos/c17.1.png'
import carbonCheckoutTrustC18 from '../../../CNC photos/c18.png'
import carbonTurningPointC19 from '../../../CNC photos/c19.png'
import carbonPlanPageB2BC20 from '../../../CNC photos/c20.png'
import carbonPlanPageB2CC20_1 from '../../../CNC photos/c20.1.png'
import carbonPrototypeVideo from '../../../CNC photos/cnc video portfolio prototype 720p30.mp4'
import mindExplosionGif from '../../../CNC photos/mindexplosion.gif'
import {
  KpiAnimatedValue,
  ProblemStatementGlitchFramedBlock,
  TimelinePillsRow,
  caseStudyScrollAnchorClass,
} from '../../components/caseStudy/patterns'
import type { CaseStudyPresentationSlide } from '../../components/caseStudy/CaseStudyPresentationOverlay'
import { ChamferFrame } from '../../components/system/ChamferFrame'
import { FigmaGrid12 } from '../../components/system/FigmaGrid'
import {
  RotatingGradientCircle,
  RotatingGradientCircleDotPlaceholder,
} from '../../components/system/RotatingGradientCircle'

const chamferAnnotationToggleLabelOff = 'Show why this works'
const chamferAnnotationToggleLabelOn = 'Hide annotations'

const chamferToggleStackSpacerClass =
  'block h-auto w-full max-w-full select-none pointer-events-none opacity-0'

const chamferToggleStackLayerClass =
  'pointer-events-none absolute inset-0 h-full w-full max-w-full object-contain object-left object-top align-middle'

const IMPACT_KPI_ROWS: { value: string; body: string; target?: string }[] = [
  {
    value: '85%',
    body: 'of people enter their email to start the calculator, with 15% dropping off before starting',
    target: 'Target start rate was 60%',
  },
  {
    value: '95%',
    body: 'of people who start the calculator finish it',
    target: 'Target completion rate was 70%',
  },
  {
    value: '3–4%',
    body: 'of people complete checkout for B2C',
    target: 'Target checkout rate was 3%',
  },
  {
    value: '97%',
    body: 'of people complete checkout for B2B',
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

const RESULT_MEANINGFUL_INTRO_COLUMNS: { body: ReactNode }[] = [
  {
    body: (
      <>
        <p className="m-0">
          A raw footprint number is not enough. Without context, users don&apos;t know:
        </p>
        <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 marker:text-fg-subtle">
          <li>If their score is high or low</li>
          <li>How it compares to others</li>
          <li>What it should mean for their decision</li>
        </ul>
      </>
    ),
  },
  {
    body: (
      <>
        <p className="m-0">We redesigned the result layer to make the number interpretable through:</p>
        <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 marker:text-fg-subtle">
          <li>Comparison</li>
          <li>Category breakdown</li>
          <li>Contextual framing</li>
        </ul>
      </>
    ),
  },
  {
    body: 'This was one of the most important trust-building moments in the flow.',
  },
]

const PRICING_PLAN_INTRO_COLUMNS: { body: ReactNode }[] = [
  {
    body: (
      <>
        <p className="m-0">Plan selection needed to do two jobs at once:</p>
        <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 marker:text-fg-subtle">
          <li>Help users understand their options</li>
          <li>Make the connection between impact and price feel logical</li>
        </ul>
      </>
    ),
  },
  {
    body: (
      <>
        <p className="m-0">We introduced a limited, clear set of tiers:</p>
        <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 marker:text-fg-subtle">
          <li>50%</li>
          <li>100%</li>
          <li>200%</li>
        </ul>
      </>
    ),
  },
  {
    body: (
      <>
        <p className="m-0">
          That gave users flexibility without overwhelming them. It also made the value proposition
          easier to explain:
        </p>
        <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 marker:text-fg-subtle">
          <li>Different levels of offset, tied to the same underlying footprint</li>
        </ul>
      </>
    ),
  },
]

const PRICING_TRUST_OFFSET_INTRO_COLUMNS: { body: ReactNode }[] = [
  {
    body: (
      <p className="m-0">
        We gave people a nudge of trust and transparency so they always knew the exact next step.
      </p>
    ),
  },
  {
    body: (
      <>
        <p className="m-0">Sections we implemented for trust &amp; transparency:</p>
        <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 marker:text-fg-subtle">
          <li>How the business works</li>
          <li>Membership rewards and savings</li>
          <li>Testimonials</li>
          <li>Cost breakdowns</li>
        </ul>
      </>
    ),
  },
]

const CHECKOUT_TRUST_INTRO_COLUMNS: { body: ReactNode }[] = [
  {
    body: 'Checkout was the moment where uncertainty became commitment — the step where intent turned into payment.',
  },
  {
    body: 'Users needed to understand what each line item represented before they felt confident completing checkout. We surfaced offset, membership, processing, taxes, and discounts as separate, legible rows.',
  },
  {
    body: 'Express pay options and card fields sat next to a persistent order summary so the full price story stayed visible through the last tap.',
  },
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

const WHAT_THIS_CHANGED_BULLETS = [
  'Who the product was really for',
  'How onboarding worked',
  'How value was framed',
  'How the system needed to support different user states',
] as const

const FINAL_EXPERIENCE_BULLETS = [
  'Define impact',
  'Explain the number',
  'Choose a level of action',
  'Complete the experience with confidence',
] as const

const deckTradeRowConnector = (
  <span className="relative flex w-full min-w-[2rem] max-w-full items-center md:min-h-[1.25em]" aria-hidden>
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

function CarbonDeckPrototypeAutoplayVideo({ src }: { src: string }) {
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

export function CarbonDeckCrossfadeChamfer({
  baseSrc,
  baseAlt,
  altSrc,
  altAlt,
}: {
  baseSrc: string
  baseAlt: string
  altSrc: string
  altAlt: string
}) {
  const labelId = useId()
  const [showAlt, setShowAlt] = useState(false)
  return (
    <ChamferFrame
      className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
      innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
    >
      <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
        <button
          type="button"
          role="switch"
          aria-checked={showAlt}
          aria-labelledby={labelId}
          onClick={() => setShowAlt((v) => !v)}
          className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
            showAlt
              ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_rgba(0,0,0,0.12)]'
              : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.35)]'
          }`}
        >
          <span
            className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
              showAlt ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg' : 'left-1 bg-white'
            }`}
            aria-hidden
          />
        </button>
        <span id={labelId} className="font-mono text-sm font-normal leading-none text-fg md:text-base">
          {showAlt ? chamferAnnotationToggleLabelOn : chamferAnnotationToggleLabelOff}
        </span>
      </div>
      <div className="relative isolate w-full">
        <img
          src={baseSrc}
          alt=""
          aria-hidden
          decoding="async"
          loading="eager"
          className={chamferToggleStackSpacerClass}
        />
        <img
          src={baseSrc}
          alt={baseAlt}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className={`${chamferToggleStackLayerClass} z-0 ${showAlt ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src={altSrc}
          alt={altAlt}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className={`${chamferToggleStackLayerClass} z-10 ${showAlt ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </ChamferFrame>
  )
}

export function CarbonDeckPlanB2B2CChamfer() {
  const uid = useId().replace(/:/g, '')
  const tabB2bId = `deck-plan-b2b-${uid}`
  const tabB2cId = `deck-plan-b2c-${uid}`
  const panelId = `deck-plan-panel-${uid}`
  const [planIsB2C, setPlanIsB2C] = useState(false)
  return (
    <ChamferFrame
      className="chamfer-media-border mx-auto w-full min-w-0 max-w-[min(100%,1156px)]"
      innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
    >
      <div className="flex w-full shrink-0 border-b border-fg/[0.12] bg-surface" role="tablist" aria-label="Plan page version">
        <button
          type="button"
          role="tab"
          id={tabB2bId}
          aria-selected={!planIsB2C}
          aria-controls={panelId}
          tabIndex={planIsB2C ? -1 : 0}
          onClick={() => setPlanIsB2C(false)}
          className={`min-h-[44px] flex-1 px-4 py-3 text-center font-mono text-[12px] font-normal leading-snug transition-[background-color,color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fg/55 md:text-[13px] ${
            !planIsB2C
              ? 'bg-fg text-bg'
              : 'text-fg/75 hover:bg-fg/[0.06] hover:text-fg active:bg-fg/[0.1]'
          }`}
        >
          B2B Plan page
        </button>
        <button
          type="button"
          role="tab"
          id={tabB2cId}
          aria-selected={planIsB2C}
          aria-controls={panelId}
          tabIndex={!planIsB2C ? -1 : 0}
          onClick={() => setPlanIsB2C(true)}
          className={`min-h-[44px] flex-1 px-4 py-3 text-center font-mono text-[12px] font-normal leading-snug transition-[background-color,color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fg/55 md:text-[13px] ${
            planIsB2C
              ? 'bg-fg text-bg'
              : 'text-fg/75 hover:bg-fg/[0.06] hover:text-fg active:bg-fg/[0.1]'
          }`}
        >
          B2C Plan page
        </button>
      </div>
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={planIsB2C ? tabB2cId : tabB2bId}
        className="relative isolate w-full bg-[#f9f6f0]"
      >
        <img
          src={carbonPlanPageB2BC20}
          alt=""
          aria-hidden
          decoding="async"
          loading="lazy"
          className={chamferToggleStackSpacerClass}
        />
        <img
          src={carbonPlanPageB2BC20}
          alt="Carbon Neutral Club — B2B plan selection: employer-funded offset, Select your plan with free tier and sub-total at zero."
          decoding="async"
          loading="lazy"
          className={`${chamferToggleStackLayerClass} z-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            planIsB2C ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <img
          src={carbonPlanPageB2CC20_1}
          alt="Carbon Neutral Club — B2C plan flow: choose a plan, cost breakdown, savings, and long-form checkout context."
          decoding="async"
          loading="lazy"
          className={`${chamferToggleStackLayerClass} z-10 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            planIsB2C ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </ChamferFrame>
  )
}

const deckMaxW = 'mx-auto w-full max-w-[min(100%,1156px)]'

export const CARBON_PRESENTATION_MEDIA_TO_SLIDE: readonly number[] = [
  0, 2, 3, 5, 8, 10, 11, 13, 15, 17, 18, 19, 20, 22, 23, 25, 27, 29, 30, 32, 34, 35, 37,
]

const CARBON_PRESENTATION_SLIDES_BASE = [
  {
    content: (
      <ChamferFrame className={`chamfer-media-border ${deckMaxW}`} innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0">
        <img src={carbonHeroC1} alt="Carbon Neutral Club — hero" decoding="async" className="block h-auto w-full max-w-full align-middle" />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <div
        data-presentation-split-root
        className={`flex ${deckMaxW} min-w-0 flex-col items-stretch gap-8 md:gap-10 lg:flex-row lg:items-center lg:gap-x-6 lg:gap-y-0 xl:gap-x-8`}
      >
        <h1
          data-presentation-text-region
          className="min-w-0 flex-1 text-left text-[40px] font-normal leading-[1.12] tracking-[-0.03em] text-fg"
        >
          Redesigning the carbon footprint to checkout flow that shifted the product from direct-to-consumer to company-funded memberships.
        </h1>
        <div data-presentation-media-region className="shrink-0 self-center lg:ml-auto">
          <RotatingGradientCircle
            className="aspect-square w-[min(52vw,11rem)] shrink-0 md:w-[min(42vw,15rem)] lg:w-[min(34vw,17.5rem)]"
            innerClassName="bg-bg"
            aria-hidden
          >
            <RotatingGradientCircleDotPlaceholder />
          </RotatingGradientCircle>
        </div>
      </div>
    ),
  },
  {
    content: (
      <ChamferFrame className={`chamfer-media-border ${deckMaxW}`} innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0">
        <CarbonDeckPrototypeAutoplayVideo src={carbonPrototypeVideo} />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <ChamferFrame className={`chamfer-media-border ${deckMaxW}`} innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0">
        <img src={carbonOverviewC2} alt="Carbon Neutral Club case study — supporting visual 1" decoding="async" className="block h-auto w-full max-w-full align-middle" />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
        <h2 className="col-span-12 text-[24px] font-normal leading-snug tracking-[-0.02em] text-fg">Overview</h2>
        <div className="col-span-12 md:col-span-4">
          <h3 className="text-sm font-normal leading-none text-fg md:text-base">What does the company do?</h3>
          <ChamferFrame className="mt-4 w-full md:mt-5" innerClassName="p-5 text-xs leading-[1.55] text-fg md:p-6 md:text-sm md:leading-relaxed">
            <p className="m-0">
              Carbon Neutral Club helps users understand and offset their carbon footprint through a paid membership.
            </p>
            <p className="mb-0 mt-4 md:mt-5">What started as a conversion and clarity problem became something much bigger:</p>
            <p className="mb-0 mt-4 md:mt-5">
              The flow revealed a better business model, and helped shift the company from individual purchase → employer-funded memberships.
            </p>
          </ChamferFrame>
        </div>
        <div className="col-span-12 md:col-span-4">
          <h3 className="text-sm font-normal leading-none text-fg md:text-base">What I did</h3>
          <ChamferFrame className="mt-4 w-full md:mt-5" innerClassName="p-5 text-xs leading-[1.55] text-fg md:p-6 md:text-sm md:leading-relaxed">
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
          <ChamferFrame className="mt-4 w-full md:mt-5" innerClassName="p-5 text-xs leading-[1.55] text-fg md:p-6 md:text-sm md:leading-relaxed">
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
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <ChamferFrame className={`chamfer-media-border ${deckMaxW}`} innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0">
        <img src={carbonOverviewC3} alt="Carbon Neutral Club case study — supporting visual 2" decoding="async" className="block h-auto w-full max-w-full align-middle" />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <>
        <p className="m-0 text-balance text-[24px] font-normal leading-snug text-fg">Millions of people want to take climate action.</p>
        <p className="m-0 mt-4 text-balance text-[24px] font-normal leading-snug text-fg">
          But wanting to help and knowing what to do are very different things.
        </p>
      </>
    ),
  },
  {
    content: (
      <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
        <div className="col-span-12 md:col-span-5">
          <h3 className="m-0 text-sm font-normal leading-snug text-fg md:text-base">The existing screens asked them to:</h3>
          <ul className="mb-0 mt-4 list-disc space-y-2 pl-[1.15rem] text-xs leading-[1.55] text-fg md:mt-5 md:space-y-2.5 md:pl-5 md:text-sm md:leading-relaxed">
            {PROBLEM_EXISTING_SCREEN_ASKS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 md:col-span-7">
          <h3 className="m-0 text-sm font-normal leading-snug text-fg md:text-base">That created three major problems:</h3>
          <div className="mt-4 flex flex-col gap-4 md:mt-5 md:gap-5">
            {PROBLEM_MAJOR_ISSUES.map((item) => (
              <ChamferFrame key={item.title} className="w-full" innerClassName="flex flex-col bg-surface/20 p-5 text-left md:p-6">
                <p className="m-0 text-base font-normal leading-snug text-fg md:text-lg">{item.title}</p>
                <p className="mb-0 mt-2 text-xs leading-relaxed text-fg-muted md:mt-3 md:text-sm">{item.body}</p>
              </ChamferFrame>
            ))}
          </div>
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <CarbonDeckCrossfadeChamfer
        baseSrc={carbonProblemProductSurface}
        baseAlt="Carbon Neutral Club — problem and product surface context"
        altSrc={carbonProblemProductSurfaceStruggles}
        altAlt="Carbon Neutral Club — where users struggled (annotated)"
      />
    ),
  },
  {
    content: (
      <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
        <h2 className="m-0 text-[24px] font-normal leading-snug text-fg">What we learned</h2>
        <p className="mt-4">User testing made the shape of the problem clear.</p>
        <p>The users were not rejecting climate action.</p>
        <p>They were unsure how to evaluate what they were seeing.</p>
        <p>The strongest pattern was this:</p>
        <p className="relative mt-4 pl-4 before:absolute before:left-0 before:text-fg before:content-['•']">
          Users were willing to complete the flow, but they needed more context and trust before paying.
        </p>
      </div>
    ),
  },
  {
    content: (
      <ChamferFrame
        fitContentHeight
        className="chamfer-media-border mx-auto w-full max-w-3xl"
        innerClassName="flex flex-col gap-4 bg-surface/20 p-5 text-left font-mono text-fg md:gap-5 md:p-6"
      >
        <p className="m-0 text-[22px] font-normal leading-snug">We saw:</p>
        <ul className="m-0 list-none space-y-3 p-0 text-[16px] font-normal leading-relaxed md:space-y-3.5">
          {WHAT_WE_SAW_ITEMS.map((line) => (
            <li key={line} className="relative pl-4 before:absolute before:left-0 before:text-fg before:content-['•']">
              {line}
            </li>
          ))}
        </ul>
      </ChamferFrame>
    ),
  },
  {
    content: (
      <ChamferFrame className={`chamfer-media-border ${deckMaxW}`} innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0">
        <img
          src={carbonWhatWeLearnedC5}
          alt="Carbon Neutral Club — supporting detail for what we learned in research"
          decoding="async"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <h2 className="col-span-12 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg">User needs vs Business needs</h2>
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
              <p className="m-0 min-w-0 w-full text-left font-mono text-sm font-normal leading-snug text-fg md:text-base">{row.label}</p>
              <div className="flex min-h-0 min-w-0 w-full items-center">{deckTradeRowConnector}</div>
              <p className="m-0 min-w-0 w-full text-left font-mono text-xs font-normal leading-relaxed text-fg md:w-auto md:text-sm">{row.body}</p>
            </ChamferFrame>
          ))}
        </div>
        <div className="col-span-12 mt-10 font-mono text-sm font-normal leading-relaxed text-fg md:mt-12 md:text-base">
          <p className="m-0">The solution could not optimize one at the expense of everything else.</p>
          <p className="mb-0 mt-3 md:mt-4">It needed balance.</p>
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <ChamferFrame className={`chamfer-media-border ${deckMaxW}`} innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0">
        <img
          src={carbonUserBusinessVennC6}
          alt="Diagram: user needs and business needs overlapping at the solution — clarity, transparency, education, speed, simplicity, and conversion"
          decoding="async"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <h2 id="flow-system-heading-deck" className="col-span-12 font-mono text-[24px] font-normal leading-snug text-fg">
          The System We Designed
        </h2>
        <div className="col-span-12 -mx-1 w-full min-w-0 overflow-x-auto px-1 pb-1 md:overflow-visible md:pb-0">
          <TimelinePillsRow stepLabels={SYSTEM_DESIGNED_FLOW_PILLS} ariaLabelledBy="flow-system-heading-deck" />
        </div>
        <p className="col-span-12 mt-6 font-mono text-sm font-normal leading-relaxed text-fg md:mt-8 md:text-base">
          We restructured the experience into four distinct stages, each answering a different question:
        </p>
        <div className="col-span-12 mt-8 grid grid-cols-1 gap-4 font-mono md:grid-cols-2 md:gap-5">
          {SYSTEM_DESIGNED_STAGES.map((stage) => (
            <ChamferFrame key={stage.step} className="chamfer-tradeoff-outline w-full" innerClassName="flex gap-4 bg-transparent p-5 md:gap-5 md:p-6">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-[0.5px] border-solid border-[#414141] text-sm font-normal tabular-nums text-fg md:size-10 md:text-base">
                {stage.step}
              </span>
              <div className="min-w-0">
                <p className="m-0 text-sm font-medium text-fg md:text-base">{stage.title}</p>
                <p className="mb-0 mt-2 text-xs leading-relaxed text-fg-muted md:text-sm">{stage.question}</p>
              </div>
            </ChamferFrame>
          ))}
        </div>
        <div className="col-span-12 mt-8 font-mono text-sm font-normal leading-relaxed text-fg md:mt-10 md:text-base">
          <p className="m-0">This structure gave the journey rhythm and purpose.</p>
          <p className="mb-0 mt-3 md:mt-4">Instead of asking the user to decide too early, the system gradually built understanding.</p>
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <ChamferFrame className={`chamfer-media-border ${deckMaxW}`} innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0">
        <img
          src={carbonSystemDesignedC7}
          alt="Carbon Neutral Club — visual for the four-stage system: calculator, result, plan, and checkout"
          decoding="async"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <div className="col-span-12 flex flex-col gap-[16px]">
          <h2 className="m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg">Design principles</h2>
          <p className="m-0 font-mono text-sm font-normal leading-relaxed text-fg md:text-base">We anchored the redesign around four principles:</p>
        </div>
      </FigmaGrid12>
    ),
  },
  ...DESIGN_PRINCIPLES.map((p) => ({
    content: (
      <ChamferFrame
        fitContentHeight
        className={`chamfer-tradeoff-outline figma-frame-static ${deckMaxW} self-start`}
        innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-elevated/25"
      >
        <div className="px-4 pb-0 pt-4 md:px-5 md:pt-5">
          <h3 className="m-0 text-[16px] font-medium leading-snug text-fg">{p.title}</h3>
          <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 text-[12px] leading-relaxed text-fg-muted marker:text-fg-subtle md:mt-4">
            {p.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 w-full shrink-0 leading-[0] md:mt-5">
          <img src={p.visual} alt={p.visualAlt} decoding="async" loading="lazy" className="block h-auto w-full max-w-full" />
        </div>
      </ChamferFrame>
    ),
  })),
  {
    content: (
      <FigmaGrid12>
        <div className="col-span-12 flex flex-col gap-[16px]">
          <h2 className="m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg">The Calculator</h2>
          <div className="grid grid-cols-1 gap-[var(--figma-gutter)] font-mono text-[12px] font-normal leading-relaxed text-fg md:grid-cols-3 [&_li]:text-[12px] [&_p]:text-[12px]">
            {CALCULATOR_INTRO_COLUMNS.map((col, i) => (
              <div key={i} className="min-w-0">
                {col.body}
              </div>
            ))}
          </div>
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <CarbonDeckCrossfadeChamfer
        baseSrc={carbonCalculatorMockup}
        baseAlt="Carbon Neutral Club calculator landing: estimate footprint hero, stepper, and laptop mockup"
        altSrc={carbonCalculatorWhyMockup}
        altAlt="Carbon Neutral Club calculator — rationale for progressive steps and flow structure"
      />
    ),
  },
  {
    content: (
      <CarbonDeckCrossfadeChamfer
        baseSrc={carbonCalculatorC13}
        baseAlt="Carbon Neutral Club calculator — extended flow or interface detail"
        altSrc={carbonCalculatorC13Alt}
        altAlt="Carbon Neutral Club calculator — alternate or annotated view for the extended flow"
      />
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <div className="col-span-12 flex flex-col gap-[16px]">
          <h2 className="m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg">Making the result meaningful</h2>
          <div className="grid grid-cols-1 gap-[var(--figma-gutter)] font-mono text-[12px] font-normal leading-relaxed text-fg md:grid-cols-3 [&_li]:text-[12px] [&_p]:text-[12px]">
            {RESULT_MEANINGFUL_INTRO_COLUMNS.map((col, i) => (
              <div key={i} className="min-w-0">
                {col.body}
              </div>
            ))}
          </div>
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <CarbonDeckCrossfadeChamfer
        baseSrc={carbonResultMeaningfulC14}
        baseAlt="Carbon Neutral Club footprint result: comparison to national average, range bar, and tonnes per year"
        altSrc={carbonResultMeaningfulC14Alt}
        altAlt="Carbon Neutral Club footprint result — annotated view explaining comparison and framing"
      />
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <div className="col-span-12 flex flex-col gap-[16px]">
          <h2 className="m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg">Pricing & plan design</h2>
          <div className="grid grid-cols-1 gap-[var(--figma-gutter)] font-mono text-[12px] font-normal leading-relaxed text-fg md:grid-cols-3 [&_li]:text-[12px] [&_p]:text-[12px]">
            {PRICING_PLAN_INTRO_COLUMNS.map((col, i) => (
              <div key={i} className="min-w-0">
                {col.body}
              </div>
            ))}
          </div>
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <CarbonDeckCrossfadeChamfer
        baseSrc={carbonPricingPlanC15}
        baseAlt="Carbon Neutral Club plan selection: footprint summary, tier cards, and monthly or yearly pricing"
        altSrc={carbonPricingPlanC15Alt}
        altAlt="Carbon Neutral Club plan selection — annotated view explaining tiers and pricing rationale"
      />
    ),
  },
  {
    content: (
      <FigmaGrid12 className="mt-[var(--figma-gutter)]">
        <div className="col-span-12 grid grid-cols-1 gap-[var(--figma-gutter)] font-mono text-[12px] font-normal leading-relaxed text-fg md:grid-cols-2 [&_li]:text-[12px] [&_p]:text-[12px]">
          {PRICING_TRUST_OFFSET_INTRO_COLUMNS.map((col, i) => (
            <div key={i} className="min-w-0">
              {col.body}
            </div>
          ))}
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <CarbonDeckCrossfadeChamfer
        baseSrc={carbonTrustOffsetProjectsC16}
        baseAlt="Carbon Neutral Club — Want to know more: offset projects tab, project cards, and trust framing"
        altSrc={carbonTrustOffsetProjectsC16Alt}
        altAlt="Carbon Neutral Club offset projects — annotated view for trust and transparency"
      />
    ),
  },
  {
    content: (
      <CarbonDeckCrossfadeChamfer
        baseSrc={carbonCostBreakdownC17}
        baseAlt="Carbon Neutral Club cost breakdown: plan tiers, segmented fees, and monthly total"
        altSrc={carbonCostBreakdownC17Alt}
        altAlt="Carbon Neutral Club cost breakdown — annotated view explaining fees and transparency"
      />
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <div className="col-span-12 flex flex-col gap-[16px]">
          <h2 className="m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg">Checkout transparency</h2>
          <div className="grid grid-cols-1 gap-[var(--figma-gutter)] font-mono text-[12px] font-normal leading-relaxed text-fg md:grid-cols-3 [&_li]:text-[12px] [&_p]:text-[12px]">
            {CHECKOUT_TRUST_INTRO_COLUMNS.map((col, i) => (
              <div key={i} className="min-w-0">
                {col.body}
              </div>
            ))}
          </div>
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <ChamferFrame className={`chamfer-media-border ${deckMaxW}`} innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0">
        <img
          src={carbonCheckoutTrustC18}
          alt="Carbon Neutral Club checkout: order summary with line items, express pay, card form, and pay now"
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <div className="flex flex-col gap-5 md:gap-6">
        <div className="relative flex justify-center">
          <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-cell-border" aria-hidden />
          <h2 className="relative m-0 bg-bg px-4 text-center font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-fg md:text-[11px]">The turning point</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          <div className="flex min-w-0 flex-col gap-3 font-mono text-[12px] font-normal leading-relaxed text-fg">
            <p className="m-0">This is where everything changed.</p>
            <p className="m-0">Originally, the product was B2C:</p>
            <p className="m-0">User → calculate → choose → pay</p>
            <p className="m-0">Then something unexpected happened.</p>
          </div>
          <div className="min-w-0">
            <ProblemStatementGlitchFramedBlock>
              <p className="m-0 text-balance">A CEO wanted to pay for everyone in the company.</p>
            </ProblemStatementGlitchFramedBlock>
          </div>
          <div className="flex min-w-0 flex-col gap-3 font-mono text-[12px] font-normal leading-relaxed text-fg">
            <p className="m-0">Everything changed.</p>
            <p className="m-0">Now:</p>
            <ul className="m-0 list-none space-y-2.5 p-0">
              <li className="relative pl-4 before:absolute before:left-0 before:text-fg before:content-['•']">Employees still calculate their footprint</li>
              <li className="relative pl-4 before:absolute before:left-0 before:text-fg before:content-['•']">Still go through the flow</li>
              <li className="relative pl-4 before:absolute before:left-0 before:text-fg before:content-['•']">But checkout ends at $0.00</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    content: (
      <ChamferFrame className={`chamfer-media-border ${deckMaxW}`} innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0">
        <img
          src={carbonTurningPointC19}
          alt="B2C versus B2B: four-step flow from calculator through checkout with a split at plan selection, and bullet comparison of each flow."
          decoding="async"
          loading="lazy"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <div className="flex flex-col gap-[16px]">
        <h3 className="m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg">What this changed</h3>
        <div className="grid grid-cols-1 gap-8 font-mono text-[12px] font-normal leading-relaxed text-fg md:grid-cols-3 md:gap-6 lg:gap-8">
          <p className="m-0">The shift from B2C to employer-funded memberships changed more than pricing.</p>
          <div className="flex min-w-0 flex-col gap-3">
            <p className="m-0">It changed:</p>
            <ul className="m-0 list-none space-y-2.5 p-0">
              {WHAT_THIS_CHANGED_BULLETS.map((line) => (
                <li key={line} className="relative pl-4 before:absolute before:left-0 before:text-fg before:content-['•']">
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <p className="m-0">A flow that once ended in personal payment now had to support multiple models cleanly.</p>
        </div>
        <CarbonDeckPlanB2B2CChamfer />
      </div>
    ),
  },
  {
    content: (
      <div>
        <h2 className="m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg">Final experience</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 font-mono text-[12px] font-normal leading-relaxed text-fg md:mt-6 md:grid-cols-2 md:gap-10">
          <div className="flex min-w-0 flex-col gap-3">
            <p className="m-0">The final system brought the entire journey together:</p>
            <ul className="m-0 list-none space-y-2.5 p-0">
              {FINAL_EXPERIENCE_BULLETS.map((line) => (
                <li key={line} className="relative pl-4 before:absolute before:left-0 before:text-fg before:content-['•']">
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <p className="m-0 min-w-0">
            Whether the user is paying themselves or being covered by an employer, the system now supports the decision clearly and consistently.
          </p>
        </div>
      </div>
    ),
  },
  {
    content: (
      <ChamferFrame className={`chamfer-media-border ${deckMaxW}`} innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0">
        <CarbonDeckPrototypeAutoplayVideo src={carbonPrototypeVideo} />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <section aria-labelledby="impact-outcomes-heading-deck" className="w-full">
        <FigmaGrid12 className={`md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)] ${deckMaxW}`}>
          <div className="col-span-12 flex flex-col gap-[24px]">
            <h2
              id="impact-outcomes-heading-deck"
              className="m-0 text-left font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
            >
              Impact
            </h2>
            <p className="m-0 max-w-4xl font-mono text-[12px] font-normal leading-relaxed text-fg">
              {
                "The data didn't just show conversion. It proved the experience was intuitive, trusted, and compelling enough to support a scalable business model."
              }
            </p>
          </div>
          {IMPACT_KPI_ROWS.map((row, i) => (
            <div key={`${row.value}-${i}`} className="col-span-12 md:col-span-3">
              <p className="text-4xl font-normal tabular-nums tracking-tight text-fg md:text-[76px] md:leading-none">
                <KpiAnimatedValue value={row.value} />
              </p>
              <p className="mt-3 text-[12px] font-normal leading-relaxed text-fg">{row.body}</p>
              {row.target ? (
                <p className="mt-2 text-[12px] font-normal leading-relaxed text-fg-muted">{row.target}</p>
              ) : null}
            </div>
          ))}
        </FigmaGrid12>

        <div className="mx-auto mt-10 w-full max-w-[min(100%,1156px)] border-t border-dashed border-cell-border md:mt-12" aria-hidden />

        <div className={`mx-auto mt-10 w-full max-w-4xl min-w-0 md:mt-14 ${deckMaxW}`}>
          <ProblemStatementGlitchFramedBlock>
            <>
              <p className="m-0 text-balance">The strongest signal was not just conversion.</p>
              <p className="m-0 text-balance">
                It was that the experience was strong enough to become the foundation for a company-funded model.
              </p>
            </>
          </ProblemStatementGlitchFramedBlock>
        </div>
      </section>
    ),
  },
  {
    content: (
      <FigmaGrid12 aria-labelledby="retro-title-deck" className={deckMaxW}>
        <ChamferFrame
          meteorTrail
          className="col-span-12 md:col-span-8 md:col-start-3"
          innerClassName="px-4 py-12 text-left md:px-6 md:py-16"
        >
          <h2
            id="retro-title-deck"
            className={`text-left text-base font-normal text-fg md:text-[40px] ${caseStudyScrollAnchorClass}`}
          >
            Retrospective
          </h2>
          <div className="mt-8 flex max-w-2xl flex-col gap-6 font-mono text-[12px] font-normal leading-relaxed text-fg">
            <p className="m-0">This project reinforced three things for me:</p>
            <ul className="m-0 list-outside list-disc space-y-3 pl-5 marker:text-fg">
              <li className="pl-1">Clarity builds trust more effectively than simplicity alone</li>
              <li className="pl-1">Checkout is often a product strategy problem, not just a UI problem</li>
              <li className="pl-1">Small experience shifts can reshape an entire business model</li>
            </ul>
            <p className="m-0">The most important part of this work wasn&apos;t just making the flow feel cleaner.</p>
            <p className="m-0">
              It was designing a system that helped users understand enough to act, and that gave the company a better way to grow.
            </p>
          </div>
          <ChamferFrame
            fitContentHeight
            className="chamfer-tradeoff-outline mt-8 w-fit max-w-full shrink-0"
            innerClassName="flex min-h-0 min-w-0 items-center justify-start overflow-hidden bg-bg p-0"
          >
            <img
              src={mindExplosionGif}
              alt=""
              decoding="async"
              loading="lazy"
              className="block h-auto w-24 max-w-[6.5rem] object-contain object-left md:w-28 md:max-w-[7.5rem]"
            />
          </ChamferFrame>
        </ChamferFrame>
      </FigmaGrid12>
    ),
  },
] satisfies CaseStudyPresentationSlide[]

const CARBON_PRESENTATION_IMAGE_INDEX = new Set<number>(CARBON_PRESENTATION_MEDIA_TO_SLIDE)

/** Short labels for presentation thumbnail strip (text slides only). */
const CARBON_PRESENTATION_TEXT_THUMB_LABELS: Record<number, string> = {
  1: 'Intro',
  4: 'Overview',
  6: 'Climate',
  7: 'Problems',
  9: 'Research',
  12: 'Tradeoffs',
  14: 'System',
  16: 'Principles',
  21: 'Calculator',
  24: 'Result',
  26: 'Pricing',
  28: 'Trust',
  31: 'Checkout',
  33: 'Turning point',
  36: 'B2B shift',
  38: 'Impact',
  39: 'Retro',
}

const CARBON_PRESENTATION_VIDEO_SLIDE_INDEX = new Set<number>([2, 37])

export const CARBON_PRESENTATION_SLIDES: CaseStudyPresentationSlide[] = CARBON_PRESENTATION_SLIDES_BASE.map(
  (slide, i) => ({
    ...slide,
    slideKind: CARBON_PRESENTATION_IMAGE_INDEX.has(i) ? ('image' as const) : ('text' as const),
    thumbnailLabel: CARBON_PRESENTATION_TEXT_THUMB_LABELS[i],
    thumbnailIsVideo: CARBON_PRESENTATION_VIDEO_SLIDE_INDEX.has(i),
  }),
)

/** One preview URL per deck slide (same order as {@link CARBON_PRESENTATION_SLIDES}). */
export const CARBON_PRESENTATION_THUMBNAILS = [
  carbonHeroC1,
  carbonHeroC1,
  carbonHeroC1,
  carbonOverviewC2,
  carbonOverviewC2,
  carbonOverviewC3,
  carbonOverviewC3,
  carbonProblemProductSurface,
  carbonProblemProductSurface,
  carbonWhatWeLearnedC5,
  carbonWhatWeLearnedC5,
  carbonWhatWeLearnedC5,
  carbonUserBusinessVennC6,
  carbonUserBusinessVennC6,
  carbonSystemDesignedC7,
  carbonSystemDesignedC7,
  carbonPrincipleC8,
  carbonPrincipleC9,
  carbonPrincipleC10,
  carbonPrincipleC11,
  carbonPrincipleC11,
  carbonCalculatorMockup,
  carbonCalculatorC13,
  carbonResultMeaningfulC14,
  carbonResultMeaningfulC14,
  carbonPricingPlanC15,
  carbonPricingPlanC15,
  carbonTrustOffsetProjectsC16,
  carbonTrustOffsetProjectsC16,
  carbonCostBreakdownC17,
  carbonCostBreakdownC17,
  carbonCheckoutTrustC18,
  carbonCheckoutTrustC18,
  carbonTurningPointC19,
  carbonTurningPointC19,
  carbonPlanPageB2BC20,
  carbonPlanPageB2BC20,
  carbonHeroC1,
  carbonResultMeaningfulC14,
  mindExplosionGif,
] as const
