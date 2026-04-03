import { AnimatePresence, motion } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useHudShooterGame } from '../contexts/HudShooterContext'
import { HudGraphic, type HudCellTrack } from './HudGraphic'

// --- Codename + word pool (game data) ---

const ADJECTIVES = [
  'Silent',
  'Crimson',
  'Phantom',
  'Neon',
  'Shadow',
  'Iron',
  'Ghost',
  'Digital',
] as const

const NOUNS = [
  'Lockdown',
  'Vector',
  'Hunter',
  'Signal',
  'Protocol',
  'Drift',
  'Operator',
  'Nova',
] as const

const ROLE_WORDS = [
  'Product Designer',
  'Interaction Designer',
  'Design systems expert',
  'UX Engineer',
  'Systems Thinker',
  'Creative Technologist',
  'AI Prototyper',
  'Speed Designer',
  'Vibe coder',
  'Builder & dreamer',
] as const

function randomCodename(): string {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const n = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${a} ${n}`
}

function pickRoleWord(): string {
  return ROLE_WORDS[Math.floor(Math.random() * ROLE_WORDS.length)]
}

// --- Game / canvas types (logic layer) ---

type Phase = 'idle' | 'explode' | 'game' | 'winddown' | 'end'

type WordBite = { lx: number; ly: number; r: number }

type TargetWord = {
  id: number
  text: string
  x: number
  y: number
  scale: number
  opacity: number
  vx: number
  vy: number
  speed: number
  hitFlash: number
  jitterT: number
  health: number
  angle: number
  spinRate: number
  wanderPhase: number
  wanderFreq: number
  bites: WordBite[]
}

type FxParticle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

type BulletFlash = {
  x1: number
  y1: number
  x2: number
  y2: number
  life: number
}

const GAME_DURATION_MS = 26_000
const MAX_WORDS = 13
const MAX_PARTICLES = 420
const EXPLODE_MS = 880
/** Canvas text size (px); thinnest weight. Scaled 3× for readability + hit feel. */
function wordFontSize(scale: number) {
  return (6.5 + scale * 14) * 3
}
const WORD_FONT = (fs: number) => `100 ${fs}px "Space Mono", monospace`
const COMBO_WINDOW_MS = 720
const WINDDOWN_MAX_MS = 4500
/** Hits to fully clear a target (cookie eaten away) */
const WORD_MAX_HEALTH = 6
/** Uniform pacing — not tied to player accuracy */
const SPAWN_INTERVAL_SEC = 0.68
const WORD_SPEED = 210
const WORD_SCALE_RATE = 0.5
const WHIMSY_LATERAL = 155
const WHIMSY_PHASE_SPEED = 1.15
const WORD_SPIN_MAX = 0.55

const STAR_COUNT = 175

type BackgroundStar = {
  x: number
  y: number
  tw: number
  tws: number
  sz: number
}

function initBackgroundStars(w: number, h: number, out: BackgroundStar[]) {
  out.length = 0
  for (let i = 0; i < STAR_COUNT; i++) {
    out.push({
      x: Math.random() * w,
      y: Math.random() * h,
      tw: Math.random() * Math.PI * 2,
      tws: 0.85 + Math.random() * 2.5,
      sz: 0.5 + Math.random() * 1.2,
    })
  }
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// --- Rendering helpers (canvas) ---

function measureWord(
  ctx: CanvasRenderingContext2D,
  w: TargetWord,
): { halfW: number; halfH: number } {
  const fs = wordFontSize(w.scale)
  ctx.font = WORD_FONT(fs)
  const tw = ctx.measureText(w.text).width
  return { halfW: tw / 2 + 36, halfH: fs / 2 + 28 }
}

function worldToLocal(
  mx: number,
  my: number,
  wx: number,
  wy: number,
  angle: number,
): { lx: number; ly: number } {
  const dx = mx - wx
  const dy = my - wy
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return { lx: c * dx + s * dy, ly: -s * dx + c * dy }
}

function pointInsideAnyBite(lx: number, ly: number, bites: WordBite[]): boolean {
  for (const b of bites) {
    const d = lx - b.lx
    const e = ly - b.ly
    if (d * d + e * e < b.r * b.r) return true
  }
  return false
}

function hitTestWords(
  ctx: CanvasRenderingContext2D,
  words: TargetWord[],
  cx: number,
  cy: number,
): TargetWord | null {
  const sorted = [...words].sort((a, b) => b.scale - a.scale)
  for (const w of sorted) {
    const { halfW, halfH } = measureWord(ctx, w)
    const { lx, ly } = worldToLocal(cx, cy, w.x, w.y, w.angle)
    if (Math.abs(lx) > halfW || Math.abs(ly) > halfH) continue
    if (pointInsideAnyBite(lx, ly, w.bites)) continue
    return w
  }
  return null
}

function drawWords(
  ctx: CanvasRenderingContext2D,
  words: TargetWord[],
  fg: string,
) {
  for (const w of words) {
    const fs = wordFontSize(w.scale)
    ctx.save()
    let a = w.opacity
    if (w.hitFlash > 0) a = clamp(w.opacity + w.hitFlash * 0.35, 0, 1)
    ctx.globalAlpha = clamp(a, 0, 1)
    const jitter =
      w.jitterT > 0 ? Math.sin(w.jitterT * 90) * (w.jitterT * 2.2) : 0
    ctx.translate(w.x + jitter, w.y)
    ctx.rotate(w.angle)
    ctx.font = WORD_FONT(fs)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = fg
    ctx.fillText(w.text, 0, 0)

    if (w.bites.length > 0) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = '#000'
      for (const b of w.bites) {
        ctx.beginPath()
        ctx.arc(b.lx, b.ly, b.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }
    ctx.restore()
  }
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  parts: FxParticle[],
  color: string,
) {
  for (const p of parts) {
    const t = p.life / p.maxLife
    ctx.globalAlpha = t * t
    ctx.fillStyle = color
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
  }
  ctx.globalAlpha = 1
}

function drawFlashes(
  ctx: CanvasRenderingContext2D,
  flashes: BulletFlash[],
  stroke: string,
) {
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.5
  for (const f of flashes) {
    const t = f.life / 0.14
    ctx.globalAlpha = clamp(t, 0, 1)
    ctx.beginPath()
    ctx.moveTo(f.x1, f.y1)
    ctx.lineTo(f.x2, f.y2)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

/** Greeting burst — dense, fast, large particles from the text center */
function spawnGreetingExplosion(
  parts: FxParticle[],
  ox: number,
  oy: number,
  cap: number,
) {
  const budget = Math.min(270, cap - parts.length)
  for (let i = 0; i < budget; i++) {
    const ang = Math.random() * Math.PI * 2
    const sp = 130 + Math.random() * 480
    parts.push({
      x: ox + (Math.random() - 0.5) * 14,
      y: oy + (Math.random() - 0.5) * 10,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      life: 0.55 + Math.random() * 0.55,
      maxLife: 0.65 + Math.random() * 0.6,
      size: 1.8 + Math.random() * 4.2,
    })
  }
}

/** Per-hit “chunk” flying off */
function spawnChunkHitSparks(
  parts: FxParticle[],
  x: number,
  y: number,
  cap: number,
) {
  const budget = Math.min(52, cap - parts.length)
  for (let i = 0; i < budget; i++) {
    const ang = Math.random() * Math.PI * 2
    const sp = 95 + Math.random() * 220
    parts.push({
      x,
      y,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      life: 0.22 + Math.random() * 0.32,
      maxLife: 0.35 + Math.random() * 0.35,
      size: 0.9 + Math.random() * 2.4,
    })
  }
}

/** Final destroy when word is fully eaten */
function spawnTargetExplosion(
  parts: FxParticle[],
  x: number,
  y: number,
  cap: number,
) {
  const budget = Math.min(130, cap - parts.length)
  for (let i = 0; i < budget; i++) {
    const ang = Math.random() * Math.PI * 2
    const sp = 80 + Math.random() * 280
    parts.push({
      x,
      y,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      life: 0.35 + Math.random() * 0.45,
      maxLife: 0.5 + Math.random() * 0.45,
      size: 0.8 + Math.random() * 2.2,
    })
  }
}

// --- Component ---

export function HudShooterIntro() {
  const { setActive } = useHudShooterGame()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsCanvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<BackgroundStar[]>([])
  const starfieldWarpRef = useRef(false)
  const idleTextRef = useRef<HTMLDivElement>(null)

  const phaseRef = useRef<Phase>('idle')
  const wordsRef = useRef<TargetWord[]>([])
  const particlesRef = useRef<FxParticle[]>([])
  const flashesRef = useRef<BulletFlash[]>([])
  const nextWordId = useRef(0)
  const spawnAccRef = useRef(0)
  const gameT0Ref = useRef(0)
  const explodeT0Ref = useRef(0)
  const winddownT0Ref = useRef(0)
  const rafRef = useRef<number>(0)
  const dprRef = useRef(1)
  const sizeRef = useRef({ w: 1, h: 1 })
  const hudTrackRef = useRef<HudCellTrack>({
    active: false,
    x: 0,
    y: 0,
    w: 1,
    h: 1,
  })
  const lastHitRef = useRef(0)
  const comboRef = useRef(0)

  const [codename, setCodename] = useState(randomCodename)
  const [uiPhase, setUiPhase] = useState<'idle' | 'game' | 'end'>('idle')
  /** True only during active shooting (after explosion), not during explode phase */
  const [combatHud, setCombatHud] = useState(false)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [crosshair, setCrosshair] = useState({ x: 0, y: 0 })
  const enteredGameRef = useRef(false)

  useEffect(() => {
    starfieldWarpRef.current = uiPhase === 'game'
  }, [uiPhase])

  const prevUiPhaseRef = useRef(uiPhase)
  useEffect(() => {
    if (uiPhase === 'idle' && prevUiPhaseRef.current !== 'idle') {
      const { w, h } = sizeRef.current
      if (w > 4 && h > 4) initBackgroundStars(w, h, starsRef.current)
    }
    prevUiPhaseRef.current = uiPhase
  }, [uiPhase])

  const syncHudActive = useCallback(() => {
    const p = phaseRef.current
    setActive(p === 'game' || p === 'winddown' || p === 'explode')
  }, [setActive])

  const beginExplosion = useCallback(() => {
    if (phaseRef.current !== 'idle') return
    const container = containerRef.current
    if (!container) return

    const cr = container.getBoundingClientRect()
    const textEl = idleTextRef.current
    let ox = container.clientWidth / 2
    let oy = container.clientHeight / 2
    if (textEl) {
      const tr = textEl.getBoundingClientRect()
      ox = tr.left + tr.width / 2 - cr.left
      oy = tr.top + tr.height / 2 - cr.top
    }

    enteredGameRef.current = false
    setCombatHud(false)
    phaseRef.current = 'explode'
    explodeT0Ref.current = performance.now()
    syncHudActive()
    setUiPhase('game')
    particlesRef.current = []
    spawnGreetingExplosion(particlesRef.current, ox, oy, MAX_PARTICLES)
  }, [syncHudActive])

  const resetRun = useCallback(() => {
    phaseRef.current = 'idle'
    wordsRef.current = []
    particlesRef.current = []
    flashesRef.current = []
    spawnAccRef.current = 0
    gameT0Ref.current = 0
    nextWordId.current = 0
    setScore(0)
    setCombo(0)
    comboRef.current = 0
    lastHitRef.current = 0
    setCodename(randomCodename())
    setUiPhase('idle')
    setCombatHud(false)
    enteredGameRef.current = false
    syncHudActive()
  }, [syncHudActive])

  const tryAgain = useCallback(() => {
    resetRun()
  }, [resetRun])

  const exitToIdle = useCallback(() => {
    phaseRef.current = 'idle'
    wordsRef.current = []
    particlesRef.current = []
    flashesRef.current = []
    spawnAccRef.current = 0
    gameT0Ref.current = 0
    nextWordId.current = 0
    setScore(0)
    setCombo(0)
    comboRef.current = 0
    lastHitRef.current = 0
    setUiPhase('idle')
    setCombatHud(false)
    enteredGameRef.current = false
    syncHudActive()
  }, [syncHudActive])

  // Resize game + starfield canvases to container
  useLayoutEffect(() => {
    const el = containerRef.current
    const canvas = canvasRef.current
    const starsCanvas = starsCanvasRef.current
    if (!el || !canvas) return

    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dprRef.current = dpr
      const w = el.clientWidth
      const h = el.clientHeight
      sizeRef.current = { w, h }
      hudTrackRef.current.w = w
      hudTrackRef.current.h = h
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      if (starsCanvas && w > 0 && h > 0) {
        starsCanvas.width = Math.max(1, Math.floor(w * dpr))
        starsCanvas.height = Math.max(1, Math.floor(h * dpr))
        starsCanvas.style.width = `${w}px`
        starsCanvas.style.height = `${h}px`
        initBackgroundStars(w, h, starsRef.current)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Starfield: twinkle when idle/end; radial “warp” while uiPhase === 'game'
  useEffect(() => {
    const canvas = starsCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const { w, h } = sizeRef.current
      if (w < 4 || h < 4) return

      const dpr = dprRef.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const warp = starfieldWarpRef.current
      const fg =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--color-fg')
          .trim() || '#ffffff'
      const cx = w / 2
      const cy = h / 2
      const stars = starsRef.current
      if (stars.length === 0) return

      for (const s of stars) {
        if (warp) {
          const dx = s.x - cx
          const dy = s.y - cy
          const dist = Math.hypot(dx, dy) + 0.001
          const rush = (165 + dist * 0.62) / 3
          s.x += (dx / dist) * rush * dt
          s.y += (dy / dist) * rush * dt
          const pad = 120
          if (
            s.x < -pad ||
            s.x > w + pad ||
            s.y < -pad ||
            s.y > h + pad
          ) {
            const ang = Math.random() * Math.PI * 2
            const r = 5 + Math.random() * Math.min(w, h) * 0.07
            s.x = cx + Math.cos(ang) * r
            s.y = cy + Math.sin(ang) * r
          }
        }

        s.tw += dt * s.tws * (warp ? 1.5 : 1)
        const pulse = 0.5 + 0.5 * Math.sin(s.tw)
        const alpha = warp
          ? 0.32 + 0.68 * pulse
          : 0.12 + 0.78 * pulse
        ctx.globalAlpha = clamp(alpha * (warp ? 0.92 : 0.88), 0.1, 1)
        ctx.fillStyle = fg
        const rad = s.sz * (warp ? 0.9 + pulse * 0.45 : 0.75 + pulse * 0.55)
        ctx.beginPath()
        ctx.arc(s.x, s.y, rad, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Pointer: crosshair + HUD cell track (1:1 follow while shooting)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      let x = e.clientX - r.left
      let y = e.clientY - r.top
      const w = el.clientWidth
      const h = el.clientHeight
      x = clamp(x, 0, w)
      y = clamp(y, 0, h)
      const t = hudTrackRef.current
      t.x = x
      t.y = y
      t.w = w
      t.h = h
      t.active = combatHud
      if (combatHud) {
        setCrosshair({ x, y })
      }
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [combatHud])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (!combatHud) {
      hudTrackRef.current.active = false
      return
    }
    const w = el.clientWidth
    const h = el.clientHeight
    const t = hudTrackRef.current
    t.active = true
    t.w = w
    t.h = h
    t.x = w / 2
    t.y = h / 2
    setCrosshair({ x: w / 2, y: h / 2 })
  }, [combatHud])

  // Main RAF loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const dpr = dprRef.current
      const { w: cw, h: ch } = sizeRef.current

      const root = document.documentElement
      const fg =
        getComputedStyle(root).getPropertyValue('--color-fg').trim() ||
        '#ffffff'

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cw, ch)

      // Explosion → game
      if (phaseRef.current === 'explode') {
        if (now - explodeT0Ref.current >= EXPLODE_MS) {
          phaseRef.current = 'game'
          gameT0Ref.current = now
          spawnAccRef.current = 0
          syncHudActive()
          if (!enteredGameRef.current) {
            enteredGameRef.current = true
            setCombatHud(true)
          }
        }
      }

      let ph = phaseRef.current

      if (
        (phaseRef.current === 'game' || phaseRef.current === 'winddown') &&
        comboRef.current > 0 &&
        now - lastHitRef.current > COMBO_WINDOW_MS
      ) {
        comboRef.current = 0
        setCombo(0)
      }

      const words = wordsRef.current
      const parts = particlesRef.current
      const flashes = flashesRef.current

      // Particles
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.life -= dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vy += 420 * dt
        if (p.life <= 0) parts.splice(i, 1)
      }
      while (parts.length > MAX_PARTICLES) parts.shift()

      // Bullet flashes
      for (let i = flashes.length - 1; i >= 0; i--) {
        flashes[i].life -= dt
        if (flashes[i].life <= 0) flashes.splice(i, 1)
      }

      const gameElapsed =
        ph === 'game' || ph === 'winddown'
          ? now - gameT0Ref.current
          : 0
      const timeT = clamp(gameElapsed / GAME_DURATION_MS, 0, 1)
      const spawnInterval = lerp(SPAWN_INTERVAL_SEC, SPAWN_INTERVAL_SEC * 0.55, timeT)

      // Spawn (game only) — fast, uniform motion; spawn rate eases slightly with time only
      if (ph === 'game' && words.length < MAX_WORDS) {
        spawnAccRef.current += dt
        while (
          spawnAccRef.current >= spawnInterval &&
          words.length < MAX_WORDS
        ) {
          spawnAccRef.current -= spawnInterval
          const angle = Math.random() * Math.PI * 2
          const spread = 10 + Math.random() * 36
          const sp = WORD_SPEED + (Math.random() - 0.5) * 28
          const id = nextWordId.current++
          words.push({
            id,
            text: pickRoleWord(),
            x: cw / 2 + Math.cos(angle) * spread,
            y: ch / 2 + Math.sin(angle) * spread,
            scale: 0.14 + Math.random() * 0.05,
            opacity: 0,
            vx: Math.cos(angle) * sp,
            vy: Math.sin(angle) * sp,
            speed: WORD_SCALE_RATE,
            hitFlash: 0,
            jitterT: 0,
            health: WORD_MAX_HEALTH,
            angle: (Math.random() - 0.5) * 0.35,
            spinRate: (Math.random() < 0.5 ? -1 : 1) * (0.18 + Math.random() * WORD_SPIN_MAX),
            wanderPhase: Math.random() * Math.PI * 2,
            wanderFreq: 0.65 + Math.random() * 1.4,
            bites: [],
          })
        }
      }

      // Game → winddown
      if (ph === 'game' && gameElapsed >= GAME_DURATION_MS) {
        phaseRef.current = 'winddown'
        winddownT0Ref.current = now
        syncHudActive()
      }

      ph = phaseRef.current

      // Word integration
      for (let i = words.length - 1; i >= 0; i--) {
        const word = words[i]
        word.hitFlash = Math.max(0, word.hitFlash - dt * 2.8)
        word.jitterT = Math.max(0, word.jitterT - dt)

        if (ph === 'winddown') {
          word.opacity -= dt * 1.15
          word.angle += word.spinRate * dt
          word.x += word.vx * dt
          word.y += word.vy * dt
          if (word.opacity <= 0.02) {
            words.splice(i, 1)
            continue
          }
        } else if (ph === 'game') {
          word.opacity = clamp(word.opacity + dt * 2.4, 0, 1)
          word.scale += word.speed * dt
          word.angle += word.spinRate * dt

          word.wanderPhase += WHIMSY_PHASE_SPEED * dt
          const vm = Math.hypot(word.vx, word.vy) || 1
          const px = -word.vy / vm
          const py = word.vx / vm
          const wobble =
            WHIMSY_LATERAL *
            Math.sin(word.wanderPhase * word.wanderFreq + word.id * 0.37)
          word.vx += px * wobble * dt
          word.vy += py * wobble * dt

          const cx = cw / 2
          const cy = ch / 2
          const ox = word.x - cx
          const oy = word.y - cy
          const dist = Math.hypot(ox, oy) + 12
          const outward = 22
          word.vx += (ox / dist) * outward * dt
          word.vy += (oy / dist) * outward * dt

          const loop =
            WHIMSY_LATERAL *
            0.42 *
            Math.cos(word.wanderPhase * word.wanderFreq * 0.72 + word.id)
          word.vx += (-oy / dist) * loop * dt
          word.vy += (ox / dist) * loop * dt

          const vMag = Math.hypot(word.vx, word.vy)
          const vCap = 360
          if (vMag > vCap) {
            word.vx *= vCap / vMag
            word.vy *= vCap / vMag
          }

          word.x += word.vx * dt
          word.y += word.vy * dt

          const margin = 100
          const out =
            word.x < -margin ||
            word.x > cw + margin ||
            word.y < -margin ||
            word.y > ch + margin
          if (out) {
            word.opacity -= dt * 2.8
          }

          if (word.opacity <= 0.02) {
            words.splice(i, 1)
          }
        }
      }

      // Winddown → end
      if (phaseRef.current === 'winddown') {
        if (
          words.length === 0 ||
          now - winddownT0Ref.current > WINDDOWN_MAX_MS
        ) {
          phaseRef.current = 'end'
          wordsRef.current = []
          setActive(false)
          setCombatHud(false)
          setUiPhase('end')
        }
      }

      drawParticles(ctx, parts, fg)
      drawWords(ctx, words, fg)
      drawFlashes(ctx, flashes, fg)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [setActive, syncHudActive])

  const onCanvasPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const phase = phaseRef.current
      if (phase !== 'game' && phase !== 'winddown') return

      const el = containerRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const mx = e.clientX - r.left
      const my = e.clientY - r.top

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dx = mx - sizeRef.current.w / 2
      const dy = my - sizeRef.current.h / 2
      const len = Math.hypot(dx, dy) || 1
      const ux = dx / len
      const uy = dy / len
      flashesRef.current.push({
        x1: mx - ux * 72,
        y1: my - uy * 72,
        x2: mx + ux * 28,
        y2: my + uy * 28,
        life: 0.14,
      })

      const list = wordsRef.current
      const hit = hitTestWords(ctx, list, mx, my)
      if (hit) {
        const idx = list.findIndex((w) => w.id === hit.id)
        if (idx >= 0) {
          const w = list[idx]
          const fs = wordFontSize(w.scale)
          const { lx, ly } = worldToLocal(mx, my, w.x, w.y, w.angle)
          const biteR = Math.max(11, fs * 0.26)
          w.bites.push({ lx, ly, r: biteR })
          w.health -= 1
          w.hitFlash = 1
          w.jitterT = 0.18

          if (w.health <= 0) {
            spawnTargetExplosion(
              particlesRef.current,
              w.x,
              w.y,
              MAX_PARTICLES,
            )
            list.splice(idx, 1)
          } else {
            spawnChunkHitSparks(
              particlesRef.current,
              mx,
              my,
              MAX_PARTICLES,
            )
          }

          const tnow = performance.now()
          if (tnow - lastHitRef.current < COMBO_WINDOW_MS) {
            comboRef.current += 1
          } else {
            comboRef.current = 1
          }
          lastHitRef.current = tnow
          setCombo(comboRef.current)
          setScore((s) => s + 1)
        }
      }
    },
    [],
  )

  return (
    <div
      ref={containerRef}
      className={`relative isolate h-full min-h-[200px] w-full select-none ${
        combatHud ? 'cursor-none' : ''
      }`}
    >
      <canvas
        ref={starsCanvasRef}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden
      >
        <div className="flex h-full w-full items-center justify-center">
          <HudGraphic cellTrackRef={hudTrackRef} />
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-10 ${
          combatHud ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        onPointerDown={onCanvasPointerDown}
        aria-hidden
      />

      {/* UI overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 flex min-h-0 flex-col p-3 md:p-5">
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0 text-[10px] uppercase tracking-[0.14em] text-fg/75">
            YOUR CODENAME: {codename.toUpperCase()}
          </div>
          {uiPhase === 'game' && (
            <button
              type="button"
              className="pointer-events-auto shrink-0 border-[1px] border-solid border-fg p-2 text-[14px] leading-none text-fg transition-colors hover:border-cell-hover hover:bg-fg/[0.06]"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                exitToIdle()
              }}
            >
              Exit
            </button>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 w-full flex-1 flex-col items-start justify-center">
            <AnimatePresence mode="wait">
              {uiPhase === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-full pr-2 text-left"
                >
                  <div ref={idleTextRef}>
                    <motion.p
                      className="max-w-full text-[2rem] font-medium leading-[1.15] text-fg md:text-[2.25rem]"
                      animate={{ opacity: [1, 0.1, 1] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      Hello, my name is Dez, I like to dream & create
                    </motion.p>
                  </div>
                  <button
                    type="button"
                    className="pointer-events-auto mt-6 border border-cell-border px-4 py-2.5 text-[12px] uppercase tracking-[0.12em] text-fg transition-colors hover:border-cell-hover hover:bg-fg/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
                    onClick={(e) => {
                      e.preventDefault()
                      beginExplosion()
                    }}
                  >
                    Start shooter
                  </button>
                </motion.div>
              )}

              {uiPhase === 'end' && (
                <motion.div
                  key="end"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-auto flex w-full flex-col items-start gap-4 px-2 text-left"
                >
                  <div>
                    <p className="text-lg font-medium text-fg md:text-xl">
                      Score: {score}
                    </p>
                    <p className="mt-1 text-[11px] text-fg/70 md:text-xs">
                      Codename: {codename}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="border border-cell-border px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-fg transition-colors hover:border-cell-hover hover:bg-fg/5"
                    onClick={tryAgain}
                  >
                    Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto flex w-full items-end justify-between gap-2 text-[10px] text-fg/70">
            <div className="max-w-[58%] text-fg/50">
              <div className="text-fg/65">High scores:</div>
              <div className="tabular-nums leading-relaxed">23 • Lockdown</div>
              <div className="tabular-nums leading-relaxed">17 • Sniper</div>
              <div className="tabular-nums leading-relaxed">8 • Cool guy</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-medium tabular-nums leading-none text-fg md:text-3xl">
                {score}
              </div>
              <div className="mt-0.5 uppercase tracking-[0.1em] text-fg/55">
                Targets hit
              </div>
              {combatHud && combo >= 2 && (
                <motion.div
                  key={combo}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-1 text-[10px] text-fg/80"
                >
                  ×{combo} combo
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Local crosshair (shooting mode only) */}
      {combatHud && (
        <div
          className="pointer-events-none absolute z-30"
          style={{
            left: crosshair.x,
            top: crosshair.y,
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden
        >
          <div className="relative h-5 w-5">
            <div className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-fg" />
            <div className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-fg" />
            <div className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-fg" />
            <div className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-fg" />
          </div>
        </div>
      )}
    </div>
  )
}
