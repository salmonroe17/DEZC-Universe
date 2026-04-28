/**
 * IBM Envizi case study presentation deck — same pattern as {@link ../carbon/CarbonPresentationDeck.tsx}
 * and {@link ../super/SuperPresentationDeck.tsx}: text slides mirror sections, then image / video / toggle slides.
 */
import { type ReactNode } from 'react'
import ibmHeroAp1 from '../../../IBM case study assets/ap1.png'
import ibmOverviewAp2 from '../../../IBM case study assets/ap2.png'
import ibmOverviewAp3 from '../../../IBM case study assets/ap3.png'
import ibmProblemSurfaceAp4 from '../../../IBM case study assets/ap4.png'
import ibmProblemSurfaceAp4Alt from '../../../IBM case study assets/ap4.1.png'
import ibmTensionsVennAp5 from '../../../IBM case study assets/ap5.png'
import ibmWorkshopFindingsAp6 from '../../../IBM case study assets/ap6.png'
import ibmActionPlansWorkflowAp7 from '../../../IBM case study assets/ap7.png'
import ibmActionLayerAp8 from '../../../IBM case study assets/ap8.png'
import ibmActionLayerAp8Alt from '../../../IBM case study assets/ap8.1.png'
import ibmCriteriaSelectionAp9 from '../../../IBM case study assets/ap9.png'
import ibmCriteriaSelectionAp9Alt from '../../../IBM case study assets/ap9.1.png'
import ibmDefineSuccessAp10 from '../../../IBM case study assets/ap10.png'
import ibmDefineSuccessAp10Alt from '../../../IBM case study assets/ap10.1.png'
import ibmExecuteActionsAp11 from '../../../IBM case study assets/ap11.png'
import ibmExecuteActionsAp11Alt from '../../../IBM case study assets/ap11.1.png'
import ibmTrackProgressAp12 from '../../../IBM case study assets/ap12.png'
import ibmTrackProgressAp12Alt from '../../../IBM case study assets/ap12.1.png'
import ibmTrackProgressAp13 from '../../../IBM case study assets/ap13.png'
import ibmEmissionsComparisonAp14 from '../../../IBM case study assets/ap14.png'
import ibmEmissionsComparisonAp14Alt from '../../../IBM case study assets/ap14.1.png'
import ibmPartnerPortalAp15 from '../../../IBM case study assets/ap15.png'
import ibmPartnerPortalAp15Alt from '../../../IBM case study assets/ap15.1.png'
import ibmPartnerPortalAp16 from '../../../IBM case study assets/ap16.png'
import ibmPartnerPortalAp16Alt from '../../../IBM case study assets/ap16.1.png'
import ibmMethodFlowsAp18 from '../../../IBM case study assets/ap18.png'
import ibmMethodFlowsAp18Alt from '../../../IBM case study assets/ap18.1.png'
import ibmBeforeAfterAp19 from '../../../IBM case study assets/ap19.png'
import ibmBeforeAfterAp19Alt from '../../../IBM case study assets/ap19.1.png'
import ibmActionPlansPrototypeVideo from '../../../IBM case study assets/IBM prototype video action plans 720p.mp4'
import ibmRetrospectiveConfusedGif from '../../../IBM case study assets/confused.gif'
import ibmHeroShipGif from '../../../IBM case study assets/ship.gif'
import {
  caseStudyTeamConnectorHorizontal,
  caseStudyTradeConnectorHorizontal,
  caseStudyTradeConnectorVertical,
} from '../../components/caseStudy/CaseStudyFlowConnectors'
import {
  ProblemStatementFrame,
  ProblemStatementGlitchFramedBlock,
  TimelinePillsRow,
  caseStudyTeamResponsibilityTextClass,
  caseStudyTeamRoleColumnClass,
  caseStudyTeamRowConnectorCellClass,
  caseStudyTeamRowLiClass,
  caseStudyTeamRowListClass,
} from '../../components/caseStudy/patterns'
import type { CaseStudyPresentationSlide } from '../../components/caseStudy/CaseStudyShowcaseScaffold'
import { IbmToggleAspectSpacer } from '../../components/caseStudy/IbmChamferMediaPlaceholder'
import { ChamferFrame } from '../../components/system/ChamferFrame'
import { FigmaGrid12 } from '../../components/system/FigmaGrid'
import { RotatingGradientCircle } from '../../components/system/RotatingGradientCircle'
import {
  BEFORE_VS_AFTER,
  CRITERIA_SELECTION_STEP_2,
  DEFINE_MEASURABLE_SUCCESS_STEP_3,
  EXECUTE_ACTIONS_STEP_4,
  FOUR_METHODS_ONE_EXPERIENCE,
  IBM_IMPACT_OUTCOMES,
  MAKING_EMISSIONS_CHANGES,
  OTHER_HALF_OF_SYSTEM,
  TRACK_PROGRESS_STEP_5,
} from './ibmEnviziContentBlocks'
import { IbmActionLayerStep1Chamfer, IbmCoreFlowStepBlock } from './ibmEnviziContentComponents'
import { IbmDeckAutoplayVideo } from './IbmDeckAutoplayVideo'
import { IbmDeckToggleChamfer } from './IbmDeckToggleChamfer'

const deckMaxW = 'mx-auto w-full max-w-[min(100%,1156px)]'

const chamferToggleStackLayerClass =
  'pointer-events-none absolute inset-0 h-full w-full max-w-full object-contain object-left object-top align-middle'

const ACTION_PLANS_FLOW_CREATING = [
  '1.\nSelect\ntemplate',
  '2.\nCriteria\nselection',
  '3.\nDefine\ngoal',
  '4.\nSelect\nactions',
  '5.\nTrack\nprogress',
] as const

const ACTION_PLANS_FLOW_TRACKING = ['1. Send requests', '2. Review responses', '3. Approve emissions'] as const

const ACTION_LAYER_INTRO_COLUMNS = [
  'One of the clearest system-level moves was naming what this was: not a feature, but a workflow layer that sat alongside the reporting engine.',
  'Before this, the product was a surface for seeing emissions. The redesign added a system for improving them – from identifying weak calculations, to coordinating suppliers, to comparing the impact of better inputs.',
  'This shifted the product from read-only reporting to an operational tool.',
] as const

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

const TEAM_ROWS_DECK: { role: string; responsibility: string }[] = [
  {
    role: 'Lead product designer (me)',
    responsibility:
      'Primary designer on Action Plans. Owned flows, logic, specs, handoff, and QA end-to-end.',
  },
  {
    role: 'Scope 3 Product Manager',
    responsibility: 'Domain lead. Brought complex requirements; I translated them into product.',
  },
  {
    role: 'STSM / Software Architect',
    responsibility: 'Systems architecture. Partnered on feasibility and component strategy.',
  },
  {
    role: 'Senior Software Architect',
    responsibility: 'Technical direction for the Angular implementation.',
  },
  {
    role: 'Lead Software Developer',
    responsibility: 'Day-to-day engineering partner through build and QA.',
  },
  {
    role: 'Product Designer · Content Designer · UX Researcher',
    responsibility: 'Supporting design, writing, and research across adjacent areas.',
  },
]

const ACTION_PLANS_WORKFLOW_BULLETS = [
  'Identify weak calculations',
  'Choose a stronger method',
  'Target suppliers',
  'Request better inputs',
  'Compare impact',
  'Track progress over time',
] as const

const problemSurfaceStrugglesToggleLabelOff = 'Show the goals'
const problemSurfaceStrugglesToggleLabelOn = 'Hide the goals'
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

const ibmRetrospectiveGifImgClass =
  'block size-24 max-h-24 max-w-24 shrink-0 object-cover object-center md:size-28 md:max-h-28 md:max-w-28'

const IBM_PRESENTATION_SLIDES_BASE = [
  {
    content: (
      <ChamferFrame
        className={`chamfer-media-border ${deckMaxW}`}
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-[#d9d5cf]/50 p-0 dark:bg-surface/25"
      >
        <img
          src={ibmHeroAp1}
          alt="IBM Envizi product UI — action plans, supplier PCFs, emissions overview, and iMac view"
          decoding="async"
          className="block h-auto w-full max-w-full align-middle"
        />
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
          className="m-0 min-w-0 flex-1 text-pretty text-left text-[clamp(1.5rem,4.2vw,2.5rem)] font-mono font-normal leading-snug tracking-[-0.04em] text-fg"
        >
          Turning an undefined emissions workflow into a shipped enterprise system
        </h1>
        <div data-presentation-media-region className="shrink-0 self-center lg:ml-auto">
          <RotatingGradientCircle
            className="aspect-square w-[min(52vw,11rem)] shrink-0 md:w-[min(42vw,15rem)] lg:w-[min(34vw,17.5rem)]"
            innerClassName="bg-bg p-0"
            aria-hidden
          >
            <img
              src={ibmHeroShipGif}
              alt=""
              className="pointer-events-none block h-full w-full object-cover object-center select-none"
              loading="lazy"
              decoding="async"
            />
          </RotatingGradientCircle>
        </div>
      </div>
    ),
  },
  {
    content: (
      <ChamferFrame
        className={`chamfer-media-border ${deckMaxW}`}
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <IbmDeckAutoplayVideo src={ibmActionPlansPrototypeVideo} />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
        <h2 className="col-span-12 max-w-[40ch] text-[clamp(1.25rem,2.5vw,1.75rem)] font-mono font-normal leading-snug tracking-[-0.02em] text-fg [text-wrap:balance] sm:max-w-none">
          Scope 3. Four methods. One shipped system.
        </h2>
        <div className="col-span-12 md:col-span-4">
          <h3 className="text-[12px] font-mono font-normal leading-none text-fg">What does the company do?</h3>
          <ChamferFrame
            fitContentHeight
            className="mt-4 w-full md:mt-5"
            innerClassName="p-5 text-[12px] font-mono leading-[1.55] text-fg md:p-6 md:leading-relaxed"
          >
            <p className="m-0">
              <span className="text-fg">IBM Envizi</span> is an enterprise sustainability platform used by global
              organizations to track and report emissions data.
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
            <p className="mb-0 mt-4 text-fg/90 md:mt-5">Not a redesign — a new category of workflow.</p>
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
          <h3 className="mt-2 text-[12px] font-mono font-normal leading-none text-fg md:mt-6">Team</h3>
          <ul className={`${caseStudyTeamRowListClass} font-mono`}>
            {TEAM_ROWS_DECK.map((row) => (
              <li key={row.role} className={caseStudyTeamRowLiClass}>
                <span
                  className={`${caseStudyTeamRoleColumnClass} text-left text-[14px] leading-snug text-fg`}
                >
                  {row.role}
                </span>
                <span className={caseStudyTeamRowConnectorCellClass}>
                  {caseStudyTeamConnectorHorizontal}
                </span>
                <span className={caseStudyTeamResponsibilityTextClass}>{row.responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <ChamferFrame
        className={`chamfer-media-border ${deckMaxW}`}
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <img
          src={ibmOverviewAp2}
          alt="IBM Envizi case study — supporting visual 1 (overview)"
          decoding="async"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <ChamferFrame
        className={`chamfer-media-border ${deckMaxW}`}
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <img
          src={ibmOverviewAp3}
          alt="IBM Envizi case study — supporting visual 2 (overview)"
          decoding="async"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <ProblemStatementFrame
        label="The problem"
        framedStatementClassName="font-mono"
        className="w-full"
        afterRule={
          <FigmaGrid12 className="font-mono md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
            <div className="col-span-12 md:col-span-5">
              <p className="m-0 text-[12px] leading-[1.55] text-fg">
                IBM Envizi surfaces emissions data across every vertical – but stops helping the moment
                you need to act on it.
              </p>
              <p className="m-0 mt-4 text-[12px] leading-[1.55] text-fg md:mt-5">Without a system, teams were forced into:</p>
              <ul className="mb-0 mt-3 list-disc space-y-2 pl-[1.15rem] text-[12px] leading-[1.55] text-fg md:mt-4 md:space-y-2.5 md:pl-5">
                {PROBLEM_EXISTING_SCREEN_ASKS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 md:col-span-7">
              <h3 className="m-0 text-[12px] font-medium leading-snug text-fg">This created multiple major problems:</h3>
              <div className="mt-4 flex flex-col gap-4 md:mt-5 md:gap-5">
                {PROBLEM_MAJOR_ISSUES.map((item) => (
                  <ChamferFrame
                    key={item.title}
                    fitContentHeight
                    className="w-full"
                    innerClassName="flex flex-col bg-surface/20 p-5 text-left md:p-6"
                  >
                    <p className="m-0 text-[20px] font-medium leading-snug text-fg">{item.title}</p>
                    <p className="mb-0 mt-2 text-[12px] leading-relaxed text-fg/90 md:mt-3">{item.body}</p>
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
    ),
  },
  {
    content: (
      <IbmDeckToggleChamfer
        baseSrc={ibmProblemSurfaceAp4}
        toggledSrc={ibmProblemSurfaceAp4Alt}
        baseAlt="IBM Envizi — Emissions dashboard, overview"
        toggledAlt="IBM Envizi — Emissions dashboard, alternate view"
        toggleLabelOff={problemSurfaceStrugglesToggleLabelOff}
        toggleLabelOn={problemSurfaceStrugglesToggleLabelOn}
      />
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <h2 className="col-span-12 m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg">
          The tensions that shaped the work
        </h2>
        <p className="col-span-12 mb-2 mt-2 font-mono text-[12px] font-normal leading-relaxed text-fg md:mb-3 md:mt-3">
          This wasn&apos;t about polishing screens. It was about giving the product a layer it fundamentally
          lacked.
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
              <div className="hidden min-h-0 min-w-0 w-full items-center md:flex">{caseStudyTradeConnectorHorizontal}</div>
              <div className="flex min-h-0 w-full justify-start py-0.5 md:hidden">{caseStudyTradeConnectorVertical}</div>
              <p className="m-0 min-w-0 w-full text-left font-mono text-[12px] font-normal leading-relaxed text-fg md:w-auto">
                {row.body}
              </p>
            </ChamferFrame>
          ))}
        </div>
        <div className="col-span-12 mt-10 font-mono text-[12px] font-normal leading-relaxed text-fg md:mt-12">
          <p className="m-0 [text-wrap:pretty]">
            The work had to preserve the rigor of the reporting engine while making the whole experience
            feel like it belonged to one system.
          </p>
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <ChamferFrame
        className={`chamfer-media-border ${deckMaxW}`}
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <img
          src={ibmTensionsVennAp5}
          alt="IBM Envizi case study — business needs, user needs, and solution in a Venn diagram"
          decoding="async"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
        <h2 className="col-span-12 m-0 font-mono text-[24px] font-normal leading-snug text-fg">From ambiguous brief to product system.</h2>
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
        <p className="col-span-12 mt-10 font-mono text-[12px] font-normal leading-relaxed text-fg [text-wrap:pretty] md:mt-12">
          This shifted the work from &apos;design a flow&apos; into &apos;define what this product layer
          should be.&apos; The output wasn&apos;t screens. It was the structural logic every downstream screen
          would follow.
        </p>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <ChamferFrame
        className={`chamfer-media-border ${deckMaxW}`}
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <img
          src={ibmWorkshopFindingsAp6}
          alt="Workshop findings — four columns of problems and opportunities from alignment sessions"
          decoding="async"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
        <h2 className="col-span-12 m-0 font-mono text-[24px] font-normal leading-snug text-fg [text-wrap:balance]">
          Dashboards inform. Workflows improve.
        </h2>
        <div className="col-span-12 md:col-span-4">
          <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg [text-wrap:pretty]">
            The existing product helped customers see emissions totals. But totals alone do not improve data
            quality.
          </p>
        </div>
        <div className="col-span-12 font-mono text-[12px] leading-relaxed text-fg md:col-span-4">
          <p className="m-0 [text-wrap:pretty]">What customers needed was a workflow layer that helped them:</p>
          <ul className="mb-0 mt-3 list-disc space-y-1.5 pl-[1.15rem] marker:text-fg/80 md:mt-4 md:space-y-2 md:pl-5">
            {ACTION_PLANS_WORKFLOW_BULLETS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 flex items-start md:col-span-4">
          <p className="m-0 font-mono text-[24px] font-medium leading-snug text-fg [text-wrap:balance]">That insight became Action Plans.</p>
        </div>
        <p className="col-span-12 m-0 mt-10 font-mono text-[12px] font-normal text-fg/90 [text-wrap:balance] md:mt-12" id="deck-ap-flow-creating">
          Creating an action plan
        </p>
        <div className="col-span-12 -mx-1 w-full min-w-0 overflow-x-auto px-1 pb-1 md:overflow-visible md:pb-0">
          <TimelinePillsRow
            stepLabels={ACTION_PLANS_FLOW_CREATING}
            ariaLabelledBy="deck-ap-flow-creating"
            pillTextMode="multiline"
          />
        </div>
        <p className="col-span-12 m-0 mt-8 font-mono text-[12px] font-normal text-fg/90 [text-wrap:balance] md:mt-10" id="deck-ap-flow-tracking">
          Track action plan progress
        </p>
        <div className="col-span-12 -mx-1 w-full min-w-0 overflow-x-auto px-1 pb-1 md:overflow-visible md:pb-0">
          <TimelinePillsRow stepLabels={ACTION_PLANS_FLOW_TRACKING} ariaLabelledBy="deck-ap-flow-tracking" />
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <ChamferFrame
        className={`chamfer-media-border ${deckMaxW}`}
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-[#d9d5cf]/50 p-0 dark:bg-surface/25"
      >
        <img
          src={ibmActionPlansWorkflowAp7}
          alt="Action Plans — creating a plan and tracking progress, step-by-step UI"
          decoding="async"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <h2 className="col-span-12 m-0 max-w-[48ch] font-mono text-[clamp(1.25rem,2.6vw,1.75rem)] font-normal leading-snug tracking-tight text-fg [text-wrap:balance]">
          Action Plans became the action layer.
        </h2>
        <div className="col-span-12 grid grid-cols-1 gap-6 [font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif)] [font-variant-numeric:lining-nums] text-[12px] font-normal leading-relaxed text-fg/95 md:grid-cols-3 md:gap-[var(--figma-gutter)]">
          {ACTION_LAYER_INTRO_COLUMNS.map((p, i) => (
            <p key={i} className="m-0 [text-wrap:pretty]">
              {p}
            </p>
          ))}
        </div>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <IbmActionLayerStep1Chamfer />
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <IbmDeckToggleChamfer
        baseSrc={ibmActionLayerAp8}
        toggledSrc={ibmActionLayerAp8Alt}
        baseAlt="IBM Envizi — select action plan type, template cards"
        toggledAlt="IBM Envizi — select action plan type, alternate view"
        toggleLabelOff={actionLayerWhatWorksToggleOff}
        toggleLabelOn={actionLayerWhatWorksToggleOn}
      />
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <ChamferFrame
          fitContentHeight
          className="chamfer-tradeoff-outline figma-frame-static col-span-12 w-full"
          innerClassName="min-w-0 overflow-hidden bg-elevated/20"
        >
          <IbmCoreFlowStepBlock
            rootClassName="w-full p-5 md:p-6"
            step={CRITERIA_SELECTION_STEP_2.step}
            title={CRITERIA_SELECTION_STEP_2.title}
            kicker={CRITERIA_SELECTION_STEP_2.kicker}
            centerColumn={CRITERIA_SELECTION_STEP_2.centerColumn}
            rightIntro={CRITERIA_SELECTION_STEP_2.rightIntro}
            listItems={CRITERIA_SELECTION_STEP_2.listItems}
            heading="h2"
            headingId="deck-criteria-heading"
          />
        </ChamferFrame>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <IbmDeckToggleChamfer
        baseSrc={ibmCriteriaSelectionAp9}
        toggledSrc={ibmCriteriaSelectionAp9Alt}
        baseAlt="IBM Envizi — criteria selection, supplier-specific method and treemap"
        toggledAlt="IBM Envizi — criteria selection, alternate view"
        toggleLabelOff={criteriaSelectionWhatWorksToggleOff}
        toggleLabelOn={criteriaSelectionWhatWorksToggleOn}
      />
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <ChamferFrame
          fitContentHeight
          className="chamfer-tradeoff-outline figma-frame-static col-span-12 w-full"
          innerClassName="min-w-0 overflow-hidden bg-elevated/20"
        >
          <IbmCoreFlowStepBlock
            rootClassName="w-full p-5 md:p-6"
            step={DEFINE_MEASURABLE_SUCCESS_STEP_3.step}
            title={DEFINE_MEASURABLE_SUCCESS_STEP_3.title}
            kicker={DEFINE_MEASURABLE_SUCCESS_STEP_3.kicker}
            centerColumn={DEFINE_MEASURABLE_SUCCESS_STEP_3.centerColumn}
            rightIntro={DEFINE_MEASURABLE_SUCCESS_STEP_3.rightIntro}
            listItems={DEFINE_MEASURABLE_SUCCESS_STEP_3.listItems}
            heading="h2"
            headingId="deck-define-heading"
          />
        </ChamferFrame>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <IbmDeckToggleChamfer
        baseSrc={ibmDefineSuccessAp10}
        toggledSrc={ibmDefineSuccessAp10Alt}
        baseAlt="IBM Envizi — set a goal, program summary, and estimated program milestones"
        toggledAlt="IBM Envizi — define success, alternate view"
        toggleLabelOff={defineSuccessWhatWorksToggleOff}
        toggleLabelOn={defineSuccessWhatWorksToggleOn}
      />
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <ChamferFrame
          fitContentHeight
          className="chamfer-tradeoff-outline figma-frame-static col-span-12 w-full"
          innerClassName="min-w-0 overflow-hidden bg-elevated/20"
        >
          <IbmCoreFlowStepBlock
            rootClassName="w-full p-5 md:p-6"
            step={EXECUTE_ACTIONS_STEP_4.step}
            title={EXECUTE_ACTIONS_STEP_4.title}
            kicker={EXECUTE_ACTIONS_STEP_4.kicker}
            centerColumn={EXECUTE_ACTIONS_STEP_4.centerColumn}
            rightIntro={EXECUTE_ACTIONS_STEP_4.rightIntro}
            listItems={EXECUTE_ACTIONS_STEP_4.listItems}
            heading="h2"
            headingId="deck-execute-heading"
          />
        </ChamferFrame>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <IbmDeckToggleChamfer
        baseSrc={ibmExecuteActionsAp11}
        toggledSrc={ibmExecuteActionsAp11Alt}
        baseAlt="IBM Envizi action plan — configure program actions"
        toggledAlt="IBM Envizi action plan — configure actions, alternate view"
        toggleLabelOff={executeActionsWhatWorksToggleOff}
        toggleLabelOn={executeActionsWhatWorksToggleOn}
      />
    ),
  },
  {
    content: (
      <FigmaGrid12>
        <ChamferFrame
          fitContentHeight
          className="chamfer-tradeoff-outline figma-frame-static col-span-12 w-full"
          innerClassName="min-w-0 overflow-hidden bg-elevated/20"
        >
          <IbmCoreFlowStepBlock
            rootClassName="w-full p-5 md:p-6"
            step={TRACK_PROGRESS_STEP_5.step}
            title={TRACK_PROGRESS_STEP_5.title}
            kicker={TRACK_PROGRESS_STEP_5.kicker}
            centerColumn={TRACK_PROGRESS_STEP_5.centerColumn}
            rightIntro={TRACK_PROGRESS_STEP_5.rightIntro}
            listItems={TRACK_PROGRESS_STEP_5.listItems}
            heading="h2"
            headingId="deck-track-heading"
          />
        </ChamferFrame>
      </FigmaGrid12>
    ),
  },
  {
    content: (
      <IbmDeckToggleChamfer
        baseSrc={ibmTrackProgressAp12}
        toggledSrc={ibmTrackProgressAp12Alt}
        baseAlt="IBM Envizi program dashboard — progress and supplier activity"
        toggledAlt="IBM Envizi program dashboard — alternate view with annotations"
        toggleLabelOff={trackProgressWhatWorksToggleOff}
        toggleLabelOn={trackProgressWhatWorksToggleOn}
      />
    ),
  },
  {
    content: (
      <ChamferFrame
        className={`chamfer-media-border ${deckMaxW}`}
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
    ),
  },
  {
    content: (
      <FigmaGrid12 className="gap-y-6 md:gap-y-8">
        <h2 className="col-span-12 m-0 max-w-[40rem] font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg [text-wrap:balance] md:text-[24px]">
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
    ),
  },
  {
    content: (
      <IbmDeckToggleChamfer
        baseSrc={ibmEmissionsComparisonAp14}
        toggledSrc={ibmEmissionsComparisonAp14Alt}
        baseAlt="IBM Envizi — PCF data request and comparison view"
        toggledAlt="IBM Envizi — comparison and recalculation experience, annotated"
        toggleLabelOff={emissionsChangesWhatWorksToggleOff}
        toggleLabelOn={emissionsChangesWhatWorksToggleOn}
      />
    ),
  },
  {
    content: (
      <FigmaGrid12 className="gap-y-6 md:gap-y-8">
        <h2 className="col-span-12 m-0 max-w-[48rem] font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg [text-wrap:balance] md:text-[24px]">
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
    ),
  },
  {
    content: (
      <IbmDeckToggleChamfer
        baseSrc={ibmPartnerPortalAp15}
        toggledSrc={ibmPartnerPortalAp15Alt}
        baseAlt="IBM partner portal — welcome dashboard, PCF and SBTi requests"
        toggledAlt="IBM partner portal — product carbon footprint request detail, alternate view"
        toggleLabelOff={otherHalfWhatWorksToggleOff}
        toggleLabelOn={otherHalfWhatWorksToggleOn}
      />
    ),
  },
  {
    content: (
      <IbmDeckToggleChamfer
        baseSrc={ibmPartnerPortalAp16}
        toggledSrc={ibmPartnerPortalAp16Alt}
        baseAlt="IBM partner portal — PCF request metrics, completion rate, and open requests"
        toggledAlt="IBM partner portal — request metrics and cards, alternate view"
        toggleLabelOff={otherHalfWhatWorksToggleOff}
        toggleLabelOn={otherHalfWhatWorksToggleOn}
      />
    ),
  },
  {
    content: (
      <FigmaGrid12 className="gap-y-6 md:gap-y-8">
        <h2 className="col-span-12 m-0 max-w-[min(100%,48rem)] font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg [text-wrap:balance] md:text-[24px]">
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
    ),
  },
  {
    content: (
      <IbmDeckToggleChamfer
        baseSrc={ibmMethodFlowsAp18}
        toggledSrc={ibmMethodFlowsAp18Alt}
        baseAlt="IBM Envizi — four parallel action-plan method flows"
        toggledAlt="IBM Envizi — all four method flows visible"
        toggleLabelOff={methodFlowsToggleOff}
        toggleLabelOn={methodFlowsToggleOn}
      />
    ),
  },
  {
    content: (
      <FigmaGrid12 className="gap-y-5 md:gap-y-6">
        <p className="col-span-12 m-0 font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-fg/75">
          {BEFORE_VS_AFTER.kicker}:
        </p>
        <h2 className="col-span-12 m-0 max-w-[min(100%,52rem)] font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg [text-wrap:balance] md:text-[24px]">
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
    ),
  },
  {
    content: (
      <IbmDeckToggleChamfer
        baseSrc={ibmBeforeAfterAp19}
        toggledSrc={ibmBeforeAfterAp19Alt}
        baseAlt="IBM Envizi — before action plans vs after, guided in-product workflow"
        toggledAlt="IBM Envizi — before vs after process comparison, full detail"
        toggleLabelOff={beforeAfterDetailsToggleOff}
        toggleLabelOn={beforeAfterDetailsToggleOn}
      />
    ),
  },
  {
    content: (
      <FigmaGrid12 className="gap-y-6 md:gap-y-8 md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
        <p className="col-span-12 m-0 font-mono text-[12px] font-medium leading-snug text-fg/90">
          {IBM_IMPACT_OUTCOMES.kicker}
        </p>
        <h2 className="col-span-12 m-0 max-w-[min(100%,40rem)] font-mono text-[20px] font-medium leading-snug tracking-[-0.02em] text-fg [text-wrap:balance] md:text-[24px]">
          {IBM_IMPACT_OUTCOMES.title}
        </h2>
        <div className="col-span-12 grid min-w-0 grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {IBM_IMPACT_OUTCOMES.columns.map((col) => (
            <div key={col.heading} className="min-w-0 font-mono text-[12px] font-normal leading-relaxed text-fg/95">
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
    ),
  },
  {
    content: (
      <ChamferFrame
        className={`chamfer-media-border ${deckMaxW}`}
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <IbmDeckAutoplayVideo src={ibmActionPlansPrototypeVideo} />
      </ChamferFrame>
    ),
  },
  {
    content: (
      <div className="mx-auto w-full max-w-4xl px-2 md:px-4">
        <ProblemStatementGlitchFramedBlock frameClassName="font-mono" containerClassName="w-full max-w-[56rem]">
          <p className="m-0 text-balance text-center">
            I took a fragmented, undefined process and turned it into a product teams could actually run at
            enterprise scale.
          </p>
        </ProblemStatementGlitchFramedBlock>
      </div>
    ),
  },
  {
    content: (
      <ChamferFrame
        meteorTrail
        className={`chamfer-media-border ${deckMaxW}`}
        innerClassName="px-4 py-10 text-left md:px-6 md:py-14"
      >
        <h2 className="text-left text-base font-normal text-fg md:text-[40px]">Retrospective</h2>
        <div className="mt-6 flex max-w-2xl flex-col gap-5 font-mono text-[12px] font-normal leading-relaxed text-fg md:mt-8 md:gap-6">
          <p className="m-0">What I learned</p>
          <ul className="m-0 list-outside list-disc space-y-2 pl-5 marker:text-fg md:space-y-3">
            <li className="pl-1">Complex systems stall when no one owns the ambiguity.</li>
            <li className="pl-1">Main flows are easy. Real usability happens in exceptions.</li>
            <li className="pl-1">In expert-heavy domains, users need confidence more than options.</li>
            <li className="pl-1">Dashboards explain problems. Systems solve them.</li>
          </ul>
          <p className="m-0">What I&apos;d explore next</p>
          <ul className="m-0 list-outside list-disc space-y-2 pl-5 marker:text-fg md:space-y-3">
            <li className="pl-1">Automated supplier follow-up</li>
            <li className="pl-1">Smarter validation checks</li>
            <li className="pl-1">Benchmarking supplier maturity</li>
            <li className="pl-1">Pathways from measurement to reduction</li>
          </ul>
        </div>
        <ChamferFrame
          fitContentHeight
          className="chamfer-tradeoff-outline mt-6 w-fit max-w-full shrink-0 md:mt-8"
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
    ),
  },
] satisfies Array<{ content: ReactNode }>

/**
 * On-page `presentationMediaIndex` (0–19) → deck slide index. Chamfer click opens the image / media slide
 * for that section. Retrospective is not a presentation target (read-only on the page).
 */
export const IBM_PRESENTATION_MEDIA_TO_SLIDE: readonly number[] = [
  0, 2, 4, 5, 7, 9, 11, 13, 16, 18, 20, 22, 24, 25, 27, 29, 30, 32, 34, 36,
]

const IBM_PRESENTATION_IMAGE_INDEX = new Set<number>(IBM_PRESENTATION_MEDIA_TO_SLIDE)

const IBM_PRESENTATION_TEXT_THUMB_LABELS: Record<number, string> = {
  1: 'Intro',
  3: 'Overview',
  6: 'Problem',
  8: 'Tensions',
  10: 'Alignment',
  12: 'Workflow',
  14: 'Action layer',
  15: 'Select template',
  17: 'Criteria',
  19: 'Define',
  21: 'Execute',
  23: 'Track',
  26: 'Emissions',
  28: 'Portal',
  31: 'Methods',
  33: 'Before/After',
  35: 'Impact',
  37: 'Quote',
}

const IBM_PRESENTATION_VIDEO_SLIDE_INDEX = new Set<number>([2, 36])

export const IBM_PRESENTATION_SLIDES: CaseStudyPresentationSlide[] = IBM_PRESENTATION_SLIDES_BASE.map((slide, i) => ({
  content: slide.content,
  slideKind: IBM_PRESENTATION_IMAGE_INDEX.has(i) ? ('image' as const) : ('text' as const),
  thumbnailLabel: IBM_PRESENTATION_TEXT_THUMB_LABELS[i],
  thumbnailIsVideo: IBM_PRESENTATION_VIDEO_SLIDE_INDEX.has(i),
}))

/** One preview per deck slide (39 slides), same order as {@link IBM_PRESENTATION_SLIDES}. */
export const IBM_PRESENTATION_THUMBNAILS = [
  ibmHeroAp1,
  ibmHeroAp1,
  ibmHeroAp1,
  ibmOverviewAp2,
  ibmOverviewAp2,
  ibmOverviewAp3,
  ibmProblemSurfaceAp4,
  ibmProblemSurfaceAp4,
  ibmTensionsVennAp5,
  ibmTensionsVennAp5,
  ibmWorkshopFindingsAp6,
  ibmWorkshopFindingsAp6,
  ibmActionPlansWorkflowAp7,
  ibmActionPlansWorkflowAp7,
  ibmActionLayerAp8,
  ibmActionLayerAp8,
  ibmActionLayerAp8,
  ibmCriteriaSelectionAp9,
  ibmCriteriaSelectionAp9,
  ibmDefineSuccessAp10,
  ibmDefineSuccessAp10,
  ibmExecuteActionsAp11,
  ibmExecuteActionsAp11,
  ibmTrackProgressAp12,
  ibmTrackProgressAp12,
  ibmTrackProgressAp13,
  ibmEmissionsComparisonAp14,
  ibmEmissionsComparisonAp14,
  ibmPartnerPortalAp15,
  ibmPartnerPortalAp16,
  ibmPartnerPortalAp16,
  ibmMethodFlowsAp18,
  ibmMethodFlowsAp18,
  ibmBeforeAfterAp19,
  ibmBeforeAfterAp19,
  ibmHeroAp1,
  ibmHeroAp1,
  ibmHeroAp1,
  ibmRetrospectiveConfusedGif,
] as const

export function ibmPresentationMediaToSlideIndex(mediaIndex: number): number {
  return IBM_PRESENTATION_MEDIA_TO_SLIDE[mediaIndex] ?? mediaIndex
}
