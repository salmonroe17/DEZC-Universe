/** Shared with FlowingLine + ShowTellSandCanvas — keep in sync with SVG viewBox. */
export const FLOW_PERIOD = 200
export const FLOW_VB_H = 72
export const FLOW_TOTAL_W = FLOW_PERIOD * 2
export const FLOW_NODE_COUNT = 7

/** Adjacent thumbnail centers in line-root space (track spans 2 units; nodes evenly spaced). */
export const FLOW_NODE_CENTER_SPACING_NORM = 2 / FLOW_NODE_COUNT
export const FLOW_MID = FLOW_VB_H / 2
export const FLOW_AMP1 = 18
export const FLOW_AMP2 = 4
export const FLOW_SLITH1 = 0.18
export const FLOW_SLITH2 = -0.14
const FLOW_TIME_SCALE = 0.68

function clampToViewBoxY(y: number): number {
  const pad = 1.5
  return Math.max(pad, Math.min(FLOW_VB_H - pad, y))
}

/**
 * Smooth repeating wave (two harmonics). Kept simple so sand repulsion stays
 * aligned with the visible line and square nodes.
 */
export function flowWaveY(x: number, time: number): number {
  const t = time * FLOW_TIME_SCALE
  const p = FLOW_PERIOD
  const kx = (2 * Math.PI) / p
  const s1 = x * kx + t * FLOW_SLITH1
  const s2 = x * 2 * kx + t * FLOW_SLITH2
  return clampToViewBoxY(FLOW_MID + FLOW_AMP1 * Math.sin(s1) + FLOW_AMP2 * Math.sin(s2))
}
