import { DS_CASE_STUDY } from '../constants/caseStudyCatalog'
import { DS_CASE_STUDY_SHOWCASE_NAV } from '../data/caseStudyShowcaseNav'
import {
  ProblemStatementFrame,
  ProblemStatementGlitchedCopy,
  caseStudyScrollAnchorClass,
} from '../components/caseStudy/patterns'
import { CaseStudyShowcaseScaffold } from '../components/caseStudy/CaseStudyShowcaseScaffold'
import {
  DS_PRESENTATION_MEDIA_TO_SLIDE,
  DS_PRESENTATION_SLIDES,
  DS_PRESENTATION_THUMBNAILS,
} from './ds/DsPresentationDeck'
import { ExperimentalCaseStudiesPanel } from '../components/ExperimentalCaseStudiesPanel'
import {
  DsCaseStudyChamferCollage,
  DsCaseStudyChamferDs2,
  DsCaseStudyChamferDs3,
  DsCaseStudyChamferDs4,
  DsCaseStudyChamferDs5,
  DsCaseStudyChamferDs6,
  DsCaseStudyChamferDs7,
  DsCaseStudyChamferDs8,
  DsCaseStudyChamferDs9,
  DsCaseStudyChamferDs10,
  DsCaseStudyChamferDs11,
  DsCaseStudyChamferDs12,
  DS_HERO_MANIFEST_LINES,
  dsCalculatorGif,
  dsPuzzleGif,
} from '../components/caseStudy/dsCaseStudy/DsCaseStudyHeroMedia'
import { ChamferFrame } from '../components/system/ChamferFrame'
import { RotatingGradientCircle } from '../components/system/RotatingGradientCircle'
import { FigmaGrid12 } from '../components/system/FigmaGrid'
import { DsBulletGrid } from './ds/dsShowcaseBulletGrid'
import {
  DS_BUILT_REAL_WORLD_BULLETS,
  DS_COMPONENTS_AT_SCALE_BULLETS,
  DS_DESIGN_ENGINEERING_BULLETS,
  DS_FOUNDATIONS_BULLETS,
  DS_IA_EXAMPLES_BULLETS,
  DS_MY_PHILOSOPHY_OPTIMIZE_BULLETS,
  DS_PHILOSOPHY_COMPANIES,
  DS_PHILOSOPHY_EXPERIENCE_PARAS,
  DS_PROBLEM_BODY_LEFT,
  DS_PROBLEM_WITHOUT_DS_BULLETS,
  DS_RETRO_LEARNED_BULLETS,
  DS_RETRO_WHAT_UNLOCKS_BULLETS,
  DS_RULES_PREVENT_CHAOS_BULLETS,
  DS_STATES_VARIANTS_BULLETS,
} from './ds/dsShowcaseData'

export default function DesignSystemsShowcasePage() {
  return (
    <CaseStudyShowcaseScaffold
      sidebarKicker={DS_CASE_STUDY.title}
      caseStudiesModifierTo="/case-study/design-systems"
      navSections={DS_CASE_STUDY_SHOWCASE_NAV}
      presentationSlides={DS_PRESENTATION_SLIDES}
      presentationMediaToSlideIndex={(mediaIndex) =>
        DS_PRESENTATION_MEDIA_TO_SLIDE[mediaIndex] ?? mediaIndex
      }
      presentationThumbnailSrcs={DS_PRESENTATION_THUMBNAILS}
      presentationInitialTextSlidesVisible
    >
      <ChamferFrame
        presentationMediaIndex={0}
        className="chamfer-media-border w-full"
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <DsCaseStudyChamferCollage />
      </ChamferFrame>

      <div className="flex w-full min-w-0 flex-col items-stretch gap-8 md:gap-10 lg:flex-row lg:items-center lg:gap-x-6 lg:gap-y-0 xl:gap-x-8">
        <h1
          id="hero-heading"
          className={`min-w-0 flex-1 whitespace-pre-line text-left text-[40px] font-normal leading-[1.12] tracking-[-0.03em] text-fg ${caseStudyScrollAnchorClass}`}
        >
          {DS_HERO_MANIFEST_LINES}
        </h1>
        <RotatingGradientCircle
          className="aspect-square w-[min(52vw,11rem)] shrink-0 self-center md:w-[min(42vw,15rem)] lg:ml-auto lg:w-[min(34vw,17.5rem)]"
          innerClassName="bg-bg p-0"
          aria-hidden
        >
          <img
            src={dsCalculatorGif}
            alt=""
            className="pointer-events-none block h-full w-full object-cover object-center select-none"
            loading="lazy"
            decoding="async"
          />
        </RotatingGradientCircle>
      </div>

      <ChamferFrame presentationMediaIndex={1}
        className="chamfer-media-border w-full"
        innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
      >
        <DsCaseStudyChamferDs2 />
      </ChamferFrame>

      <section aria-labelledby="overview-section">
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12 mb-8 md:mb-10 lg:mb-12">
            <p className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">
              Design System Philosophy
            </p>
            <h2
              id="overview-section"
              className={`mt-3 font-mono text-[clamp(2.25rem,4.2vw,3.5rem)] font-normal leading-[1.08] tracking-[0.06em] text-fg md:mt-4 ${caseStudyScrollAnchorClass}`}
            >
              The systems behind efficient product teams
            </h2>
          </div>

          <div className="col-span-12 md:col-span-6">
            <h3 className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">
              My design system experience
            </h3>
            <ChamferFrame
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 font-mono text-[12px] font-normal leading-[1.55] text-fg md:p-6 md:leading-relaxed [&_p+p]:mt-4"
            >
              {DS_PHILOSOPHY_EXPERIENCE_PARAS.map((para) => (
                <p key={para} className="m-0">
                  {para}
                </p>
              ))}
            </ChamferFrame>
          </div>

          <div className="col-span-12 md:col-span-6">
            <h3 className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">
              Where I&apos;ve built them
            </h3>
            <ChamferFrame
              className="mt-4 w-full md:mt-5"
              innerClassName="p-5 font-mono text-[12px] font-normal leading-[1.55] text-fg md:p-6 md:leading-relaxed [&_li]:text-[12px]"
            >
              <p className="m-0">Design systems built for products such as:</p>
              <DsBulletGrid
                items={DS_PHILOSOPHY_COMPANIES}
                listMarginClass="mb-0 mt-3 md:mt-4"
                ulClass="list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5"
              />
              <p className="mb-0 mt-4 md:mt-5">
                Across B2B, B2C, mobile, web, fintech, climate, travel, and enterprise.
              </p>
            </ChamferFrame>
          </div>

          <ChamferFrame presentationMediaIndex={2}
            className="chamfer-media-border col-span-12 w-full"
            innerClassName="flex min-w-0 justify-center overflow-hidden bg-surface/20 p-0"
          >
            <DsCaseStudyChamferDs3 />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <ProblemStatementFrame
        id="problem-statement"
        className={caseStudyScrollAnchorClass}
        label="The problem"
        statementMaxWidthClassName="max-w-[min(100%,58rem)]"
        framedStatementClassName="font-mono text-[1.35rem] leading-tight tracking-[-0.02em] md:text-[1.75rem] lg:text-[2.125rem]"
        afterRule={
          <div className="flex w-full flex-col gap-10 md:gap-12">
            <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
              <div className="col-span-12 md:col-span-6">
                <div className="space-y-4 text-sm font-normal leading-relaxed text-fg md:text-base md:leading-relaxed">
                  {DS_PROBLEM_BODY_LEFT.map((line) => (
                    <p key={line} className="m-0">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <ChamferFrame
                  className="w-full"
                  innerClassName="p-5 font-mono text-[12px] font-normal leading-[1.55] text-fg md:p-6 md:leading-relaxed"
                >
                  <p className="m-0 text-sm font-normal text-fg md:text-base">
                    Problems when building without a DS
                  </p>
                  <DsBulletGrid
                    items={DS_PROBLEM_WITHOUT_DS_BULLETS}
                    listMarginClass="mb-0 mt-3 md:mt-4"
                    ulClass="list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5"
                  />
                </ChamferFrame>
              </div>
            </FigmaGrid12>
            <ChamferFrame
              presentationMediaIndex={3}
              className="chamfer-media-border w-full"
              innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
            >
              <DsCaseStudyChamferDs4 />
            </ChamferFrame>
          </div>
        }
      >
        <p className="m-0 text-balance">
          Most teams don&apos;t need a design system – until they suddenly do
        </p>
      </ProblemStatementFrame>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="my-philosophy"
        aria-labelledby="my-philosophy-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12">
            <p className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">Saving time</p>
            <h2
              id="my-philosophy-heading"
              className="mt-3 max-w-[min(100%,52rem)] font-mono text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-fg md:mt-4"
            >
              A design system should save more time than it costs
            </h2>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="text-[12px] font-normal leading-relaxed text-fg [&_li]:text-[12px]">
              <p className="m-0">Every component adds maintenance overhead.</p>
              <br />
              <br />
              <p className="m-0">So I optimize for:</p>
              <DsBulletGrid
                items={DS_MY_PHILOSOPHY_OPTIMIZE_BULLETS}
                ulClass="m-0 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5"
              />
            </div>
          </div>

          <div className="col-span-12 self-start md:col-span-6 md:pt-1">
            <ChamferFrame
              fitContentHeight
              className="w-full"
              innerClassName="bg-surface/20 p-5 md:p-6"
            >
              <p className="m-0 max-w-none text-balance font-mono text-[32px] font-normal leading-tight tracking-[-0.02em] text-fg">
                The best systems are not the biggest. They are the most adopted.
              </p>
            </ChamferFrame>
          </div>

          <ChamferFrame
            presentationMediaIndex={4}
            className="chamfer-media-border col-span-12 mt-8 w-full md:mt-10"
            innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
          >
            <DsCaseStudyChamferDs5 />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="foundations-first"
        aria-labelledby="foundations-first-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12">
            <p className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">Foundations first</p>
            <h2
              id="foundations-first-heading"
              className="mt-3 max-w-[min(100%,52rem)] font-mono text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-fg md:mt-4"
            >
              Build the rules before the screens
            </h2>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="text-[12px] font-normal leading-relaxed text-fg [&_li]:text-[12px]">
              <p className="m-0">Every scalable system starts with foundations.</p>
              <br />
              <br />
              <p className="m-0">I typically define:</p>
              <DsBulletGrid
                items={DS_FOUNDATIONS_BULLETS}
                ulClass="m-0 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5"
              />
            </div>
          </div>

          <div className="col-span-12 self-start md:col-span-6 md:pt-1">
            <ChamferFrame
              fitContentHeight
              className="w-full"
              innerClassName="bg-surface/20 p-5 md:p-6"
            >
              <p className="m-0 max-w-none text-balance font-mono text-[32px] font-normal leading-tight tracking-[-0.02em] text-fg">
                These decisions reduce hundreds of future micro-decisions.
              </p>
            </ChamferFrame>
          </div>

          <ChamferFrame
            presentationMediaIndex={5}
            className="chamfer-media-border col-span-12 mt-8 w-full md:mt-10"
            innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
          >
            <DsCaseStudyChamferDs6 />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="components-at-scale"
        aria-labelledby="components-at-scale-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12">
            <p className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">Components at scale</p>
            <h2
              id="components-at-scale-heading"
              className="mt-3 max-w-[min(100%,58rem)] font-mono text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-fg md:mt-4"
            >
              Reusable UI that survives real product growth
            </h2>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="text-[12px] font-normal leading-relaxed text-fg">
              <p className="m-0">
                I build component libraries designed for actual product usage, not Dribbble screenshots.
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="text-[12px] font-normal leading-relaxed text-fg [&_li]:text-[12px]">
              <p className="m-0">Common systems include:</p>
              <DsBulletGrid
                items={DS_COMPONENTS_AT_SCALE_BULLETS}
                ulClass="m-0 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5"
              />
            </div>
          </div>

          <div className="col-span-12 self-start md:col-span-4 md:pt-0">
            <ChamferFrame
              fitContentHeight
              className="w-full"
              innerClassName="bg-surface/20 p-5 md:p-6"
            >
              <p className="m-0 max-w-none text-balance font-mono text-[32px] font-normal leading-tight tracking-[-0.02em] text-fg">
                Uses atomic design to build slot-based systems that swap elements efficiently and reduce variant
                complexity.
              </p>
            </ChamferFrame>
          </div>

          <ChamferFrame
            presentationMediaIndex={6}
            className="chamfer-media-border col-span-12 mt-8 w-full md:mt-10"
            innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
          >
            <DsCaseStudyChamferDs7 />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="states-variants-edge-cases"
        aria-labelledby="states-variants-edge-cases-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12">
            <p className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">
              States, variants, and edge cases
            </p>
            <h2
              id="states-variants-edge-cases-heading"
              className="mt-3 max-w-[min(100%,58rem)] font-mono text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-fg md:mt-4"
            >
              Most systems fail in the states no one plans for
            </h2>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="text-[12px] font-normal leading-relaxed text-fg">
              <p className="m-0">Anyone can make a default button.</p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="text-[12px] font-normal leading-relaxed text-fg [&_li]:text-[12px]">
              <p className="m-0">Real systems handle:</p>
              <DsBulletGrid
                items={DS_STATES_VARIANTS_BULLETS}
                ulClass="m-0 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5"
              />
            </div>
          </div>

          <div className="col-span-12 self-start md:col-span-4">
            <ChamferFrame
              fitContentHeight
              className="w-full"
              innerClassName="bg-surface/20 p-5 md:p-6"
            >
              <p className="m-0 max-w-none text-balance font-mono text-[32px] font-normal leading-tight tracking-[-0.02em] text-fg">
                This is where quality lives.
              </p>
            </ChamferFrame>
          </div>

          <ChamferFrame
            presentationMediaIndex={7}
            className="chamfer-media-border col-span-12 mt-8 w-full md:mt-10"
            innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
          >
            <DsCaseStudyChamferDs8 />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="rules-that-prevent-chaos"
        aria-labelledby="rules-that-prevent-chaos-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12">
            <p className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">
              Rules that prevent chaos
            </p>
            <h2
              id="rules-that-prevent-chaos-heading"
              className="mt-3 max-w-[min(100%,58rem)] font-mono text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-fg md:mt-4"
            >
              Components are only half the system
            </h2>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="text-[12px] font-normal leading-relaxed text-fg [&_li]:text-[12px]">
              <p className="m-0">The other half is behavioral clarity.</p>
              <br />
              <br />
              <p className="m-0">I document:</p>
              <DsBulletGrid
                items={DS_RULES_PREVENT_CHAOS_BULLETS}
                ulClass="m-0 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5"
              />
            </div>
          </div>

          <div className="col-span-12 self-start md:col-span-6 md:pt-1">
            <ChamferFrame
              fitContentHeight
              className="w-full"
              innerClassName="bg-surface/20 p-5 md:p-6"
            >
              <p className="m-0 max-w-none text-balance font-mono text-[32px] font-normal leading-tight tracking-[-0.02em] text-fg">
                This helps teams make good decisions without asking permission constantly.
              </p>
            </ChamferFrame>
          </div>

          <ChamferFrame
            presentationMediaIndex={8}
            className="chamfer-media-border col-span-12 mt-8 w-full md:mt-10"
            innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
          >
            <DsCaseStudyChamferDs9 />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="built-for-real-world-products"
        aria-labelledby="built-for-real-world-products-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12">
            <p className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">
              Built for real-world products
            </p>
            <h2
              id="built-for-real-world-products-heading"
              className="mt-3 max-w-[min(100%,58rem)] font-mono text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-fg md:mt-4"
            >
              Products don&apos;t stay in one language, theme, or layout
            </h2>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="text-[12px] font-normal leading-relaxed text-fg">
              <p className="m-0">
                A component that breaks in German or Arabic is not complete. Neither is another component that
                doesn&apos;t account for different modes or even other seasons, holidays, or cultures.
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="text-[12px] font-normal leading-relaxed text-fg [&_li]:text-[12px]">
              <p className="m-0">I&apos;ve designed for:</p>
              <DsBulletGrid
                items={DS_BUILT_REAL_WORLD_BULLETS}
                ulClass="m-0 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5"
              />
            </div>
          </div>

          <div className="col-span-12 self-start md:col-span-4">
            <ChamferFrame
              fitContentHeight
              className="w-full"
              innerClassName="bg-surface/20 p-5 md:p-6"
            >
              <p className="m-0 max-w-none text-balance font-mono text-[32px] font-normal leading-tight tracking-[-0.02em] text-fg">
                Strong systems need to scale globally.
              </p>
            </ChamferFrame>
          </div>

          <ChamferFrame
            presentationMediaIndex={9}
            className="chamfer-media-border col-span-12 mt-8 w-full md:mt-10"
            innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
          >
            <DsCaseStudyChamferDs10 />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="design-engineering-bridge"
        aria-labelledby="design-engineering-bridge-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12">
            <p className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">
              Design ↔ Engineering bridge
            </p>
            <h2
              id="design-engineering-bridge-heading"
              className="mt-3 max-w-[min(100%,58rem)] font-mono text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-fg md:mt-4"
            >
              Systems only matter if they ship
            </h2>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="text-[12px] font-normal leading-relaxed text-fg">
              <p className="m-0">
                I build systems that developers can implement cleanly. Sometimes I even record videos to explain
                the entire design or component and implement it into a Linear/JIRA ticket for devs.
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="text-[12px] font-normal leading-relaxed text-fg [&_li]:text-[12px]">
              <p className="m-0">That includes:</p>
              <DsBulletGrid
                items={DS_DESIGN_ENGINEERING_BULLETS}
                ulClass="m-0 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5"
              />
            </div>
          </div>

          <div className="col-span-12 self-start md:col-span-4">
            <ChamferFrame
              fitContentHeight
              className="w-full"
              innerClassName="bg-surface/20 p-5 md:p-6"
            >
              <p className="m-0 max-w-none text-balance font-mono text-[32px] font-normal leading-tight tracking-[-0.02em] text-fg">
                My goal is fewer Slack questions and faster builds.
              </p>
            </ChamferFrame>
          </div>

          <ChamferFrame
            presentationMediaIndex={10}
            className="chamfer-media-border col-span-12 mt-8 w-full md:mt-10"
            innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
          >
            <DsCaseStudyChamferDs11 />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section
        id="information-architecture-for-ds"
        aria-labelledby="information-architecture-for-ds-heading"
        className={caseStudyScrollAnchorClass}
      >
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12">
            <p className="m-0 font-mono text-lg font-normal leading-snug text-fg md:text-xl">
              Information architecture for DS
            </p>
            <h2
              id="information-architecture-for-ds-heading"
              className="mt-3 max-w-[min(100%,58rem)] font-mono text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-fg md:mt-4"
            >
              Organized files create organized products
            </h2>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="text-[12px] font-normal leading-relaxed text-fg">
              <p className="m-0">Good file structure compounds over time.</p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="text-[12px] font-normal leading-relaxed text-fg [&_li]:text-[12px]">
              <p className="m-0">Examples:</p>
              <DsBulletGrid
                items={DS_IA_EXAMPLES_BULLETS}
                ulClass="m-0 list-disc space-y-1.5 pl-[1.15rem] md:space-y-2 md:pl-5"
              />
            </div>
          </div>

          <div className="col-span-12 self-start md:col-span-4">
            <ChamferFrame
              fitContentHeight
              className="w-full"
              innerClassName="bg-surface/20 p-5 md:p-6"
            >
              <p className="m-0 max-w-none text-balance font-mono text-[32px] font-normal leading-tight tracking-[-0.02em] text-fg">
                I structure design files so teams can move quickly.
              </p>
            </ChamferFrame>
          </div>

          <ChamferFrame
            presentationMediaIndex={11}
            className="chamfer-media-border col-span-12 mt-8 w-full md:mt-10"
            innerClassName="flex min-h-0 min-w-0 flex-col overflow-hidden bg-surface/20 p-0"
          >
            <DsCaseStudyChamferDs12 />
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />

      <section aria-label="What a design system unlocks, then retrospective">
        <FigmaGrid12 className="md:[column-gap:clamp(1.75rem,3.8vw,2.75rem)]">
          <div className="col-span-12 mb-8 w-full min-w-0 text-fg md:mb-10">
            <p className="m-0 font-mono text-sm font-normal leading-snug text-fg md:text-base">
              What a DS unlocks
            </p>
            <p className="m-0 mt-3 font-mono text-[clamp(1.125rem,2.4vw,1.5rem)] font-normal leading-tight tracking-[-0.02em] text-fg">
              Better systems create better product velocity
            </p>
            <div className="mt-6 grid grid-cols-1 gap-8 font-mono md:mt-8 md:grid-cols-2 md:items-start md:gap-8 lg:gap-10">
              <div>
                <p className="m-0 text-[12px] font-normal leading-relaxed text-fg">
                  Across multiple teams, strong systems helped enable:
                </p>
                <DsBulletGrid
                  items={DS_RETRO_WHAT_UNLOCKS_BULLETS}
                  listMarginClass="mt-2 md:mt-3"
                  ulClass="m-0 list-outside list-disc space-y-1.5 pl-[1.15rem] text-[12px] font-normal leading-relaxed text-fg md:space-y-2 md:pl-5"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-3 text-sm font-normal leading-snug text-fg md:gap-4 md:text-base md:leading-relaxed">
                <p className="m-0">Design systems are not decoration.</p>
                <p className="m-0">They are operational leverage.</p>
              </div>
            </div>
            <div className="mt-8 md:mt-10">
              <ProblemStatementGlitchedCopy
                framedStatementClassName="font-mono text-[1.35rem] leading-tight tracking-[-0.02em] md:text-[1.75rem] lg:text-[2.125rem]"
                statementMaxWidthClassName="max-w-[min(100%,58rem)]"
              >
                <p className="m-0 text-balance">
                  A design system is never finished.
                  <br />
                  Every product evolves.
                  <br />
                  New features, new devices, new accessibility standards, new business models, new
                  constraints.
                  <br />
                  The best systems stay flexible without losing coherence.
                </p>
              </ProblemStatementGlitchedCopy>
            </div>
          </div>

          <ChamferFrame
            meteorTrail
            className="col-span-12 md:col-span-8 md:col-start-3"
            innerClassName="px-4 py-12 text-left md:px-6 md:py-16"
          >
            <h2
              id="retro-title"
              className={`text-left text-base font-normal text-fg md:text-[40px] ${caseStudyScrollAnchorClass}`}
            >
              Retrospective
            </h2>
            <div className="mt-8 flex max-w-2xl flex-col gap-3 font-mono text-[12px] font-normal leading-relaxed text-fg">
              <p className="m-0">What I&apos;ve learned most:</p>
              <DsBulletGrid
                items={DS_RETRO_LEARNED_BULLETS}
                listMarginClass=""
                ulClass="m-0 list-outside list-disc space-y-3 pl-5 marker:text-fg"
                liClassName="pl-1"
              />
            </div>
            <ChamferFrame
              fitContentHeight
              className="chamfer-tradeoff-outline mt-8 w-fit max-w-full shrink-0"
              innerClassName="flex min-h-0 min-w-0 items-center justify-start overflow-hidden bg-bg p-0"
            >
              <img
                src={dsPuzzleGif}
                alt=""
                decoding="async"
                loading="lazy"
                className="block h-auto w-24 max-w-[6.5rem] object-contain object-left md:w-28 md:max-w-[7.5rem]"
              />
            </ChamferFrame>
          </ChamferFrame>
        </FigmaGrid12>
      </section>

      <div className="figma-rule my-[32px]" aria-hidden />
      <ExperimentalCaseStudiesPanel layout="footer" />
    </CaseStudyShowcaseScaffold>
  )
}
