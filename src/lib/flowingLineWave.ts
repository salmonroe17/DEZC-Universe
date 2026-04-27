/** Shared with FlowingLine + ShowTellSandCanvas — keep in sync with SVG viewBox. */
export const FLOW_PERIOD = 200
export const FLOW_VB_H = 72
export const FLOW_NODE_COUNT = 7

/**
 * Base horizontal step used only to size the segment (`×` {@link FLOW_LINE_HORIZONTAL_STRETCH}).
 * Kept as `FLOW_PERIOD × 2` for continuity with earlier layout math.
 */
export const FLOW_LINE_MICRO_UNIT = FLOW_PERIOD * 2

/**
 * How many micro-units long one drawn segment is. This sets thumbnail spacing (linear) and must be
 * large enough that the row feels stretched — not compressed into a few tight wave repeats.
 */
export const FLOW_LINE_HORIZONTAL_STRETCH = 16

export const FLOW_LINE_CORE_W = FLOW_LINE_MICRO_UNIT * FLOW_LINE_HORIZONTAL_STRETCH

/**
 * Wave period along X equals the full segment so one stroke undulates **once** across all seven
 * squares (same spirit as the faint ambient lines: long horizontal runs, mild vertical).
 */
export const FLOW_LINE_TILE_SVG = FLOW_LINE_CORE_W

/**
 * Scrolling track width as a multiple of the line-root viewport (`width: 200%`, pan `h` shifts one viewport).
 */
export const FLOW_TRACK_CSS_WIDTH_MULT = 2

/**
 * Symmetric horizontal gap (SVG units) before and after each drawn line. Where one loop ends and
 * the next begins you get gap + gap — a clear blank band before the same line repeats.
 */
export const FLOW_LOOP_GAP_SVG = 192

/** One loop unit: `[gap][line: FLOW_LINE_CORE_W][gap]`. */
export const FLOW_LOOP_PERIOD_SVG = FLOW_LINE_CORE_W + 2 * FLOW_LOOP_GAP_SVG

/** Two identical loops on the track so panning `h` 0→1 shows a seamless repeat. */
export const FLOW_TRACK_SCROLL_COPIES = 2

export const FLOW_TRACK_VIEW_W = FLOW_LOOP_PERIOD_SVG * FLOW_TRACK_SCROLL_COPIES

/** Rendered squares: two copies × seven sidequests (same data, duplicated for the loop). */
export const FLOW_TRACK_PHYSICAL_NODE_COUNT = FLOW_NODE_COUNT * FLOW_TRACK_SCROLL_COPIES

export const FLOW_MID = FLOW_VB_H / 2
/** Legacy exports — unused by current wave; kept for older imports. */
export const FLOW_AMP1 = 18
export const FLOW_AMP2 = 4

/** Same weights as {@link ShowTellAmbientLines} `buildPath` — keep in sync. */
export const FLOW_AMBIENT_BLEND_W1 = 0.42
export const FLOW_AMBIENT_BLEND_W2 = 0.34
export const FLOW_AMBIENT_BLEND_W3 = 0.24

/**
 * Main flowing timeline: favor the fundamental (1 cycle / segment) so the stroke reads like the
 * ambient lines — slow rolls, not sharp multi-peak “heartbeat” ridges from equal 1×+2×+3× blend.
 */
const FLOW_MAIN_BLEND_W1 = 0.78
const FLOW_MAIN_BLEND_W2 = 0.15
const FLOW_MAIN_BLEND_W3 = 0.07

/** Vertical excursion (SVG units in {@link FLOW_VB_H} space); clamped to viewBox padding. */
export const FLOW_LINE_WAVE_AMP = 11

/** How fast the wave phase advances (main timeline stroke + sand sampling). */
export const FLOW_LINE_WAVE_PHASE_SPEED = 0.11

function clampToViewBoxY(y: number): number {
  const pad = 1.5
  return Math.max(pad, Math.min(FLOW_VB_H - pad, y))
}

/** Horizontal center (SVG x) of physical node `j` (0 … {@link FLOW_TRACK_PHYSICAL_NODE_COUNT}−1). */
export function flowPhysicalNodeCenterX(physicalIndex: number): number {
  const copy = Math.floor(physicalIndex / FLOW_NODE_COUNT)
  const local = physicalIndex % FLOW_NODE_COUNT
  return (
    copy * FLOW_LOOP_PERIOD_SVG +
    FLOW_LOOP_GAP_SVG +
    ((local + 0.5) / FLOW_NODE_COUNT) * FLOW_LINE_CORE_W
  )
}

/**
 * Wave Y at absolute SVG x along the **flowing track**, or `null` in gap regions (no stroke).
 * Sand / hit-tests must use this so dots are not pushed by a “ghost” curve in the blanks.
 */
export function flowWaveYAtTrackX(absX: number, time: number): number | null {
  if (!Number.isFinite(absX)) return null
  const loopW = FLOW_LOOP_PERIOD_SVG
  const g = FLOW_LOOP_GAP_SVG
  const core = FLOW_LINE_CORE_W
  const total = FLOW_TRACK_VIEW_W
  if (absX < 0 || absX > total + 1e-6) return null
  const clamped = Math.min(Math.max(absX, 0), total - 1e-9)
  const u = clamped - Math.floor(clamped / loopW) * loopW
  if (u < g - 1e-9 || u > g + core + 1e-9) return null
  const along = u - g
  const wrapped = ((along % FLOW_LINE_TILE_SVG) + FLOW_LINE_TILE_SVG) % FLOW_LINE_TILE_SVG
  return flowWaveY(g + wrapped, time)
}

/**
 * Triple sine with **fundamental-heavy** weights (see {@link FLOW_MAIN_BLEND_W*}). Same integer
 * harmonics on 0…100 / segment as before so loop copies join cleanly; phase coupling matches the
 * ambient lines’ feel without matching their exact frequencies (those are not tile-periodic here).
 */
export function flowWaveY(x: number, time: number): number {
  const tile = FLOW_LINE_TILE_SVG
  const g = FLOW_LOOP_GAP_SVG
  const along = ((x - g) % tile + tile) % tile
  const xn = (along / tile) * 100
  const phase = time * FLOW_LINE_WAVE_PHASE_SPEED
  const f1 = (2 * Math.PI) / 100
  const f2 = (4 * Math.PI) / 100
  const f3 = (6 * Math.PI) / 100
  const s1 = Math.sin(xn * f1 + phase)
  const s2 = Math.sin(xn * f2 - phase * 0.62)
  const s3 = Math.sin(xn * f3 + phase * 1.25)
  const w =
    FLOW_MAIN_BLEND_W1 * s1 + FLOW_MAIN_BLEND_W2 * s2 + FLOW_MAIN_BLEND_W3 * s3
  return clampToViewBoxY(FLOW_MID + FLOW_LINE_WAVE_AMP * w)
}
