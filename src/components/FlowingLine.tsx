import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react'

/** ViewBox width for one full sine period (two periods drawn = seamless tile). */
const PERIOD = 200
/** Taller viewBox so the wave can use most of the vertical band (stroke + glow margin). */
const VB_H = 72
const MID = VB_H / 2
/** Primary sine amplitude (uses vertical space in the quadrant). */
const AMP1 = 24
/** Secondary harmonic — beats against the primary for snake-like silhouette churn. */
const AMP2 = 5.5
const TOTAL_W = PERIOD * 2
/** Markers along the wave (same math as path → stays on-curve under non-uniform scale). */
const NODE_COUNT = 8
/**
 * Temporal phase speeds (rad/s). Different rates + opposite sign = slithering, not rigid slide.
 * Spatial periods stay integer multiples of P so horizontal tiling stays seamless.
 */
const SLITH1 = 0.3
const SLITH2 = -0.23
/** One full horizontal wavelength (parent-relative) in seconds — matches prior CSS cadence. */
const H_SCROLL_S = 80
/** Horizontal drift while hovering or holding an arrow (wavelengths per second). */
const ARROW_DRIFT_RATE = 0.2

function isPrimaryPointer(e: PointerEvent): boolean {
  return e.pointerType === 'touch' || e.pointerType === 'pen' || e.button === 0
}

function cycleMod(n: number): number {
  return ((n % 1) + 1) % 1
}

function waveY(x: number, time: number): number {
  const s1 = (x / PERIOD) * 2 * Math.PI + time * SLITH1
  const s2 = (x / PERIOD) * 4 * Math.PI + time * SLITH2
  return MID + AMP1 * Math.sin(s1) + AMP2 * Math.sin(s2)
}

function buildSinePath(periods: number, period: number, time: number): string {
  const totalW = period * periods
  const stepsPerPeriod = 64
  const steps = stepsPerPeriod * periods
  const parts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const x = (totalW * i) / steps
    const y = waveY(x, time)
    parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(3)} ${y.toFixed(3)}`)
  }
  return parts.join(' ')
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none">
      <path
        d="M9 3.5 5.5 7 9 10.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none">
      <path
        d="M5 3.5 8.5 7 5 10.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

const arrowBtnClass =
  'pointer-events-auto z-20 flex size-9 touch-none select-none items-center justify-center border border-cell-border/90 bg-bg/75 text-fg/70 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-fg)_6%,transparent)] backdrop-blur-[2px] transition-[color,background-color,border-color] duration-150 hover:border-fg/35 hover:bg-elevated/90 hover:text-fg md:size-10'

export function FlowingLine() {
  const uid = useId()
  const filterId = useMemo(() => `flowing-line-glow-${uid.replace(/:/g, '')}`, [uid])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const linePaused = hoveredIndex !== null
  const linePausedRef = useRef(false)
  linePausedRef.current = linePaused

  const [phaseTime, setPhaseTime] = useState(0)
  const [userHOffset, setUserHOffset] = useState(0)
  const scrollCycleRef = useRef(0)

  const arrowLeftRef = useRef(false)
  const arrowRightRef = useRef(false)
  const leftPointerOverRef = useRef(false)
  const leftPointerHeldRef = useRef(false)
  const rightPointerOverRef = useRef(false)
  const rightPointerHeldRef = useRef(false)

  const syncArrowLeft = () => {
    arrowLeftRef.current = leftPointerOverRef.current || leftPointerHeldRef.current
  }
  const syncArrowRight = () => {
    arrowRightRef.current = rightPointerOverRef.current || rightPointerHeldRef.current
  }

  useEffect(() => {
    let id: number
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.064)
      last = now
      if (!linePausedRef.current) {
        scrollCycleRef.current += dt / H_SCROLL_S
        setPhaseTime((t) => t + dt)
      }
      if (arrowLeftRef.current) {
        setUserHOffset((u) => u + ARROW_DRIFT_RATE * dt)
      } else if (arrowRightRef.current) {
        setUserHOffset((u) => u - ARROW_DRIFT_RATE * dt)
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  const pathD = useMemo(() => buildSinePath(2, PERIOD, phaseTime), [phaseTime])

  const nodePoints = useMemo(
    () =>
      Array.from({ length: NODE_COUNT }, (_, i) => {
        const x = ((i + 0.5) / NODE_COUNT) * TOTAL_W
        return { x, y: waveY(x, phaseTime) }
      }),
    [phaseTime],
  )

  const hUnit = cycleMod(scrollCycleRef.current + userHOffset)
  const leftPercent = -hUnit * 100

  const onNodeLeave = (e: MouseEvent<HTMLDivElement>) => {
    const rel = e.relatedTarget as HTMLElement | null
    if (rel?.closest?.('[data-flowing-line-node]')) return
    setHoveredIndex(null)
  }

  return (
    <div className="relative min-h-0 w-full flex-1 overflow-visible py-2 md:py-3">
      <div
        className="absolute top-1 bottom-1 left-0 w-[200%] max-w-none overflow-visible will-change-[left] md:top-2 md:bottom-2"
        style={{ left: `${leftPercent}%` }}
        aria-hidden
      >
        <svg
          className="absolute inset-0 block h-full w-full text-fg/55"
          viewBox={`0 0 ${TOTAL_W} ${VB_H}`}
          preserveAspectRatio="none"
        >
          <defs>
            <filter
              id={filterId}
              x="-20%"
              y="-100%"
              width="140%"
              height="300%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.55" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.32}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="nonScalingStroke"
            filter={`url(#${filterId})`}
          />
        </svg>
        {nodePoints.map((p, i) => {
          const active = hoveredIndex === i
          const dimOthers = linePaused && !active

          return (
            <div
              key={i}
              data-flowing-line-node
              className="absolute z-[1] overflow-visible pointer-events-auto"
              style={{
                left: `${(p.x / TOTAL_W) * 100}%`,
                top: `${(p.y / VB_H) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: active ? 3 : 1,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={onNodeLeave}
              aria-hidden
            >
              <div className="-m-3 flex items-center justify-center overflow-visible p-3">
                {active ? (
                  <div className="relative flex items-center justify-center">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/[0.22] blur-[20px] md:h-[120px] md:w-[120px] md:blur-[26px]"
                    />
                    <div
                      className="relative z-[1] size-4 shrink-0 rounded-none bg-fg/92 brightness-110 transition-[transform,opacity,filter,background-color] duration-150 ease-out scale-[2.5] md:size-5"
                    />
                  </div>
                ) : (
                  <div
                    className={[
                      'size-4 shrink-0 rounded-none md:size-5',
                      'transition-[transform,opacity,filter,background-color,box-shadow] duration-150 ease-out',
                      dimOthers
                        ? 'scale-100 bg-fg/38 opacity-[0.32] brightness-[0.72]'
                        : 'scale-100 bg-fg/38 shadow-[0_0_6px_rgba(250,250,250,0.12)]',
                    ].join(' ')}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className={`${arrowBtnClass} absolute bottom-1 left-1 md:bottom-2 md:left-2`}
        aria-label="Move line left (hover or hold)"
        onPointerEnter={() => {
          leftPointerOverRef.current = true
          syncArrowLeft()
        }}
        onPointerLeave={() => {
          leftPointerOverRef.current = false
          if (!leftPointerHeldRef.current) {
            arrowLeftRef.current = false
          }
        }}
        onPointerDown={(e) => {
          if (!isPrimaryPointer(e)) return
          leftPointerHeldRef.current = true
          syncArrowLeft()
          try {
            e.currentTarget.setPointerCapture(e.pointerId)
          } catch {
            /* already captured */
          }
        }}
        onPointerUp={(e) => {
          if (!isPrimaryPointer(e)) return
          leftPointerHeldRef.current = false
          try {
            e.currentTarget.releasePointerCapture(e.pointerId)
          } catch {
            /* not captured */
          }
          arrowLeftRef.current = leftPointerOverRef.current
        }}
        onPointerCancel={() => {
          leftPointerHeldRef.current = false
          arrowLeftRef.current = leftPointerOverRef.current
        }}
        onLostPointerCapture={() => {
          leftPointerHeldRef.current = false
          arrowLeftRef.current = leftPointerOverRef.current
        }}
      >
        <ChevronLeftIcon />
      </button>
      <button
        type="button"
        className={`${arrowBtnClass} absolute bottom-1 right-1 md:bottom-2 md:right-2`}
        aria-label="Move line right (hover or hold)"
        onPointerEnter={() => {
          rightPointerOverRef.current = true
          syncArrowRight()
        }}
        onPointerLeave={() => {
          rightPointerOverRef.current = false
          if (!rightPointerHeldRef.current) {
            arrowRightRef.current = false
          }
        }}
        onPointerDown={(e) => {
          if (!isPrimaryPointer(e)) return
          rightPointerHeldRef.current = true
          syncArrowRight()
          try {
            e.currentTarget.setPointerCapture(e.pointerId)
          } catch {
            /* already captured */
          }
        }}
        onPointerUp={(e) => {
          if (!isPrimaryPointer(e)) return
          rightPointerHeldRef.current = false
          try {
            e.currentTarget.releasePointerCapture(e.pointerId)
          } catch {
            /* not captured */
          }
          arrowRightRef.current = rightPointerOverRef.current
        }}
        onPointerCancel={() => {
          rightPointerHeldRef.current = false
          arrowRightRef.current = rightPointerOverRef.current
        }}
        onLostPointerCapture={() => {
          rightPointerHeldRef.current = false
          arrowRightRef.current = rightPointerOverRef.current
        }}
      >
        <ChevronRightIcon />
      </button>
    </div>
  )
}
