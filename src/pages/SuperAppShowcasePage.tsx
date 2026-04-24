import { useEffect, useRef } from 'react'
import superHeroS1 from '../../Super assets/s1.png'
import superOverviewS2 from '../../Super assets/s2.png'
import superProblemTwoUp from '../../Super assets/s3.png'
import superProblemTwoUpStruggles from '../../Super assets/s3.1.png'
import superProblemThreeUp from '../../Super assets/s4.png'
import superProblemThreeUpStruggles from '../../Super assets/s4.1.png'
import superAlignmentVenn from '../../Super assets/s5.png'
import superWorkshopBoard from '../../Super assets/s6.png'
import superWorkshopFindings from '../../Super assets/s7.png'
import superNavigationChange from '../../Super assets/s8.png'
import superTrueHomeOld from '../../Super assets/s9.png'
import superTrueHomeNew from '../../Super assets/s9.1.png'
import superSuperCashHomeSection from '../../Super assets/s10.png'
import superSuperCashDedicated from '../../Super assets/s10.1.png'
import superNotificationsOverview from '../../Super assets/s13.png'
import superNotificationsSystem from '../../Super assets/s13.1.png'
import superRewardsProfileOld from '../../Super assets/s14.png'
import superRewardsProfileNew from '../../Super assets/s14.1.png'
import superRewardsSystemOld from '../../Super assets/s15.png'
import superRewardsSystemNew from '../../Super assets/s15.1.png'
import superPrioritizationMatrix from '../../Super assets/s16.png'
import superTurningPointMatrix from '../../Super assets/s17.png'
import superImpactHandoff from '../../Super assets/s18.png'
import superImpactHandoffEnabled from '../../Super assets/s18.1.png'
import superWalkthrough1080 from '../../Super assets/Super app walkthrough 1080p.mp4'
import superHeroDrivingGif from '../../Super assets/driving.gif'
import { usePreloadImages } from '../hooks/usePreloadImages'
import { SUPER_CASE_STUDY } from '../constants/caseStudyCatalog'
import { SUPER_CASE_STUDY_SHOWCASE_NAV } from '../data/caseStudyShowcaseNav'
import {
  KpiAnimatedValue,
  ProblemStatementFrame,
  ProblemStatementGlitchFramedBlock,
  caseStudyScrollAnchorClass,
  caseStudyTeamResponsibilityTextClass,
  caseStudyTeamRoleColumnClass,
  caseStudyTeamRowConnectorCellClass,
  caseStudyTeamRowLiClass,
  caseStudyTeamRowListClass,
} from '../components/caseStudy/patterns'
import {
  caseStudyTeamConnectorHorizontal,
  caseStudyTradeConnectorHorizontal,
  caseStudyTradeConnectorVertical,
} from '../components/caseStudy/CaseStudyFlowConnectors'
import { CaseStudyShowcaseScaffold } from '../components/caseStudy/CaseStudyShowcaseScaffold'
import {
  SUPER_PRESENTATION_SLIDES,
  SUPER_PRESENTATION_THUMBNAILS,
  SUPER_RETROSPECTIVE_GIF_URL,
  superPresentationMediaToSlideIndex,
  superRetrospectiveGifImgClass,
} from './super/SuperPresentationDeck'
import {
  SuperProblemOldScreensChamfer,
  SuperSuperCashRelocatedComparison,
  SuperToggleImageChamfer,
  SuperTrueHomeComparison,
  SUPER_IMPACT_TOGGLE_OFF,
  SUPER_NOTIFICATIONS_TOGGLE_OFF,
  SUPER_REWARDS_PROFILE_TOGGLE_OFF,
  SUPER_REWARDS_SYSTEM_TOGGLE_OFF,
  SUPER_TOGGLE_LABEL_ON,
} from './super/SuperShowcaseChamfers'
import { ExperimentalCaseStudiesPanel } from '../components/ExperimentalCaseStudiesPanel'
import { ChamferFrame } from '../components/system/ChamferFrame'
import { FigmaGrid12 } from '../components/system/FigmaGrid'
import { RotatingGradientCircle } from '../components/system/RotatingGradientCircle'

/** Chamfer toggle image pairs — preloaded so instant swaps don’t hitch on first flip (same as Carbon). */
const SUPER_CHAMFER_CROSSFADE_IMAGE_URLS = [
  superProblemTwoUp,
  superProblemTwoUpStruggles,
  superProblemThreeUp,
  superProblemThreeUpStruggles,
  superTrueHomeOld,
  superTrueHomeNew,
  superSuperCashHomeSection,
  superSuperCashDedicated,
  superNotificationsOverview,
  superNotificationsSystem,
  superRewardsProfileOld,
  superRewardsProfileNew,
  superRewardsSystemOld,
  superRewardsSystemNew,
  superImpactHandoff,
  superImpactHandoffEnabled,
] as const

const TEAM_ROWS: { role: string; responsibility: string }[] = [
  {
    role: 'Senior product designer (me)',
    responsibility:
      'Led the initiative end-to-end, defined problem, direction, and system-level solutions',
  },
  {
    role: 'CEO (main stakeholder)',
    responsibility: 'Primary decision-maker, aligned on product direction and business priorities',
  },
  {
    role: 'Group PM',
    responsibility: 'Core partner in shaping scope and priorities, translated insights into product strategy',
  },
  {
    role: 'Design director',
    responsibility: 'Assigned task, provided feedback and design alignment',
  },
  {
    role: '10+ designers & researchers',
    responsibility: 'Received direction and frameworks, executed and expanded on the proposed roadmap',
  },
]

const PROBLEM_LEFT_SHIPPED_BULLETS: string[] = [
  'Teams worked independently within each vertical',
  'Decisions were made locally, not system-wide',
  'There was no shared UX foundation or unified experience',
  'What looked like growth internally → felt fragmented externally',
]

const PROBLEM_LEFT_AUDIENCE_BULLETS: string[] = [
  'Price-sensitive millennials',
  'Users with low credit access',
  'Value-driven decision makers',
]

const PROBLEM_CARDS: { title: string; body: string }[] = [
  {
    title: 'Missed opportunities across verticals',
    body: 'The product failed to connect its offerings, preventing users from discovering value beyond a single entry point.',
  },
  {
    title: 'Users didn’t understand the full product',
    body: 'Most users didn’t even realize the ecosystem existed.',
  },
  {
    title: 'Inconsistent experiences',
    body: 'Each vertical felt like a separate product, with mismatched navigation, layouts, and interaction patterns.',
  },
  {
    title: 'Duplicated patterns',
    body: 'Users had to relearn the same actions across different parts of the product.',
  },
]

const ALIGNMENT_TRADE_OFF_ROWS: { label: string; body: string }[] = [
  {
    label: 'Autonomy vs Consistency',
    body: 'Teams moved fast, but the experience fractured.',
  },
  {
    label: 'Focus vs discovery',
    body: 'Users came for one thing, but missed everything else.',
  },
  {
    label: 'Identity vs Standardization',
    body: 'Each vertical felt strong alone, but weak together.',
  },
]

const PRIORITIZATION_BULLETS = [
  'What to build now',
  'What to delay',
  'What not to build',
] as const

/** Same numbered chamfer cards pattern as Carbon “The System We Designed”. */
const SUPER_NAVIGATION_INTRO_COLUMNS: string[] = [
  'Navigation became the backbone of the system. One of the clearest system changes was the nav.',
  "The old nav didn't help users understand the product as a whole. The new nav reorganized the app around clearer entry points.",
  'This shifted the experience from product-specific to system-aware.',
]

const SUPER_NEW_NAV_DESTINATIONS: { step: number; title: string; description: string }[] = [
  {
    step: 1,
    title: 'Home',
    description:
      'A unified overview of the ecosystem, surfacing key actions, status, and entry points across all verticals.',
  },
  {
    step: 2,
    title: 'Discover',
    description:
      'A dedicated space to explore everything Super offers, enabling cross-vertical discovery and universal search.',
  },
  {
    step: 3,
    title: 'Cash',
    description:
      'A focused hub for all financial interactions, separating transactional behavior from broader product exploration.',
  },
  {
    step: 4,
    title: 'Rewards',
    description:
      'A centralized system for incentives and engagement, connecting user actions across verticals into long-term value.',
  },
  {
    step: 5,
    title: 'My Super',
    description:
      "A personal control center for account, activity, and preferences, tying together the user's full relationship with the product.",
  },
]


/** Autoplay when in view — same pattern as Carbon showcase prototype video. */
function SuperShowcaseAutoplayVideo({ src }: { src: string }) {
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
      aria-label="Screen recording of the Super app walkthrough"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

export default function SuperAppShowcasePage() {
  usePreloadImages(SUPER_CHAMFER_CROSSFADE_IMAGE_URLS)

  return (
    <CaseStudyShowcaseScaffold
      sidebarKicker={SUPER_CASE_STUDY.title}
      caseStudiesModifierTo="/case-study/components"
      navSections={SUPER_CASE_STUDY_SHOWCASE_NAV}
      presentationSlides={SUPER_PRESENTATION_SLIDES}
      presentationMediaToSlideIndex={superPresentationMediaToSlideIndex}
      presentationThumbnailSrcs={SUPER_PRESENTATION_THUMBNAILS}
      presentationInitialTextSlidesVisible
    >
      <ChamferFrame presentationMediaIndex={0}
        className="chamfer-media-border w-full"
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <img
          src={superHeroS1}
          alt="Super app — hero"
          decoding="async"
          className="block h-auto w-full max-w-full align-middle"
        />
      </ChamferFrame>

      <div
        data-presentation-split-root
        className="flex w-full min-w-0 flex-col items-stretch gap-8 md:gap-10 lg:flex-row lg:items-center lg:gap-x-6 lg:gap-y-0 xl:gap-x-8"
      >
        <h1
          id="super-hero-heading"
          data-presentation-text-region
          className={`m-0 min-w-0 flex-1 text-left text-[40px] font-normal leading-[1.12] tracking-[-0.03em] text-fg ${caseStudyScrollAnchorClass}`}
        >
          From scattered features to a shared roadmap and driving a new way of deciding what to build.
        </h1>
        <div data-presentation-media-region className="shrink-0 self-center lg:ml-auto">
        <RotatingGradientCircle
          className="aspect-square w-[min(52vw,11rem)] shrink-0 self-center md:w-[min(42vw,15rem)] lg:ml-auto lg:w-[min(34vw,17.5rem)]"
          innerClassName="bg-bg p-0"
          aria-hidden
        >
          <img
            src={superHeroDrivingGif}
            alt=""
            className="pointer-events-none block h-full w-full object-cover object-center select-none"
            loading="lazy"
            decoding="async"
          />
        </RotatingGradientCircle>
        </div>
      </div>

      <ChamferFrame presentationMediaIndex={1}
        className="chamfer-media-border w-full"
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <SuperShowcaseAutoplayVideo src={superWalkthrough1080} />
      </ChamferFrame>

      <section aria-labelledby="super-overview-section">
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-overview-section"
            className={`col-span-12 font-mono text-[12px] font-normal leading-snug tracking-[-0.02em] text-fg ${caseStudyScrollAnchorClass}`}
          >
            Overview
          </h2>
          <p className="col-span-12 -mt-2 font-mono text-[24px] font-normal leading-snug tracking-[-0.02em] text-fg md:-mt-1">
            3 products. 1 system problem.
          </p>

          <div className="col-span-12 md:col-span-4">
            <h3 className="font-mono text-[16px] font-normal leading-none text-fg">
              What does the company do?
            </h3>
            <ChamferFrame
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 font-mono text-[12px] leading-relaxed text-fg md:p-6"
            >
              <ul className="mb-0 mt-0 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5">
                <li>Travel — hotel &amp; flight bookings</li>
                <li>Fintech — debit card &amp; cashback system</li>
                <li>Ecommerce — selling warehouse returned products</li>
              </ul>
            </ChamferFrame>
          </div>

          <div className="col-span-12 md:col-span-4">
            <h3 className="font-mono text-[16px] font-normal leading-none text-fg">What I did</h3>
            <ChamferFrame
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 font-mono text-[12px] leading-relaxed text-fg md:p-6"
            >
              <p className="m-0">
                I was brought in to define how these products should work as one system.
              </p>
              <ul className="mb-0 mt-3 list-disc space-y-1.5 pl-[1.15rem] md:mt-4 md:space-y-2 md:pl-5">
                <li>Mapping the end-to-end experience across all three verticals</li>
                <li>Identifying breakdowns in navigation, discovery, and value clarity</li>
                <li>Running cross-functional workshops to align product, design, and leadership</li>
                <li>Proposing a unified product direction and prioritized roadmap</li>
              </ul>
              <p className="mb-0 mt-4 md:mt-5">
                This wasn&apos;t a surface-level redesign, it was about reframing the product at a
                system level
              </p>
            </ChamferFrame>
          </div>

          <div className="col-span-12 md:col-span-4">
            <h3 className="font-mono text-[16px] font-normal leading-none text-fg">Scope</h3>
            <ChamferFrame
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 font-mono text-[12px] leading-relaxed text-fg md:p-6"
            >
              <p className="m-0">Timeline: 9 business days</p>
              <p className="mb-0 mt-4 font-normal md:mt-5">Scope details:</p>
              <ul className="mb-0 mt-2 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5">
                <li>System-level UX across all verticals</li>
                <li>Navigation and information architecture</li>
                <li>Cross-product discovery and entry points</li>
                <li>Feature prioritization for upcoming roadmap</li>
              </ul>
            </ChamferFrame>
          </div>

          <div className="col-span-12">
            <h3 className="mt-2 font-mono text-[16px] font-normal leading-none text-fg md:mt-6">
              Team
            </h3>
            <ul className={`${caseStudyTeamRowListClass} font-mono`}>
              {TEAM_ROWS.map((row) => (
                <li key={row.role} className={caseStudyTeamRowLiClass}>
                  <span
                    className={`${caseStudyTeamRoleColumnClass} text-left text-[12px] text-fg md:shrink-0 md:whitespace-nowrap`}
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

          <ChamferFrame presentationMediaIndex={2}
            className="chamfer-media-border col-span-12 w-full"
            innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
          >
            <img
              src={superOverviewS2}
              alt="Super app — product screens across travel, rewards, SuperCash, and home"
              decoding="async"
              className="block h-auto w-full max-w-full align-middle"
            />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <ProblemStatementFrame
        id="super-problem-statement"
        className={caseStudyScrollAnchorClass}
        label="The problem"
        framedStatementClassName="font-mono"
        afterRule={
          <>
            <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
              <div className="col-span-12 md:col-span-5">
                <p className="m-0 font-mono text-[12px] leading-relaxed text-fg">
                  As new features shipped across teams:
                </p>
                <ul className="mb-0 mt-4 list-disc space-y-2 pl-[1.15rem] font-mono text-[12px] leading-relaxed text-fg md:mt-5 md:space-y-2.5 md:pl-5">
                  {PROBLEM_LEFT_SHIPPED_BULLETS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mb-0 mt-6 font-mono text-[12px] leading-relaxed text-fg md:mt-8">
                  Users trying to save money, not learn products
                </p>
                <p className="mb-0 mt-6 font-mono text-[12px] font-normal leading-snug text-fg md:mt-8">
                  Core audience:
                </p>
                <ul className="mb-0 mt-3 list-disc space-y-2 pl-[1.15rem] font-mono text-[12px] leading-relaxed text-fg md:mt-4 md:space-y-2.5 md:pl-5">
                  {PROBLEM_LEFT_AUDIENCE_BULLETS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="col-span-12 md:col-span-7">
                <h3 className="m-0 font-mono text-[12px] font-normal leading-snug text-fg">
                  This created multiple major problems:
                </h3>
                <div className="mt-4 flex flex-col gap-4 md:mt-5 md:gap-5">
                  {PROBLEM_CARDS.map((item) => (
                    <ChamferFrame
                      key={item.title}
                      className="w-full"
                      innerClassName="flex flex-col bg-surface/20 p-5 text-left font-mono md:p-6"
                    >
                      <p className="m-0 text-[16px] font-normal leading-snug text-fg">
                        {item.title}
                      </p>
                      <p className="mb-0 mt-2 text-[12px] leading-relaxed text-fg-muted md:mt-3">
                        {item.body}
                      </p>
                    </ChamferFrame>
                  ))}
                </div>
              </div>
            </FigmaGrid12>
            <div className="mt-10 flex w-full min-w-0 flex-col gap-6 md:mt-14 md:gap-8">
              <SuperProblemOldScreensChamfer
                presentationMediaIndex={3}
                baseSrc={superProblemTwoUp}
                strugglesSrc={superProblemTwoUpStruggles}
                altBase="Super app — legacy Cash and Travel flows (two-up)"
                altStruggles="Super app — legacy Cash and Travel flows with struggle callouts (two-up)"
              />
              <SuperProblemOldScreensChamfer
                presentationMediaIndex={4}
                baseSrc={superProblemThreeUp}
                strugglesSrc={superProblemThreeUpStruggles}
                altBase="Super app — legacy bookings, rewards, and account (three-up)"
                altStruggles="Super app — legacy bookings, rewards, and account with struggle callouts (three-up)"
              />
            </div>
          </>
        }
      >
        <>
          <div className="flex flex-col gap-1 md:gap-1.5">
            <p className="m-0 text-balance">The product scaled.</p>
            <p className="m-0 text-balance">The system didn&apos;t.</p>
          </div>
          <div className="flex flex-col gap-1 md:gap-1.5">
            <p className="m-0 text-balance">Users didn&apos;t experience &quot;one product&quot;</p>
            <p className="m-0 text-balance">They experienced three disconnected ones</p>
          </div>
        </>
      </ProblemStatementFrame>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-alignment-section"
        aria-labelledby="super-alignment-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <h2
            id="super-alignment-heading"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            Alignment, not iteration
          </h2>
          <p className="col-span-12 mb-2 mt-2 font-mono text-[12px] font-normal leading-relaxed text-fg md:mb-3 md:mt-3">
            This wasn&apos;t about improving flows. It was about making multiple products work as one.
          </p>
          <div className="col-span-12 flex flex-col gap-4 md:gap-5">
            {ALIGNMENT_TRADE_OFF_ROWS.map((row) => (
              <ChamferFrame
                key={row.label}
                className="chamfer-tradeoff-outline w-full"
                innerClassName="grid min-w-0 grid-cols-1 gap-3 bg-transparent px-4 py-3.5 md:grid-cols-[17rem_minmax(2.5rem,0.38fr)_minmax(0,1fr)] md:items-center md:gap-x-5 md:gap-y-0 md:px-5 md:py-4"
              >
                <p className="m-0 min-w-0 w-full text-left font-mono text-[16px] font-normal leading-snug text-fg">
                  {row.label}
                </p>
                <div className="hidden min-h-0 min-w-0 w-full items-center md:flex">
                  {caseStudyTradeConnectorHorizontal}
                </div>
                <div className="flex min-h-0 w-full justify-start py-0.5 md:hidden">
                  {caseStudyTradeConnectorVertical}
                </div>
                <p className="m-0 min-w-0 w-full text-left font-mono text-[12px] font-normal leading-relaxed text-fg md:w-auto">
                  {row.body}
                </p>
              </ChamferFrame>
            ))}
          </div>
          <p className="col-span-12 mt-6 max-w-4xl font-mono text-[12px] font-normal leading-relaxed text-fg md:mt-8">
            The solution had to preserve product value while making the whole experience feel connected.
          </p>
          <div className="col-span-12 mt-8 md:mt-10">
            <ChamferFrame presentationMediaIndex={5}
              className="chamfer-media-border w-full"
              innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/25 p-0 md:bg-gradient-to-b md:from-[#eaeaea]/40 md:via-surface/30 md:to-bg"
            >
              <img
                src={superAlignmentVenn}
                alt="Super app — business needs and user needs converging on a shared solution"
                decoding="async"
                className="block h-auto w-full max-w-full align-middle"
              />
            </ChamferFrame>
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-workshop-section"
        aria-labelledby="super-workshop-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-workshop-heading"
            className="col-span-12 m-0 font-mono text-[24px] font-normal leading-snug text-fg"
          >
            Workshop &amp; exploration
          </h2>
          <div className="col-span-12 md:col-span-4">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">
              Before proposing solutions, I ran a structured workshop to align around three things:
            </p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <ol className="m-0 list-decimal space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg md:space-y-2.5">
              <li>What users were struggling with</li>
              <li>Which problems mattered across all verticals</li>
              <li>What opportunities were worth exploring next</li>
              <li>What group patterns existed across verticals</li>
            </ol>
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">
              This made the work bigger than &apos;redesigning screens.&apos; It turned it into a product
              direction exercise.
            </p>
          </div>

          <div className="col-span-12 mt-8 md:mt-10">
            <ChamferFrame presentationMediaIndex={6}
              className="chamfer-media-border w-full"
              innerClassName="flex min-w-0 justify-center overflow-hidden bg-white p-0"
            >
              <img
                src={superWorkshopBoard}
                alt="Super app — design workshop boards: grouping, voting, and proposed features"
                decoding="async"
                className="block h-auto w-full max-w-full align-middle"
              />
            </ChamferFrame>
          </div>

          <div className="col-span-12 mt-12 md:mt-16">
            <ChamferFrame
              presentationMediaIndex={7}
              className="chamfer-media-border w-full"
              innerClassName="flex min-w-0 justify-center overflow-hidden bg-bg p-0"
            >
              <img
                src={superWorkshopFindings}
                alt="Super app — workshop findings: themes across verticals, user struggles, patterns, and opportunities"
                decoding="async"
                className="block h-auto w-full max-w-full align-middle"
              />
            </ChamferFrame>
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-navigation-section"
        aria-labelledby="super-navigation-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-navigation-heading"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            Navigation change
          </h2>
          {SUPER_NAVIGATION_INTRO_COLUMNS.map((paragraph) => (
            <div key={paragraph} className="col-span-12 md:col-span-4">
              <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">{paragraph}</p>
            </div>
          ))}
          <div className="col-span-12">
            <p className="m-0 font-mono text-[20px] font-normal leading-relaxed text-fg">New nav:</p>
            <div className="mt-[24px] grid grid-cols-1 gap-4 font-mono md:grid-cols-2 md:gap-5">
              {SUPER_NEW_NAV_DESTINATIONS.map((dest) => (
                <ChamferFrame
                  key={dest.step}
                  className="chamfer-tradeoff-outline w-full"
                  innerClassName="flex gap-4 bg-transparent p-5 md:gap-5 md:p-6"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-[0.5px] border-solid border-[#414141] text-sm font-normal tabular-nums text-fg md:size-10 md:text-base">
                    {dest.step}
                  </span>
                  <div className="min-w-0">
                    <p className="m-0 text-[20px] font-medium leading-snug text-fg">{dest.title}</p>
                    <p className="mb-0 mt-2 text-[12px] leading-relaxed text-fg-muted">{dest.description}</p>
                  </div>
                </ChamferFrame>
              ))}
            </div>
          </div>
          <div className="col-span-12 mt-8 md:mt-10">
            <ChamferFrame
              presentationMediaIndex={8}
              className="chamfer-media-border w-full"
              innerClassName="flex min-w-0 justify-center overflow-hidden bg-bg p-0"
            >
              <img
                src={superNavigationChange}
                alt="Super app — navigation change: old vs new tab bar, destination model, five primary destinations, and hypotheses for Home, Discover, Cash, Rewards, and My Super"
                decoding="async"
                className="block h-auto w-full max-w-full align-middle"
              />
            </ChamferFrame>
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-true-home-section"
        aria-labelledby="super-true-home-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-true-home-heading"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            A true home
          </h2>
          <div className="col-span-12 md:col-span-6">
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>Home became an overview, not a single vertical.</p>
              <p>
                The original home was too centered on SuperCash, making it hard for users to discover
                other products.
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">
              The redesign shifted home into a system entry point.
            </p>
            <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg md:mt-4 md:space-y-2.5">
              <li>Broader overview of services</li>
              <li>Stronger cross-vertical exposure</li>
              <li>Seasonal and promotional surfaces</li>
              <li>Customizable quick actions</li>
            </ul>
          </div>
          <div className="col-span-12 mt-8 md:mt-10">
            <SuperTrueHomeComparison presentationMediaIndex={9} />
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-supercash-relocated-section"
        aria-labelledby="super-supercash-relocated-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-supercash-relocated-heading"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            SuperCash relocated
          </h2>
          <div className="col-span-12 md:col-span-4">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">
              The goal wasn&apos;t to reduce its importance. It was to put it in the right place.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">
              By relocating SuperCash:
            </p>
            <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg md:mt-4 md:space-y-2.5">
              <li>Home became more balanced</li>
              <li>Financial actions became more focused</li>
              <li>Other verticals gained visibility</li>
            </ul>
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">
              Instead of dominating the experience, SuperCash became part of a clearer system.
            </p>
          </div>
          <div className="col-span-12 mt-8 md:mt-10">
            <SuperSuperCashRelocatedComparison presentationMediaIndex={10} />
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-notifications-section"
        aria-labelledby="super-notifications-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-notifications-heading"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            Notifications: from noise → system
          </h2>
          <div className="col-span-12 md:col-span-6">
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>Notifications became a system, not scattered messages.</p>
              <p>With multiple verticals came multiple notification types.</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">
              A centralized notification experience made it easier for users to:
            </p>
            <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg md:mt-4 md:space-y-2.5">
              <li>See important updates</li>
              <li>Manage signals across features</li>
              <li>Avoid losing context between parts of the product</li>
            </ul>
          </div>
          <div className="col-span-12 mt-8 md:mt-10">
            <SuperToggleImageChamfer
              presentationMediaIndex={11}
              toggleLabelOff={SUPER_NOTIFICATIONS_TOGGLE_OFF}
              toggleLabelOn={SUPER_TOGGLE_LABEL_ON}
              baseSrc={superNotificationsOverview}
              toggledSrc={superNotificationsSystem}
              baseAlt="Super app — notifications feed and grouped updates from the home experience"
              toggledAlt="Super app — notification settings and per-group controls"
            />
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-rewards-profile-section"
        aria-labelledby="super-rewards-profile-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-rewards-profile-heading"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            Rewards &amp; profile
          </h2>
          <div className="col-span-12 md:col-span-6">
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>Rewards and profile were rethought as long-term engagement tools.</p>
              <p>
                The redesign tracked how users returned to and stayed engaged with the product.
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">
              That led to:
            </p>
            <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg md:mt-4 md:space-y-2.5">
              <li>Tiered rewards concepts</li>
              <li>Daily reward loops</li>
              <li>A stronger My Super profile area</li>
              <li>A more coherent relationship between account, activity, and value</li>
            </ul>
          </div>
          <div className="col-span-12 mt-8 md:mt-10">
            <SuperToggleImageChamfer
              presentationMediaIndex={12}
              toggleLabelOff={SUPER_REWARDS_PROFILE_TOGGLE_OFF}
              toggleLabelOn={SUPER_TOGGLE_LABEL_ON}
              baseSrc={superRewardsProfileOld}
              toggledSrc={superRewardsProfileNew}
              baseAlt="Super app — legacy profile screen"
              toggledAlt="Super app — redesigned My Super profile with rewards context"
            />
          </div>
          <div className="col-span-12 mt-8 md:mt-10">
            <SuperToggleImageChamfer
              presentationMediaIndex={13}
              toggleLabelOff={SUPER_REWARDS_SYSTEM_TOGGLE_OFF}
              toggleLabelOn={SUPER_TOGGLE_LABEL_ON}
              baseSrc={superRewardsSystemOld}
              toggledSrc={superRewardsSystemNew}
              baseAlt="Super app — initial rewards entry in new navigation"
              toggledAlt="Super app — progressive and daily rewards system"
            />
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-prioritization-section"
        aria-labelledby="super-prioritization-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-prioritization-heading"
            className="col-span-12 m-0 font-mono text-[24px] font-normal leading-snug text-fg"
          >
            Feature prioritization
          </h2>
          <div className="col-span-12 md:col-span-6">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">
              To move forward, I introduced a simple evaluation framework:
            </p>
            <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg md:mt-4 md:space-y-2.5">
              <li>UX impact</li>
              <li>Business value</li>
              <li>Implementation effort</li>
            </ul>
            <p className="m-0 mt-4 font-mono text-[12px] font-normal leading-relaxed text-fg md:mt-5">
              This shifted discussions from opinions to tradeoffs.
            </p>
          </div>
          <div className="col-span-12 md:col-span-6">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">
              What this unlocked:
            </p>
            <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg md:mt-4 md:space-y-2.5">
              {PRIORITIZATION_BULLETS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="m-0 mt-4 font-mono text-[12px] font-normal leading-relaxed text-fg md:mt-5">
              For the first time, the team could see the roadmap clearly.
            </p>
          </div>
          <div className="col-span-12 mt-8 md:mt-10">
            <ChamferFrame presentationMediaIndex={14}
              className="chamfer-media-border w-full"
              innerClassName="flex min-w-0 justify-center overflow-hidden bg-bg p-0"
            >
              <img
                src={superPrioritizationMatrix}
                alt="Super app — feature prioritization matrix across UX importance, business value, and implementation effort"
                decoding="async"
                className="block h-auto w-full max-w-full align-middle"
              />
            </ChamferFrame>
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-turning-point-section"
        aria-labelledby="super-turning-point-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-turning-point-heading"
            className="col-span-12 m-0 text-[24px] font-normal leading-snug text-fg"
          >
            The turning point
          </h2>
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>What started as exploration became ownership.</p>
              <p>I initially approached this as feature exploration.</p>
              <p>But as the work evolved, something shifted.</p>
              <p>I was asked to define what the product should become.</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>This changed my role completely.</p>
              <p>
                What began as a design exercise became ownership of blue-sky product direction.
              </p>
              <ul className="mb-0 mt-4 list-disc space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg">
                <li>I was given space to explore beyond maintenance and bug fixes</li>
                <li>Blue-sky work became a higher priority for the team</li>
                <li>The output wasn&apos;t just designs — it was what the company should build next</li>
              </ul>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>This also changed how decisions were made.</p>
              <p>The process itself evolved:</p>
              <ul className="mb-0 mt-4 list-disc space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg">
                <li>From reactive fixes to proactive direction</li>
                <li>From isolated ideas to structured prioritization</li>
                <li>From design output to roadmap definition</li>
              </ul>
            </div>
          </div>
          <p className="col-span-12 m-0 mt-8 text-center font-mono text-[18px] font-normal leading-snug text-fg md:mt-10 md:text-[30px] md:leading-[1.15]">
            The work didn&apos;t just define features. It redefined how the roadmap gets decided.
          </p>
          <div className="col-span-12 mt-8 md:mt-10">
            <ChamferFrame presentationMediaIndex={15}
              className="chamfer-media-border w-full"
              innerClassName="flex min-w-0 justify-center overflow-hidden bg-bg p-0"
            >
              <img
                src={superTurningPointMatrix}
                alt="Super app — turning point matrix showing which proposals were accepted into upcoming design goals and downstream implementation outcomes"
                decoding="async"
                className="block h-auto w-full max-w-full align-middle"
              />
            </ChamferFrame>
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-outcome-section"
        aria-labelledby="super-outcome-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-outcome-heading"
            className="col-span-12 m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            Outcome
          </h2>
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>In 9 business days, I helped define how the product should scale.</p>
              <p>The impact wasn&apos;t just the interfaces.</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="m-0 font-mono text-[12px] font-normal leading-relaxed text-fg">
              It was:
            </p>
            <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg md:mt-4 md:space-y-2.5">
              <li>Shifting design from execution to direction-setting</li>
              <li>Establishing a repeatable approach to roadmap prioritization</li>
              <li>Elevating blue-sky exploration as a core part of the design process</li>
            </ul>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>The real impact?</p>
              <p>The work didn&apos;t just improve the product. It made it possible to move forward.</p>
            </div>
          </div>
          <div className="col-span-12 mt-8 md:mt-10">
            <ChamferFrame presentationMediaIndex={16}
              className="chamfer-media-border w-full"
              innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
            >
              <SuperShowcaseAutoplayVideo src={superWalkthrough1080} />
            </ChamferFrame>
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-impact-section"
        aria-labelledby="super-impact-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-impact-heading"
            className="col-span-12 m-0 text-left font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            Impactful alignment
          </h2>
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>From fragmented to connected.</p>
              <p>The system now:</p>
              <ul className="mb-0 mt-4 list-disc space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg">
                <li>Made navigation understandable</li>
                <li>Enabled cross-vertical discovery</li>
                <li>Connected previously isolated journeys</li>
              </ul>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>Most importantly:</p>
              <p>These decisions became the next quarter&apos;s design goals</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>They were:</p>
              <ul className="mb-0 mt-4 list-disc space-y-2 pl-5 font-mono text-[12px] font-normal leading-relaxed text-fg marker:text-fg">
                <li>Handed off to other designers</li>
                <li>Expanded into production work</li>
                <li>And continued into future releases</li>
              </ul>
            </div>
          </div>
          <p className="col-span-12 m-0 mt-6 font-mono text-[34px] font-normal leading-[1.1] tracking-tight text-fg md:mt-8 md:text-[52px]">
            This wasn&apos;t design exploration. It was roadmap definition.
          </p>
          <div className="col-span-12 mt-4 border-t border-dashed border-cell-border pt-8 md:mt-6 md:pt-10" />

          <div className="col-span-12 md:col-span-4">
            <p className="text-4xl font-normal tabular-nums tracking-tight text-fg md:text-[76px] md:leading-none">
              <span className="block">5 of 7</span>
            </p>
            <p className="mt-3 font-mono text-[12px] font-normal leading-relaxed text-fg">
              5 of 7 features shipped next quarter
            </p>
            <p className="mt-2 font-mono text-[12px] font-normal leading-relaxed text-fg">
              → remaining shipped later
            </p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="m-0 flex flex-wrap items-end gap-x-2 text-4xl font-normal tabular-nums tracking-tight text-fg md:gap-x-3 md:text-[76px] md:leading-none">
              <KpiAnimatedValue value="9" />
              <span className="kpi-metric-value-glow proportional-nums pb-[0.15em] text-[16px] font-normal leading-snug md:text-[16px]">
                days
              </span>
            </p>
            <p className="mt-3 font-mono text-[12px] font-normal leading-relaxed text-fg">
              Aligned direction in 9 days
            </p>
            <p className="mt-2 font-mono text-[12px] font-normal leading-relaxed text-fg">
              → reduced ambiguity from weeks to days
            </p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="m-0 flex flex-wrap items-end gap-x-2 text-4xl font-normal tabular-nums tracking-tight text-fg md:gap-x-3 md:text-[76px] md:leading-none">
              <KpiAnimatedValue value="10+" />
              <span className="kpi-metric-value-glow proportional-nums pb-[0.15em] text-[16px] font-normal leading-snug md:text-[16px]">
                designers enabled
              </span>
            </p>
            <p className="mt-3 font-mono text-[12px] font-normal leading-relaxed text-fg">
              Enabled 10+ designers to execute without re-scoping
            </p>
            <p className="mt-2 font-mono text-[12px] font-normal leading-relaxed text-fg">→ reduced rework</p>
          </div>
          <div className="col-span-12 mt-8 md:mt-10">
            <SuperToggleImageChamfer
              presentationMediaIndex={17}
              toggleLabelOff={SUPER_IMPACT_TOGGLE_OFF}
              toggleLabelOn={SUPER_TOGGLE_LABEL_ON}
              baseSrc={superImpactHandoff}
              toggledSrc={superImpactHandoffEnabled}
              baseAlt="Super app — design outcomes handed off to other designers after alignment"
              toggledAlt="Super app — outcomes expanded into production work across teams"
            />
          </div>
        </FigmaGrid12>
      </section>

      <div id="super-retrospective-section" className={caseStudyScrollAnchorClass}>
        <div className="mx-auto mt-10 w-full max-w-4xl px-2 md:mt-14 md:px-4">
          <ProblemStatementGlitchFramedBlock frameClassName="font-mono" containerClassName="w-full max-w-[56rem]">
            <p className="m-0 text-balance text-center">
              The real impact wasn&apos;t the designs, it was giving the team a clear direction to move
              forward.
            </p>
          </ProblemStatementGlitchFramedBlock>
        </div>

        <FigmaGrid12
          className="mt-8 md:mt-10"
          aria-labelledby="super-retrospective-heading"
        >
          <ChamferFrame
            meteorTrail
            className="col-span-12 md:col-span-8 md:col-start-3"
            innerClassName="px-4 py-12 text-left md:px-6 md:py-16"
          >
            <h2
              id="super-retrospective-heading"
              className={`text-left text-base font-normal text-fg md:text-[40px]`}
            >
              Retrospective
            </h2>
            <div className="mt-8 flex max-w-2xl flex-col gap-6 font-mono text-[12px] font-normal leading-relaxed text-fg">
              <p className="m-0">What I&apos;d push further</p>
              <p className="m-0">If I continued the work, I&apos;d push deeper into:</p>
              <ul className="m-0 list-outside list-disc space-y-3 pl-5 marker:text-fg">
                <li className="pl-1">Seasonal / trend-led discovery</li>
                <li className="pl-1">Better travel + commerce bundling</li>
                <li className="pl-1">More ambitious assistive / AI features</li>
                <li className="pl-1">Stronger performance measurement after rollout</li>
              </ul>
              <p className="m-0">The work proved the direction.</p>
              <p className="m-0">The next step would be compounding it.</p>
            </div>
            <ChamferFrame
              fitContentHeight
              className="chamfer-tradeoff-outline mt-8 w-fit max-w-full shrink-0"
              innerClassName="flex min-h-0 min-w-0 items-center justify-start overflow-hidden bg-bg p-0"
            >
              <img
                src={SUPER_RETROSPECTIVE_GIF_URL}
                alt="Compound interest animation"
                decoding="async"
                loading="lazy"
                className={superRetrospectiveGifImgClass}
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
