import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type MutableRefObject,
  type RefObject,
} from 'react'
import {
  FLOW_AMBIENT_BLEND_W1,
  FLOW_AMBIENT_BLEND_W2,
  FLOW_AMBIENT_BLEND_W3,
} from '../lib/flowingLineWave'
const VB = 100
const STEPS = 52

type Props = {
  scrollHUnitRef: MutableRefObject<number>
  hoveredNodeIndexRef: RefObject<number | null>
}

type AmbientLine = {
  phase: number
  phaseVel: number
  mid: number
  midVel: number
  f1: number
  f2: number
  amp: number
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

function buildPath(L: AmbientLine): string {
  const parts: string[] = []
  for (let i = 0; i <= STEPS; i++) {
    const x = (i / STEPS) * VB
    const s1 = Math.sin(x * L.f1 + L.phase)
    const s2 = Math.sin(x * L.f2 - L.phase * 0.62)
    const s3 = Math.sin(x * (L.f1 + L.f2) * 0.85 + L.phase * 1.25)
    const w = FLOW_AMBIENT_BLEND_W1 * s1 + FLOW_AMBIENT_BLEND_W2 * s2 + FLOW_AMBIENT_BLEND_W3 * s3
    const y = L.mid + L.amp * w

    parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return parts.join(' ')
}

function initLines(): AmbientLine[] {
  return [
    { phase: 2.7, phaseVel: -0.42, mid: 52, midVel: 0, f1: 0.12, f2: 0.15, amp: 17 },
    { phase: 5.1, phaseVel: 0.28, mid: 70, midVel: 0, f1: 0.088, f2: 0.2, amp: 18 },
  ]
}

/**
 * Behind the sand: faint horizontal waves. Pauses organic motion when a FlowingLine
 * square is hovered; horizontal drift matches FlowingLine track.
 */
export function ShowTellAmbientLines({ scrollHUnitRef, hoveredNodeIndexRef }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const path0 = useRef<SVGPathElement>(null)
  const path1 = useRef<SVGPathElement>(null)
  const scrollWrapRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<AmbientLine[]>(initLines())

  const applyPaths = useCallback(() => {
    const paths = [path0.current, path1.current].filter(Boolean) as SVGPathElement[]
    const lines = linesRef.current
    const p0 = buildPath(lines[0]!)
    const p1 = buildPath(lines[1]!)
    paths[0]?.setAttribute('d', p0)
    paths[1]?.setAttribute('d', p1)
  }, [])

  const syncScrollLeft = useCallback(() => {
    const wrap = scrollWrapRef.current
    if (wrap) {
      wrap.style.left = `${-scrollHUnitRef.current * 100}%`
    }
  }, [scrollHUnitRef])

  useLayoutEffect(() => {
    applyPaths()
    syncScrollLeft()
  }, [applyPaths, syncScrollLeft])

  useEffect(() => {
    const lines = linesRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let id: number
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.055)
      last = now

      const hovered = hoveredNodeIndexRef.current != null
      if (!reduced && !hovered) {
        for (const L of lines) {
          L.phaseVel += (Math.random() - 0.5) * 2.85 * dt
          L.phaseVel = clamp(L.phaseVel, -4.2, 4.2)
          L.phaseVel *= 1 - Math.min(1, 0.5 * dt * 60) / 60
          L.phase += L.phaseVel * dt * 1.65

          L.midVel += (Math.random() - 0.5) * 1.75 * dt
          L.midVel *= 1 - Math.min(1, 0.55 * dt * 60) / 60
          L.mid += L.midVel * dt * 40
          L.mid = clamp(L.mid, 18, 82)
        }
      }

      applyPaths()
      syncScrollLeft()
      id = requestAnimationFrame(tick)
    }

    applyPaths()
    syncScrollLeft()
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [applyPaths, syncScrollLeft, hoveredNodeIndexRef])

  return (
    <div ref={hostRef} className="show-tell-ambient-lines" aria-hidden>
      <div
        ref={scrollWrapRef}
        className="pointer-events-none absolute top-0 bottom-0 left-0 max-w-none will-change-[left]"
        style={{ left: '0%', width: '200%' }}
      >
        <svg
          className="absolute inset-0 block h-full w-full text-hud opacity-[0.14]"
          viewBox={`0 0 ${VB} ${VB}`}
          preserveAspectRatio="none"
        >
          <path
            ref={path0}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="0.25px"
            vectorEffect="nonScalingStroke"
          />
          <path
            ref={path1}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="0.25px"
            vectorEffect="nonScalingStroke"
          />
        </svg>
      </div>
    </div>
  )
}
