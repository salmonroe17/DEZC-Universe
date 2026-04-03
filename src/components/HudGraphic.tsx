import type { MutableRefObject, ReactNode } from 'react'
import { useEffect, useRef } from 'react'

/** When `active`, HUD reticle center follows `(x,y)` inside a `w×h` box (cell-local px). */
export type HudCellTrack = {
  active: boolean
  x: number
  y: number
  w: number
  h: number
}

/**
 * Pure SVG HUD — compass reticle, tick ring, accent arcs, horizontal axis with tapering wings.
 * Coordinates: viewBox centered at 0,0; SVG y-axis positive downward.
 */

const HUD_STROKE = 'var(--color-hud)'
const HAIRLINE = 0.65
const THIN = 1
const ARC_STROKE = 3.25

const R_MAIN = 275
const R_TICK_IN = 268
const R_TICK_OUT = 284
const TICK_COUNT = 120
const WING_LEN = 420
const VIEWBOX_WIDTH = 1440
/** Base horizontal wing pulse past tip (SVG user units). */
const WING_PULSE_EXT_BASE = 36
/**
 * Extra outward travel (beyond base), in CSS px converted to SVG user units at ~720px-wide render.
 * Includes prior ~16px tuning plus ~40px more wing travel each way.
 */
const WING_PULSE_EXT_EXTRA_PX = 56
const WING_PULSE_EXT_EXTRA_SU = Math.round(
  (WING_PULSE_EXT_EXTRA_PX * VIEWBOX_WIDTH) / 720,
)
const WING_PULSE_EXT = WING_PULSE_EXT_BASE + WING_PULSE_EXT_EXTRA_SU
/** Full out-and-back cycle (seconds) — horizontal wing line pulse */
const WING_PULSE_DURATION_SEC = 9 / 5

const R_INNER_RING = 58
const PLUS_ARM = 11
const PLUS_STROKE = 1.1

/** Degrees clockwise from 3 o'clock (SVG); gaps at 6 and 12 o'clock */
const CIRCLE_GAP_HALF_DEG = 4

function circlePoint(deg: number, r: number) {
  const t = (deg * Math.PI) / 180
  return { x: r * Math.cos(t), y: r * Math.sin(t) }
}

/** Thin main ring as two arcs — no continuous stroke through top/bottom poles */
function MainCircleRing() {
  const g0 = 90 - CIRCLE_GAP_HALF_DEG
  const g1 = 90 + CIRCLE_GAP_HALF_DEG
  const g2 = 270 - CIRCLE_GAP_HALF_DEG
  const g3 = 270 + CIRCLE_GAP_HALF_DEG
  const a = circlePoint(g1, R_MAIN)
  const b = circlePoint(g2, R_MAIN)
  const c = circlePoint(g3, R_MAIN)
  const endRight = circlePoint(g0, R_MAIN)
  return (
    <>
      <path
        d={`M ${a.x} ${a.y} A ${R_MAIN} ${R_MAIN} 0 0 1 ${b.x} ${b.y}`}
        stroke={HUD_STROKE}
        strokeWidth={HAIRLINE}
        strokeLinecap="round"
      />
      <path
        d={`M ${c.x} ${c.y} A ${R_MAIN} ${R_MAIN} 0 0 1 ${endRight.x} ${endRight.y}`}
        stroke={HUD_STROKE}
        strokeWidth={HAIRLINE}
        strokeLinecap="round"
      />
    </>
  )
}

/** Full rotation period (seconds) — dial (1.2× faster than prior 80/1.2s, i.e. 1.44× vs 80s base) */
const DIAL_ROTATION_DURATION_SEC = 80 / (1.2 * 1.2)

/** Used only for horizontal-axis micro-vibration */
const MOUSE_MOVE_WINDOW_MS = 200

/** Max parallax shift (px) per axis — follows pointer position smoothly */
const PARALLAX_MAX_PX = 16
/** Higher = snappier follow */
const PARALLAX_SMOOTH = 0.14

function tickLines() {
  const lines: ReactNode[] = []
  for (let i = 0; i < TICK_COUNT; i++) {
    const deg = (i / TICK_COUNT) * 360
    const rad = (deg * Math.PI) / 180
    const c = Math.cos(rad)
    const s = Math.sin(rad)
    lines.push(
      <line
        key={i}
        x1={R_TICK_IN * c}
        y1={R_TICK_IN * s}
        x2={R_TICK_OUT * c}
        y2={R_TICK_OUT * s}
        stroke={HUD_STROKE}
        strokeWidth={HAIRLINE}
        strokeLinecap="round"
      />,
    )
  }
  return lines
}

/** Inner cluster: three equal vertical ticks between reticle and main ring */
function InnerVerticalCluster({ side }: { side: -1 | 1 }) {
  const cx = side * 145
  const gap = 5
  const h = 18
  return (
    <>
      {[-gap, 0, gap].map((dx) => (
        <line
          key={dx}
          x1={cx + dx}
          y1={-h / 2}
          x2={cx + dx}
          y2={h / 2}
          stroke={HUD_STROKE}
          strokeWidth={HAIRLINE}
          strokeLinecap="round"
        />
      ))}
    </>
  )
}

/** Outer wing: three verticals (middle taller) + horizontal taper segment */
function OuterWingAssembly({ side }: { side: -1 | 1 }) {
  const x0 = side * R_MAIN
  const dir = side
  const xWingEnd = x0 + dir * WING_LEN
  const xWingPulse =
    side === -1 ? xWingEnd - WING_PULSE_EXT : xWingEnd + WING_PULSE_EXT
  const midH = 22
  const sideH = 15
  const vGap = 4.5

  return (
    <g>
      <line
        x1={x0 - vGap}
        y1={-sideH / 2}
        x2={x0 - vGap}
        y2={sideH / 2}
        stroke={HUD_STROKE}
        strokeWidth={HAIRLINE}
        strokeLinecap="round"
      />
      <line
        x1={x0}
        y1={-midH / 2}
        x2={x0}
        y2={midH / 2}
        stroke={HUD_STROKE}
        strokeWidth={THIN}
        strokeLinecap="round"
      />
      <line
        x1={x0 + vGap}
        y1={-sideH / 2}
        x2={x0 + vGap}
        y2={sideH / 2}
        stroke={HUD_STROKE}
        strokeWidth={HAIRLINE}
        strokeLinecap="round"
      />
      <line
        x1={x0}
        y1={0}
        x2={xWingEnd}
        y2={0}
        stroke={side === -1 ? 'url(#hudWingLeft)' : 'url(#hudWingRight)'}
        strokeWidth={THIN}
        strokeLinecap="round"
      >
        <animate
          attributeName="x2"
          values={`${xWingEnd};${xWingPulse};${xWingEnd}`}
          keyTimes="0;0.5;1"
          dur={`${WING_PULSE_DURATION_SEC}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
        />
      </line>
    </g>
  )
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}

type HudGraphicProps = {
  /** When set and `active`, reticle center tracks cell-local pointer 1:1 (clipped by parent `overflow-hidden`). */
  cellTrackRef?: MutableRefObject<HudCellTrack>
}

export function HudGraphic({ cellTrackRef }: HudGraphicProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const horizontalAxisRef = useRef<SVGGElement>(null)
  const lastMouseMoveRef = useRef(0)
  /** Normalized cursor −1…1 (viewport-centered) */
  const mouseNormRef = useRef({ x: 0, y: 0 })
  const parallaxCurrentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      lastMouseMoveRef.current = performance.now()
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      mouseNormRef.current = {
        x: (e.clientX / w) * 2 - 1,
        y: (e.clientY / h) * 2 - 1,
      }
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    let rafId = 0
    let stopped = false

    const tick = () => {
      if (stopped) return
      rafId = requestAnimationFrame(tick)
      const svg = svgRef.current
      const g = horizontalAxisRef.current
      if (!svg || !g) return

      const tr = cellTrackRef?.current
      if (tr?.active && tr.w > 0 && tr.h > 0) {
        const cx = clamp(tr.x, 0, tr.w)
        const cy = clamp(tr.y, 0, tr.h)
        const tx = cx - tr.w / 2
        const ty = cy - tr.h / 2
        svg.style.transform = `translate(${tx}px, ${ty}px)`
        g.setAttribute('transform', 'translate(0, 0)')
        return
      }

      const mn = mouseNormRef.current
      const targetX = mn.x * PARALLAX_MAX_PX
      const targetY = mn.y * PARALLAX_MAX_PX
      const pc = parallaxCurrentRef.current
      const k = PARALLAX_SMOOTH
      pc.x += (targetX - pc.x) * k
      pc.y += (targetY - pc.y) * k
      svg.style.transform = `translate(${pc.x}px, ${pc.y}px)`

      const moving =
        performance.now() - lastMouseMoveRef.current < MOUSE_MOVE_WINDOW_MS
      const sec = performance.now() / 1000

      if (!moving) {
        g.setAttribute('transform', 'translate(0, 0)')
        return
      }

      const vdx = Math.sin(sec * 81) * 0.22
      const vdy = Math.sin(sec * 46) * 0.48 + Math.sin(sec * 69) * 0.34
      g.setAttribute('transform', `translate(${vdx}, ${vdy})`)
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      stopped = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [cellTrackRef])

  return (
    <svg
      ref={svgRef}
      className="hud-svg-glow h-full w-full will-change-transform"
      viewBox="-720 -360 1440 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient
          id="hudWingLeft"
          gradientUnits="userSpaceOnUse"
          x1={-R_MAIN}
          y1={0}
          x2={-R_MAIN - WING_LEN - WING_PULSE_EXT}
          y2={0}
        >
          <stop offset="0%" stopColor="var(--color-hud)" stopOpacity={1} />
          <stop offset="55%" stopColor="var(--color-hud)" stopOpacity={0.35} />
          <stop offset="100%" stopColor="var(--color-hud)" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="hudWingRight"
          gradientUnits="userSpaceOnUse"
          x1={R_MAIN}
          y1={0}
          x2={R_MAIN + WING_LEN + WING_PULSE_EXT}
          y2={0}
        >
          <stop offset="0%" stopColor="var(--color-hud)" stopOpacity={1} />
          <stop offset="55%" stopColor="var(--color-hud)" stopOpacity={0.35} />
          <stop offset="100%" stopColor="var(--color-hud)" stopOpacity={0} />
        </linearGradient>
      </defs>

      <g className="hud-root">
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur={`${DIAL_ROTATION_DURATION_SEC}s`}
            repeatCount="indefinite"
          />
          {tickLines()}
          <MainCircleRing />
          <path
            d={`M 0 ${-R_MAIN} A ${R_MAIN} ${R_MAIN} 0 0 1 ${R_MAIN} 0`}
            fill="none"
            stroke={HUD_STROKE}
            strokeWidth={ARC_STROKE}
            strokeLinecap="round"
          />
          <path
            d={`M 0 ${R_MAIN} A ${R_MAIN} ${R_MAIN} 0 0 1 ${-R_MAIN} 0`}
            fill="none"
            stroke={HUD_STROKE}
            strokeWidth={ARC_STROKE}
            strokeLinecap="round"
          />
        </g>

        <g ref={horizontalAxisRef}>
          <InnerVerticalCluster side={-1} />
          <InnerVerticalCluster side={1} />

          <OuterWingAssembly side={-1} />
          <OuterWingAssembly side={1} />
        </g>

        <circle
          cx={0}
          cy={0}
          r={R_INNER_RING}
          stroke={HUD_STROKE}
          strokeWidth={HAIRLINE}
        />

        <line
          x1={-PLUS_ARM}
          y1={0}
          x2={PLUS_ARM}
          y2={0}
          stroke={HUD_STROKE}
          strokeWidth={PLUS_STROKE}
          strokeLinecap="round"
        />
        <line
          x1={0}
          y1={-PLUS_ARM}
          x2={0}
          y2={PLUS_ARM}
          stroke={HUD_STROKE}
          strokeWidth={PLUS_STROKE}
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
