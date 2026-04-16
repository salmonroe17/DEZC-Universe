import { useEffect, useRef, useState } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

const MAX_PARTICLES = 500
const SPAWN_MIN_DIST = 3
const SPAWN_PER_TICK = 2
const GRAVITY = 0.14

const FINE_POINTER_MQ = '(pointer: fine)'

/** Matches elements that would typically use `cursor: pointer` — reticle scales on hover. */
const INTERACTIVE_RETICLE_SELECTOR =
  'a[href],button:not([disabled]),[role="button"]:not([aria-disabled="true"]),[role="link"],[role="switch"],[role="tab"],label[for],select,summary,.cursor-pointer,[data-cursor-interactive],input:not([type="hidden"]):not([disabled])'

const TEXT_FIELD_SELECTOR =
  'textarea,input:not([type]),input[type="text"],input[type="search"],input[type="email"],input[type="password"],input[type="url"],input[type="tel"]'

const RETICLE_HOVER_SCALE = 2.5
/** Matches legacy 16×16 SVG over viewBox 0…14 — scales geometry only; strokes stay 1px. */
const RETICLE_PX_PER_UNIT = 16 / 14

const RETICLE_TRANSITION = 'width 200ms ease-out, height 200ms ease-out, top 200ms ease-out, left 200ms ease-out, margin 200ms ease-out'

type ReticleLayout = {
  box: number
  cx: number
  cy: number
  ring: number
  tickLen: number
  dot: number
  u: (n: number) => number
}

function getReticleLayout(expanded: boolean): ReticleLayout {
  const s = expanded ? RETICLE_HOVER_SCALE : 1
  const u = (n: number) => n * s * RETICLE_PX_PER_UNIT
  const extent = u(6.5)
  const box = Math.ceil(extent * 2 + 4)
  const cx = box / 2
  const cy = box / 2
  return {
    box,
    cx,
    cy,
    ring: 2 * u(4.5),
    tickLen: u(3),
    dot: 2 * u(0.9),
    u,
  }
}

function Reticle({ expanded }: { expanded: boolean }) {
  const { box, cx, cy, ring, tickLen, dot, u } = getReticleLayout(expanded)
  const lineStyle = { transition: RETICLE_TRANSITION, backgroundColor: 'currentColor' } as const

  return (
    <div
      className="relative text-white"
      style={{
        width: box,
        height: box,
        marginLeft: -box / 2,
        marginTop: -box / 2,
        transition: RETICLE_TRANSITION,
      }}
    >
      {/* Ring — 1px border; geometry scales, stroke does not */}
      <div
        className="absolute rounded-full border border-solid border-current opacity-95"
        style={{
          width: ring,
          height: ring,
          left: cx - ring / 2,
          top: cy - ring / 2,
          boxSizing: 'border-box',
          transition: RETICLE_TRANSITION,
        }}
      />
      {/* Ticks — 1px rects */}
      <div
        className="absolute rounded-[1px]"
        style={{
          ...lineStyle,
          width: 1,
          height: tickLen,
          left: '50%',
          top: cy - u(6.5),
          transform: 'translateX(-0.5px)',
        }}
      />
      <div
        className="absolute rounded-[1px]"
        style={{
          ...lineStyle,
          width: 1,
          height: tickLen,
          left: '50%',
          top: cy + u(3.5),
          transform: 'translateX(-0.5px)',
        }}
      />
      <div
        className="absolute rounded-[1px]"
        style={{
          ...lineStyle,
          width: tickLen,
          height: 1,
          left: cx - u(6.5),
          top: '50%',
          transform: 'translateY(-0.5px)',
        }}
      />
      <div
        className="absolute rounded-[1px]"
        style={{
          ...lineStyle,
          width: tickLen,
          height: 1,
          left: cx + u(3.5),
          top: '50%',
          transform: 'translateY(-0.5px)',
        }}
      />
      {/* Center dot */}
      <div
        className="absolute rounded-full bg-current opacity-90"
        style={{
          width: dot,
          height: dot,
          left: cx - dot / 2,
          top: cy - dot / 2,
          transition: RETICLE_TRANSITION,
        }}
      />
    </div>
  )
}

function shouldEnlargeReticle(clientX: number, clientY: number): boolean {
  const el = document.elementFromPoint(clientX, clientY)
  if (!el) return false
  /* `.custom-cursor-root * { pointer-events: none }` — reticle should not be the hit target. */
  if (el.closest(TEXT_FIELD_SELECTOR)) return false
  return !!el.closest(INTERACTIVE_RETICLE_SELECTOR)
}

export function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const lastSpawnRef = useRef({ x: 0, y: 0 })
  const hasMovedRef = useRef(false)
  /** Scale reticle geometry on interactive hover (strokes stay 1px via DOM layout, not transform scale). */
  const [reticleExpanded, setReticleExpanded] = useState(false)
  const lastExpandedRef = useRef<boolean | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mq = window.matchMedia(FINE_POINTER_MQ)
    const isFine = () => mq.matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawnBurst = (x: number, y: number) => {
      const list = particlesRef.current
      while (list.length > MAX_PARTICLES - SPAWN_PER_TICK) {
        list.shift()
      }
      for (let i = 0; i < SPAWN_PER_TICK; i++) {
        const maxLife = 55 + Math.random() * 50
        list.push({
          x: x + (Math.random() - 0.5) * 5,
          y: y + (Math.random() - 0.5) * 5,
          vx: (Math.random() - 0.5) * 1.1,
          vy: Math.random() * 0.9 + 0.35,
          life: maxLife,
          maxLife,
        })
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isFine()) return

      if (!hasMovedRef.current) {
        hasMovedRef.current = true
        document.body.classList.add('custom-cursor-active')
        wrap.style.opacity = '1'
      }

      wrap.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`

      const enlarge = shouldEnlargeReticle(e.clientX, e.clientY)
      if (lastExpandedRef.current !== enlarge) {
        lastExpandedRef.current = enlarge
        setReticleExpanded(enlarge)
      }

      const last = lastSpawnRef.current
      const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y)
      if (dist >= SPAWN_MIN_DIST) {
        spawnBurst(e.clientX, e.clientY)
        last.x = e.clientX
        last.y = e.clientY
      }
    }

    const onMqChange = () => {
      if (!isFine()) {
        document.body.classList.remove('custom-cursor-active')
        wrap.style.opacity = '0'
        hasMovedRef.current = false
        lastExpandedRef.current = null
        setReticleExpanded(false)
      }
    }

    mq.addEventListener('change', onMqChange)

    let raf = 0
    let stopped = false
    const tick = () => {
      if (stopped) return
      raf = requestAnimationFrame(tick)
      if (!isFine()) return

      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const list = particlesRef.current
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]
        p.vy += GRAVITY
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.992
        p.life -= 1

        if (p.life <= 0 || p.y > h + 24) {
          list.splice(i, 1)
          continue
        }

        const a = (p.life / p.maxLife) * 0.9
        /* White + canvas `mix-blend-difference` inverts against the backdrop (same idea as reticle). */
        ctx.fillStyle = `rgba(255,255,255,${a})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.15, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', resize)
      mq.removeEventListener('change', onMqChange)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [])

  return (
    <div className="custom-cursor-root">
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998] mix-blend-difference"
        aria-hidden
      />
      <div
        ref={wrapRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference opacity-0 will-change-transform"
        style={{ transform: 'translate(0px, 0px)' }}
        aria-hidden
      >
        <div className="inline-flex overflow-visible will-change-transform">
          <Reticle expanded={reticleExpanded} />
        </div>
      </div>
    </div>
  )
}
