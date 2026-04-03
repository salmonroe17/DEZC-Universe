import { motion } from 'framer-motion'
import { useCallback, useMemo, useRef, useState } from 'react'
import { easeOutExpo } from '../animations/variants'
import { CaseStudyList } from './CaseStudyList'
import { Fake3DCube } from './Fake3DCube'
import { HudShooterIntro } from './HudShooterIntro'
import { FlowingLine } from './FlowingLine'
import { ShowTellSandCanvas } from './ShowTellSandCanvas'

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

/** Matches quadrant section titles (e.g. Case Studies). */
const quadrantHeadingClass =
  'shrink-0 px-4 pt-3 text-left text-[11px] font-semibold tracking-[0.06em] text-fg/90 md:pt-4 md:text-xs md:tracking-[0.05em]'

const showTellSubtitleClass =
  'shrink-0 px-4 pb-1.5 text-left text-[10px] font-normal leading-snug tracking-[0.04em] text-fg-subtle md:pb-2 md:text-[11px] md:tracking-[0.035em]'

export function ExperimentalGrid() {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0)
  const [caseListPointerInside, setCaseListPointerInside] = useState(false)

  const sandLineRootRef = useRef<HTMLDivElement>(null)
  const sandTrackRef = useRef<HTMLDivElement>(null)
  const sandPhaseRef = useRef(0)
  const sandHoveredNodeIndexRef = useRef<number | null>(null)
  const sandRefs = useMemo(
    () => ({
      lineRootRef: sandLineRootRef,
      trackRef: sandTrackRef,
      phaseRef: sandPhaseRef,
      hoveredNodeIndexRef: sandHoveredNodeIndexRef,
    }),
    [],
  )

  const onCaseAdvance = useCallback(() => {
    setActiveCaseIndex((i) => (i + 1) % 4)
  }, [])

  const onCaseListPointerInsideChange = useCallback((inside: boolean) => {
    setCaseListPointerInside(inside)
  }, [])

  return (
    <div className="box-border flex min-h-0 w-full flex-1 flex-col items-start bg-bg p-4 md:p-5">
      <motion.div
        className="grid h-[calc(100dvh-3rem-2rem)] max-h-full min-h-0 w-full shrink-0 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-[7fr_3fr] gap-3 md:h-[calc(100dvh-3rem-2.5rem)] md:gap-4"
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
            <h2 className={quadrantHeadingClass}>Case Studies</h2>
            <Fake3DCube activeCaseIndex={activeCaseIndex} />
            <CaseStudyList
              activeCaseIndex={activeCaseIndex}
              onActiveCaseChange={setActiveCaseIndex}
              autoRotatePaused={caseListPointerInside}
              onAutoAdvance={onCaseAdvance}
              onCaseListPointerInsideChange={onCaseListPointerInsideChange}
            />
          </div>
        </motion.div>
        <motion.div
          variants={cellVariants}
          className={`group/showtell ${quadrantCell} relative flex flex-col`}
          data-show-tell-quadrant
          style={{ willChange: 'opacity, transform' }}
        >
          <ShowTellSandCanvas sandRefs={sandRefs} />
          <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-visible">
            <h2
              className={`${quadrantHeadingClass} relative z-[2] w-fit max-w-full shrink-0 self-start`}
            >
              Show & tell
            </h2>
            <p
              className={`${showTellSubtitleClass} relative z-[2] mb-3 w-fit max-w-full shrink-0 self-start md:mb-4`}
            >
              Click squares to see visuals
            </p>
            <div className="relative z-[1] flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-visible opacity-30 transition-opacity duration-300 ease-out group-hover/showtell:opacity-100">
              <FlowingLine
                sandLineRootRef={sandLineRootRef}
                sandTrackRef={sandTrackRef}
                sandPhaseRef={sandPhaseRef}
                sandHoveredNodeIndexRef={sandHoveredNodeIndexRef}
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={cellVariants}
          className={`${quadrantCell} relative flex flex-col`}
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <h2 className={quadrantHeadingClass}>Who I am</h2>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
