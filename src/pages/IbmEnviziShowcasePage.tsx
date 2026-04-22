import { useEffect, useRef, useState, type ReactNode } from 'react'
import ibmHeroAp1 from '../../IBM case study assets/ap1.png'
import ibmOverviewAp2 from '../../IBM case study assets/ap2.png'
import ibmOverviewAp3 from '../../IBM case study assets/ap3.png'
import ibmProblemSurfaceAp4 from '../../IBM case study assets/ap4.png'
import ibmProblemSurfaceAp4Alt from '../../IBM case study assets/ap4.1.png'
import ibmTensionsVennAp5 from '../../IBM case study assets/ap5.png'
import ibmWorkshopFindingsAp6 from '../../IBM case study assets/ap6.png'
import ibmActionPlansWorkflowAp7 from '../../IBM case study assets/ap7.png'
import ibmActionLayerAp8 from '../../IBM case study assets/ap8.png'
import ibmActionLayerAp8Alt from '../../IBM case study assets/ap8.1.png'
import ibmCriteriaSelectionAp9 from '../../IBM case study assets/ap9.png'
import ibmCriteriaSelectionAp9Alt from '../../IBM case study assets/ap9.1.png'
import ibmDefineSuccessAp10 from '../../IBM case study assets/ap10.png'
import ibmDefineSuccessAp10Alt from '../../IBM case study assets/ap10.1.png'
import ibmExecuteActionsAp11 from '../../IBM case study assets/ap11.png'
import ibmExecuteActionsAp11Alt from '../../IBM case study assets/ap11.1.png'
import ibmTrackProgressAp12 from '../../IBM case study assets/ap12.png'
import ibmTrackProgressAp12Alt from '../../IBM case study assets/ap12.1.png'
import ibmTrackProgressAp13 from '../../IBM case study assets/ap13.png'
import ibmEmissionsComparisonAp14 from '../../IBM case study assets/ap14.png'
import ibmEmissionsComparisonAp14Alt from '../../IBM case study assets/ap14.1.png'
import ibmPartnerPortalAp15 from '../../IBM case study assets/ap15.png'
import ibmPartnerPortalAp15Alt from '../../IBM case study assets/ap15.1.png'
import ibmPartnerPortalAp16 from '../../IBM case study assets/ap16.png'
import ibmPartnerPortalAp16Alt from '../../IBM case study assets/ap16.1.png'
import ibmMethodFlowsAp18 from '../../IBM case study assets/ap18.png'
import ibmMethodFlowsAp18Alt from '../../IBM case study assets/ap18.1.png'
import ibmBeforeAfterAp19 from '../../IBM case study assets/ap19.png'
import ibmBeforeAfterAp19Alt from '../../IBM case study assets/ap19.1.png'
import ibmActionPlansPrototypeVideo from '../../IBM case study assets/IBM prototype video action plans 720p.mp4'
import ibmRetrospectiveConfusedGif from '../../IBM case study assets/confused.gif'
import { IBM_ENVIZI_CASE_STUDY_SHOWCASE_NAV } from '../data/caseStudyShowcaseNav'
import {
  ProblemStatementFrame,
  ProblemStatementGlitchFramedBlock,
  TimelinePillsRow,
  caseStudyChamferToggleLabelClassName,
  caseStudyScrollAnchorClass,
} from '../components/caseStudy/patterns'
import { IbmToggleAspectSpacer } from '../components/caseStudy/IbmChamferMediaPlaceholder'
import { CaseStudyShowcaseScaffold } from '../components/caseStudy/CaseStudyShowcaseScaffold'
import { ExperimentalCaseStudiesPanel } from '../components/ExperimentalCaseStudiesPanel'
import { ChamferFrame } from '../components/system/ChamferFrame'
import { FigmaGrid12 } from '../components/system/FigmaGrid'
import {
  RotatingGradientCircle,
  RotatingGradientCircleDotPlaceholder,
} from '../components/system/RotatingGradientCircle'

import { IBM_ENVIZI_CASE_STUDY } from '../constants/caseStudyCatalog'
import { usePreloadImages } from '../hooks/usePreloadImages'
import {
  ACTION_LAYER_STEP_1,
  BEFORE_VS_AFTER,
  CRITERIA_SELECTION_STEP_2,
  DEFINE_MEASURABLE_SUCCESS_STEP_3,
  EXECUTE_ACTIONS_STEP_4,
  FOUR_METHODS_ONE_EXPERIENCE,
  IBM_IMPACT_OUTCOMES,
  MAKING_EMISSIONS_CHANGES,
  OTHER_HALF_OF_SYSTEM,
  TRACK_PROGRESS_STEP_5,
} from './ibm/ibmEnviziSharedContent'
import {
  IBM_PRESENTATION_SLIDES,
  IBM_PRESENTATION_THUMBNAILS,
  ibmPresentationMediaToSlideIndex,
} from './ibm/IbmPresentationDeck'

const ibmRetrospectiveGifImgClass =
  'block size-24 max-h-24 max-w-24 shrink-0 object-cover object-center md:size-28 md:max-h-28 md:max-w-28'

/** IBM showcase images used in crossfades — preloaded so toggles don’t hitch. */
const IBM_PAGE_PRELOAD_IMAGES = [
  ibmProblemSurfaceAp4,
  ibmProblemSurfaceAp4Alt,
  ibmActionLayerAp8,
  ibmActionLayerAp8Alt,
  ibmCriteriaSelectionAp9,
  ibmCriteriaSelectionAp9Alt,
  ibmDefineSuccessAp10,
  ibmDefineSuccessAp10Alt,
  ibmExecuteActionsAp11,
  ibmExecuteActionsAp11Alt,
  ibmTrackProgressAp12,
  ibmTrackProgressAp12Alt,
  ibmTrackProgressAp13,
  ibmEmissionsComparisonAp14,
  ibmEmissionsComparisonAp14Alt,
  ibmPartnerPortalAp15,
  ibmPartnerPortalAp15Alt,
  ibmPartnerPortalAp16,
  ibmPartnerPortalAp16Alt,
  ibmMethodFlowsAp18,
  ibmMethodFlowsAp18Alt,
  ibmBeforeAfterAp19,
  ibmBeforeAfterAp19Alt,
] as const

/**
 * Layer clone for crossfade — matches Carbon `img` (object-contain, top-left). Spacer is
 * {@link IbmToggleAspectSpacer} with per-asset pixel aspect.
 */
const chamferToggleStackLayerClass =
  'pointer-events-none absolute inset-0 h-full w-full max-w-full object-contain object-left object-top align-middle'

/** Emissions toggle (ap4 / ap4.1): default vs goals overlay. */
const problemSurfaceStrugglesToggleLabelOff = 'Show the goals'
const problemSurfaceStrugglesToggleLabelOn = 'Hide the goals'

const ACTION_PLANS_WORKFLOW_BULLETS = [
  'Identify weak calculations',
  'Choose a stronger method',
  'Target suppliers',
  'Request better inputs',
  'Compare impact',
  'Track progress over time',
] as const

/** Step pills — {@link TimelinePillsRow} (Creating an action plan). Three lines: step number, then two words. */
const ACTION_PLANS_FLOW_CREATING = [
  '1.\nSelect\ntemplate',
  '2.\nCriteria\nselection',
  '3.\nDefine\ngoal',
  '4.\nSelect\nactions',
  '5.\nTrack\nprogress',
] as const

/** Step pills — {@link TimelinePillsRow} (Track action plan progress). */
const ACTION_PLANS_FLOW_TRACKING = [
  '1. Send requests',
  '2. Review responses',
  '3. Approve emissions',
] as const

const ACTION_LAYER_INTRO_COLUMNS = [
  'One of the clearest system-level moves was naming what this was: not a feature, but a workflow layer that sat alongside the reporting engine.',
  'Before this, the product was a surface for seeing emissions. The redesign added a system for improving them – from identifying weak calculations, to coordinating suppliers, to comparing the impact of better inputs.',
  'This shifted the product from read-only reporting to an operational tool.',
] as const

const actionLayerWhatWorksToggleOff = 'Show what works'
const actionLayerWhatWorksToggleOn = 'Hide what works'

const criteriaSelectionWhatWorksToggleOff = 'Show what works'
const criteriaSelectionWhatWorksToggleOn = 'Hide what works'

const defineSuccessWhatWorksToggleOff = 'Show what works'
const defineSuccessWhatWorksToggleOn = 'Hide what works'

const executeActionsWhatWorksToggleOff = 'Show what works'
const executeActionsWhatWorksToggleOn = 'Hide what works'

const trackProgressWhatWorksToggleOff = 'Show what works'
const trackProgressWhatWorksToggleOn = 'Hide what works'

const emissionsChangesWhatWorksToggleOff = 'Show what works'
const emissionsChangesWhatWorksToggleOn = 'Hide what works'

const otherHalfWhatWorksToggleOff = 'Show what works'
const otherHalfWhatWorksToggleOn = 'Hide what works'

const methodFlowsToggleOff = 'Show all method flows'
const methodFlowsToggleOn = 'Hide all method flows'

const beforeAfterDetailsToggleOff = 'Show before vs after details'
const beforeAfterDetailsToggleOn = 'Hide before vs after details'

/** Match {@link CarbonNeutralClubShowcasePage} / {@link SuperAppShowcasePage} team rows. */
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

const TEAM_ROWS: { id: string; role: ReactNode; responsibility: string }[] = [
  {
    id: 'lead',
    role: 'Lead product designer (me)',
    responsibility:
      'Primary designer on Action Plans. Owned flows, logic, specs, handoff, and QA end-to-end.',
  },
  {
    id: 'pm',
    role: 'Scope 3 Product Manager',
    responsibility: 'Domain lead. Brought complex requirements; I translated them into product.',
  },
  {
    id: 'stsm',
    role: 'STSM / Software Architect',
    responsibility: 'Systems architecture. Partnered on feasibility and component strategy.',
  },
  {
    id: 'sr-arch',
    role: 'Senior Software Architect',
    responsibility: 'Technical direction for the Angular implementation.',
  },
  {
    id: 'lead-dev',
    role: 'Lead Software Developer',
    responsibility: 'Day-to-day engineering partner through build and QA.',
  },
  {
    id: 'design-support',
    role: 'Product Designer · Content Designer · UX Researcher',
    responsibility: 'Supporting design, writing, and research across adjacent areas.',
  },
]

const PROBLEM_EXISTING_SCREEN_ASKS = [
  'Emailing suppliers manually',
  'Tracking replies in spreadsheets',
  'Requesting files repeatedly',
  'Recalculating totals by hand',
  'Guessing which suppliers mattered most',
  'Repeating the same chaos every reporting cycle',
] as const

const PROBLEM_MAJOR_ISSUES: { title: string; body: string }[] = [
  {
    title: 'No action layer inside the product',
    body: 'Dashboards showed emissions totals. Nothing offered a path to improve them. Seeing the problem and fixing it lived in separate worlds.',
  },
  {
    title: 'Supplier outreach was off-platform',
    body: 'Email chains. Personal spreadsheets. No shared state. Every quarter rebuilt the same coordination system from scratch.',
  },
  {
    title: 'Calculation methods were invisible',
    body: "Users didn't know which method powered a given estimate or how to upgrade it. The data quality gap was real – and entirely unsurfaced.",
  },
  {
    title: 'No memory between cycles',
    body: "No record of last quarter's outreach. No sense of who had responded. Teams repeated the same work, every cycle.",
  },
]

const USER_VS_BUSINESS_TRADEOFFS: { label: string; body: string }[] = [
  {
    label: 'Rigor vs. Usability',
    body: "Carbon accounting demands precision. Users aren't master carbon accountants.",
  },
  {
    label: 'Coverage vs. Coherence',
    body: 'Four methods, branching logic. One pattern held it together.',
  },
  {
    label: 'Flexibility vs. Guidance',
    body: 'Control without guardrails corrupts downstream reporting.',
  },
  {
    label: 'Design system vs. Product stack',
    body: 'IBM Carbon was React. The product was Angular.',
  },
]

const ALIGNMENT_FOCUS_BOXES = [
  'What users were actually struggling with inside the reporting cycle',
  'Which problems existed across every calculation method, not just one',
  'What opportunities were worth exploring, and which ones were distractions',
  'Which patterns could be shared across branches to keep the system coherent',
] as const

function IbmActionPlansAutoplayVideo({ src }: { src: string }) {
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
      aria-label="Screen recording: IBM Envizi action plans prototype"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

export default function IbmEnviziShowcasePage() {
  usePreloadImages(IBM_PAGE_PRELOAD_IMAGES)

  const [seeWhereUsersStruggled, setSeeWhereUsersStruggled] = useState(false)
  const [showCriteriaSelectionWhatWorks, setShowCriteriaSelectionWhatWorks] = useState(false)
  const [showDefineSuccessWhatWorks, setShowDefineSuccessWhatWorks] = useState(false)
  const [showExecuteActionsWhatWorks, setShowExecuteActionsWhatWorks] = useState(false)
  const [showTrackProgressWhatWorks, setShowTrackProgressWhatWorks] = useState(false)
  const [showEmissionsChangesWhatWorks, setShowEmissionsChangesWhatWorks] = useState(false)
  const [showOtherHalfAp15WhatWorks, setShowOtherHalfAp15WhatWorks] = useState(false)
  const [showOtherHalfAp16WhatWorks, setShowOtherHalfAp16WhatWorks] = useState(false)
  const [showAllMethodFlows, setShowAllMethodFlows] = useState(false)
  const [showBeforeAfterDetails, setShowBeforeAfterDetails] = useState(false)
  const [showActionLayerWhatWorks, setShowActionLayerWhatWorks] = useState(false)


  return (
    <CaseStudyShowcaseScaffold
      sidebarKicker={IBM_ENVIZI_CASE_STUDY.title}
      caseStudiesModifierTo="/case-study/components"
      navSections={IBM_ENVIZI_CASE_STUDY_SHOWCASE_NAV}
      presentationSlides={IBM_PRESENTATION_SLIDES}
      presentationMediaToSlideIndex={ibmPresentationMediaToSlideIndex}
      presentationThumbnailSrcs={IBM_PRESENTATION_THUMBNAILS}
      presentationInitialTextSlidesVisible={true}
    >
      <ChamferFrame
        presentationMediaIndex={0}
        className="chamfer-media-border w-full"
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-[#d9d5cf]/50 p-0 dark:bg-surface/25"
      >
        <img
          src={ibmHeroAp1}
          alt="IBM Envizi product UI — action plans, supplier PCFs, emissions overview, and iMac view"
          decoding="async"
          className="block h-auto w-full max-w-full select-none align-middle"
        />
      </ChamferFrame>

      <div className="flex w-full min-w-0 flex-col items-stretch gap-8 md:gap-10 lg:flex-row lg:items-center lg:gap-x-6 lg:gap-y-0 xl:gap-x-8">
        <h1
          id="hero-heading"
          className={`min-w-0 max-w-full flex-1 text-pretty text-left text-[clamp(1.5rem,4.2vw,2.5rem)] font-mono font-normal leading-snug tracking-[-0.04em] text-fg sm:leading-tight sm:text-[clamp(1.75rem,4.5vw,2.75rem)] ${caseStudyScrollAnchorClass}`}
        >
          Turning an undefined emissions workflow into a shipped enterprise system
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
        presentationMediaIndex={1}
        className="chamfer-media-border w-full"
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <IbmActionPlansAutoplayVideo src={ibmActionPlansPrototypeVideo} />
      </ChamferFrame>

      <section aria-labelledby="overview-section">
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="overview-section"
            className={`col-span-12 max-w-[40ch] text-[clamp(1.25rem,2.5vw,1.75rem)] font-mono font-normal leading-snug tracking-[-0.02em] text-fg sm:max-w-none ${caseStudyScrollAnchorClass}`}
          >
            Scope 3. Four methods. One shipped system.
          </h2>

          <div className="col-span-12 md:col-span-4">
            <h3 className="text-[12px] font-mono font-normal leading-none text-fg">
              What does the company do?
            </h3>
            <ChamferFrame
              fitContentHeight
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 text-[12px] font-mono leading-[1.55] text-fg md:p-6 md:leading-relaxed"
            >
              <p className="m-0">
                <span className="text-fg">IBM Envizi</span> is an enterprise sustainability platform used by
                global organizations to track and report emissions data.
              </p>
              <ul className="mb-0 mt-3 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/80 md:mt-4 md:space-y-2 md:pl-5">
                <li>Scope 1 – direct operational emissions</li>
                <li>Scope 2 – purchased energy</li>
                <li>Scope 3 – supply chain &amp; external operations</li>
              </ul>
            </ChamferFrame>
          </div>

          <div className="col-span-12 md:col-span-4">
            <h3 className="text-[12px] font-mono font-normal leading-none text-fg">What I did</h3>
            <ChamferFrame
              fitContentHeight
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 text-[12px] font-mono leading-[1.55] text-fg md:p-6 md:leading-relaxed"
            >
              <p className="m-0">
                I was brought in to lead the design of a new workflow layer — one that didn&apos;t yet exist
                inside the product.
              </p>
              <ul className="mb-0 mt-3 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/80 md:mt-4 md:space-y-2 md:pl-5">
                <li>Primary designer, end-to-end</li>
                <li>Defined flows across four calculation methods</li>
              </ul>
              <p className="mb-0 mt-4 text-fg/90 md:mt-5">
                Not a redesign — a new category of workflow.
              </p>
            </ChamferFrame>
          </div>

          <div className="col-span-12 md:col-span-4">
            <h3 className="text-[12px] font-mono font-normal leading-none text-fg">Scope</h3>
            <ChamferFrame
              fitContentHeight
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 text-[12px] font-mono leading-[1.55] text-fg md:p-6 md:leading-relaxed"
            >
              <p className="m-0">Timeline: ~6 months</p>
              <p className="mb-0 mt-4 text-fg md:mt-5">Scope details</p>
              <ul className="mb-0 mt-2 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/80 md:space-y-2 md:pl-5">
                <li>0 -&gt; 1 workflow inside a shipped product</li>
                <li>Four branching method flows</li>
                <li>Supplier outreach, tracking, comparison</li>
                <li>Carbon (React) -&gt; Angular constraints</li>
              </ul>
            </ChamferFrame>
          </div>

          <div className="col-span-12">
            <h3 className="mt-2 text-[12px] font-mono font-normal leading-none text-fg md:mt-6">
              Team
            </h3>
            <ul className="mt-7 flex flex-col gap-6 md:mt-8 md:gap-7">
              {TEAM_ROWS.map((row) => (
                <li
                  key={row.id}
                  className="flex min-w-0 items-center gap-3 md:gap-5"
                >
                  <span className="min-w-0 max-w-[min(16rem,46%)] shrink-0 [text-wrap:balance] text-left font-mono text-[14px] leading-snug text-fg sm:max-w-[min(20rem,44%)]">
                    {row.role}
                  </span>
                  {teamConnector}
                  <span className="min-w-0 shrink-0 text-right text-[10px] font-mono font-normal leading-snug text-fg">
                    {row.responsibility}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <ChamferFrame
            presentationMediaIndex={2}
            className="chamfer-media-border col-span-12 w-full"
            innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
          >
            <img
              src={ibmOverviewAp2}
              alt="IBM Envizi case study — supporting visual 1 (overview)"
              decoding="async"
              className="block h-auto w-full max-w-full select-none align-middle"
            />
          </ChamferFrame>
          <ChamferFrame
            presentationMediaIndex={3}
            className="chamfer-media-border col-span-12 w-full"
            innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
          >
            <img
              src={ibmOverviewAp3}
              alt="IBM Envizi case study — supporting visual 2 (overview)"
              decoding="async"
              className="block h-auto w-full max-w-full select-none align-middle"
            />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <ProblemStatementFrame
        id="problem-statement"
        className={caseStudyScrollAnchorClass}
        label="The problem"
        framedStatementClassName="font-mono"
        afterRule={
          <FigmaGrid12 className="font-mono md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
            <div className="col-span-12 md:col-span-5">
              <p className="m-0 text-[12px] leading-[1.55] text-fg">
                IBM Envizi surfaces emissions data across every vertical – but stops helping the moment
                you need to act on it.
              </p>
              <p className="m-0 mt-4 text-[12px] leading-[1.55] text-fg md:mt-5">
                Without a system, teams were forced into:
              </p>
              <ul className="mb-0 mt-3 list-disc space-y-2 pl-[1.15rem] text-[12px] leading-[1.55] text-fg md:mt-4 md:space-y-2.5 md:pl-5">
                {PROBLEM_EXISTING_SCREEN_ASKS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 md:col-span-7">
              <h3 className="m-0 text-[12px] font-medium leading-snug text-fg">
                This created multiple major problems:
              </h3>
              <div className="mt-4 flex flex-col gap-4 md:mt-5 md:gap-5">
                {PROBLEM_MAJOR_ISSUES.map((item) => (
                  <ChamferFrame
                    key={item.title}
                    fitContentHeight
                    className="w-full"
                    innerClassName="flex flex-col bg-surface/20 p-5 text-left md:p-6"
                  >
                    <p className="m-0 text-[20px] font-medium leading-snug text-fg">
                      {item.title}
                    </p>
                    <p className="mb-0 mt-2 text-[12px] leading-relaxed text-fg/90 md:mt-3">
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
          <p className="m-0 text-balance">
            Users didn&apos;t experience a product that
            <br />
            helped them reduce emissions.
          </p>
          <p className="m-0 text-balance">
            They experienced a product that only told
            <br />
            them how bad things were.
          </p>
        </>
      </ProblemStatementFrame>

      <ChamferFrame
        presentationMediaIndex={4}
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
                ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
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
            className={caseStudyChamferToggleLabelClassName}
          >
            {seeWhereUsersStruggled
              ? problemSurfaceStrugglesToggleLabelOn
              : problemSurfaceStrugglesToggleLabelOff}
          </span>
        </div>
        <div className="relative isolate w-full">
          <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
          <img
            src={ibmProblemSurfaceAp4}
            alt="IBM Envizi — Emissions dashboard, overview"
            decoding="async"
            loading="eager"
            fetchPriority="high"
            className={`${chamferToggleStackLayerClass} z-0 ${
              seeWhereUsersStruggled ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <img
            src={ibmProblemSurfaceAp4Alt}
            alt="IBM Envizi — Emissions dashboard, alternate view"
            decoding="async"
            loading="eager"
            className={`${chamferToggleStackLayerClass} z-10 ${
              seeWhereUsersStruggled ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </ChamferFrame>

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
            The tensions that shaped the work
          </h2>
          <p className="col-span-12 mb-2 mt-2 font-mono text-[12px] font-normal leading-relaxed text-fg md:mb-3 md:mt-3">
            This wasn&apos;t about polishing screens. It was about giving the product a layer it
            fundamentally lacked.
          </p>
          <div className="col-span-12 flex flex-col gap-4 md:gap-5">
            {USER_VS_BUSINESS_TRADEOFFS.map((row) => (
              <ChamferFrame
                key={row.label}
                className="chamfer-tradeoff-outline w-full"
                innerClassName="grid min-w-0 grid-cols-1 gap-3 bg-transparent px-4 py-3.5 md:grid-cols-[17rem_minmax(2.5rem,0.38fr)_minmax(0,1fr)] md:items-center md:gap-x-5 md:gap-y-0 md:px-5 md:py-4"
              >
                <p className="m-0 min-w-0 w-full text-left font-mono text-[20px] font-normal leading-snug text-fg">
                  {row.label}
                </p>
                <div className="flex min-h-0 min-w-0 w-full items-center">{tradeRowConnector}</div>
                <p className="m-0 min-w-0 w-full text-left font-mono text-[12px] font-normal leading-relaxed text-fg md:w-auto">
                  {row.body}
                </p>
              </ChamferFrame>
            ))}
          </div>
          <div className="col-span-12 mt-10 font-mono text-[12px] font-normal leading-relaxed text-fg md:mt-12">
            <p className="m-0 [text-wrap:pretty]">
              The work had to preserve the rigor of the reporting engine while making the whole
              experience feel like it belonged to one system.
            </p>
          </div>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={5}
          className="chamfer-media-border mt-10 w-full md:mt-12"
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <img
            src={ibmTensionsVennAp5}
            alt="IBM Envizi case study — business needs, user needs, and solution in a Venn diagram"
            decoding="async"
            className="block h-auto w-full max-w-full select-none align-middle"
          />
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="alignment-brief-to-system"
        aria-labelledby="alignment-brief-to-system-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="alignment-brief-to-system-heading"
            className="col-span-12 m-0 font-mono text-[24px] font-normal leading-snug text-fg"
          >
            From ambiguous brief to product system.
          </h2>
          <p className="col-span-12 m-0 mt-2 font-mono text-[12px] font-normal leading-relaxed text-fg/80 md:mt-3">
            Before proposing solutions, I spent the first weeks aligning around four things:
          </p>
          <div className="col-span-12 mt-6 grid grid-cols-1 gap-4 font-mono md:mt-8 md:grid-cols-2 md:gap-5">
            {ALIGNMENT_FOCUS_BOXES.map((line, i) => (
              <ChamferFrame
                key={line}
                fitContentHeight
                className="chamfer-tradeoff-outline w-full"
                innerClassName="flex gap-4 bg-transparent p-4 text-left text-fg md:gap-5 md:p-5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center self-start rounded-full border-[0.5px] border-solid border-[#414141] text-[12px] font-normal leading-[1.55] tabular-nums md:size-10">
                  {i + 1}
                </span>
                <p className="m-0 min-w-0 text-[16px] font-normal leading-[1.55] [text-wrap:pretty] md:leading-relaxed">
                  {line}
                </p>
              </ChamferFrame>
            ))}
          </div>
          <div className="col-span-12 mt-10 font-mono text-[12px] font-normal leading-relaxed text-fg [text-wrap:pretty] md:mt-12">
            <p className="m-0">
              This shifted the work from &apos;design a flow&apos; into &apos;define what this product
              layer should be.&apos; The output wasn&apos;t screens. It was the structural logic every
              downstream screen would follow.
            </p>
          </div>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={6}
          className="chamfer-media-border mt-10 w-full md:mt-14"
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <img
            src={ibmWorkshopFindingsAp6}
            alt="Workshop findings — four columns of problems and opportunities from alignment sessions"
            decoding="async"
            className="block h-auto w-full max-w-full select-none align-middle"
          />
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="system-we-designed"
        aria-labelledby="flow-system-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="flow-system-heading"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug text-fg [text-wrap:balance]"
          >
            Dashboards inform. Workflows improve.
          </h2>
          <div className="col-span-12 md:col-span-4">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg [text-wrap:pretty]">
              The existing product helped customers see emissions totals. But totals alone do not
              improve data quality.
            </p>
          </div>
          <div className="col-span-12 font-mono text-[12px] text-fg leading-relaxed md:col-span-4">
            <p className="m-0 [text-wrap:pretty]">What customers needed was a workflow layer that helped them:</p>
            <ul className="mb-0 mt-3 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/80 md:mt-4 md:space-y-2 md:pl-5">
              {ACTION_PLANS_WORKFLOW_BULLETS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 flex items-start md:col-span-4">
            <p className="m-0 font-mono text-[24px] font-medium leading-snug text-fg [text-wrap:balance]">
              That insight became Action Plans.
            </p>
          </div>
          <p
            className="col-span-12 m-0 mt-10 font-mono text-[12px] font-normal text-fg/90 [text-wrap:balance] md:mt-12"
            id="action-plans-flow-creating-label"
          >
            Creating an action plan
          </p>
          <div className="col-span-12 -mx-1 w-full min-w-0 overflow-x-auto px-1 pb-1 md:overflow-visible md:pb-0">
            <TimelinePillsRow
              stepLabels={ACTION_PLANS_FLOW_CREATING}
              ariaLabelledBy="action-plans-flow-creating-label"
              pillTextMode="multiline"
            />
          </div>
          <p
            className="col-span-12 m-0 mt-8 font-mono text-[12px] font-normal text-fg/90 [text-wrap:balance] md:mt-10"
            id="action-plans-flow-tracking-label"
          >
            Track action plan progress
          </p>
          <div className="col-span-12 -mx-1 w-full min-w-0 overflow-x-auto px-1 pb-1 md:overflow-visible md:pb-0">
            <TimelinePillsRow
              stepLabels={ACTION_PLANS_FLOW_TRACKING}
              ariaLabelledBy="action-plans-flow-tracking-label"
            />
          </div>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={7}
          className="chamfer-media-border mt-10 w-full md:mt-12"
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-[#d9d5cf]/50 p-0 dark:bg-surface/25"
        >
          <img
            src={ibmActionPlansWorkflowAp7}
            alt="Action Plans — creating a plan and tracking progress, step-by-step UI"
            decoding="async"
            className="block h-auto w-full max-w-full select-none align-middle"
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
          <h2
            id="design-principles-heading"
            className="col-span-12 m-0 max-w-[48ch] font-mono text-[clamp(1.25rem,2.6vw,1.75rem)] font-normal leading-snug tracking-tight text-fg [text-wrap:balance]"
          >
            Action Plans became the action layer.
          </h2>
          <div className="col-span-12 grid grid-cols-1 gap-6 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)] [font-variant-numeric:lining-nums] text-[12px] font-normal leading-relaxed text-fg/95 md:grid-cols-3 md:gap-[var(--figma-gutter)]">
            {ACTION_LAYER_INTRO_COLUMNS.map((p, i) => (
              <p key={`action-layer-intro-${i}`} className="m-0 [text-wrap:pretty]">
                {p}
              </p>
            ))}
          </div>

          <ChamferFrame
            fitContentHeight
            className="chamfer-tradeoff-outline figma-frame-static col-span-12 w-full"
            innerClassName="min-w-0 overflow-hidden bg-elevated/20"
          >
            <div className="grid min-w-0 grid-cols-1 gap-6 p-5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-8 md:p-6">
              <div className="flex min-w-0 items-start gap-4 md:max-w-none md:flex-col md:gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-fg/30 bg-elevated/30 font-mono text-lg font-medium leading-none text-fg"
                  aria-hidden
                >
                  {ACTION_LAYER_STEP_1.step}
                </div>
                <div className="min-w-0">
                  <h3 className="m-0 font-mono text-[17px] font-normal leading-snug tracking-[-0.02em] text-fg sm:text-lg">
                    {ACTION_LAYER_STEP_1.title}
                  </h3>
                  <p className="m-0 mt-1.5 text-[12px] font-mono font-normal text-fg-muted">
                    {ACTION_LAYER_STEP_1.kicker}
                  </p>
                </div>
              </div>
              <div className="grid min-w-0 grid-cols-1 gap-5 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)] md:grid-cols-2 md:gap-6 md:gap-y-0">
                <p className="m-0 [text-wrap:pretty]">{ACTION_LAYER_STEP_1.middleColumn}</p>
                <div className="min-w-0">
                  <p className="m-0 [text-wrap:pretty]">{ACTION_LAYER_STEP_1.rightIntro}</p>
                  <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/70 md:mt-2 md:space-y-2 md:pl-5">
                    {ACTION_LAYER_STEP_1.listItems.map((item) => (
                      <li key={item} className="[text-wrap:pretty] pl-0.5">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </ChamferFrame>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={8}
          className="chamfer-media-border mt-8 w-full md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={showActionLayerWhatWorks}
              aria-labelledby="action-layer-what-works-label"
              onClick={() => setShowActionLayerWhatWorks((v) => !v)}
              className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
                showActionLayerWhatWorks
                  ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                  : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                  showActionLayerWhatWorks
                    ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                    : 'left-1 bg-white'
                }`}
                aria-hidden
              />
            </button>
            <span
              id="action-layer-what-works-label"
              className={caseStudyChamferToggleLabelClassName}
            >
              {showActionLayerWhatWorks ? actionLayerWhatWorksToggleOn : actionLayerWhatWorksToggleOff}
            </span>
          </div>
          <div className="relative isolate w-full">
            <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
            <img
              src={ibmActionLayerAp8}
              alt="IBM Envizi — select action plan type, template cards"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-0 ${
                showActionLayerWhatWorks ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={ibmActionLayerAp8Alt}
              alt="IBM Envizi — select action plan type, alternate view"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-10 ${
                showActionLayerWhatWorks ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="criteria-selection"
        aria-labelledby="criteria-selection-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <ChamferFrame
            fitContentHeight
            className="chamfer-tradeoff-outline figma-frame-static col-span-12 w-full"
            innerClassName="min-w-0 overflow-hidden bg-elevated/20"
          >
            <div className="grid min-w-0 grid-cols-1 gap-6 p-5 md:grid-cols-3 md:gap-6 md:p-6">
              <div className="flex min-w-0 items-start gap-4 md:flex-col md:gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-fg/30 bg-elevated/30 font-mono text-lg font-medium leading-none text-fg"
                  aria-hidden
                >
                  {CRITERIA_SELECTION_STEP_2.step}
                </div>
                <div className="min-w-0">
                  <h2
                    id="criteria-selection-heading"
                    className="m-0 font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg"
                  >
                    {CRITERIA_SELECTION_STEP_2.title}
                  </h2>
                  <p className="m-0 mt-1.5 text-[12px] font-mono font-normal text-fg-muted">
                    {CRITERIA_SELECTION_STEP_2.kicker}
                  </p>
                </div>
              </div>
              <p className="m-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)] [text-wrap:pretty]">
                {CRITERIA_SELECTION_STEP_2.centerColumn}
              </p>
              <div className="min-w-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)]">
                <p className="m-0 [text-wrap:pretty]">{CRITERIA_SELECTION_STEP_2.rightIntro}</p>
                <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/70 md:mt-2 md:space-y-2 md:pl-5">
                  {CRITERIA_SELECTION_STEP_2.listItems.map((item) => (
                    <li key={item} className="[text-wrap:pretty] pl-0.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ChamferFrame>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={9}
          className="chamfer-media-border mt-8 w-full md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={showCriteriaSelectionWhatWorks}
              aria-labelledby="criteria-selection-what-works-label"
              onClick={() => setShowCriteriaSelectionWhatWorks((v) => !v)}
              className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
                showCriteriaSelectionWhatWorks
                  ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                  : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                  showCriteriaSelectionWhatWorks
                    ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                    : 'left-1 bg-white'
                }`}
                aria-hidden
              />
            </button>
            <span
              id="criteria-selection-what-works-label"
              className={caseStudyChamferToggleLabelClassName}
            >
              {showCriteriaSelectionWhatWorks
                ? criteriaSelectionWhatWorksToggleOn
                : criteriaSelectionWhatWorksToggleOff}
            </span>
          </div>
          <div className="relative isolate w-full">
            <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
            <img
              src={ibmCriteriaSelectionAp9}
              alt="IBM Envizi — criteria selection, supplier-specific method and treemap"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-0 ${
                showCriteriaSelectionWhatWorks ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={ibmCriteriaSelectionAp9Alt}
              alt="IBM Envizi — criteria selection, alternate view"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-10 ${
                showCriteriaSelectionWhatWorks ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="define-measurable-success"
        aria-labelledby="define-measurable-success-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <ChamferFrame
            fitContentHeight
            className="chamfer-tradeoff-outline figma-frame-static col-span-12 w-full"
            innerClassName="min-w-0 overflow-hidden bg-elevated/20"
          >
            <div className="grid min-w-0 grid-cols-1 gap-6 p-5 md:grid-cols-3 md:gap-6 md:p-6">
              <div className="flex min-w-0 items-start gap-4 md:flex-col md:gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-fg/30 bg-elevated/30 font-mono text-lg font-medium leading-none text-fg"
                  aria-hidden
                >
                  {DEFINE_MEASURABLE_SUCCESS_STEP_3.step}
                </div>
                <div className="min-w-0">
                  <h2
                    id="define-measurable-success-heading"
                    className="m-0 font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg"
                  >
                    {DEFINE_MEASURABLE_SUCCESS_STEP_3.title}
                  </h2>
                  <p className="m-0 mt-1.5 text-[12px] font-mono font-normal text-fg-muted">
                    {DEFINE_MEASURABLE_SUCCESS_STEP_3.kicker}
                  </p>
                </div>
              </div>
              <p className="m-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)] [text-wrap:pretty]">
                {DEFINE_MEASURABLE_SUCCESS_STEP_3.centerColumn}
              </p>
              <div className="min-w-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)]">
                <p className="m-0 [text-wrap:pretty]">{DEFINE_MEASURABLE_SUCCESS_STEP_3.rightIntro}</p>
                <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/70 md:mt-2 md:space-y-2 md:pl-5">
                  {DEFINE_MEASURABLE_SUCCESS_STEP_3.listItems.map((item) => (
                    <li key={item} className="[text-wrap:pretty] pl-0.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ChamferFrame>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={10}
          className="chamfer-media-border mt-8 w-full md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={showDefineSuccessWhatWorks}
              aria-labelledby="define-success-what-works-label"
              onClick={() => setShowDefineSuccessWhatWorks((v) => !v)}
              className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
                showDefineSuccessWhatWorks
                  ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                  : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                  showDefineSuccessWhatWorks
                    ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                    : 'left-1 bg-white'
                }`}
                aria-hidden
              />
            </button>
            <span
              id="define-success-what-works-label"
              className={caseStudyChamferToggleLabelClassName}
            >
              {showDefineSuccessWhatWorks
                ? defineSuccessWhatWorksToggleOn
                : defineSuccessWhatWorksToggleOff}
            </span>
          </div>
          <div className="relative isolate w-full">
            <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
            <img
              src={ibmDefineSuccessAp10}
              alt="IBM Envizi — set a goal, program summary, and estimated program milestones"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-0 ${
                showDefineSuccessWhatWorks ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={ibmDefineSuccessAp10Alt}
              alt="IBM Envizi — define success, alternate view"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-10 ${
                showDefineSuccessWhatWorks ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="execute-actions"
        aria-labelledby="execute-actions-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <ChamferFrame
            fitContentHeight
            className="chamfer-tradeoff-outline figma-frame-static col-span-12 w-full"
            innerClassName="min-w-0 overflow-hidden bg-elevated/20"
          >
            <div className="grid min-w-0 grid-cols-1 gap-6 p-5 md:grid-cols-3 md:gap-6 md:p-6">
              <div className="flex min-w-0 items-start gap-4 md:flex-col md:gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-fg/30 bg-elevated/30 font-mono text-lg font-medium leading-none text-fg"
                  aria-hidden
                >
                  {EXECUTE_ACTIONS_STEP_4.step}
                </div>
                <div className="min-w-0">
                  <h2
                    id="execute-actions-heading"
                    className="m-0 font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg"
                  >
                    {EXECUTE_ACTIONS_STEP_4.title}
                  </h2>
                  <p className="m-0 mt-1.5 text-[12px] font-mono font-normal text-fg-muted">
                    {EXECUTE_ACTIONS_STEP_4.kicker}
                  </p>
                </div>
              </div>
              <p className="m-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)] [text-wrap:pretty]">
                {EXECUTE_ACTIONS_STEP_4.centerColumn}
              </p>
              <div className="min-w-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)]">
                <p className="m-0 [text-wrap:pretty]">{EXECUTE_ACTIONS_STEP_4.rightIntro}</p>
                <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/70 md:mt-2 md:space-y-2 md:pl-5">
                  {EXECUTE_ACTIONS_STEP_4.listItems.map((item) => (
                    <li key={item} className="[text-wrap:pretty] pl-0.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ChamferFrame>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={11}
          className="chamfer-media-border mt-8 w-full md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={showExecuteActionsWhatWorks}
              aria-labelledby="execute-actions-what-works-label"
              onClick={() => setShowExecuteActionsWhatWorks((v) => !v)}
              className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
                showExecuteActionsWhatWorks
                  ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                  : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                  showExecuteActionsWhatWorks
                    ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                    : 'left-1 bg-white'
                }`}
                aria-hidden
              />
            </button>
            <span
              id="execute-actions-what-works-label"
              className={caseStudyChamferToggleLabelClassName}
            >
              {showExecuteActionsWhatWorks
                ? executeActionsWhatWorksToggleOn
                : executeActionsWhatWorksToggleOff}
            </span>
          </div>
          <div className="relative isolate w-full">
            <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
            <img
              src={ibmExecuteActionsAp11}
              alt="IBM Envizi action plan — configure program actions, select one or more actions to accomplish the goals of this program"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-0 ${
                showExecuteActionsWhatWorks ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={ibmExecuteActionsAp11Alt}
              alt="IBM Envizi action plan — configure actions, alternate view"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-10 ${
                showExecuteActionsWhatWorks ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="track-progress"
        aria-labelledby="track-progress-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <ChamferFrame
            fitContentHeight
            className="chamfer-tradeoff-outline figma-frame-static col-span-12 w-full"
            innerClassName="min-w-0 overflow-hidden bg-elevated/20"
          >
            <div className="grid min-w-0 grid-cols-1 gap-6 p-5 md:grid-cols-3 md:gap-6 md:p-6">
              <div className="flex min-w-0 items-start gap-4 md:flex-col md:gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-fg/30 bg-elevated/30 font-mono text-lg font-medium leading-none text-fg"
                  aria-hidden
                >
                  {TRACK_PROGRESS_STEP_5.step}
                </div>
                <div className="min-w-0">
                  <h2
                    id="track-progress-heading"
                    className="m-0 font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg"
                  >
                    {TRACK_PROGRESS_STEP_5.title}
                  </h2>
                  <p className="m-0 mt-1.5 text-[12px] font-mono font-normal text-fg-muted">
                    {TRACK_PROGRESS_STEP_5.kicker}
                  </p>
                </div>
              </div>
              <p className="m-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)] [text-wrap:pretty]">
                {TRACK_PROGRESS_STEP_5.centerColumn}
              </p>
              <div className="min-w-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)]">
                <p className="m-0 [text-wrap:pretty]">{TRACK_PROGRESS_STEP_5.rightIntro}</p>
                <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/70 md:mt-2 md:space-y-2 md:pl-5">
                  {TRACK_PROGRESS_STEP_5.listItems.map((item) => (
                    <li key={item} className="[text-wrap:pretty] pl-0.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ChamferFrame>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={12}
          className="chamfer-media-border mt-8 w-full md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={showTrackProgressWhatWorks}
              aria-labelledby="track-progress-what-works-label"
              onClick={() => setShowTrackProgressWhatWorks((v) => !v)}
              className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
                showTrackProgressWhatWorks
                  ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                  : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                  showTrackProgressWhatWorks
                    ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                    : 'left-1 bg-white'
                }`}
                aria-hidden
              />
            </button>
            <span
              id="track-progress-what-works-label"
              className={caseStudyChamferToggleLabelClassName}
            >
              {showTrackProgressWhatWorks
                ? trackProgressWhatWorksToggleOn
                : trackProgressWhatWorksToggleOff}
            </span>
          </div>
          <div className="relative isolate w-full">
            <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
            <img
              src={ibmTrackProgressAp12}
              alt="IBM Envizi program dashboard — progress, PCF requests and responses, supplier activity, emissions comparison, and action status"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-0 ${
                showTrackProgressWhatWorks ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={ibmTrackProgressAp12Alt}
              alt="IBM Envizi program dashboard — alternate view with annotations"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-10 ${
                showTrackProgressWhatWorks ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </ChamferFrame>

        <ChamferFrame
          presentationMediaIndex={13}
          className="chamfer-media-border mt-8 w-full md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="relative isolate w-full">
            <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
            <img
              src={ibmTrackProgressAp13}
              alt="IBM Envizi — detailed view of program metrics, charts, emissions comparison, and actions table"
              decoding="async"
              loading="eager"
              className={chamferToggleStackLayerClass}
            />
          </div>
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="making-emissions-changes-understandable"
        aria-labelledby="making-emissions-changes-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="gap-y-6 md:gap-y-8">
          <h2
            id="making-emissions-changes-heading"
            className="col-span-12 m-0 max-w-[40rem] font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg md:text-[24px]"
          >
            {MAKING_EMISSIONS_CHANGES.title}
          </h2>

          <div className="col-span-12 grid min-w-0 grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 md:gap-y-0 lg:gap-8">
            <div className="min-w-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)]">
              <p className="m-0 [text-wrap:pretty] text-fg/95">
                {MAKING_EMISSIONS_CHANGES.lede}
              </p>
              <p className="m-0 mt-3 text-fg/80 [text-wrap:pretty] md:mt-4">
                {MAKING_EMISSIONS_CHANGES.usersNeedIntro}
              </p>
              <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/70 md:mt-2 md:space-y-2 md:pl-5">
                {MAKING_EMISSIONS_CHANGES.usersNeed.map((item) => (
                  <li key={item} className="[text-wrap:pretty] pl-0.5">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 text-[12px] leading-relaxed [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)]">
              <p className="m-0 font-mono text-[12px] font-medium leading-snug text-fg [text-wrap:pretty]">
                {MAKING_EMISSIONS_CHANGES.introducedTitle}
              </p>
              <p className="m-0 mt-2 text-fg/95 [text-wrap:pretty] md:mt-2.5">
                {MAKING_EMISSIONS_CHANGES.introducedIntro}
              </p>
              <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] text-fg/95 marker:text-fg/70 md:mt-2 md:space-y-2 md:pl-5">
                {MAKING_EMISSIONS_CHANGES.introduced.map((item) => (
                  <li key={item} className="[text-wrap:pretty] pl-0.5">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 text-[12px] leading-relaxed [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)]">
              <p className="m-0 font-mono text-[12px] font-medium leading-snug text-fg [text-wrap:pretty]">
                {MAKING_EMISSIONS_CHANGES.whyTitle}
              </p>
              <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] text-fg/95 marker:text-fg/70 md:mt-2 md:pl-5">
                <li className="[text-wrap:pretty] pl-0.5">{MAKING_EMISSIONS_CHANGES.whyTrust}</li>
              </ul>
              <p className="m-0 mt-4 text-fg/80 [text-wrap:pretty] md:mt-5">
                {MAKING_EMISSIONS_CHANGES.connectIntro}
              </p>
              <ul className="mb-0 mt-1.5 list-disc pl-[1.15rem] marker:text-fg/70 md:mt-2 md:pl-5">
                <li className="[text-wrap:pretty] pl-0.5 text-fg/95">{MAKING_EMISSIONS_CHANGES.connectChain}</li>
              </ul>
            </div>
          </div>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={14}
          className="chamfer-media-border mt-8 w-full min-w-0 md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={showEmissionsChangesWhatWorks}
              aria-labelledby="emissions-changes-what-works-label"
              onClick={() => setShowEmissionsChangesWhatWorks((v) => !v)}
              className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
                showEmissionsChangesWhatWorks
                  ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                  : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                  showEmissionsChangesWhatWorks
                    ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                    : 'left-1 bg-white'
                }`}
                aria-hidden
              />
            </button>
            <span
              id="emissions-changes-what-works-label"
              className={caseStudyChamferToggleLabelClassName}
            >
              {showEmissionsChangesWhatWorks
                ? emissionsChangesWhatWorksToggleOn
                : emissionsChangesWhatWorksToggleOff}
            </span>
          </div>
          <div className="relative isolate w-full">
            <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
            <img
              src={ibmEmissionsComparisonAp14}
              alt="IBM Envizi — PCF data request and comparison view, current vs updated product carbon footprint with change percentage"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-0 ${
                showEmissionsChangesWhatWorks ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={ibmEmissionsComparisonAp14Alt}
              alt="IBM Envizi — comparison and recalculation experience, annotated"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-10 ${
                showEmissionsChangesWhatWorks ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="the-other-half-of-the-system"
        aria-labelledby="the-other-half-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="gap-y-6 md:gap-y-8">
          <h2
            id="the-other-half-heading"
            className="col-span-12 m-0 max-w-[48rem] font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg md:text-[24px]"
          >
            {OTHER_HALF_OF_SYSTEM.title}
          </h2>

          <div className="col-span-12 grid min-w-0 grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 md:gap-y-0 lg:gap-8">
            <div className="min-w-0 text-[12px] leading-relaxed text-fg/95 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)]">
              <p className="m-0 [text-wrap:pretty]">{OTHER_HALF_OF_SYSTEM.context}</p>
            </div>

            <div className="min-w-0 text-[12px] leading-relaxed [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)]">
              <p className="m-0 font-mono text-[12px] font-medium leading-snug text-fg [text-wrap:pretty]">
                {OTHER_HALF_OF_SYSTEM.whatHeading}
              </p>
              <p className="m-0 mt-2 text-fg/95 [text-wrap:pretty] md:mt-2.5">
                {OTHER_HALF_OF_SYSTEM.whatIntro}
              </p>
              <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] text-fg/95 marker:text-fg/70 md:mt-2 md:space-y-2 md:pl-5">
                {OTHER_HALF_OF_SYSTEM.whatList.map((item) => (
                  <li key={item} className="[text-wrap:pretty] pl-0.5">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 text-[12px] leading-relaxed [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)]">
              <p className="m-0 font-mono text-[12px] font-medium leading-snug text-fg [text-wrap:pretty]">
                {OTHER_HALF_OF_SYSTEM.whyHeading}
              </p>
              <p className="m-0 mt-2 text-fg/80 [text-wrap:pretty] md:mt-2.5">
                {OTHER_HALF_OF_SYSTEM.fragmentedIntro}
              </p>
              <ul className="mb-0 mt-1.5 list-disc space-y-1.5 pl-[1.15rem] text-fg/95 marker:text-fg/70 md:mt-2 md:space-y-2 md:pl-5">
                {OTHER_HALF_OF_SYSTEM.fragmentedList.map((item) => (
                  <li key={item} className="[text-wrap:pretty] pl-0.5">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="m-0 mt-4 [text-wrap:pretty] text-fg/95 md:mt-5">
                {OTHER_HALF_OF_SYSTEM.closing}
              </p>
            </div>
          </div>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={15}
          className="chamfer-media-border mt-8 w-full min-w-0 md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={showOtherHalfAp15WhatWorks}
              aria-labelledby="other-half-ap15-what-works-label"
              onClick={() => setShowOtherHalfAp15WhatWorks((v) => !v)}
              className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
                showOtherHalfAp15WhatWorks
                  ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                  : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                  showOtherHalfAp15WhatWorks
                    ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                    : 'left-1 bg-white'
                }`}
                aria-hidden
              />
            </button>
            <span
              id="other-half-ap15-what-works-label"
              className={caseStudyChamferToggleLabelClassName}
            >
              {showOtherHalfAp15WhatWorks
                ? otherHalfWhatWorksToggleOn
                : otherHalfWhatWorksToggleOff}
            </span>
          </div>
          <div className="relative isolate w-full">
            <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
            <img
              src={ibmPartnerPortalAp15}
              alt="IBM partner portal — welcome dashboard, PCF and SBTi requests, supplier emissions overview"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-0 ${
                showOtherHalfAp15WhatWorks ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={ibmPartnerPortalAp15Alt}
              alt="IBM partner portal — product carbon footprint request detail, alternate view"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-10 ${
                showOtherHalfAp15WhatWorks ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </ChamferFrame>

        <ChamferFrame
          presentationMediaIndex={16}
          className="chamfer-media-border mt-8 w-full min-w-0 md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={showOtherHalfAp16WhatWorks}
              aria-labelledby="other-half-ap16-what-works-label"
              onClick={() => setShowOtherHalfAp16WhatWorks((v) => !v)}
              className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
                showOtherHalfAp16WhatWorks
                  ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                  : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                  showOtherHalfAp16WhatWorks
                    ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                    : 'left-1 bg-white'
                }`}
                aria-hidden
              />
            </button>
            <span
              id="other-half-ap16-what-works-label"
              className={caseStudyChamferToggleLabelClassName}
            >
              {showOtherHalfAp16WhatWorks
                ? otherHalfWhatWorksToggleOn
                : otherHalfWhatWorksToggleOff}
            </span>
          </div>
          <div className="relative isolate w-full">
            <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
            <img
              src={ibmPartnerPortalAp16}
              alt="IBM partner portal — PCF request metrics, completion rate, and open requests"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-0 ${
                showOtherHalfAp16WhatWorks ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={ibmPartnerPortalAp16Alt}
              alt="IBM partner portal — request metrics and cards, alternate view"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-10 ${
                showOtherHalfAp16WhatWorks ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="four-methods-one-experience"
        aria-labelledby="four-methods-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="gap-y-6 md:gap-y-8">
          <h2
            id="four-methods-heading"
            className="col-span-12 m-0 max-w-[min(100%,48rem)] font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg [text-wrap:balance] md:text-[24px]"
          >
            {FOUR_METHODS_ONE_EXPERIENCE.title}
          </h2>
          <p className="col-span-12 m-0 max-w-[56rem] font-mono text-[12px] font-normal leading-relaxed text-fg/95 [text-wrap:pretty]">
            {FOUR_METHODS_ONE_EXPERIENCE.body}
          </p>

          <div className="col-span-12 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:gap-5">
            {FOUR_METHODS_ONE_EXPERIENCE.cards.map((card) => (
              <ChamferFrame
                key={card.n}
                fitContentHeight
                className="chamfer-tradeoff-outline figma-frame-static min-h-0 w-full min-w-0"
                innerClassName="min-w-0 overflow-hidden bg-elevated/20"
              >
                <div className="flex min-w-0 flex-col gap-3 p-4 md:flex-row md:gap-4 md:p-5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-full border border-fg/30 bg-elevated/30 font-mono text-base font-medium leading-none text-fg md:h-11 md:w-11"
                    aria-hidden
                  >
                    {card.n}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 font-mono text-[17px] font-medium leading-snug tracking-[-0.02em] text-fg sm:text-lg">
                      {card.title}
                    </h3>
                    <p className="m-0 mt-2 text-[12px] font-mono font-normal leading-relaxed text-fg/90 [text-wrap:pretty]">
                      {card.body}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border border-fg/25 bg-transparent px-2.5 py-1 font-mono text-[10px] font-normal leading-none tracking-wide text-fg/90"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ChamferFrame>
            ))}
          </div>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={17}
          className="chamfer-media-border mt-8 w-full min-w-0 md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={showAllMethodFlows}
              aria-labelledby="method-flows-toggle-label"
              onClick={() => setShowAllMethodFlows((v) => !v)}
              className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
                showAllMethodFlows
                  ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                  : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                  showAllMethodFlows
                    ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                    : 'left-1 bg-white'
                }`}
                aria-hidden
              />
            </button>
            <span
              id="method-flows-toggle-label"
              className={caseStudyChamferToggleLabelClassName}
            >
              {showAllMethodFlows ? methodFlowsToggleOn : methodFlowsToggleOff}
            </span>
          </div>
          <div className="relative isolate w-full">
            <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
            <img
              src={ibmMethodFlowsAp18}
              alt="IBM Envizi — four parallel action-plan method flows, supplier-specific path highlighted"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-0 ${
                showAllMethodFlows ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={ibmMethodFlowsAp18Alt}
              alt="IBM Envizi — all four method flows visible, parallel branching comparison"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-10 ${
                showAllMethodFlows ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="before-vs-after-action-plans"
        aria-labelledby="before-vs-after-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="gap-y-5 md:gap-y-6">
          <p className="col-span-12 m-0 font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-fg/75">
            {BEFORE_VS_AFTER.kicker}:
          </p>
          <h2
            id="before-vs-after-heading"
            className="col-span-12 m-0 max-w-[min(100%,52rem)] font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg [text-wrap:balance] md:text-[24px]"
          >
            {BEFORE_VS_AFTER.title}
          </h2>

          <div className="col-span-12 mt-2 grid min-w-0 grid-cols-1 gap-8 md:mt-0 md:grid-cols-3 md:gap-6 lg:gap-8">
            <div className="min-w-0 font-mono text-[12px] font-normal leading-relaxed text-fg/95">
              <p className="m-0 text-[12px] font-medium text-fg">{BEFORE_VS_AFTER.beforeLabel}</p>
              <ul className="mb-0 mt-2 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/60 md:mt-2.5 md:pl-5">
                {BEFORE_VS_AFTER.beforeList.map((item) => (
                  <li key={item} className="[text-wrap:pretty] pl-0.5">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 font-mono text-[12px] font-normal leading-relaxed text-fg/95">
              <p className="m-0 text-[12px] font-medium text-fg">{BEFORE_VS_AFTER.afterLabel}</p>
              <ul className="mb-0 mt-2 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/60 md:mt-2.5 md:pl-5">
                {BEFORE_VS_AFTER.afterList.map((item) => (
                  <li key={item} className="[text-wrap:pretty] pl-0.5">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 font-mono text-[12px] font-normal leading-relaxed text-fg/95">
              <p className="m-0 text-[12px] font-medium text-fg">{BEFORE_VS_AFTER.whatChangedLabel}</p>
              <p className="m-0 mt-2 [text-wrap:pretty] text-fg/90 md:mt-2.5">
                {BEFORE_VS_AFTER.whatChanged}
              </p>
            </div>
          </div>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={18}
          className="chamfer-media-border mt-8 w-full min-w-0 md:mt-10"
          innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
        >
          <div className="flex w-full shrink-0 items-center justify-center gap-3 border-b border-fg/[0.12] bg-surface py-3 md:gap-4 md:py-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={showBeforeAfterDetails}
              aria-labelledby="before-after-details-toggle-label"
              onClick={() => setShowBeforeAfterDetails((v) => !v)}
              className={`group relative h-7 w-12 shrink-0 cursor-pointer rounded-full border p-0 transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
                showBeforeAfterDetails
                  ? 'border-white bg-white hover:bg-[#f2f2f2] hover:shadow-[0_1px_8px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]'
                  : 'border-white bg-transparent hover:bg-white/[0.12] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_35%,transparent)]'
              }`}
            >
              <span
                className={`pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-none transition-[left,background-color,transform] duration-200 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100 ${
                  showBeforeAfterDetails
                    ? 'left-[calc(100%-0.25rem-1.25rem)] bg-bg'
                    : 'left-1 bg-white'
                }`}
                aria-hidden
              />
            </button>
            <span
              id="before-after-details-toggle-label"
              className={caseStudyChamferToggleLabelClassName}
            >
              {showBeforeAfterDetails
                ? beforeAfterDetailsToggleOn
                : beforeAfterDetailsToggleOff}
            </span>
          </div>
          <div className="relative isolate w-full">
            <IbmToggleAspectSpacer pixelWidth={2880} pixelHeight={1800} />
            <img
              src={ibmBeforeAfterAp19}
              alt="IBM Envizi — before action plans, manual fragmented process vs after, guided in-product workflow"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-0 ${
                showBeforeAfterDetails ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={ibmBeforeAfterAp19Alt}
              alt="IBM Envizi — before vs after process comparison, full detail"
              decoding="async"
              loading="eager"
              className={`${chamferToggleStackLayerClass} z-10 ${
                showBeforeAfterDetails ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </ChamferFrame>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="impact-outcomes"
        aria-labelledby="impact-outcomes-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="gap-y-6 md:gap-y-8 md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <p className="col-span-12 m-0 font-mono text-[12px] font-medium leading-snug text-fg/90">
            {IBM_IMPACT_OUTCOMES.kicker}
          </p>
          <h2
            id="impact-outcomes-heading"
            className="col-span-12 m-0 max-w-[min(100%,40rem)] font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg [text-wrap:balance] md:text-[24px]"
          >
            {IBM_IMPACT_OUTCOMES.title}
          </h2>

          <div className="col-span-12 grid min-w-0 grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
            {IBM_IMPACT_OUTCOMES.columns.map((col) => (
              <div
                key={col.heading}
                className="min-w-0 font-mono text-[12px] font-normal leading-relaxed text-fg/95"
              >
                <p className="m-0 text-[12px] font-medium text-fg">{col.heading}</p>
                <ul className="mb-0 mt-2 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/60 md:mt-2.5 md:pl-5">
                  {col.items.map((item) => (
                    <li key={item} className="[text-wrap:pretty] pl-0.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </FigmaGrid12>

        <ChamferFrame
          presentationMediaIndex={19}
          className="chamfer-media-border mt-8 w-full min-w-0 md:mt-10"
          innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
        >
          <IbmActionPlansAutoplayVideo src={ibmActionPlansPrototypeVideo} />
        </ChamferFrame>
      </section>

      <div id="retro-title" className={caseStudyScrollAnchorClass}>
        <div className="mx-auto mt-10 w-full max-w-4xl px-2 md:mt-14 md:px-4">
          <ProblemStatementGlitchFramedBlock frameClassName="font-mono" containerClassName="w-full max-w-[56rem]">
            <p className="m-0 text-balance text-center">
              I took a fragmented, undefined process and turned it into a product teams could actually
              run at enterprise scale.
            </p>
          </ProblemStatementGlitchFramedBlock>
        </div>

        <FigmaGrid12 className="mt-8 md:mt-10" aria-labelledby="ibm-retrospective-heading">
          <ChamferFrame
            meteorTrail
            className="col-span-12 md:col-span-8 md:col-start-3"
            innerClassName="px-4 py-12 text-left md:px-6 md:py-16"
          >
            <h2
              id="ibm-retrospective-heading"
              className="text-left text-base font-normal text-fg md:text-[40px]"
            >
              Retrospective
            </h2>
            <div className="mt-8 flex max-w-2xl flex-col gap-6 font-mono text-[12px] font-normal leading-relaxed text-fg">
              <p className="m-0">What I learned</p>
              <ul className="m-0 list-outside list-disc space-y-3 pl-5 marker:text-fg">
                <li className="pl-1">Complex systems stall when no one owns the ambiguity.</li>
                <li className="pl-1">Main flows are easy. Real usability happens in exceptions.</li>
                <li className="pl-1">
                  In expert-heavy domains, users need confidence more than options.
                </li>
                <li className="pl-1">Dashboards explain problems. Systems solve them.</li>
              </ul>
              <p className="m-0">What I&apos;d explore next</p>
              <ul className="m-0 list-outside list-disc space-y-3 pl-5 marker:text-fg">
                <li className="pl-1">Automated supplier follow-up</li>
                <li className="pl-1">Smarter validation checks</li>
                <li className="pl-1">Benchmarking supplier maturity</li>
                <li className="pl-1">Pathways from measurement to reduction</li>
              </ul>
            </div>
            <ChamferFrame
              fitContentHeight
              className="chamfer-tradeoff-outline mt-8 w-fit max-w-full shrink-0"
              innerClassName="flex min-h-0 min-w-0 items-center justify-start overflow-hidden bg-bg p-0"
            >
              <img
                src={ibmRetrospectiveConfusedGif}
                alt="Confused reaction"
                decoding="async"
                loading="lazy"
                className={ibmRetrospectiveGifImgClass}
              />
            </ChamferFrame>
          </ChamferFrame>
        </FigmaGrid12>
      </div>

      <div className="figma-rule my-[32px]" aria-hidden />
      <ExperimentalCaseStudiesPanel layout="footer" />
    </CaseStudyShowcaseScaffold>
  )
}
