import { useEffect, useRef, type RefObject } from 'react'
import {
  FLOW_NODE_COUNT,
  FLOW_TOTAL_W,
  FLOW_VB_H,
  flowWaveY,
} from '../lib/flowingLineWave'

export type ShowTellSandRefs = {
  lineRootRef: RefObject<HTMLDivElement | null>
  trackRef: RefObject<HTMLDivElement | null>
  phaseRef: RefObject<number>
  /** FlowingLine square under hover — stronger sand burst at that node. */
  hoveredNodeIndexRef: RefObject<number | null>
}

type Dot = {
  rx: number
  ry: number
  x: number
  y: number
  vx: number
  vy: number
}

const GRID_SPACING_CSS = 13
const LINE_REPEL_CSS = 36
const LINE_STRENGTH = 3.2
const NODE_REPEL_CSS = 48
const NODE_STRENGTH = 4.5
/** Hovered square — wide ring + steep falloff reads as a burst / explosion. */
const NODE_HOVER_REPEL_CSS = 118
const NODE_HOVER_STRENGTH = 22
/** Viewport px — cursor pushes sand without blocking clicks (window pointer tracking). */
const POINTER_REPEL_CSS = 56
const POINTER_STRENGTH = 5.2
const DAMP = 0.87
const SPRING = 0.12
const SMOOTH = 0.2
const MAX_DOTS = 2600

function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n))
}

export function ShowTellSandCanvas({ sandRefs }: { sandRefs: ShowTellSandRefs }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const dprRef = useRef(1)
  const colsRowsRef = useRef({ cols: 0, rows: 0 })
  /** Viewport client coords when pointer is over the sand host; null otherwise. */
  const pointerViewRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const rebuildDots = (w: number, h: number, dpr: number) => {
      let step = GRID_SPACING_CSS * dpr
      let cols = Math.floor(w / step)
      let rows = Math.floor(h / step)
      while (cols * rows > MAX_DOTS && step < 22 * dpr) {
        step += dpr * 2
        cols = Math.floor(w / step)
        rows = Math.floor(h / step)
      }
      colsRowsRef.current = { cols, rows }
      const dots: Dot[] = []
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const rx = step * (i + 0.5)
          const ry = step * (j + 0.5)
          dots.push({ rx, ry, x: rx, y: ry, vx: 0, vy: 0 })
        }
      }
      dotsRef.current = dots
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dprRef.current = dpr
      const rect = host.getBoundingClientRect()
      const w = Math.max(1, rect.width * dpr)
      const h = Math.max(1, rect.height * dpr)
      canvas.width = w
      canvas.height = h
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      rebuildDots(w, h, dpr)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    const onPointerMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      if (
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom
      ) {
        pointerViewRef.current = { x: e.clientX, y: e.clientY }
      } else {
        pointerViewRef.current = null
      }
    }
    const clearPointer = () => {
      pointerViewRef.current = null
    }
    const onVisibility = () => {
      if (document.visibilityState !== 'visible') clearPointer()
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('blur', clearPointer)
    document.addEventListener('visibilitychange', onVisibility)

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const { lineRootRef, trackRef, phaseRef, hoveredNodeIndexRef } = sandRefs
      const hoveredNode = hoveredNodeIndexRef.current
      const lineEl = lineRootRef.current
      const trackEl = trackRef.current
      const w = canvas.width
      const h = canvas.height
      const dpr = dprRef.current
      const dots = dotsRef.current
      const canvasRect = host.getBoundingClientRect()

      const fg = getComputedStyle(document.documentElement).getPropertyValue('--color-fg').trim() || '#fafafa'

      ctx.clearRect(0, 0, w, h)

      if (reduced || !dots.length || w < 2 || h < 2) {
        ctx.fillStyle = fg
        ctx.globalAlpha = 0.28
        const r = 0.65 * dpr
        for (const d of dots) {
          ctx.beginPath()
          ctx.arc(d.rx, d.ry, r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        return
      }

      const lineRect = lineEl?.getBoundingClientRect()
      const trackRect = trackEl?.getBoundingClientRect()
      const phase = phaseRef.current

      if (!lineRect || !trackRect || trackRect.width < 4 || trackRect.height < 4) {
        for (const d of dots) {
          d.x = d.rx
          d.y = d.ry
          d.vx = 0
          d.vy = 0
        }
        ctx.fillStyle = fg
        ctx.globalAlpha = 0.32
        for (const d of dots) {
          ctx.beginPath()
          ctx.arc(d.rx, d.ry, 0.7 * dpr, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        return
      }

      const nodeView: { x: number; y: number }[] = []
      for (let i = 0; i < FLOW_NODE_COUNT; i++) {
        const vxb = ((i + 0.5) / FLOW_NODE_COUNT) * FLOW_TOTAL_W
        const vyb = flowWaveY(vxb, phase)
        const nx = (vxb / FLOW_TOTAL_W) * trackRect.width
        const ny = (vyb / FLOW_VB_H) * trackRect.height
        nodeView.push({
          x: trackRect.left + nx,
          y: trackRect.top + ny,
        })
      }

      for (const d of dots) {
        const viewX = canvasRect.left + d.x / dpr
        const viewY = canvasRect.top + d.y / dpr

        let fxc = 0
        let fyc = 0

        if (
          viewX >= trackRect.left &&
          viewX <= trackRect.right &&
          viewY >= trackRect.top &&
          viewY <= trackRect.bottom
        ) {
          const lx = viewX - trackRect.left
          const ly = viewY - trackRect.top
          const vxb = (lx / trackRect.width) * FLOW_TOTAL_W
          const waveYpx = (flowWaveY(vxb, phase) / FLOW_VB_H) * trackRect.height
          const distLine = Math.abs(ly - waveYpx)
          if (distLine < LINE_REPEL_CSS) {
            const t = 1 - distLine / LINE_REPEL_CSS
            const push = t * t * LINE_STRENGTH
            fyc += (ly < waveYpx ? -1 : 1) * push
          }
        }

        for (let ni = 0; ni < FLOW_NODE_COUNT; ni++) {
          const n = nodeView[ni]!
          const dx = viewX - n.x
          const dy = viewY - n.y
          const dist = Math.hypot(dx, dy)
          const burst = hoveredNode === ni
          const rMax = burst ? NODE_HOVER_REPEL_CSS : NODE_REPEL_CSS
          const str = burst ? NODE_HOVER_STRENGTH : NODE_STRENGTH
          if (dist < rMax && dist > 0.25) {
            const t = 1 - dist / rMax
            const falloff = burst ? t * t * t : t * t
            const push = falloff * str
            fxc += (dx / dist) * push
            fyc += (dy / dist) * push
          }
        }

        const ptr = pointerViewRef.current
        if (ptr) {
          const dx = viewX - ptr.x
          const dy = viewY - ptr.y
          const dist = Math.hypot(dx, dy)
          if (dist < POINTER_REPEL_CSS && dist > 0.25) {
            const t = 1 - dist / POINTER_REPEL_CSS
            const push = t * t * POINTER_STRENGTH
            fxc += (dx / dist) * push
            fyc += (dy / dist) * push
          }
        }

        d.vx = (d.vx + fxc * dpr) * DAMP
        d.vy = (d.vy + fyc * dpr) * DAMP
        d.vx += (d.rx - d.x) * SPRING
        d.vy += (d.ry - d.y) * SPRING
        d.x += d.vx
        d.y += d.vy
        d.x = clamp(d.x, 0, w)
        d.y = clamp(d.y, 0, h)
      }

      const { cols, rows } = colsRowsRef.current
      if (cols > 0 && rows > 0 && SMOOTH > 0) {
        const copy = dots.map((p) => ({ x: p.x, y: p.y }))
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const idx = j * cols + i
            let sx = 0
            let sy = 0
            let c = 0
            for (const [di, dj] of [
              [0, 0],
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ] as const) {
              const ni = i + di
              const nj = j + dj
              if (ni < 0 || ni >= cols || nj < 0 || nj >= rows) continue
              const nidx = nj * cols + ni
              sx += copy[nidx].x
              sy += copy[nidx].y
              c++
            }
            if (c > 0) {
              dots[idx].x = dots[idx].x * (1 - SMOOTH) + (sx / c) * SMOOTH
              dots[idx].y = dots[idx].y * (1 - SMOOTH) + (sy / c) * SMOOTH
            }
          }
        }
      }

      ctx.fillStyle = fg
      ctx.globalAlpha = 0.34
      const rad = 0.72 * dpr
      for (const d of dots) {
        ctx.beginPath()
        ctx.arc(d.x, d.y, rad, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', clearPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      pointerViewRef.current = null
    }
  }, [sandRefs])

  return (
    <div ref={hostRef} className="show-tell-sand-host pointer-events-none" aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
