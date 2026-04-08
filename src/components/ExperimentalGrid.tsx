import { motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { easeOutExpo } from '../animations/variants'
import { ExperimentalCaseStudiesPanel } from './ExperimentalCaseStudiesPanel'
import { HudShooterIntro } from './HudShooterIntro'
import { FlowingLine } from './FlowingLine'
import { ShowTellAmbientLines } from './ShowTellAmbientLines'
import { ShowTellSandCanvas } from './ShowTellSandCanvas'
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

/** Matches quadrant section titles (e.g. Show & tell heading). */
const quadrantHeadingClass =
  'shrink-0 px-4 pt-3 text-left text-[11px] font-semibold tracking-[0.06em] text-fg/90 md:pt-4 md:text-xs md:tracking-[0.05em]'

const showTellSubtitleClass =
  'shrink-0 px-4 pb-1.5 text-left text-[10px] font-normal leading-snug tracking-[0.04em] text-fg-subtle md:pb-2 md:text-[11px] md:tracking-[0.035em]'

export function ExperimentalGrid() {
  const [whoIamPointerInside, setWhoIamPointerInside] = useState(false)
  const [whoIamFocusInside, setWhoIamFocusInside] = useState(false)
  const whoIamScrollActive = whoIamPointerInside || whoIamFocusInside

  const sandLineRootRef = useRef<HTMLDivElement>(null)
  const sandTrackRef = useRef<HTMLDivElement>(null)
  const sandPhaseRef = useRef(0)
  const sandHoveredNodeIndexRef = useRef<number | null>(null)
  const sandScrollHUnitRef = useRef(0)
  const sandRefs = useMemo(
    () => ({
      lineRootRef: sandLineRootRef,
      trackRef: sandTrackRef,
      phaseRef: sandPhaseRef,
      hoveredNodeIndexRef: sandHoveredNodeIndexRef,
    }),
    [],
  )

  return (
    <div className="box-border flex min-h-0 w-full flex-1 flex-col items-start bg-bg p-4 md:p-5">
      <motion.div
        className="grid min-h-0 w-full flex-1 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-[13fr_7fr] gap-3 md:gap-4"
        initial="hidden"
        animate="visible"
        variants={gridContainerVariants}
      >
        <motion.div
          variants={cellVariants}
          className={`${quadrantCell} relative flex items-stretch justify-stretch`}
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="relative z-10 flex min-h-0 min-w-0 flex-1 overflow-hidden">
            <HudShooterIntro />
          </div>
        </motion.div>
        <motion.div
          variants={cellVariants}
          className={`group/right-quadrant ${quadrantCell} relative flex flex-col`}
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <ExperimentalCaseStudiesPanel layout="quadrant" />
          </div>
        </motion.div>
        <motion.div
          variants={cellVariants}
          id="show-tell"
          className={`group/showtell ${quadrantCell} relative flex scroll-mt-24 flex-col md:scroll-mt-28`}
          data-show-tell-quadrant
          style={{ willChange: 'opacity, transform' }}
        >
          <ShowTellAmbientLines
            scrollHUnitRef={sandScrollHUnitRef}
            hoveredNodeIndexRef={sandHoveredNodeIndexRef}
          />
          <ShowTellSandCanvas sandRefs={sandRefs} />
          <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-visible">
            <h2
              className={`${quadrantHeadingClass} relative z-[2] w-fit max-w-full shrink-0 self-start`}
            >
              My multiple timelines of side projects
            </h2>
            <p
              className={`${showTellSubtitleClass} relative z-[2] mb-4 w-fit max-w-full shrink-0 self-start md:mb-5`}
            >
              Click squares to see visuals
            </p>
            <div className="relative z-[1] flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-visible opacity-30 transition-opacity duration-300 ease-out group-hover/showtell:opacity-100">
              <FlowingLine
                sandLineRootRef={sandLineRootRef}
                sandTrackRef={sandTrackRef}
                sandPhaseRef={sandPhaseRef}
                sandHoveredNodeIndexRef={sandHoveredNodeIndexRef}
                sandScrollHUnitRef={sandScrollHUnitRef}
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={cellVariants}
          className={`${quadrantCell} relative flex flex-col`}
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
              <div
                className={`min-h-0 flex-1 px-4 py-3 text-left text-[11px] font-normal leading-relaxed tracking-[0.02em] text-fg transition-opacity duration-300 ease-out md:text-xs md:tracking-[0.015em] ${
                  whoIamScrollActive
                    ? 'overflow-y-auto opacity-100'
                    : 'overflow-hidden opacity-30'
                }`}
              >
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
      </motion.div>
    </div>
  )
}
