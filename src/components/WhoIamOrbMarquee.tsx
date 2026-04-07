import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { WHO_IAM_ORB_ART } from '../data/whoIamOrbArt'

const BURST_RESET_MS = 680
const PARTICLE_N = 14

type BurstState = { idx: number; id: number }

function OrbBurstParticles({ burstId }: { burstId: number }) {
  return (
    <>
      {Array.from({ length: PARTICLE_N }, (_, pi) => {
        const angle = (pi / PARTICLE_N) * Math.PI * 2
        const dist = 36 + (pi % 4) * 7
        return (
          <motion.span
            key={`${burstId}-p-${pi}`}
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/85"
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0.12,
            }}
            transition={{ duration: 0.52, ease: 'easeOut' }}
          />
        )
      })}
    </>
  )
}

function OrbCell({
  src,
  index,
  burst,
  onActivate,
}: {
  src: string | null
  index: number
  burst: BurstState | null
  onActivate: (index: number) => void
}) {
  const reduced = useReducedMotion() ?? false
  const bursting = burst !== null && burst.idx === index

  return (
    <motion.button
      type="button"
      onClick={() => onActivate(index)}
      aria-label={src ? `Dot art ${index + 1}` : `Empty circle ${index + 1}`}
      className={[
        'group/orb relative box-border flex aspect-square h-full max-h-full min-h-[2.75rem] min-w-[2.75rem] shrink-0 cursor-pointer',
        'items-center justify-center rounded-full border border-fg/[0.22] bg-transparent',
        'pointer-events-auto outline-none transition-[box-shadow,border-color] duration-200',
        'hover:border-fg/[0.48] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-fg)_22%,transparent),0_0_20px_color-mix(in_srgb,var(--color-fg)_12%,transparent)]',
        'focus-visible:border-fg/[0.55] focus-visible:ring-2 focus-visible:ring-fg/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        bursting ? 'z-[30] overflow-visible' : 'z-[1] overflow-hidden',
      ].join(' ')}
      whileHover={reduced ? undefined : { scale: 1.06 }}
      whileTap={reduced ? undefined : { scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
    >
      <motion.div
        className="relative z-[1] flex h-full w-full max-h-[4.25rem] max-w-[4.25rem] items-center justify-center"
        animate={
          bursting && !reduced
            ? { scale: 1.28, opacity: 0, filter: 'blur(5px)' }
            : bursting && reduced
              ? { opacity: [1, 0.45, 1] }
              : { scale: 1, opacity: 1, filter: 'blur(0px)' }
        }
        transition={
          bursting && reduced
            ? { duration: 0.35, ease: 'easeInOut' }
            : { duration: 0.38, ease: 'easeOut' }
        }
      >
        {src ? (
          <img
            src={src}
            alt=""
            draggable={false}
            className="h-full w-full select-none object-contain object-center transition-[filter,transform] duration-200 group-hover/orb:brightness-[1.12] group-hover/orb:contrast-[1.05] group-hover/orb:drop-shadow-[0_0_10px_color-mix(in_srgb,var(--color-fg)_18%,transparent)]"
          />
        ) : (
          <div className="h-full w-full shrink-0" aria-hidden />
        )}
      </motion.div>

      <AnimatePresence>
        {bursting && !reduced && (
          <motion.span
            key={`ring-${burst.id}`}
            className="pointer-events-none absolute inset-0 z-[5] rounded-full border-2 border-fg/[0.65]"
            initial={{ scale: 0.88, opacity: 0.95 }}
            animate={{ scale: 2.15, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      {bursting && !reduced && <OrbBurstParticles burstId={burst.id} />}
    </motion.button>
  )
}

function OrbStrip({
  stripKey,
  burst,
  onActivate,
}: {
  stripKey: string
  burst: BurstState | null
  onActivate: (index: number) => void
}) {
  return (
    <div className="flex h-full w-max shrink-0 items-center gap-5 pr-5">
      {WHO_IAM_ORB_ART.map((src, i) => (
        <OrbCell key={`${stripKey}-${i}`} src={src} index={i} burst={burst} onActivate={onActivate} />
      ))}
    </div>
  )
}

export type WhoIamOrbMarqueeProps = {
  /** True when pointer or focus is inside the Who I am quadrant — orbs go to full opacity. */
  quadrantActive: boolean
}

/** Outlined circles with dot-art images, left → right marquee; hover + click burst. */
export function WhoIamOrbMarquee({ quadrantActive }: WhoIamOrbMarqueeProps) {
  const [burst, setBurst] = useState<BurstState | null>(null)
  const burstSerial = useRef(0)

  const onActivate = useCallback((index: number) => {
    burstSerial.current += 1
    const id = burstSerial.current
    setBurst({ idx: index, id })
    window.setTimeout(() => {
      setBurst((b) => (b?.id === id ? null : b))
    }, BURST_RESET_MS)
  }, [])

  return (
    <div className="box-border h-full min-h-0 w-full min-w-0 overflow-visible p-1">
      <div className="h-full min-h-0 w-full overflow-x-clip overflow-y-visible">
        <div
          className={
            quadrantActive
              ? 'whoiam-orbit-marquee flex h-full w-max items-center opacity-100 transition-opacity duration-300 ease-out'
              : 'whoiam-orbit-marquee flex h-full w-max items-center opacity-50 transition-opacity duration-300 ease-out'
          }
        >
          <OrbStrip stripKey="a" burst={burst} onActivate={onActivate} />
          <OrbStrip stripKey="b" burst={burst} onActivate={onActivate} />
        </div>
      </div>
    </div>
  )
}
