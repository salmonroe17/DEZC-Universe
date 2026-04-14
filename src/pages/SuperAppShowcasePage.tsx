import { SUPER_CASE_STUDY } from '../constants/caseStudyCatalog'
import { SUPER_CASE_STUDY_SHOWCASE_NAV } from '../data/caseStudyShowcaseNav'
import {
  KpiAnimatedValue,
  ProblemStatementFrame,
  caseStudyScrollAnchorClass,
} from '../components/caseStudy/patterns'
import {
  CaseStudyShowcaseScaffold,
  type CaseStudyPresentationSlide,
} from '../components/caseStudy/CaseStudyShowcaseScaffold'
import { ExperimentalCaseStudiesPanel } from '../components/ExperimentalCaseStudiesPanel'
import { ChamferFrame } from '../components/system/ChamferFrame'
import { FigmaGrid12 } from '../components/system/FigmaGrid'

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
  { role: 'Lead product designer', responsibility: 'Workshops, flows, and UI direction' },
  { role: 'Product manager', responsibility: 'Roadmap framing and stakeholder alignment' },
  { role: 'Design team', responsibility: 'Patterns, specs, and critique' },
  { role: 'Engineering partners', responsibility: 'Feasibility and release planning' },
]

const PROBLEM_CARDS: { title: string; body: string }[] = [
  {
    title: 'Missed opportunities across verticals',
    body: 'Features shipped in isolation, so cross-sell and coherence rarely compounded.',
  },
  {
    title: 'Users didn’t understand the full product',
    body: 'The surface area looked like separate apps instead of one connected system.',
  },
  {
    title: 'Inconsistent experiences',
    body: 'Similar jobs were solved differently depending on which vertical owned the screen.',
  },
  {
    title: 'Duplicated patterns',
    body: 'Teams rebuilt the same foundations with small variations, slowing everyone down.',
  },
]

const TENSION_ROWS: { label: string; body: string }[] = [
  {
    label: 'Autonomy vs Consistency',
    body: 'Squads needed to move fast, but divergence made the product feel fragmented.',
  },
  {
    label: 'Focus vs Discovery',
    body: 'Power users wanted depth; newcomers needed a clearer map of what existed.',
  },
  {
    label: 'Identity vs Standardization',
    body: 'Vertical brands fought for recognition while the shell needed one coherent voice.',
  },
]

const NAV_ITEMS: { step: number; title: string; description: string }[] = [
  { step: 1, title: 'Home', description: 'A single entry that orients people to the whole system.' },
  { step: 2, title: 'Discover', description: 'Exploration without losing context of the broader app.' },
  { step: 3, title: 'Cash', description: 'Money movement in one predictable place.' },
  { step: 4, title: 'Rewards', description: 'Recognition and value back to the member.' },
  { step: 5, title: 'My Super', description: 'Profile, settings, and personal history.' },
]

const KEY_CHANGE_BLOCKS: { title: string; description: string }[] = [
  {
    title: 'Home became an overview',
    description:
      'The landing shifted from a vertical entry point to a cross-product snapshot people could scan in seconds.',
  },
  {
    title: 'SuperCash relocated',
    description:
      'Cash sat where members already looked for money tasks, reducing duplicate entry points across tabs.',
  },
  {
    title: 'Discover',
    description:
      'Discovery was reframed as a guided path through the catalogue instead of a flat grid of launches.',
  },
  {
    title: 'Notifications',
    description:
      'Alerts were grouped and prioritized so signal wasn’t buried under promotional noise.',
  },
  {
    title: 'Rewards & Profile',
    description:
      'Rewards and account lived together so status and personalization felt like one story.',
  },
]

const PRIORITIZATION_BULLETS = [
  'What to build now',
  'What to delay',
  'What not to build',
] as const

const OUTCOME_BULLETS = [
  'A shared mental model of the super app',
  'A prioritized backlog aligned to navigation',
  'Clear ownership between verticals and platform',
] as const

const IMPACT_BULLETS = [
  'Design and product could reference the same map in critique',
  'Fewer one-off launches that contradicted the shell',
  'Room to sequence seasonal and experimental bets without rewriting the frame',
] as const

const RETRO_BULLETS = [
  'Seasonal discovery',
  'Travel + commerce bundling',
  'AI features',
  'Performance measurement',
] as const

const SUPER_PRESENTATION_SLIDES: CaseStudyPresentationSlide[] = [
  {
    content: (
      <div className="mx-auto flex w-full max-w-[min(100%,1156px)] flex-col gap-6 md:flex-row md:items-center md:gap-x-6 lg:gap-x-8">
        <div className="min-w-0 flex-1 text-left">
          <h1 className="m-0 text-[40px] font-normal leading-[1.12] tracking-[-0.03em] text-fg">
            Super app unifying verticals
          </h1>
          <p className="mb-0 mt-5 max-w-2xl text-pretty font-mono text-sm font-normal leading-relaxed text-fg md:mt-6 md:text-base">
            From scattered features to a shared roadmap and a new way of deciding what to build.
          </p>
        </div>
        <ChamferFrame
          className="chamfer-media-border w-full shrink-0 md:max-w-[min(52vw,22rem)] lg:ml-auto lg:max-w-[min(40vw,26rem)]"
          innerClassName="flex min-h-[min(42vw,14rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(34vw,20rem)]"
        />
      </div>
    ),
  },
  {
    content: (
      <ChamferFrame
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-[min(48vw,16rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(36vw,22rem)]"
      />
    ),
  },
  {
    content: (
      <ChamferFrame
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-[12rem] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[16rem]"
      >
        <span className="text-center font-mono text-xs text-fg-muted md:text-sm">Show user struggles</span>
      </ChamferFrame>
    ),
  },
  {
    content: (
      <ChamferFrame
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-[min(48vw,18rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(40vw,24rem)]"
      />
    ),
  },
  {
    content: (
      <ChamferFrame
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-[14rem] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[18rem]"
      >
        <span className="text-center font-mono text-xs text-fg-muted md:text-sm">Old vs new navigation</span>
      </ChamferFrame>
    ),
  },
  {
    content: (
      <ChamferFrame
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-[min(44vw,15rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(32vw,18rem)]"
      />
    ),
  },
  {
    content: (
      <ChamferFrame
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-[5.5rem] items-center justify-center bg-fg/[0.06] p-4 md:min-h-[6.5rem]"
      >
        <span className="font-mono text-xs text-fg-muted md:text-sm">Show what works</span>
      </ChamferFrame>
    ),
  },
  {
    content: (
      <ChamferFrame
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-[min(48vw,16rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(36vw,22rem)]"
      >
        <span className="text-center font-mono text-xs text-fg-muted md:text-sm">Prioritization matrix</span>
      </ChamferFrame>
    ),
  },
  {
    content: (
      <ChamferFrame
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-[min(48vw,16rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(36vw,20rem)]"
      >
        <span className="text-center font-mono text-xs text-fg-muted md:text-sm">Decision shift</span>
      </ChamferFrame>
    ),
  },
  {
    content: (
      <ChamferFrame
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-[14rem] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[20rem]"
      />
    ),
  },
  {
    content: (
      <ChamferFrame
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-[5.5rem] items-center justify-center bg-fg/[0.06] p-4 md:min-h-[6.5rem]"
      >
        <span className="font-mono text-xs text-fg-muted md:text-sm">Show what works</span>
      </ChamferFrame>
    ),
  },
  {
    content: (
      <ChamferFrame
        fitContentHeight
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-0 min-w-0 flex-col items-center justify-center overflow-hidden bg-white px-6 py-8 md:px-10 md:py-10"
      >
        <p className="m-0 max-w-[56rem] text-center font-mono text-[18px] font-normal leading-snug tracking-tight text-black md:text-[22px]">
          The real impact wasn&apos;t the designs, it was giving the team a clear direction to move
          forward.
        </p>
      </ChamferFrame>
    ),
  },
  {
    content: (
      <ChamferFrame
        className="chamfer-media-border mx-auto w-full max-w-[min(100%,1156px)]"
        innerClassName="flex min-h-[min(48vw,16rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(36vw,22rem)]"
      />
    ),
  },
]

export default function SuperAppShowcasePage() {
  return (
    <CaseStudyShowcaseScaffold
      sidebarKicker={SUPER_CASE_STUDY.title}
      caseStudiesModifierTo="/case-study/components"
      navSections={SUPER_CASE_STUDY_SHOWCASE_NAV}
      presentationSlides={SUPER_PRESENTATION_SLIDES}
    >
      <div className="flex w-full min-w-0 flex-col items-stretch gap-6 md:flex-row md:items-center md:gap-x-6 lg:gap-x-8">
        <div className="min-w-0 flex-1 text-left">
          <h1
            id="super-hero-heading"
            className={`m-0 text-[40px] font-normal leading-[1.12] tracking-[-0.03em] text-fg`}
          >
            Super app unifying verticals
          </h1>
          <p className="mb-0 mt-5 max-w-2xl text-pretty font-mono text-sm font-normal leading-relaxed text-fg md:mt-6 md:text-base">
            From scattered features to a shared roadmap and a new way of deciding what to build.
          </p>
        </div>
        <ChamferFrame presentationMediaIndex={0}
          className="chamfer-media-border w-full shrink-0 md:max-w-[min(52vw,22rem)] lg:ml-auto lg:max-w-[min(40vw,26rem)]"
          innerClassName="flex min-h-[min(42vw,14rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(34vw,20rem)]"
        />
      </div>

      <section aria-labelledby="super-overview-section">
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-overview-section"
            className={`col-span-12 text-[24px] font-normal leading-snug tracking-[-0.02em] text-fg ${caseStudyScrollAnchorClass}`}
          >
            Overview
          </h2>
          <p className="col-span-12 -mt-2 font-mono text-sm font-normal leading-relaxed text-fg-muted md:-mt-1 md:text-base">
            3 products. One system problem.
          </p>

          <div className="col-span-12 md:col-span-4">
            <h3 className="text-sm font-normal leading-none text-fg md:text-base">
              What the company does
            </h3>
            <ChamferFrame
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 text-xs leading-[1.55] text-fg md:p-6 md:text-sm md:leading-relaxed"
            >
              <p className="m-0">
                The org runs multiple consumer products—payments, loyalty, and discovery—inside one
                member-facing shell.
              </p>
              <p className="mb-0 mt-4 md:mt-5">
                Each vertical had its own roadmap; the shell needed to read as one product, not a
                bundle of apps.
              </p>
            </ChamferFrame>
          </div>

          <div className="col-span-12 md:col-span-4">
            <h3 className="text-sm font-normal leading-none text-fg md:text-base">What I did</h3>
            <ChamferFrame
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 text-xs leading-[1.55] text-fg md:p-6 md:text-sm md:leading-relaxed"
            >
              <p className="m-0">I led the end-to-end design thread for the super app narrative:</p>
              <ul className="mb-0 mt-3 list-disc space-y-1.5 pl-[1.15rem] md:mt-4 md:space-y-2 md:pl-5">
                <li>Framing the problem with product and research</li>
                <li>Workshopping navigation and IA with partner teams</li>
                <li>Shipping updated maps, patterns, and prioritization calls</li>
              </ul>
            </ChamferFrame>
          </div>

          <div className="col-span-12 md:col-span-4">
            <h3 className="text-sm font-normal leading-none text-fg md:text-base">Scope</h3>
            <ChamferFrame
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 text-xs leading-[1.55] text-fg md:p-6 md:text-sm md:leading-relaxed"
            >
              <p className="m-0">Platform navigation, cross-vertical IA, and alignment rituals.</p>
              <p className="mb-0 mt-4 font-normal md:mt-5">Out of scope for this pass:</p>
              <ul className="mb-0 mt-2 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5">
                <li>Net-new brand illustration systems</li>
                <li>Back-end contract redesign</li>
                <li>Per-vertical feature depth beyond wayfinding</li>
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
        </FigmaGrid12>
      </section>

      <section
        id="super-context-section"
        aria-labelledby="super-context-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <h2
            id="super-context-heading"
            className="col-span-12 text-[24px] font-normal leading-snug tracking-[-0.02em] text-fg"
          >
            Context
          </h2>
          <div className="col-span-12 font-mono text-xs font-normal leading-relaxed text-fg md:col-span-8 md:text-sm">
            <p className="m-0">
              Growth had accreted features faster than the shell could explain them. Leadership asked
              for a forecast the whole company could use—not another static deck, but a living map
              of what “the super app” was meant to be.
            </p>
            <p className="mb-0 mt-4 md:mt-5">
              The design org needed a shared reference before teams committed build capacity for the
              next half.
            </p>
          </div>
        </FigmaGrid12>
      </section>

      <ProblemStatementFrame
        id="super-problem-statement"
        className={caseStudyScrollAnchorClass}
        label="Problem"
        afterRule={
          <>
            <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
              <div className="col-span-12 md:col-span-5">
                <h3 className="m-0 text-sm font-normal leading-snug text-fg md:text-base">
                  The problem, in one sentence
                </h3>
                <p className="mb-0 mt-4 text-xs leading-[1.55] text-fg md:mt-5 md:text-sm md:leading-relaxed">
                  We were optimizing parts while the whole product story stayed invisible—so members
                  couldn’t form a model of what to use when, and teams couldn’t sequence work with
                  confidence.
                </p>
              </div>
              <div className="col-span-12 md:col-span-7">
                <ChamferFrame presentationMediaIndex={1}
                  className="chamfer-media-border w-full"
                  innerClassName="flex min-h-[min(48vw,16rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(36vw,22rem)]"
                />
              </div>
              <div className="col-span-12">
                <h3 className="m-0 text-sm font-normal leading-snug text-fg md:text-base">
                  That showed up as:
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 md:mt-5 md:grid-cols-2 md:gap-5">
                  {PROBLEM_CARDS.map((item) => (
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
              <div className="col-span-12 mt-8 md:mt-10">
                <ChamferFrame presentationMediaIndex={2}
                  className="chamfer-media-border w-full"
                  innerClassName="flex min-h-[12rem] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[16rem]"
                >
                  <span className="text-center font-mono text-xs text-fg-muted md:text-sm">
                    Show user struggles
                  </span>
                </ChamferFrame>
              </div>
            </FigmaGrid12>
          </>
        }
      >
        <>
          <p className="m-0 text-balance">The product worked in pieces.</p>
          <p className="m-0 text-balance">It didn’t yet work as a single story members could trust.</p>
        </>
      </ProblemStatementFrame>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-tensions-section"
        aria-labelledby="super-tensions-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <h2
            id="super-tensions-heading"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            Tensions
          </h2>
          <p className="col-span-12 mb-2 mt-2 font-mono text-sm font-normal leading-relaxed text-fg md:mb-3 md:mt-3 md:text-base">
            Every decision sat inside these tradeoffs:
          </p>
          <div className="col-span-12 flex flex-col gap-4 md:gap-5">
            {TENSION_ROWS.map((row) => (
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
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-workshop-section"
        aria-labelledby="super-workshop-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12 flex flex-col gap-6 md:col-span-6 md:gap-8">
            <h2
              id="super-workshop-heading"
              className="m-0 text-[24px] font-normal leading-snug text-fg"
            >
              Workshop &amp; exploration
            </h2>
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>We ran structured working sessions with vertical leads and platform design.</p>
              <p>Artifacts captured current journeys, duplicate entry points, and naming drift.</p>
              <p>The output wasn’t a polished deck—it was a stack of maps we could edit in the open.</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <ChamferFrame presentationMediaIndex={3}
              className="chamfer-media-border w-full"
              innerClassName="flex min-h-[min(48vw,18rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(40vw,24rem)]"
            />
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-navigation-section"
        aria-labelledby="super-navigation-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <div className="col-span-12 flex flex-col gap-[16px]">
            <h2
              id="super-navigation-heading"
              className="m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
            >
              Navigation change
            </h2>
            <p className="m-0 max-w-4xl font-mono text-sm font-normal leading-relaxed text-fg md:text-base">
              We compared the legacy tab model to a destination-based model that matched how members
              talked about tasks—home, money, discovery, rewards, and account.
            </p>
          </div>
          <div className="col-span-12 mt-8 md:mt-10">
            <ChamferFrame presentationMediaIndex={4}
              className="chamfer-media-border w-full"
              innerClassName="flex min-h-[14rem] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[18rem]"
            >
              <span className="text-center font-mono text-xs text-fg-muted md:text-sm">
                Old vs new navigation
              </span>
            </ChamferFrame>
          </div>
          <div className="col-span-12 mt-10 md:mt-12">
            <h3 className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">
              New nav
            </h3>
            <p className="mb-0 mt-3 font-mono text-sm font-normal leading-relaxed text-fg md:text-base">
              Five primary destinations, each with a single headline job:
            </p>
          </div>
          <div className="col-span-12 mt-8 grid grid-cols-1 gap-4 font-mono md:grid-cols-2 md:gap-5">
            {NAV_ITEMS.map((item) => (
              <ChamferFrame
                key={item.step}
                className="chamfer-tradeoff-outline w-full"
                innerClassName="flex gap-4 bg-transparent p-5 md:gap-5 md:p-6"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-[0.5px] border-solid border-[#414141] text-sm font-normal tabular-nums text-fg md:size-10 md:text-base">
                  {item.step}
                </span>
                <div className="min-w-0">
                  <p className="m-0 text-sm font-medium text-fg md:text-base">{item.title}</p>
                  <p className="mb-0 mt-2 text-xs leading-relaxed text-fg-muted md:text-sm">
                    {item.description}
                  </p>
                </div>
              </ChamferFrame>
            ))}
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-key-changes-section"
        aria-labelledby="super-key-changes-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12>
          <h2
            id="super-key-changes-heading"
            className="col-span-12 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            Key product changes
          </h2>
          <p className="col-span-12 mt-2 font-mono text-sm font-normal leading-relaxed text-fg md:mt-3 md:text-base">
            Each shift paired narrative with a surface we could review in critique.
          </p>
        </FigmaGrid12>

        {KEY_CHANGE_BLOCKS.map((block) => (
          <div key={block.title} className="mt-[var(--figma-gutter)] w-full min-w-0">
            <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
              <div className="col-span-12 md:col-span-5">
                <h3 className="m-0 text-lg font-normal leading-snug text-fg md:text-xl">{block.title}</h3>
                <p className="mb-0 mt-4 text-xs leading-[1.55] text-fg md:mt-5 md:text-sm md:leading-relaxed">
                  {block.description}
                </p>
              </div>
              <div className="col-span-12 md:col-span-7">
                <ChamferFrame presentationMediaIndex={5}
                  className="chamfer-media-border w-full"
                  innerClassName="flex min-h-[min(44vw,15rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(32vw,18rem)]"
                />
              </div>
            </FigmaGrid12>
            <ChamferFrame presentationMediaIndex={6}
              className="chamfer-media-border mt-6 w-full md:mt-8"
              innerClassName="flex min-h-[5.5rem] items-center justify-center bg-fg/[0.06] p-4 md:min-h-[6.5rem]"
            >
              <span className="font-mono text-xs text-fg-muted md:text-sm">Show what works</span>
            </ChamferFrame>
          </div>
        ))}
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-prioritization-section"
        aria-labelledby="super-prioritization-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="items-start md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12 flex flex-col gap-6 md:col-span-6 md:gap-8">
            <h2
              id="super-prioritization-heading"
              className="m-0 text-[24px] font-normal leading-snug text-fg"
            >
              Feature prioritization
            </h2>
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>
                We moved from a flat backlog to a matrix: member value, strategic fit, cost, and
                dependencies across verticals.
              </p>
              <p>That let us argue about sequencing without relitigating the whole roadmap each week.</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <ChamferFrame presentationMediaIndex={7}
              className="chamfer-media-border w-full"
              innerClassName="flex min-h-[min(48vw,16rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(36vw,22rem)]"
            >
              <span className="text-center font-mono text-xs text-fg-muted md:text-sm">
                Prioritization matrix
              </span>
            </ChamferFrame>
          </div>
          <div className="col-span-12 mt-8 font-mono text-sm font-normal leading-relaxed text-fg md:mt-10">
            <p className="m-0">The working agreements boiled down to:</p>
            <ul className="mb-0 mt-3 list-disc space-y-2 pl-5 marker:text-fg-subtle md:mt-4">
              {PRIORITIZATION_BULLETS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
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
          <div className="col-span-12 flex flex-col gap-6 md:col-span-6 md:gap-8">
            <h2
              id="super-turning-point-heading"
              className="m-0 text-[24px] font-normal leading-snug text-fg"
            >
              Turning point
            </h2>
            <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
              <p>Exploration stopped being a side project once product leadership owned the map.</p>
              <p>
                The shift was cultural as much as structural: design facilitated, but PMs carried
                decisions into planning forums.
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <ChamferFrame presentationMediaIndex={8}
              className="chamfer-media-border w-full"
              innerClassName="flex min-h-[min(48vw,16rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(36vw,20rem)]"
            >
              <span className="text-center font-mono text-xs text-fg-muted md:text-sm">
                Decision shift
              </span>
            </ChamferFrame>
          </div>
          <div className="col-span-12 mt-10 grid grid-cols-1 gap-8 font-mono text-[12px] font-normal leading-relaxed text-fg md:mt-12 md:grid-cols-2 md:gap-10">
            <div>
              <h3 className="m-0 text-base font-normal text-fg md:text-lg">Role shift</h3>
              <p className="mb-0 mt-3 md:mt-4">
                Design moved from producing screens to maintaining the reference architecture alongside
                PMs.
              </p>
            </div>
            <div>
              <h3 className="m-0 text-base font-normal text-fg md:text-lg">Process shift</h3>
              <p className="mb-0 mt-3 md:mt-4">
                Reviews started with the map, then features—so scope debates referenced the same
                frame.
              </p>
            </div>
          </div>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-outcome-section"
        aria-labelledby="super-outcome-heading"
        className={caseStudyScrollAnchorClass}
      >
        <div className="w-full min-w-0">
          <h2
            id="super-outcome-heading"
            className="m-0 font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
          >
            Outcome
          </h2>
          <p className="mt-6 max-w-4xl font-mono text-sm font-normal leading-relaxed text-fg md:mt-8 md:text-base">
            The organization gained a single articulation of the super app—enough to brief execs,
            onboard partners, and sequence delivery without re-deriving the story each quarter.
          </p>
          <ul className="mb-0 mt-6 max-w-4xl list-none space-y-2.5 p-0 font-mono text-sm font-normal leading-relaxed text-fg md:mt-8 md:text-base">
            {OUTCOME_BULLETS.map((line) => (
              <li
                key={line}
                className="relative pl-4 before:absolute before:left-0 before:text-fg before:content-['•']"
              >
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-8 md:mt-10">
            <ChamferFrame presentationMediaIndex={9}
              className="chamfer-media-border w-full"
              innerClassName="flex min-h-[14rem] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[20rem]"
            />
          </div>
        </div>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="super-impact-section"
        aria-labelledby="super-impact-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12 flex flex-col gap-[24px]">
            <h2
              id="super-impact-heading"
              className="m-0 text-left font-mono text-[24px] font-normal leading-snug tracking-tight text-fg"
            >
              Impactful alignment
            </h2>
            <ul className="m-0 max-w-4xl list-none space-y-2.5 p-0 font-mono text-sm font-normal leading-relaxed text-fg md:text-base">
              {IMPACT_BULLETS.map((line) => (
                <li
                  key={line}
                  className="relative pl-4 before:absolute before:left-0 before:text-fg before:content-['•']"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 md:col-span-4">
            <p className="text-4xl font-normal tabular-nums tracking-tight text-fg md:text-[76px] md:leading-none">
              <span className="block">5 of 7</span>
            </p>
            <p className="mt-3 text-[12px] font-normal leading-relaxed text-fg">features shipped</p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="text-4xl font-normal tabular-nums tracking-tight text-fg md:text-[76px] md:leading-none">
              <KpiAnimatedValue value="9" />
            </p>
            <p className="mt-3 text-[12px] font-normal leading-relaxed text-fg">days alignment</p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="text-4xl font-normal tabular-nums tracking-tight text-fg md:text-[76px] md:leading-none">
              <KpiAnimatedValue value="10+" />
            </p>
            <p className="mt-3 text-[12px] font-normal leading-relaxed text-fg">designers enabled</p>
          </div>
        </FigmaGrid12>

        <ChamferFrame presentationMediaIndex={10}
          className="chamfer-media-border mx-auto mt-10 w-full max-w-4xl md:mt-14"
          innerClassName="flex min-h-[5.5rem] items-center justify-center bg-fg/[0.06] p-4 md:min-h-[6.5rem]"
        >
          <span className="font-mono text-xs text-fg-muted md:text-sm">Show what works</span>
        </ChamferFrame>
      </section>

      <ChamferFrame presentationMediaIndex={11}
        fitContentHeight
        className="chamfer-media-border mx-auto mt-10 w-full max-w-4xl md:mt-14"
        innerClassName="flex min-h-0 min-w-0 flex-col items-center justify-center overflow-hidden bg-white px-6 py-8 md:px-10 md:py-10"
      >
        <p className="m-0 max-w-[56rem] text-center font-mono text-[18px] font-normal leading-snug tracking-tight text-black md:text-[22px]">
          The real impact wasn&apos;t the designs, it was giving the team a clear direction to move
          forward.
        </p>
      </ChamferFrame>

      <div className="figma-rule my-[32px]" aria-hidden />

      <FigmaGrid12 aria-labelledby="super-retrospective-heading">
        <div
          id="super-retrospective-section"
          className={`col-span-12 flex min-w-0 flex-col gap-8 md:col-span-6 ${caseStudyScrollAnchorClass}`}
        >
          <h2
            id="super-retrospective-heading"
            className="m-0 text-[24px] font-normal leading-snug tracking-[-0.02em] text-fg"
          >
            Retrospective
          </h2>
          <div className="font-mono text-[12px] font-normal leading-relaxed text-fg [&_p]:m-0 [&_p+p]:mt-4">
            <p>If we continued, the next bets would stress-test the map—not replace it.</p>
          </div>
          <ul className="m-0 list-outside list-disc space-y-3 pl-5 marker:text-fg">
            {RETRO_BULLETS.map((line) => (
              <li key={line} className="pl-1">
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 md:col-span-6">
          <ChamferFrame presentationMediaIndex={12}
            className="chamfer-media-border w-full"
            innerClassName="flex min-h-[min(48vw,16rem)] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-fg/[0.08] p-6 md:min-h-[min(36vw,22rem)]"
          />
        </div>
      </FigmaGrid12>

      <div className="figma-rule my-[32px]" aria-hidden />
      <ExperimentalCaseStudiesPanel layout="footer" />
    </CaseStudyShowcaseScaffold>
  )
}
