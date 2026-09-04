import type { ReactNode } from 'react'

/** Shared HUD dial geometry (homepage reticle + route loading mark). */

export const HUD_STROKE = 'var(--color-hud)'
export const HAIRLINE = 0.65
export const ARC_STROKE = 3.25

export const R_MAIN = 275
const R_TICK_IN = 268
const R_TICK_OUT = 284
const TICK_COUNT = 120

/** Degrees clockwise from 3 o'clock (SVG); gaps at 6 and 12 o'clock */
const CIRCLE_GAP_HALF_DEG = 4

function circlePoint(deg: number, r: number) {
  const t = (deg * Math.PI) / 180
  return { x: r * Math.cos(t), y: r * Math.sin(t) }
}

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

/** Tick ring, gapped main circle, and thick accent arcs (no inner plus). */
export function HudDialMarks() {
  return (
    <>
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
    </>
  )
}
