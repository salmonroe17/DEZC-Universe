import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const DOT_MIN = 6
const DOT_MAX = 10
const GAP_MIN = 6
const GAP_MAX = 10
const DOT_COUNT_MAX = 400

/** Peak scale near cursor (~2.5–3). */
const SCALE_MAX = 2.82
/** Gaussian σ (px); larger = wider “bubble” of influence. */
const GAUSS_SIGMA_PX = 72
/** Per-frame smoothing (0–1); lower = silkier, slightly more lag. */
const SCALE_SMOOTH = 0.22
const SCALE_EPS = 0.004

/** Idle wave: softer peak + wider falloff (ripple, not loud). */
const IDLE_SCALE_MAX = 2.1
const IDLE_GAUSS_SIGMA_PX = 96

/** Fake influence chases this Lissajous path (subtle wandering). */
const IDLE_PHASE_SPEED = 0.11
const IDLE_LISSAJOUS_Y_RATIO = 0.74
/** How fast the visible wave point eases toward the ideal (0–1). */
const WAVE_FOLLOW = 0.052

type GridLayout = {
  cols: number
  rows: number
  dot: number
  gap: number
}

type GridExtent = { gw: number; gh: number }

function scaleForDistance(d: number, peak: number, sigma: number): number {
  const extra =
    (peak - 1) * Math.exp(-(d * d) / (2 * sigma * sigma))
  return 1 + extra
}

function measureGrid(
  width: number,
  height: number,
  dot: number,
  gap: number,
): Pick<GridLayout, 'cols' | 'rows'> & { count: number } {
  const stride = dot + gap
  if (stride <= 0) {
    return { cols: 1, rows: 1, count: 1 }
  }
  const cols = Math.max(1, Math.floor((width + gap) / stride))
  const rows = Math.max(1, Math.floor((height + gap) / stride))
  return { cols, rows, count: cols * rows }
}

/**
 * Pick dot/gap in [6–10]px so the grid stays at or below DOT_COUNT_MAX when possible.
 */
function computeLayout(width: number, height: number): GridLayout {
  const w = Math.max(0, width)
  const h = Math.max(0, height)

  let dot = 8
  let gap = 8
  let { cols, rows, count } = measureGrid(w, h, dot, gap)

  while (count > DOT_COUNT_MAX) {
    if (gap < GAP_MAX) {
      gap += 1
    } else if (dot < DOT_MAX) {
      dot += 1
      gap = GAP_MIN
    } else {
      break
    }
    ;({ cols, rows, count } = measureGrid(w, h, dot, gap))
  }

  while (count < 200 && dot > DOT_MIN) {
    const next = measureGrid(w, h, dot - 1, gap)
    if (next.count > DOT_COUNT_MAX) break
    dot -= 1
    cols = next.cols
    rows = next.rows
    count = next.count
  }

  while (count < 200 && gap > GAP_MIN) {
    const next = measureGrid(w, h, dot, gap - 1)
    if (next.count > DOT_COUNT_MAX) break
    gap -= 1
    cols = next.cols
    rows = next.rows
    count = next.count
  }

  return { cols, rows, dot, gap }
}

function computeDotCenters(layout: GridLayout): { x: number; y: number }[] {
  const { cols, rows, dot, gap } = layout
  const stride = dot + gap
  const n = cols * rows
  const out: { x: number; y: number }[] = new Array(n)
  for (let i = 0; i < n; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    out[i] = {
      x: col * stride + dot / 2,
      y: row * stride + dot / 2,
    }
  }
  return out
}

function gridExtent(layout: GridLayout): GridExtent {
  const { cols, rows, dot, gap } = layout
  const stride = dot + gap
  const gw = cols > 0 ? (cols - 1) * stride + dot : dot
  const gh = rows > 0 ? (rows - 1) * stride + dot : dot
  return { gw, gh }
}

export function ShowAndTellGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<GridLayout | null>(null)

  const positionsRef = useRef<{ x: number; y: number }[]>([])
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const scalesRef = useRef<Float32Array | null>(null)
  const pointerInsideRef = useRef(false)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)
  const lastTsRef = useRef<number | null>(null)

  const gridExtentRef = useRef<GridExtent>({ gw: 1, gh: 1 })
  const waveRef = useRef({ x: 0, y: 0 })
  const idlePhaseRef = useRef(Math.random() * Math.PI * 2)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const apply = (width: number, height: number) => {
      if (width < 1 || height < 1) {
        setLayout(null)
        return
      }
      setLayout(computeLayout(width, height))
    }

    const measure = () => {
      apply(el.clientWidth, el.clientHeight)
    }

    measure()

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      apply(width, height)
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!layout) {
      positionsRef.current = []
      dotRefs.current = []
      scalesRef.current = null
      return
    }

    const n = layout.cols * layout.rows
    positionsRef.current = computeDotCenters(layout)
    scalesRef.current = new Float32Array(n).fill(1)
    dotRefs.current.length = n

    const { gw, gh } = gridExtent(layout)
    gridExtentRef.current = { gw, gh }
    waveRef.current = { x: gw * 0.5, y: gh * 0.5 }

    for (let i = 0; i < n; i++) {
      const node = dotRefs.current[i]
      if (node) node.style.transform = 'scale(1)'
    }
  }, [layout])

  useEffect(() => {
    if (!layout) return

    const el = containerRef.current
    if (!el) return

    const n = layout.cols * layout.rows

    const cancelLoop = () => {
      if (rafRef.current !== 0) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }

    const advanceIdleWave = (dt: number) => {
      const { gw, gh } = gridExtentRef.current
      if (gw < 8 || gh < 8) return

      const cx = gw * 0.5
      const cy = gh * 0.5
      const rx = gw * 0.43
      const ry = gh * 0.35

      idlePhaseRef.current += dt * IDLE_PHASE_SPEED
      const idealX = cx + rx * Math.sin(idlePhaseRef.current)
      const idealY = cy + ry * Math.cos(idlePhaseRef.current * IDLE_LISSAJOUS_Y_RATIO)

      const w = waveRef.current
      w.x += (idealX - w.x) * WAVE_FOLLOW
      w.y += (idealY - w.y) * WAVE_FOLLOW
    }

    const tick = () => {
      rafRef.current = 0

      const now = performance.now()
      const prev = lastTsRef.current
      lastTsRef.current = now
      const dt = prev === null ? 0 : Math.min(0.064, (now - prev) / 1000)

      const inside = pointerInsideRef.current
      const sArr = scalesRef.current
      const dRefs = dotRefs.current
      const pos = positionsRef.current
      if (!sArr || pos.length !== n || dRefs.length !== n) return

      if (!inside) {
        advanceIdleWave(dt)
      }

      let needsAnotherFrame = !inside
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const wx = waveRef.current.x
      const wy = waveRef.current.y

      for (let i = 0; i < n; i++) {
        const node = dRefs[i]
        if (!node) continue

        let target = 1
        if (inside) {
          const dx = mx - pos[i].x
          const dy = my - pos[i].y
          const d = Math.hypot(dx, dy)
          target = scaleForDistance(d, SCALE_MAX, GAUSS_SIGMA_PX)
        } else {
          const dx = wx - pos[i].x
          const dy = wy - pos[i].y
          const d = Math.hypot(dx, dy)
          target = scaleForDistance(d, IDLE_SCALE_MAX, IDLE_GAUSS_SIGMA_PX)
        }

        const cur = sArr[i]
        const next = cur + (target - cur) * SCALE_SMOOTH
        sArr[i] = next
        node.style.transform = `scale(${next})`

        if (Math.abs(target - next) > SCALE_EPS) {
          needsAnotherFrame = true
        }
      }

      if (needsAnotherFrame) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    const ensureLoop = () => {
      if (rafRef.current === 0) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    const onPointerEnter = () => {
      pointerInsideRef.current = true
      ensureLoop()
    }

    const onPointerLeave = () => {
      const { gw, gh } = gridExtentRef.current
      pointerInsideRef.current = false
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      waveRef.current = {
        x: Math.min(Math.max(0, mx), gw),
        y: Math.min(Math.max(0, my), gh),
      }
      ensureLoop()
    }

    const onPointerMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      }
      ensureLoop()
    }

    el.addEventListener('pointerenter', onPointerEnter)
    el.addEventListener('pointerleave', onPointerLeave)
    el.addEventListener('pointermove', onPointerMove)

    lastTsRef.current = null
    ensureLoop()

    return () => {
      el.removeEventListener('pointerenter', onPointerEnter)
      el.removeEventListener('pointerleave', onPointerLeave)
      el.removeEventListener('pointermove', onPointerMove)
      cancelLoop()
      lastTsRef.current = null
      pointerInsideRef.current = false
      const sArr = scalesRef.current
      const dRefs = dotRefs.current
      if (sArr) {
        sArr.fill(1)
      }
      for (let i = 0; i < dRefs.length; i++) {
        const node = dRefs[i]
        if (node) node.style.transform = 'scale(1)'
      }
    }
  }, [layout])

  const total = layout ? layout.cols * layout.rows : 0

  return (
    <div
      ref={containerRef}
      className="min-h-0 w-full min-w-0 flex-1 overflow-hidden"
    >
      {layout && total > 0 ? (
        <div
          className="grid justify-start"
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, ${layout.dot}px)`,
            gridAutoRows: `${layout.dot}px`,
            gap: `${layout.gap}px`,
            width: 'max-content',
          }}
        >
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              ref={(node) => {
                dotRefs.current[i] = node
              }}
              className="origin-center shrink-0 bg-fg/[0.22] will-change-transform"
              style={{
                width: layout.dot,
                height: layout.dot,
                transform: 'scale(1)',
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
