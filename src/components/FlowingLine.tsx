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
import {
  FLOW_LINE_CORE_W,
  FLOW_LINE_TILE_SVG,
  FLOW_LOOP_GAP_SVG,
  FLOW_LOOP_PERIOD_SVG,
  FLOW_NODE_COUNT,
  FLOW_TRACK_CSS_WIDTH_MULT,
  FLOW_TRACK_PHYSICAL_NODE_COUNT,
  FLOW_TRACK_SCROLL_COPIES,
  FLOW_TRACK_VIEW_W,
  FLOW_VB_H,
  flowPhysicalNodeCenterX,
  flowWaveY,
} from '../lib/flowingLineWave'

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

/**
 * Normalized horizontal center of a point at SVG x in the **visible** line-root (0…1).
 * Track is 2× the container wide; `left = −h×100%` shifts by one viewport per loop.
 */
function viewportXFromSvgX(xSvg: number, hUnit: number, trackW: number): number {
  return -hUnit + (2 * xSvg) / trackW
}

/** Fallback when layout is not ready or no `[data-show-tell-quadrant]` ancestor. */
const IDLE_HOTSPOT_DEFAULT_LO = 1 / 6
const IDLE_HOTSPOT_DEFAULT_HI = 5 / 6

function measureIdleHotspotInLineRoot(lineRoot: HTMLElement): { lo: number; hi: number } {
  const r = lineRoot.getBoundingClientRect()
  if (r.width <= 1) {
    return { lo: IDLE_HOTSPOT_DEFAULT_LO, hi: IDLE_HOTSPOT_DEFAULT_HI }
  }
  const quadrant = lineRoot.closest('[data-show-tell-quadrant]') as HTMLElement | null
  if (!quadrant) {
    return { lo: IDLE_HOTSPOT_DEFAULT_LO, hi: IDLE_HOTSPOT_DEFAULT_HI }
  }
  const qr = quadrant.getBoundingClientRect()
  const cx = qr.left + qr.width / 2
  const third = qr.width / 3
  const loPx = cx - third / 2
  const hiPx = cx + third / 2
  return {
    lo: (loPx - r.left) / r.width,
    hi: (hiPx - r.left) / r.width,
  }
}

type HotspotCand = { i: number; d: number; logical: number }

function collectHotspotCandidates(
  hUnit: number,
  physicalCount: number,
  hotspotLo: number,
  hotspotHi: number,
  trackW: number,
): HotspotCand[] {
  const mid = (hotspotLo + hotspotHi) / 2
  const raw: HotspotCand[] = []
  for (let j = 0; j < physicalCount; j++) {
    const xSvg = flowPhysicalNodeCenterX(j)
    const pos = viewportXFromSvgX(xSvg, hUnit, trackW)
    if (pos < 0 || pos > 1) continue
    if (pos < hotspotLo - 1e-9 || pos > hotspotHi + 1e-9) continue
    raw.push({ i: j, d: Math.abs(pos - mid), logical: j % FLOW_NODE_COUNT })
  }
  return raw
}

/**
 * Which **project** (0…{@link FLOW_NODE_COUNT}-1) wins the idle spotlight — one entry per logical
 * in the hotspot. Stable-frame logic must use this value, not a physical index, or duplicate track
 * copies (e.g. j=3 vs j=10) reset the counter and re-trigger the hover UI for the same thumbnail.
 */
function idleSpotlightPickLogical(
  hUnit: number,
  prevLogical: number | null,
  switchMargin: number,
  physicalCount: number,
  hotspotLo: number,
  hotspotHi: number,
  trackW: number,
): number | null {
  const raw = collectHotspotCandidates(hUnit, physicalCount, hotspotLo, hotspotHi, trackW)
  if (raw.length === 0) return null

  const byLogical = new Map<number, HotspotCand>()
  for (const c of raw) {
    const e = byLogical.get(c.logical)
    if (!e || c.d < e.d - 1e-12) byLogical.set(c.logical, c)
  }
  const inside = Array.from(byLogical.values())

  let best = inside[0]!
  for (const c of inside) {
    if (c.d < best.d - 1e-12) best = c
  }

  if (prevLogical !== null && best.logical !== prevLogical) {
    const prevCand = inside.find((c) => c.logical === prevLogical)
    if (prevCand !== undefined && prevCand.d - best.d < switchMargin) return prevLogical
  }
  return best.logical
}

/** Closest-to-center physical for this logical among nodes currently in the hotspot. */
function pickClosestPhysicalForLogical(
  hUnit: number,
  logical: number,
  physicalCount: number,
  hotspotLo: number,
  hotspotHi: number,
  trackW: number,
): number | null {
  const raw = collectHotspotCandidates(hUnit, physicalCount, hotspotLo, hotspotHi, trackW).filter(
    (c) => c.logical === logical,
  )
  if (raw.length === 0) return null
  let best = raw[0]!
  for (const c of raw) {
    if (c.d < best.d - 1e-12) best = c
  }
  return best.i
}

/**
 * While the same logical project stays highlighted, **never** swap between duplicate physical
 * indices (e.g. 3 vs 10) for margin / distance — that remounts the preview and reads as a double
 * hover. Keep the locked node until it leaves the hotspot, then take the only other copy if any.
 */
function resolveIdleSpotlightPhysicalLocked(
  hUnit: number,
  logical: number | null,
  lockedLogical: number | null,
  lockedPhysical: number | null,
  physicalCount: number,
  hotspotLo: number,
  hotspotHi: number,
  trackW: number,
): number | null {
  if (logical === null) return null
  const raw = collectHotspotCandidates(hUnit, physicalCount, hotspotLo, hotspotHi, trackW).filter(
    (c) => c.logical === logical,
  )
  if (raw.length === 0) return null

  if (
    lockedLogical === logical &&
    lockedPhysical !== null &&
    lockedPhysical % FLOW_NODE_COUNT === logical
  ) {
    const stillHere = raw.some((c) => c.i === lockedPhysical)
    if (stillHere) return lockedPhysical
  }

  let best = raw[0]!
  for (const c of raw) {
    if (c.d < best.d - 1e-12) best = c
  }
  return best.i
}

/**
 * Two `[gap][line][gap]` copies on the track. Layout / sand / nodes still treat gaps as empty
 * (`flowWaveYAtTrackX` is null there); the stroke bridges each inter-copy run with a straight
 * segment so the line reads continuous while the coordinate gap stays (no overlap, no jump).
 */
function buildLoopingFlowPath(time: number, waveY: (x: number, t: number) => number): string {
  const copies = FLOW_TRACK_SCROLL_COPIES
  const gap = FLOW_LOOP_GAP_SVG
  const core = FLOW_LINE_CORE_W
  const loopW = FLOW_LOOP_PERIOD_SVG
  const steps = 128
  const parts: string[] = []
  const ySeam = waveY(gap, time)

  for (let copy = 0; copy < copies; copy++) {
    const base = copy * loopW
    const xLineStart = base + gap
    const iStart = copy === 0 ? 0 : 1
    for (let i = iStart; i <= steps; i++) {
      const local = (core * i) / steps
      const absX = xLineStart + local
      const wrapped =
        ((local % FLOW_LINE_TILE_SVG) + FLOW_LINE_TILE_SVG) % FLOW_LINE_TILE_SVG
      const y = waveY(gap + wrapped, time)
      const cmd = copy === 0 && i === 0 ? 'M' : 'L'
      parts.push(`${cmd}${absX.toFixed(3)} ${y.toFixed(3)}`)
    }
    if (copy < copies - 1) {
      const nextStartX = (copy + 1) * loopW + gap
      parts.push(`L${nextStartX.toFixed(3)} ${ySeam.toFixed(3)}`)
    }
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

/** Require this many matching picks before committing — dampens flip-flop at segment boundaries. */
const IDLE_PICK_STABLE_FRAMES = 3

/** Min score improvement before switching away from last idle spotlight (line-root units). */
const IDLE_SPOTLIGHT_SWITCH_MARGIN = 0.055

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
   * When true, the node whose center **enters** the fixed middle hotspot (⅓ of
   * `[data-show-tell-quadrant]` width, centered on that quadrant — not affected by chevron scrub)
   * gets the large thumbnail while the line drifts; pointer hover still pauses and takes precedence.
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
  const idlePickCandidateLogicalRef = useRef<number | null>(null)
  const idlePickStableFramesRef = useRef(0)
  const idlePickCommittedLogicalRef = useRef<number | null>(null)
  /** Physical node showing the idle spotlight; paired with {@link idleSpotlightPhysicalLockLogicalRef}. */
  const idleSpotlightPhysicalRef = useRef<number | null>(null)
  /** Logical index for which {@link idleSpotlightPhysicalRef} was chosen — duplicate copies never swap until this changes. */
  const idleSpotlightPhysicalLockLogicalRef = useRef<number | null>(null)

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
  const idleHotspotRef = useRef({
    lo: IDLE_HOTSPOT_DEFAULT_LO,
    hi: IDLE_HOTSPOT_DEFAULT_HI,
  })
  const [idleHotspotLayout, setIdleHotspotLayout] = useState({
    lo: IDLE_HOTSPOT_DEFAULT_LO,
    hi: IDLE_HOTSPOT_DEFAULT_HI,
  })

  useLayoutEffect(() => {
    const root = lineRootRef.current
    if (!root) return

    const sync = () => {
      const b = measureIdleHotspotInLineRoot(root)
      idleHotspotRef.current = b
      setIdleHotspotLayout((prev) =>
        prev.lo === b.lo && prev.hi === b.hi ? prev : b,
      )
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(root)
    const quadrant = root.closest('[data-show-tell-quadrant]') as HTMLElement | null
    if (quadrant) ro.observe(quadrant)
    window.addEventListener('resize', sync)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [lineRootRef])

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
  /**
   * Shared playback speed for auto drift + left/right chevrons (home quadrant, footer, modal).
   * 1.5× faster than the original `115/3` loop + `0.065*1.5` arrow scrub.
   */
  const SIDE_QUEST_LINE_SPEED = 1.5
  /** One full horizontal loop (0→1 on `h`) in seconds — larger = slower drift. */
  const H_SCROLL_S = (115 / 3) / SIDE_QUEST_LINE_SPEED
  /** Chevron hold scrub rate; legacy base was `0.065 * 1.5` before `SIDE_QUEST_LINE_SPEED`. */
  const ARROW_DRIFT_RATE = 0.065 * 1.5 * SIDE_QUEST_LINE_SPEED
  const arrowDrift = ARROW_DRIFT_RATE * arrowDriftRateScale

  useEffect(() => {
    let id: number
    let last = performance.now()
    let lastPhaseUiCommit = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.064)
      last = now
      const autoDriftPerSec = linePausedRef.current ? 0 : 1 / H_SCROLL_S
      if (!linePausedRef.current) {
        scrollCycleRef.current -= dt / H_SCROLL_S
        phaseTimeRef.current += dt
        // Throttle wave path / node Y (sand still uses `phaseTimeRef` every frame).
        if (now - lastPhaseUiCommit >= 32) {
          lastPhaseUiCommit = now
          setPhaseTime(phaseTimeRef.current)
        }
      }
      // Chevron nudge must cancel auto drift in `scrollCycle` so left/right feel equally fast:
      // raw = scrollCycle + userHOffset → d(raw)/dt was (arrowDrift - auto) vs -(arrowDrift + auto).
      if (arrowLeftRef.current) {
        userHOffsetRef.current += (arrowDrift + autoDriftPerSec) * dt
        setUserHOffset(userHOffsetRef.current)
      } else if (arrowRightRef.current) {
        userHOffsetRef.current += (autoDriftPerSec - arrowDrift) * dt
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
        idlePickCandidateLogicalRef.current = null
        idlePickStableFramesRef.current = 0
        idlePickCommittedLogicalRef.current = null
        idleSpotlightPhysicalRef.current = null
        idleSpotlightPhysicalLockLogicalRef.current = null
        setIdleSpotlightTarget(null)
      } else if (hoveredIndexRef.current !== null) {
        idleScrollRawPrevRef.current = null
        idleScrollHPrevRef.current = null
        idlePickCandidateLogicalRef.current = null
        idlePickStableFramesRef.current = 0
        idlePickCommittedLogicalRef.current = null
        idleSpotlightPhysicalRef.current = null
        idleSpotlightPhysicalLockLogicalRef.current = null
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

        const { lo: hsLo, hi: hsHi } = idleHotspotRef.current
        const pickLogical = idleSpotlightPickLogical(
          hForPick,
          idlePickCommittedLogicalRef.current,
          IDLE_SPOTLIGHT_SWITCH_MARGIN,
          FLOW_TRACK_PHYSICAL_NODE_COUNT,
          hsLo,
          hsHi,
          FLOW_TRACK_VIEW_W,
        )
        let candL = idlePickCandidateLogicalRef.current
        let n = idlePickStableFramesRef.current
        if (pickLogical !== candL) {
          candL = pickLogical
          n = 0
        } else {
          n++
        }
        idlePickCandidateLogicalRef.current = candL
        idlePickStableFramesRef.current = n

        const committedL = idlePickCommittedLogicalRef.current
        const displayLogical =
          committedL === null || n >= IDLE_PICK_STABLE_FRAMES ? candL : committedL
        if (committedL === null || n >= IDLE_PICK_STABLE_FRAMES) {
          idlePickCommittedLogicalRef.current = candL
        }

        let physical: number | null = null
        if (displayLogical === null) {
          // Brief "no hotspot" frames must not clear the lock — otherwise the same project
          // re-enters with a fresh duplicate pick (3↔10) and the hover UI fires again.
          physical = null
        } else {
          const lockL = idleSpotlightPhysicalLockLogicalRef.current
          if (displayLogical !== lockL) {
            idleSpotlightPhysicalLockLogicalRef.current = displayLogical
            physical = pickClosestPhysicalForLogical(
              hForPick,
              displayLogical,
              FLOW_TRACK_PHYSICAL_NODE_COUNT,
              hsLo,
              hsHi,
              FLOW_TRACK_VIEW_W,
            )
          } else {
            physical = resolveIdleSpotlightPhysicalLocked(
              hForPick,
              displayLogical,
              lockL,
              idleSpotlightPhysicalRef.current,
              FLOW_TRACK_PHYSICAL_NODE_COUNT,
              hsLo,
              hsHi,
              FLOW_TRACK_VIEW_W,
            )
          }
          idleSpotlightPhysicalRef.current = physical
        }
        setIdleSpotlightTarget((prev) => (prev === physical ? prev : physical))
      }

      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [sandPhaseRef, sandScrollHUnitRef, arrowDrift])

  const pathD = useMemo(() => buildLoopingFlowPath(phaseTime, flowWaveY), [phaseTime])

  const nodePoints = useMemo(
    () =>
      Array.from({ length: FLOW_TRACK_PHYSICAL_NODE_COUNT }, (_, j) => {
        const localIdx = j % FLOW_NODE_COUNT
        const x = flowPhysicalNodeCenterX(j)
        const along = ((localIdx + 0.5) / FLOW_NODE_COUNT) * FLOW_LINE_CORE_W
        const wrapped =
          ((along % FLOW_LINE_TILE_SVG) + FLOW_LINE_TILE_SVG) % FLOW_LINE_TILE_SVG
        const sampleX = FLOW_LOOP_GAP_SVG + wrapped
        return { x, y: flowWaveY(sampleX, phaseTime) }
      }),
    [phaseTime],
  )

  const trackWidthPercent = 100 * FLOW_TRACK_CSS_WIDTH_MULT
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
    if (hoveredIndex !== null) return getNodeTitle(hoveredIndex % FLOW_NODE_COUNT) ?? null
    if (runIdleSpot && idleZoneTargetIndex !== null) {
      return getNodeTitle(idleZoneTargetIndex % FLOW_NODE_COUNT) ?? null
    }
    return null
  })()

  const idleMagnifyLogical =
    runIdleSpot && hoveredIndex === null && idleZoneTargetIndex !== null
      ? idleZoneTargetIndex % FLOW_NODE_COUNT
      : null
  const idleMagnifyPreviewSrc =
    idleMagnifyLogical !== null ? getNodePreviewSrc?.(idleMagnifyLogical) : undefined

  return (
    <div
      ref={lineRootRef}
      className="relative box-border min-h-0 min-w-0 w-full flex-1 overflow-visible px-4 py-2 sm:px-5 md:px-6 md:py-3"
    >
      {/* ⅓ of Side quests quadrant width, centered on that quadrant (measured; matches idle math). */}
      <div
        aria-hidden
        data-flow-idle-hotspot
        className="pointer-events-none absolute inset-y-0 z-0 min-w-0 max-w-none"
        style={{
          left: `${idleHotspotLayout.lo * 100}%`,
          width: `${(idleHotspotLayout.hi - idleHotspotLayout.lo) * 100}%`,
        }}
      />
      <div
        ref={trackRef}
        className={[
          'absolute top-7 bottom-1 left-0 max-w-none overflow-visible will-change-[left] md:top-9 md:bottom-2',
          lineTrackClassName ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ width: `${trackWidthPercent}%`, left: `${leftPercent}%` }}
        aria-hidden
      >
        <svg
          className="absolute inset-0 block h-full w-full overflow-visible text-white"
          viewBox={`0 0 ${FLOW_TRACK_VIEW_W} ${FLOW_VB_H}`}
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
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.32" result="b" />
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
            strokeWidth={0.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="nonScalingStroke"
            filter={`url(#${filterId})`}
          />
        </svg>
        {nodePoints.map((p, j) => {
          const projectIdx = j % FLOW_NODE_COUNT
          const userActive = hoveredIndex === j
          const inIdlePath = runIdleSpot && hoveredIndex === null
          const inIdleZone = inIdlePath && idleZoneTargetIndex === j
          const active = userActive || inIdleZone
          const dimOthers = spotlightDim && !active
          const idle = FLOW_NODE_IDLE_MOTION[projectIdx]!
          const previewSrc = getNodePreviewSrc?.(projectIdx)
          return (
            <div
              key={j}
              className="pointer-events-none absolute z-[1] overflow-visible"
              style={{
                left: `${(p.x / FLOW_TRACK_VIEW_W) * 100}%`,
                top: `${(p.y / FLOW_VB_H) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: active ? 3 : 1,
              }}
            >
              <div
                data-flowing-line-node
                className={[
                  '-m-3 flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center overflow-visible p-3 [perspective:160px]',
                  onNodeClick ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onPointerEnter={onNodeClick ? () => setHoveredIndex(j) : undefined}
                onPointerLeave={onNodeClick ? onNodePointerLeave : undefined}
                onClick={onNodeClick ? () => onNodeClick(projectIdx) : undefined}
                role={onNodeClick ? 'button' : undefined}
                tabIndex={onNodeClick ? 0 : undefined}
                onKeyDown={
                  onNodeClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onNodeClick(projectIdx)
                        }
                      }
                    : undefined
                }
                aria-hidden={onNodeClick ? undefined : true}
                aria-label={
                  onNodeClick
                    ? `Open ${getNodeTitle?.(projectIdx)?.trim() || `sidequest ${projectIdx + 1}`}`
                    : undefined
                }
              >
                {userActive ? (
                  <div className="pointer-events-none relative flex items-center justify-center">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--color-hud)_26%,transparent)] blur-[24px] md:h-[150px] md:w-[150px] md:blur-[30px]"
                    />
                    {previewSrc ? (
                      <div className={`${FLOW_LINE_PREVIEW_THUMB_CLIP_CLASS} pointer-events-none`}>
                        <FlowLineNodePreview src={previewSrc} />
                      </div>
                    ) : (
                      <div className="pointer-events-none relative z-[1] size-4 shrink-0 scale-[5] rounded-none bg-fg/92 brightness-110 md:size-5" />
                    )}
                  </div>
                ) : inIdlePath ? (
                  <div className="pointer-events-none relative flex min-h-[1.5rem] min-w-[1.5rem] items-center justify-center">
                    <div
                      className={[
                        'absolute flex items-center justify-center',
                        IDLE_SPOTLIGHT_CROSSFADE_CLASS,
                        inIdleZone ? 'pointer-events-none opacity-0' : 'pointer-events-none opacity-100',
                      ].join(' ')}
                      style={{ zIndex: 1 }}
                      aria-hidden={inIdleZone}
                    >
                      <motion.div
                        initial={false}
                        className={[
                          'pointer-events-none relative z-[1] size-4 shrink-0 rounded-none md:size-5',
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
                  </div>
                ) : reducedMotion ? (
                  <div
                    className={[
                      'pointer-events-none relative z-[1] size-4 shrink-0 rounded-none md:size-5',
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
                      'pointer-events-none relative z-[1] size-4 shrink-0 rounded-none md:size-5',
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
        {idleMagnifyLogical !== null && idleZoneTargetIndex !== null ? (
          <div
            key={`idle-mag-${idleMagnifyLogical}`}
            className="pointer-events-none absolute z-[4] overflow-visible"
            style={{
              left: `${(nodePoints[idleZoneTargetIndex]!.x / FLOW_TRACK_VIEW_W) * 100}%`,
              top: `${(nodePoints[idleZoneTargetIndex]!.y / FLOW_VB_H) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            aria-hidden
          >
            <div className="pointer-events-none relative flex items-center justify-center">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--color-hud)_26%,transparent)] blur-[24px] md:h-[150px] md:w-[150px] md:blur-[30px]"
              />
              {idleMagnifyPreviewSrc ? (
                <div className={`${FLOW_LINE_PREVIEW_THUMB_CLIP_CLASS} pointer-events-none`}>
                  <FlowLineNodePreview src={idleMagnifyPreviewSrc} mediaActive />
                </div>
              ) : (
                <div className="pointer-events-none relative z-[1] size-4 shrink-0 scale-[5] rounded-none bg-fg/92 brightness-110 md:size-5" />
              )}
            </div>
          </div>
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        {hoveredTitle ? (
          <motion.div
            key={
              hoveredIndex !== null
                ? `title-h-${hoveredIndex}`
                : `title-idle-${idleMagnifyLogical ?? 'none'}`
            }
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
