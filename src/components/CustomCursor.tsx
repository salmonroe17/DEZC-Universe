import { useEffect, useRef } from 'react'
import { useHudShooterGame } from '../contexts/HudShooterContext'

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

function hudRgb(): { r: number; g: number; b: number } {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-hud')
    .trim()
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(raw)
  if (m) {
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16),
    }
  }
  return { r: 255, g: 255, b: 255 }
}

export function CustomCursor() {
  const { active: hudShooterActive } = useHudShooterGame()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const lastSpawnRef = useRef({ x: 0, y: 0 })
  const hasMovedRef = useRef(false)

  useEffect(() => {
    if (hudShooterActive) {
      document.body.classList.remove('custom-cursor-active')
      return
    }

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
      const { r, g, b } = hudRgb()
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
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`
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
  }, [hudShooterActive])

  if (hudShooterActive) return null

  return (
    <div className="custom-cursor-root">
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998]"
        aria-hidden
      />
      <div
        ref={wrapRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 will-change-transform"
        style={{ transform: 'translate(0px, 0px)' }}
        aria-hidden
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 text-[var(--color-hud)] drop-shadow-[0_0_4px_color-mix(in_srgb,var(--color-hud)_50%,transparent)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="7"
              cy="7"
              r="4.5"
              stroke="currentColor"
              strokeWidth="0.85"
              opacity={0.95}
            />
            <line
              x1="7"
              y1="0.5"
              x2="7"
              y2="3.5"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeLinecap="round"
            />
            <line
              x1="7"
              y1="10.5"
              x2="7"
              y2="13.5"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeLinecap="round"
            />
            <line
              x1="0.5"
              y1="7"
              x2="3.5"
              y2="7"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeLinecap="round"
            />
            <line
              x1="10.5"
              y1="7"
              x2="13.5"
              y2="7"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeLinecap="round"
            />
            <circle cx="7" cy="7" r="0.9" fill="currentColor" opacity={0.9} />
          </svg>
        </div>
      </div>
    </div>
  )
}
