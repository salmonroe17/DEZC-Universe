import { AnimatePresence, motion, useReducedMotion, type Transition } from 'framer-motion'
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { isSideQuestVideoUrl } from '../data/sidequests'
import { FLOW_NODE_COUNT, FLOW_PERIOD, FLOW_TOTAL_W, FLOW_VB_H, flowWaveY } from '../lib/flowingLineWave'

/** When false (idle rail: magnified slot hidden), skip IO / playback so inactive nodes do not decode video in parallel. */
function FlowLineNodePreview({ src, mediaActive = true }: { src: string; mediaActive?: boolean }) {
  const cls = 'h-full w-full object-cover'
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!isSideQuestVideoUrl(src)) return
    const video = videoRef.current
    if (!video) return
    if (!mediaActive) {
      video.pause()
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { root: null, threshold: 0.2 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [src, mediaActive])

  if (isSideQuestVideoUrl(src)) {
    return (
      <video
        ref={videoRef}
        src={src}
        className={cls}
        muted
        playsInline
        loop
        preload="metadata"
        aria-hidden
      />
    )
  }
  return <img src={src} alt="" draggable={false} className={cls} loading={mediaActive ? 'eager' : 'lazy'} />
}

/**
 * Thumbnail clip around {@link FlowLineNodePreview}. At `lg+`, desaturate until the pointer is over
 * the Side quests `group/showtell` ancestor or the quadrant is marked in-view (coarse / scroll spy).
 * Below `lg`, full color — unchanged on phones.
 */
const FLOW_LINE_PREVIEW_THUMB_CLIP_CLASS =
  'relative z-[1] size-4 shrink-0 scale-[5] overflow-hidden rounded-none ring-1 ring-fg/25 shadow-[0_0_14px_rgba(0,0,0,0.22)] md:size-5 lg:grayscale lg:transition-[filter] lg:duration-200 lg:ease-out lg:group-hover/showtell:grayscale-0 lg:group-data-[quadrant-in-view]/showtell:grayscale-0'

/** Distinct idle loops per square (Show & tell). Hover resets to still + scale-up. */
type IdleMotion = {
  animate: Record<string, number | number[]>
  transition: Transition
}

const FLOW_NODE_IDLE_MOTION: IdleMotion[] = [
  {
    animate: { rotate: 360 },
    transition: { repeat: Infinity, duration: 10, ease: 'linear' },
  },
  {
    animate: { rotate: [-16, 16] },
    transition: { repeat: Infinity, repeatType: 'reverse', duration: 0.95 },
  },
  {
    animate: { rotateX: 360 },
    transition: { repeat: Infinity, duration: 5, ease: 'linear' },
  },
  {
    animate: { rotate: 360 },
    transition: { repeat: Infinity, duration: 2.2, ease: 'linear' },
  },
  {
    animate: { scale: [1, 1.2, 1] },
    transition: { repeat: Infinity, duration: 1.35, ease: 'easeInOut' },
  },
  {
    animate: { skewX: [-14, 14] },
    transition: { repeat: Infinity, repeatType: 'reverse', duration: 1.0 },
  },
  {
    animate: { y: [0, -6, 0], rotate: [-4, 4] },
    transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
  },
]

function isPrimaryPointer(e: ReactPointerEvent<Element>): boolean {
  return e.pointerType === 'touch' || e.pointerType === 'pen' || e.button === 0
}

function cycleMod(n: number): number {
  return ((n % 1) + 1) % 1
}

/** Horizontal position of node `i`’s center in line-root space; track is 2× width, window is [0,1]. */
function nodeCenterXInLineRoot(i: number, hUnit: number): number {
  const t = (i + 0.5) / FLOW_NODE_COUNT
  return -hUnit + 2 * t
}

/** Idle autoplay: which tile’s center is nearest the line midpoint (matches what you see under center). */
function closestNodeIndexToLineCenter(hUnit: number): number {
  let best = 0
  let bestD = Number.POSITIVE_INFINITY
  for (let i = 0; i < FLOW_NODE_COUNT; i++) {
    const d = Math.abs(nodeCenterXInLineRoot(i, hUnit) - 0.5)
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return best
}

function buildSinePath(
  periods: number,
  period: number,
  time: number,
  waveY: (x: number, t: number) => number,
): string {
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
  'pointer-events-auto z-20 flex size-9 touch-none select-none items-center justify-center border border-cell-border/90 bg-bg/75 text-fg/70 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-hud)_14%,transparent)] backdrop-blur-[2px] transition-[color,background-color,border-color] duration-150 hover:border-hud/35 hover:bg-elevated/90 hover:text-fg md:size-10'


/**
 * `h = cycleMod(raw)` can jump ~1 when `raw` crosses an integer while `|Δraw|` is tiny — skip that
 * frame for picking (CSS still uses the new `h`).
 */
const IDLE_SCROLL_WRAP_RAW_EPS = 0.08
const IDLE_SCROLL_WRAP_H_JUMP = 0.35

/** Require this many matching picks before committing — dampens 2-way ties at the midpoint. */
const IDLE_PICK_STABLE_FRAMES = 3

const IDLE_SPOTLIGHT_CROSSFADE_CLASS =
  'transition-opacity duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-[opacity]'

export type FlowingLineSandProps = {
  sandLineRootRef?: RefObject<HTMLDivElement | null>
  sandTrackRef?: RefObject<HTMLDivElement | null>
  sandPhaseRef?: RefObject<number>
  sandHoveredNodeIndexRef?: RefObject<number | null>
  /** Normalized horizontal scroll (0..1), same basis as track `left` — for ambient lines, etc. */
  sandScrollHUnitRef?: MutableRefObject<number>
  /** Primary click on a Show & tell square — e.g. open Sidequest viewer for that index. */
  onNodeClick?: (nodeIndex: number) => void
  /** Hovered node shows this image (e.g. first sidequest gallery frame) instead of a solid highlight. */
  getNodePreviewSrc?: (nodeIndex: number) => string | undefined
  /** Hovered node title, shown bottom-center aligned with the scroll arrow controls. */
  getNodeTitle?: (nodeIndex: number) => string | undefined
  /**
   * Multiplies horizontal nudge when holding the chevron buttons (default 1). Use values above 1
   * in constrained shells (e.g. show & tell in a dialog) to match the home grid.
   */
  arrowDriftRateScale?: number
  /**
   * When true, a node gets the large thumbnail as its **center** x crosses an invisible band in
   * the line (the timeline keeps scrolling). It scales back to the default square on exit.
   * Pauses only on real pointer hover on a node. Use on the home “multiple timelines” quadrant.
   */
  idleSpotlightAutoplay?: boolean
  /**
   * Extra classes on the scrolling track only (SVG + nodes), e.g. `-translate-y-16` on the home
   * quadrant so the wave sits higher while title + chevrons stay on the bottom.
   */
  lineTrackClassName?: string
}

export function FlowingLine({
  sandLineRootRef,
  sandTrackRef,
  sandPhaseRef,
  sandHoveredNodeIndexRef,
  sandScrollHUnitRef,
  onNodeClick,
  getNodePreviewSrc,
  getNodeTitle,
  arrowDriftRateScale = 1,
  idleSpotlightAutoplay = false,
  lineTrackClassName,
}: FlowingLineSandProps) {
  const uid = useId()
  const filterId = useMemo(() => `flowing-line-glow-${uid.replace(/:/g, '')}`, [uid])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const reducedMotion = useReducedMotion() ?? false

  const runIdleSpot = idleSpotlightAutoplay && !reducedMotion
  /** Wave / timeline scroll — only the user’s own pointer on a node pauses it. */
  const linePaused = hoveredIndex !== null
  const linePausedRef = useRef(false)
  const [idleSpotlightTarget, setIdleSpotlightTarget] = useState<number | null>(null)
  const runIdleSpotRef = useRef(runIdleSpot)
  const hoveredIndexRef = useRef(hoveredIndex)
  const idleScrollRawPrevRef = useRef<number | null>(null)
  const idleScrollHPrevRef = useRef<number | null>(null)
  const idlePickCandidateRef = useRef<number | null>(null)
  const idlePickStableFramesRef = useRef(0)
  const idlePickCommittedRef = useRef<number | null>(null)

  const [phaseTime, setPhaseTime] = useState(0)
  const phaseTimeRef = useRef(0)
  const [userHOffset, setUserHOffset] = useState(0)
  const userHOffsetRef = useRef(0)
  const scrollCycleRef = useRef(0)
  const [hUnit, setHUnit] = useState(0)

  useLayoutEffect(() => {
    userHOffsetRef.current = userHOffset
  }, [userHOffset])

  const arrowLeftRef = useRef(false)
  const arrowRightRef = useRef(false)
  const leftPointerOverRef = useRef(false)
  const leftPointerHeldRef = useRef(false)
  const rightPointerOverRef = useRef(false)
  const rightPointerHeldRef = useRef(false)

  const internalRootRef = useRef<HTMLDivElement>(null)
  const internalTrackRef = useRef<HTMLDivElement>(null)
  const lineRootRef = sandLineRootRef ?? internalRootRef
  const trackRef = sandTrackRef ?? internalTrackRef

  useLayoutEffect(() => {
    runIdleSpotRef.current = runIdleSpot
    hoveredIndexRef.current = hoveredIndex
  }, [runIdleSpot, hoveredIndex])

  const syncArrowLeft = () => {
    arrowLeftRef.current = leftPointerOverRef.current || leftPointerHeldRef.current
  }
  const syncArrowRight = () => {
    arrowRightRef.current = rightPointerOverRef.current || rightPointerHeldRef.current
  }
  /** One full horizontal wavelength (parent-relative) in seconds — matches prior CSS cadence. */
  const H_SCROLL_S = 80
  const ARROW_DRIFT_RATE = 0.2
  const arrowDrift = ARROW_DRIFT_RATE * arrowDriftRateScale

  useEffect(() => {
    let id: number
    let last = performance.now()
    let lastPhaseUiCommit = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.064)
      last = now
      if (!linePausedRef.current) {
        scrollCycleRef.current -= dt / H_SCROLL_S
        phaseTimeRef.current += dt
        // Throttle wave commits: full line still scrolls every frame via `hUnit`; phase alone was
        // forcing 60 React commits/sec and compounded jitter with idle spotlight transitions.
        if (now - lastPhaseUiCommit >= 32) {
          lastPhaseUiCommit = now
          setPhaseTime(phaseTimeRef.current)
        }
      }
      if (arrowLeftRef.current) {
        userHOffsetRef.current += arrowDrift * dt
        setUserHOffset(userHOffsetRef.current)
      } else if (arrowRightRef.current) {
        userHOffsetRef.current -= arrowDrift * dt
        setUserHOffset(userHOffsetRef.current)
      }
      if (sandPhaseRef) sandPhaseRef.current = phaseTimeRef.current
      const raw = scrollCycleRef.current + userHOffsetRef.current
      const h = cycleMod(raw)
      if (sandScrollHUnitRef) sandScrollHUnitRef.current = h
      setHUnit(h)

      if (!runIdleSpotRef.current) {
        idleScrollRawPrevRef.current = null
        idleScrollHPrevRef.current = null
        idlePickCandidateRef.current = null
        idlePickStableFramesRef.current = 0
        idlePickCommittedRef.current = null
        setIdleSpotlightTarget(null)
      } else if (hoveredIndexRef.current !== null) {
        idleScrollRawPrevRef.current = null
        idleScrollHPrevRef.current = null
        idlePickCandidateRef.current = null
        idlePickStableFramesRef.current = 0
        idlePickCommittedRef.current = null
      } else {
        const rawPrev = idleScrollRawPrevRef.current
        const hPrev = idleScrollHPrevRef.current
        let hForPick = h
        if (
          rawPrev !== null &&
          hPrev !== null &&
          Math.abs(h - hPrev) > IDLE_SCROLL_WRAP_H_JUMP &&
          Math.abs(raw - rawPrev) < IDLE_SCROLL_WRAP_RAW_EPS
        ) {
          hForPick = hPrev
        }
        idleScrollRawPrevRef.current = raw
        idleScrollHPrevRef.current = h

        const pick = closestNodeIndexToLineCenter(hForPick)
        let cand = idlePickCandidateRef.current
        let n = idlePickStableFramesRef.current
        if (pick !== cand) {
          cand = pick
          n = 0
        } else {
          n++
        }
        idlePickCandidateRef.current = cand
        idlePickStableFramesRef.current = n

        const committed = idlePickCommittedRef.current
        const displayNext =
          committed === null || n >= IDLE_PICK_STABLE_FRAMES ? cand : committed
        if (committed === null || n >= IDLE_PICK_STABLE_FRAMES) {
          idlePickCommittedRef.current = cand
        }
        setIdleSpotlightTarget((prev) => (prev === displayNext ? prev : displayNext))
      }

      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [sandPhaseRef, sandScrollHUnitRef, arrowDrift])

  const pathD = useMemo(
    () => buildSinePath(2, FLOW_PERIOD, phaseTime, flowWaveY),
    [phaseTime],
  )

  const nodePoints = useMemo(
    () =>
      Array.from({ length: FLOW_NODE_COUNT }, (_, i) => {
        const x = ((i + 0.5) / FLOW_NODE_COUNT) * FLOW_TOTAL_W
        return { x, y: flowWaveY(x, phaseTime) }
      }),
    [phaseTime],
  )

  const leftPercent = -hUnit * 100

  const idleZoneTargetIndex =
    !runIdleSpot || hoveredIndex !== null ? null : idleSpotlightTarget

  const spotlightDim = hoveredIndex !== null || (runIdleSpot && idleZoneTargetIndex !== null)
  const displayHoverIndex = hoveredIndex ?? idleZoneTargetIndex

  useLayoutEffect(() => {
    if (sandHoveredNodeIndexRef) sandHoveredNodeIndexRef.current = displayHoverIndex
  }, [displayHoverIndex, sandHoveredNodeIndexRef])

  useLayoutEffect(() => {
    linePausedRef.current = linePaused
  }, [linePaused])

  useLayoutEffect(() => {
    if (!linePaused) setPhaseTime(phaseTimeRef.current)
  }, [linePaused])

  const onNodePointerLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rel = e.relatedTarget as HTMLElement | null
    if (rel?.closest?.('[data-flowing-line-node]')) return
    setHoveredIndex(null)
  }

  const hoveredTitle = (() => {
    if (!getNodeTitle) return null
    if (hoveredIndex !== null) return getNodeTitle(hoveredIndex) ?? null
    if (runIdleSpot && idleZoneTargetIndex !== null) return getNodeTitle(idleZoneTargetIndex) ?? null
    return null
  })()

  return (
    <div ref={lineRootRef} className="relative min-h-0 w-full flex-1 overflow-visible py-2 md:py-3">
      <div
        ref={trackRef}
        className={[
          'absolute top-7 bottom-1 left-0 w-[200%] max-w-none overflow-visible will-change-[left] md:top-9 md:bottom-2',
          lineTrackClassName ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ left: `${leftPercent}%` }}
        aria-hidden
      >
        <svg
          className="absolute inset-0 block h-full w-full overflow-visible text-hud/55"
          viewBox={`0 0 ${FLOW_TOTAL_W} ${FLOW_VB_H}`}
          preserveAspectRatio="none"
          overflow="visible"
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
          const userActive = hoveredIndex === i
          const inIdlePath = runIdleSpot && hoveredIndex === null
          const inIdleZone = inIdlePath && idleZoneTargetIndex === i
          const active = userActive || inIdleZone
          const dimOthers = spotlightDim && !active
          const idle = FLOW_NODE_IDLE_MOTION[i]!
          const previewSrc = getNodePreviewSrc?.(i)
          return (
            <div
              key={i}
              data-flowing-line-node
              className={[
                'pointer-events-auto absolute z-[1] overflow-visible',
                onNodeClick ? 'cursor-pointer' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                left: `${(p.x / FLOW_TOTAL_W) * 100}%`,
                top: `${(p.y / FLOW_VB_H) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: active ? 3 : 1,
              }}
              onPointerEnter={() => setHoveredIndex(i)}
              onPointerLeave={onNodePointerLeave}
              onClick={onNodeClick ? () => onNodeClick(i) : undefined}
              role={onNodeClick ? 'button' : undefined}
              tabIndex={onNodeClick ? 0 : undefined}
              onKeyDown={
                onNodeClick
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onNodeClick(i)
                      }
                    }
                  : undefined
              }
              aria-hidden={onNodeClick ? undefined : true}
              aria-label={
                onNodeClick
                  ? `Open ${getNodeTitle?.(i)?.trim() || `sidequest ${i + 1}`}`
                  : undefined
              }
            >
              <div className="-m-3 flex items-center justify-center overflow-visible p-3 [perspective:160px]">
                {userActive ? (
                  <div className="relative flex items-center justify-center">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--color-hud)_26%,transparent)] blur-[24px] md:h-[150px] md:w-[150px] md:blur-[30px]"
                    />
                    {previewSrc ? (
                      <div className={FLOW_LINE_PREVIEW_THUMB_CLIP_CLASS}>
                        <FlowLineNodePreview src={previewSrc} />
                      </div>
                    ) : (
                      <div className="relative z-[1] size-4 shrink-0 scale-[5] rounded-none bg-fg/92 brightness-110 md:size-5" />
                    )}
                  </div>
                ) : inIdlePath ? (
                  <div className="relative flex min-h-[1.5rem] min-w-[1.5rem] items-center justify-center">
                    <div
                      className={[
                        'absolute flex items-center justify-center',
                        IDLE_SPOTLIGHT_CROSSFADE_CLASS,
                        inIdleZone ? 'pointer-events-none opacity-0' : 'opacity-100',
                      ].join(' ')}
                      style={{ zIndex: 1 }}
                      aria-hidden={inIdleZone}
                    >
                      <motion.div
                        initial={false}
                        className={[
                          'relative z-[1] size-4 shrink-0 rounded-none md:size-5',
                          'transition-[opacity,filter,background-color,box-shadow] duration-150 ease-out',
                          dimOthers
                            ? 'bg-fg/38 opacity-[0.32] brightness-[0.72]'
                            : 'bg-fg/38 shadow-[0_0_6px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]',
                        ].join(' ')}
                        style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
                        animate={idle.animate}
                        transition={idle.transition}
                      />
                    </div>
                    <div
                      className={[
                        'absolute flex items-center justify-center',
                        IDLE_SPOTLIGHT_CROSSFADE_CLASS,
                        inIdleZone ? 'opacity-100' : 'pointer-events-none opacity-0',
                      ].join(' ')}
                      style={{ zIndex: 2 }}
                    >
                      <div
                        aria-hidden
                        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--color-hud)_26%,transparent)] blur-[24px] md:h-[150px] md:w-[150px] md:blur-[30px]"
                      />
                      {previewSrc ? (
                        <div className={FLOW_LINE_PREVIEW_THUMB_CLIP_CLASS}>
                          <FlowLineNodePreview src={previewSrc} mediaActive={inIdleZone} />
                        </div>
                      ) : (
                        <div className="relative z-[1] size-4 shrink-0 scale-[5] rounded-none bg-fg/92 brightness-110 md:size-5" />
                      )}
                    </div>
                  </div>
                ) : reducedMotion ? (
                  <div
                    className={[
                      'relative z-[1] size-4 shrink-0 rounded-none md:size-5',
                      'transition-[opacity,filter,background-color,box-shadow] duration-150 ease-out',
                      dimOthers
                        ? 'bg-fg/38 opacity-[0.32] brightness-[0.72]'
                        : 'bg-fg/38 shadow-[0_0_6px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]',
                    ].join(' ')}
                  />
                ) : (
                  <motion.div
                    initial={false}
                    className={[
                      'relative z-[1] size-4 shrink-0 rounded-none md:size-5',
                      'transition-[opacity,filter,background-color,box-shadow] duration-150 ease-out',
                      dimOthers
                        ? 'bg-fg/38 opacity-[0.32] brightness-[0.72]'
                        : 'bg-fg/38 shadow-[0_0_6px_color-mix(in_srgb,var(--color-hud)_14%,transparent)]',
                    ].join(' ')}
                    style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
                    animate={idle.animate}
                    transition={idle.transition}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {hoveredTitle ? (
          <motion.div
            key={hoveredIndex !== null ? `title-h-${hoveredIndex}` : 'title-idle-rail'}
            role="status"
            aria-live="polite"
            initial={reducedMotion ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 2 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.12, ease: [0.25, 0.1, 0.25, 1] }}
            className="pointer-events-none absolute bottom-1 left-1/2 z-[19] flex min-h-9 w-[min(20rem,calc(100%-5.5rem))] -translate-x-1/2 items-center justify-center px-1 text-center md:bottom-2 md:min-h-10"
          >
            <span
              className={[
                'line-clamp-2 w-full font-mono font-normal leading-tight text-fg/90 drop-shadow-[0_1px_0_var(--color-bg)]',
                hoveredTitle.length >= 18 ? 'text-[9px] md:text-[10px]' : 'text-[10px] md:text-[11px]',
              ].join(' ')}
            >
              {hoveredTitle}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

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
