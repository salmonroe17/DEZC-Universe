import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { easeOutExpo } from '../animations/variants'
import { CaseStudyList } from './CaseStudyList'
import { Fake3DCube } from './Fake3DCube'
import { HudShooterIntro } from './HudShooterIntro'
import { ShowAndTellGrid } from './ShowAndTellGrid'

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

export function ExperimentalGrid() {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0)
  const [caseListPointerInside, setCaseListPointerInside] = useState(false)

  const onCaseAdvance = useCallback(() => {
    setActiveCaseIndex((i) => (i + 1) % 4)
  }, [])

  const onCaseListPointerInsideChange = useCallback((inside: boolean) => {
    setCaseListPointerInside(inside)
  }, [])

  return (
    <div className="box-border flex min-h-0 w-full flex-1 flex-col bg-bg p-4 md:p-5">
      <motion.div
        className="grid min-h-0 w-full flex-1 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-[7fr_3fr] gap-3 md:gap-4"
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
          className={`${quadrantCell} relative flex flex-col`}
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <h2 className={quadrantHeadingClass}>Show & tell</h2>
            <ShowAndTellGrid />
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
