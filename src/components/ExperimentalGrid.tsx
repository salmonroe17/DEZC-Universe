import { motion } from 'framer-motion'
import { useState } from 'react'
import { easeOutExpo } from '../animations/variants'
import { useMajorityInView } from '../hooks/useMajorityInView'
import { useNoPrimaryHoverDevice } from '../hooks/useNoPrimaryHoverDevice'
import { ExperimentalCaseStudiesPanel } from './ExperimentalCaseStudiesPanel'
import { ExperimentalSideQuestsPanel, showTellQuadrantCell } from './ExperimentalSideQuestsPanel'
import { HudShooterIntro } from './HudShooterIntro'
import { WhoIamOrbMarquee } from './WhoIamOrbMarquee'

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
}

const cellVariants = {
  hidden: {
    opacity: 0,
    scale: 0.997,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.26,
      ease: easeOutExpo,
    },
  },
}

/** Chamfered border + fill via ::before/::after (see index.css). */
const quadrantCell = 'quadrant-cell min-h-0 min-w-0'

export function ExperimentalGrid() {
  const noPrimaryHover = useNoPrimaryHoverDevice()
  const [heroQEl, setHeroQEl] = useState<HTMLDivElement | null>(null)
  const [caseStudiesQEl, setCaseStudiesQEl] = useState<HTMLDivElement | null>(null)
  const [whoIamQEl, setWhoIamQEl] = useState<HTMLDivElement | null>(null)
  const [showTellQEl, setShowTellQEl] = useState<HTMLDivElement | null>(null)
  const heroMajorityInView = useMajorityInView(heroQEl, noPrimaryHover)
  const caseStudiesMajorityInView = useMajorityInView(caseStudiesQEl, noPrimaryHover)
  const whoIamMajorityInView = useMajorityInView(whoIamQEl, noPrimaryHover)
  const showTellMajorityInView = useMajorityInView(showTellQEl, noPrimaryHover)

  const [whoIamPointerInside, setWhoIamPointerInside] = useState(false)
  const [whoIamFocusInside, setWhoIamFocusInside] = useState(false)
  const whoIamScrollActive =
    whoIamPointerInside || whoIamFocusInside || (noPrimaryHover && whoIamMajorityInView)

  const whoBioClass = [
    'min-h-0 flex-1 px-4 py-3 text-left text-[11px] font-normal leading-relaxed tracking-[0.02em] text-fg transition-opacity duration-300 ease-out md:text-xs md:tracking-[0.015em]',
    whoIamScrollActive
      ? 'overflow-y-auto opacity-100'
      : 'overflow-y-auto opacity-100 max-lg:opacity-100 max-lg:overflow-y-auto lg:overflow-hidden lg:opacity-30',
  ].join(' ')

  return (
    <div className="box-border flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col items-stretch overflow-x-hidden bg-bg p-3 sm:p-4 lg:max-[1439px]:p-4 port-xl:p-5">
      <motion.div
        className={[
          'grid w-full min-w-0 max-w-full flex-1 gap-3 overflow-x-hidden',
          'max-lg:grid-cols-1 sm:max-lg:grid-cols-2',
          'lg:min-h-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-rows-[13fr_7fr] lg:gap-2.5 port-xl:gap-4',
        ].join(' ')}
        initial="hidden"
        animate="visible"
        variants={gridContainerVariants}
      >
        {/* 1 — Hero / mini-game (desktop top-left) */}
        <motion.div
          ref={setHeroQEl}
          variants={cellVariants}
          className={`${quadrantCell} relative flex h-full min-h-0 sm:max-lg:col-start-1 sm:max-lg:row-start-1 lg:col-start-1 lg:row-start-1`}
          data-quadrant-in-view={noPrimaryHover && heroMajorityInView ? true : undefined}
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="relative z-10 flex h-full min-h-0 min-w-0 w-full max-lg:min-h-[500px] flex-1 overflow-hidden">
            <HudShooterIntro />
          </div>
        </motion.div>

        {/* 2 — Case Studies (desktop top-right) */}
        <motion.div
          ref={setCaseStudiesQEl}
          variants={cellVariants}
          className={`group/right-quadrant ${quadrantCell} relative flex h-full min-h-0 min-w-0 flex-col sm:max-lg:col-start-2 sm:max-lg:row-start-1 lg:col-start-2 lg:row-start-1`}
          data-quadrant-in-view={noPrimaryHover && caseStudiesMajorityInView ? true : undefined}
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="relative z-10 flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <ExperimentalCaseStudiesPanel layout="quadrant" />
          </div>
        </motion.div>

        {/* 3 — Who I am (desktop bottom-right) */}
        <motion.div
          ref={setWhoIamQEl}
          variants={cellVariants}
          className={`${quadrantCell} relative flex h-full min-h-0 min-w-0 flex-col sm:max-lg:col-start-2 sm:max-lg:row-start-2 lg:col-start-2 lg:row-start-2`}
          data-quadrant-in-view={noPrimaryHover && whoIamMajorityInView ? true : undefined}
          style={{ willChange: 'opacity, transform' }}
          onPointerEnter={() => setWhoIamPointerInside(true)}
          onPointerLeave={() => setWhoIamPointerInside(false)}
          onFocusCapture={() => setWhoIamFocusInside(true)}
          onBlurCapture={(e) => {
            const next = e.relatedTarget as Node | null
            if (!next || !e.currentTarget.contains(next)) {
              setWhoIamFocusInside(false)
            }
          }}
        >
          <div className="relative z-10 flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex h-full min-h-0 flex-1 flex-col">
              <div className="flex min-h-[5.25rem] shrink-0 basis-[26%] flex-col border-b border-cell-border md:min-h-0 md:basis-[25%]">
                <div className="grid min-h-0 flex-1 grid-cols-[auto_1fr]">
                  <div className="flex h-full min-w-0 items-center justify-center border-r border-cell-border px-3 md:px-4">
                    <h2 className="text-center text-[11px] font-semibold tracking-[0.06em] text-fg/90 md:text-xs md:tracking-[0.05em]">
                      Who I am
                    </h2>
                  </div>
                  <div className="relative z-[2] flex h-full min-h-0 min-w-0 w-full items-stretch overflow-visible">
                    <WhoIamOrbMarquee quadrantActive={whoIamScrollActive} />
                  </div>
                </div>
              </div>
              <div className={whoBioClass}>
                <p className="mb-3 last:mb-0 md:mb-3.5">Hello! My name is Dez.</p>
                <p className="mb-3 last:mb-0 md:mb-3.5">
                  I&apos;m a Lead Product Designer &amp; design systems connoisseur in the wonderful
                  city of Toronto (#WeTheNorth).
                </p>
                <p className="mb-3 last:mb-0 md:mb-3.5">
                  Besides product design, my passions include creating all sorts of things, whether
                  that be creating art, illustrating, animating, making video games, board games, or
                  something just for myself.
                </p>
                <p>
                  For business inquiries or my resume, you can contact me on{' '}
                  <a
                    href="https://www.linkedin.com/in/dezchang"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-fg underline decoration-cell-border underline-offset-[3px] transition-colors hover:text-fg hover:decoration-hud"
                  >
                    LinkedIn
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 — Side quests / show & tell (desktop bottom-left) */}
        <motion.div
          ref={setShowTellQEl}
          variants={cellVariants}
          id="show-tell"
          className={`group/showtell ${showTellQuadrantCell} relative flex h-full min-h-0 flex-col scroll-mt-24 sm:max-lg:col-start-1 sm:max-lg:row-start-2 lg:col-start-1 lg:row-start-2 md:scroll-mt-28`}
          data-show-tell-quadrant
          data-quadrant-in-view={noPrimaryHover && showTellMajorityInView ? true : undefined}
          style={{ willChange: 'opacity, transform' }}
        >
          <ExperimentalSideQuestsPanel layout="quadrant" />
        </motion.div>
      </motion.div>
    </div>
  )
}
