/** Shared with FlowingLine + ShowTellSandCanvas — keep in sync with SVG viewBox. */
export const FLOW_PERIOD = 200
export const FLOW_VB_H = 72
export const FLOW_TOTAL_W = FLOW_PERIOD * 2
export const FLOW_NODE_COUNT = 8
export const FLOW_MID = FLOW_VB_H / 2
export const FLOW_AMP1 = 24
export const FLOW_AMP2 = 5.5
export const FLOW_SLITH1 = 0.3
export const FLOW_SLITH2 = -0.23

export function flowWaveY(x: number, time: number): number {
  const s1 = (x / FLOW_PERIOD) * 2 * Math.PI + time * FLOW_SLITH1
  const s2 = (x / FLOW_PERIOD) * 4 * Math.PI + time * FLOW_SLITH2
  return FLOW_MID + FLOW_AMP1 * Math.sin(s1) + FLOW_AMP2 * Math.sin(s2)
}
