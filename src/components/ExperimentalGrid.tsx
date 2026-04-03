import { motion } from 'framer-motion'
import { easeOutExpo } from '../animations/variants'
import { HudShooterIntro } from './HudShooterIntro'

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

const cellBorder =
  'border border-cell-border shadow-none transition-[border-color,box-shadow] duration-200 ease-out hover:border-cell-hover hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_12%,transparent),0_0_18px_color-mix(in_srgb,var(--color-hud)_18%,transparent),0_0_36px_color-mix(in_srgb,var(--color-hud)_8%,transparent)]'

export function ExperimentalGrid() {
  return (
    <div className="box-border min-h-[calc(100dvh-3rem)] w-full bg-bg p-4 md:p-5">
      <motion.div
        className="grid h-[calc(100dvh-3rem-2rem)] w-full min-h-0 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-[7fr_3fr] gap-3 md:h-[calc(100dvh-3rem-2.5rem)] md:gap-4"
        initial="hidden"
        animate="visible"
        variants={gridContainerVariants}
      >
        <motion.div
          variants={cellVariants}
          className={`relative flex min-h-0 min-w-0 items-stretch justify-stretch overflow-hidden border-dashed ${cellBorder}`}
          style={{ willChange: 'opacity, transform' }}
        >
          <HudShooterIntro />
        </motion.div>
        <motion.div
          variants={cellVariants}
          className={`min-h-0 min-w-0 ${cellBorder}`}
          style={{ willChange: 'opacity, transform' }}
        />
        <motion.div
          variants={cellVariants}
          className={`min-h-0 min-w-0 ${cellBorder}`}
          style={{ willChange: 'opacity, transform' }}
        />
        <motion.div
          variants={cellVariants}
          className={`min-h-0 min-w-0 ${cellBorder}`}
          style={{ willChange: 'opacity, transform' }}
        />
      </motion.div>
    </div>
  )
}
