import { AnimatePresence, motion } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { useHudShooterGame } from '../contexts/useHudShooterGame'
import {
  ADJECTIVES,
  ADJECTIVES_SHORT,
  NOUNS,
  NOUNS_SHORT,
} from '../data/codenameWords'
import {
  fetchLeaderboardTop,
  LEADERBOARD_DISPLAY_LIMIT,
  loadLocalLeaderboard,
  submitLeaderboardEntry,
  topLeaderboardEntries,
  type HighScoreEntry,
} from '../lib/leaderboard'
import { HudGraphic, type HudCellTrack } from './HudGraphic'

export type { HighScoreEntry } from '../lib/leaderboard'

// --- Word pool (game targets) ---

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

const IDLE_GREETINGS = [
  'Hello, my name is Dez.\nI like to dream and create.',
  "Hey, I'm Dez.\nI thrive in ambiguity.",
  "Hola, I'm Dez.\nI turn chaos into structure.",
  "Ciao, I'm Dez.\nI obsess over design systems.",
  "Greetings, I'm Dez.\nI run design workshops.",
  "Salutations, I'm Dez.\nI prototype before debating.",
  "Good evening, I'm Dez.\nI ship fast and fix things.",
  "Good day, I'm Dez.\nI simplify complex workflows.",
  "Welcome, I'm Dez.\nI design for real operations.",
  "Ahoy, I'm Dez.\nI build with engineers in mind.",
  "Bonjour, I'm Dez.\nI question assumptions.",
  "Hey there, I'm Dez.\nI turn ideas into product.",
] as const

const TYPEWRITER_TYPE_MS = 36
const TYPEWRITER_HOLD_MS = 2900
const TYPEWRITER_DELETE_MS = 20
const TYPEWRITER_GAP_MS = 450

const SHOOT_HINT_FADE_S = 0.35
const SHOOT_HINT_READ_MS = 3000

/** Only mounted while `uiPhase === 'idle'` so leaving idle unmounts and clears without effect setState. */
function IdleGreetingTypewriter({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>
}) {
  const [text, setText] = useState('')

  /** rAF-driven (not `setTimeout`) so typing keeps cadence while the browser is busy scrolling. */
  useEffect(() => {
    let raf = 0
    let cancelled = false
    let lineIdx = 0
    let charCount = 0
    let phase: 'typing' | 'hold' | 'deleting' = 'typing'
    let nextActionAt = 0

    const tick = (now: number) => {
      if (cancelled) return
      raf = requestAnimationFrame(tick)
      if (now < nextActionAt) return

      const full = IDLE_GREETINGS[lineIdx]!

      if (phase === 'typing') {
        if (charCount < full.length) {
          charCount += 1
          setText(full.slice(0, charCount))
          nextActionAt = now + TYPEWRITER_TYPE_MS
        } else {
          phase = 'hold'
          nextActionAt = now + TYPEWRITER_HOLD_MS
        }
      } else if (phase === 'hold') {
        phase = 'deleting'
        nextActionAt = now + TYPEWRITER_DELETE_MS
      } else if (charCount > 0) {
        charCount -= 1
        setText(full.slice(0, charCount))
        nextActionAt = now + TYPEWRITER_DELETE_MS
      } else {
        lineIdx = (lineIdx + 1) % IDLE_GREETINGS.length
        phase = 'typing'
        nextActionAt = now + TYPEWRITER_GAP_MS
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={containerRef}>
      <p className="max-w-full whitespace-pre-line text-[2.4rem] font-medium leading-[1.15] text-fg max-lg:tracking-tight sm:text-[2.6rem] md:max-lg:text-[2.9rem] lg:text-[3rem] port-xl:text-[3.25rem]">
        {text}
        <span
          className="ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.08em] animate-pulse bg-fg align-middle"
          aria-hidden
        />
      </p>
    </div>
  )
}

const LAST_TARGETS_HIT_KEY = 'dezc-hud-last-targets-hit-v1'

function loadLastTargetsHit(): number | null {
  try {
    const raw = localStorage.getItem(LAST_TARGETS_HIT_KEY)
    if (raw == null || raw === '') return null
    const n = Number(raw)
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null
  } catch {
    return null
  }
}

function persistLastTargetsHit(n: number) {
  try {
    localStorage.setItem(LAST_TARGETS_HIT_KEY, String(n))
  } catch {
    /* ignore quota */
  }
}

const TAG_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/** Three chars from base-36; one position is always 0–9 so the tag never reads as three letters. */
function randomTag3(): string {
  const b = new Uint8Array(4)
  crypto.getRandomValues(b)
  const pos = b[0]! % 3
  const digit = TAG_CHARS[b[1]! % 10]!
  const out: [string, string, string] = ['', '', '']
  out[pos] = digit
  let o = 0
  for (let i = 0; i < 3; i++) {
    if (i === pos) continue
    out[i] = TAG_CHARS[b[2 + o]! % 36]!
    o += 1
  }
  return out[0]! + out[1]! + out[2]!
}

/** Adjective + noun + short random tag (each word ≤ {@link CODENAME_WORD_MAX_LEN} in pools). */
function generateUniqueCodename(): string {
  const adjPool = ADJECTIVES_SHORT.length > 0 ? ADJECTIVES_SHORT : ADJECTIVES
  const nounPool = NOUNS_SHORT.length > 0 ? NOUNS_SHORT : NOUNS
  const a = adjPool[Math.floor(Math.random() * adjPool.length)]!
  const n = nounPool[Math.floor(Math.random() * nounPool.length)]!
  return `${a} ${n} · ${randomTag3()}`
}

function pickRoleWord(): string {
  return ROLE_WORDS[Math.floor(Math.random() * ROLE_WORDS.length)]
}

// --- Game / canvas types (logic layer) ---

type Phase = 'idle' | 'explode' | 'game' | 'winddown' | 'end'

type WordBite = { lx: number; ly: number; r: number; jagSeed: number }

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

type LaserBolt = {
  sx: number
  sy: number
  tx: number
  ty: number
  t0: number
  durationMs: number
}

const LASER_SPEED_PX_S = 2600
const LASER_DURATION_MIN_MS = 70
const LASER_DURATION_MAX_MS = 320
/** Tight AABB around glyph + small padding (local / rotated with word). */
const WORD_BOX_PAD_X = 12
const WORD_BOX_PAD_Y = 10

const GAME_DURATION_MS = 26_000
const MAX_WORDS = 13
const MAX_PARTICLES = 960
const EXPLODE_MS = 880
/**
 * Shrink world-space words on narrow playfields. `refW` sets how fast we approach full size.
 * `min` = hard floor (after all factors). `remPx` from root for zoom.
 *
 * When playfield is narrower than `COMPACT_CUTOFF_REM`, an extra downscale (see `COMPACT_SIZE_MUL`) is
 * applied — wide hero cells (≥ ~52rem) keep the pre-compact size.
 */
const GAME_WORD_REF_WIDTH_REM = 72
const GAME_WORD_LAYOUT_MIN = 0.15
/** Playfield `cw` at/below this (× root rem) uses the compact downscale. */
const GAME_WORD_COMPACT_CUTOFF_REM = 52
/** Only under compact width; another 25% down from 2.8125 (×0.75); clamped to 1. */
const GAME_WORD_COMPACT_SIZE_MUL = 2.109375

function gameWordLayoutScale(cw: number, remPx: number) {
  const refW = GAME_WORD_REF_WIDTH_REM * remPx
  if (refW < 1) return 1
  let s = Math.min(1, cw / refW)
  s = Math.max(GAME_WORD_LAYOUT_MIN, s)
  if (cw < GAME_WORD_COMPACT_CUTOFF_REM * remPx) {
    s = Math.max(GAME_WORD_LAYOUT_MIN, Math.min(1, s * GAME_WORD_COMPACT_SIZE_MUL))
  }
  return s
}

/** Canvas text size (CSS px); thinnest weight. Scaled 3× for readability + hit feel, then by layout. */
function wordFontSize(wScale: number, layout: number) {
  return (6.5 + wScale * 14) * 3 * layout
}
const WORD_FONT = (fs: number) => `100 ${fs}px "Space Mono", monospace`
const COMBO_WINDOW_MS = 720
const WINDDOWN_MAX_MS = 4500
/** Hits before the word fully explodes (5th hit clears it). */
const WORD_MAX_HEALTH = 5
/** Uniform pacing — not tied to player accuracy */
const SPAWN_INTERVAL_SEC = 0.68
const WORD_SPEED = 210
const WORD_SCALE_RATE = 0.5
/** Cap `TargetWord.scale` so glyphs stay readable (see `wordFontSize`). */
const WORD_SCALE_MAX = 0.92
const WHIMSY_LATERAL = 155
const WHIMSY_PHASE_SPEED = 1.15
const WORD_SPIN_MAX = 0.55

/** Per-run motion tuning so each game’s drift / swirl feels different (set when `game` starts). */
type GameMotionProfile = {
  whimsyLateral: number
  whimsyPhaseSpeed: number
  outward: number
  loopMul: number
  vCap: number
  spawnIntervalMul: number
}

const DEFAULT_GAME_MOTION: GameMotionProfile = {
  whimsyLateral: WHIMSY_LATERAL,
  whimsyPhaseSpeed: WHIMSY_PHASE_SPEED,
  outward: 22,
  loopMul: 0.42,
  vCap: 360,
  spawnIntervalMul: 1,
}

function rollGameMotionProfile(): GameMotionProfile {
  return {
    whimsyLateral: 78 + Math.random() * 165,
    whimsyPhaseSpeed: 0.68 + Math.random() * 1.12,
    outward: 9 + Math.random() * 30,
    loopMul: 0.18 + Math.random() * 0.42,
    vCap: 275 + Math.random() * 125,
    spawnIntervalMul: 0.78 + Math.random() * 0.4,
  }
}

/**
 * Randomized spawn so runs differ: edge fly-ins, center burst, or corner sweeps.
 */
function spawnTargetWord(cw: number, ch: number, id: number): TargetWord {
  const sp = WORD_SPEED + (Math.random() - 0.5) * 56
  const spinRate =
    (Math.random() < 0.5 ? -1 : 1) * (0.1 + Math.random() * WORD_SPIN_MAX)
  const m = 52 + Math.random() * 28

  const mode = Math.random()
  let x: number
  let y: number
  let vx: number
  let vy: number

  if (mode < 0.4) {
    const edge = Math.floor(Math.random() * 4)
    if (edge === 0) {
      x = m + Math.random() * Math.max(8, cw - 2 * m)
      y = -m
      vx = (Math.random() - 0.5) * 220
      vy = sp * (0.48 + Math.random() * 0.85)
    } else if (edge === 1) {
      x = cw + m
      y = m + Math.random() * Math.max(8, ch - 2 * m)
      vx = -sp * (0.48 + Math.random() * 0.85)
      vy = (Math.random() - 0.5) * 220
    } else if (edge === 2) {
      x = m + Math.random() * Math.max(8, cw - 2 * m)
      y = ch + m
      vx = (Math.random() - 0.5) * 220
      vy = -sp * (0.48 + Math.random() * 0.85)
    } else {
      x = -m
      y = m + Math.random() * Math.max(8, ch - 2 * m)
      vx = sp * (0.48 + Math.random() * 0.85)
      vy = (Math.random() - 0.5) * 220
    }
  } else if (mode < 0.68) {
    const angle = Math.random() * Math.PI * 2
    const spread = 10 + Math.random() * 58
    x = cw / 2 + Math.cos(angle) * spread
    y = ch / 2 + Math.sin(angle) * spread
    vx = Math.cos(angle) * sp
    vy = Math.sin(angle) * sp
  } else {
    const left = Math.random() < 0.5
    const top = Math.random() < 0.5
    x = left ? m * 0.35 + Math.random() * cw * 0.18 : cw - m * 0.35 - Math.random() * cw * 0.18
    y = top ? m * 0.35 + Math.random() * ch * 0.18 : ch - m * 0.35 - Math.random() * ch * 0.18
    const tdx = cw / 2 - x + (Math.random() - 0.5) * cw * 0.42
    const tdy = ch / 2 - y + (Math.random() - 0.5) * ch * 0.42
    const len = Math.hypot(tdx, tdy) || 1
    const jitter = 0.72 + Math.random() * 0.38
    vx = (tdx / len) * sp * jitter
    vy = (tdy / len) * sp * jitter
  }

  return {
    id,
    text: pickRoleWord(),
    x,
    y,
    scale: 0.14 + Math.random() * 0.05,
    opacity: 0,
    vx,
    vy,
    speed: WORD_SCALE_RATE,
    hitFlash: 0,
    jitterT: 0,
    health: WORD_MAX_HEALTH,
    angle: (Math.random() - 0.5) * 0.52,
    spinRate,
    wanderPhase: Math.random() * Math.PI * 2,
    wanderFreq: 0.48 + Math.random() * 1.72,
    bites: [],
  }
}

const STAR_COUNT = 175

type BackgroundStar = {
  x: number
  y: number
  tw: number
  tws: number
  sz: number
}

/** Short streak across the starfield; head moves in (ux,uy), trail length in px. */
type ShootingStar = {
  x: number
  y: number
  ux: number
  uy: number
  speed: number
  trail: number
}

const SHOOTING_SPAWN_MIN_MS = 2200
const SHOOTING_SPAWN_JITTER_MS = 1800
const SHOOTING_MAX_STREAKS = 2

function pushShootingStar(w: number, h: number, out: ShootingStar[]) {
  if (out.length >= SHOOTING_MAX_STREAKS) return
  const margin = 48 + Math.random() * 40
  const edge = Math.floor(Math.random() * 4)
  let x: number
  let y: number
  if (edge === 0) {
    x = Math.random() * w
    y = -margin
  } else if (edge === 1) {
    x = w + margin
    y = Math.random() * h
  } else if (edge === 2) {
    x = Math.random() * w
    y = h + margin
  } else {
    x = -margin
    y = Math.random() * h
  }
  const tx = w * (0.1 + Math.random() * 0.8)
  const ty = h * (0.1 + Math.random() * 0.8)
  const dx = tx - x
  const dy = ty - y
  const len = Math.hypot(dx, dy) || 1
  out.push({
    x,
    y,
    ux: dx / len,
    uy: dy / len,
    speed: 240 + Math.random() * 260,
    trail: 42 + Math.random() * 100,
  })
}

function drawShootingStreak(
  ctx: CanvasRenderingContext2D,
  s: ShootingStar,
  fg: string,
  warp: boolean,
) {
  const hx = s.x
  const hy = s.y
  const tx = hx - s.ux * s.trail
  const ty = hy - s.uy * s.trail
  const g = ctx.createLinearGradient(tx, ty, hx, hy)
  g.addColorStop(0, 'rgba(255,255,255,0)')
  g.addColorStop(0.45, hudHexToRgba(fg, warp ? 0.22 : 0.32))
  g.addColorStop(1, hudHexToRgba(fg, warp ? 0.75 : 0.95))
  ctx.save()
  ctx.strokeStyle = g
  ctx.lineWidth = warp ? 1.1 : 1.25
  ctx.lineCap = 'round'
  ctx.shadowColor = hudHexToRgba(fg, 0.55)
  ctx.shadowBlur = warp ? 6 : 10
  ctx.beginPath()
  ctx.moveTo(tx, ty)
  ctx.lineTo(hx, hy)
  ctx.stroke()
  ctx.shadowBlur = 0
  ctx.fillStyle = hudHexToRgba(fg, 0.95)
  ctx.beginPath()
  ctx.arc(hx, hy, warp ? 0.85 : 1.05, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
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

function jagHash01(a: number, b: number) {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/** Irregular “crunch” hole instead of a smooth circle. */
function fillJaggedBiteHole(
  ctx: CanvasRenderingContext2D,
  lx: number,
  ly: number,
  r: number,
  jagSeed: number,
) {
  const verts = 9 + Math.floor(jagHash01(jagSeed, 1) * 4)
  ctx.beginPath()
  for (let i = 0; i < verts; i++) {
    const t = i / verts
    const ang = t * Math.PI * 2 + jagSeed * 1.17
    const wobble = 0.52 + 0.48 * jagHash01(jagSeed + i * 0.31, t * 6.2)
    const rad = r * wobble
    const px = lx + Math.cos(ang) * rad
    const py = ly + Math.sin(ang) * rad
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
}

function hudHexToRgba(hex: string, a: number): string {
  let h = hex.trim()
  if (h.startsWith('#')) h = h.slice(1)
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  }
  if (h.length !== 6) return `rgba(255,255,255,${a})`
  const n = parseInt(h, 16)
  if (Number.isNaN(n)) return `rgba(255,255,255,${a})`
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r},${g},${b},${a})`
}

function drawLasers(
  ctx: CanvasRenderingContext2D,
  lasers: LaserBolt[],
  now: number,
  hudHex: string,
) {
  const core = hudHex.trim() || '#ffffff'
  for (const L of lasers) {
    const u = clamp((now - L.t0) / L.durationMs, 0, 1)
    const hx = lerp(L.sx, L.tx, u)
    const hy = lerp(L.sy, L.ty, u)
    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = hudHexToRgba(core, 0.95)
    const layers: [number, string, number][] = [
      [14, hudHexToRgba(core, 0.35), 22],
      [5, hudHexToRgba(core, 0.75), 14],
      [2, core.startsWith('#') ? core : `#${core}`, 6],
    ]
    for (const [lw, stroke, blur] of layers) {
      ctx.beginPath()
      ctx.moveTo(L.sx, L.sy)
      ctx.lineTo(hx, hy)
      ctx.strokeStyle = stroke
      ctx.lineWidth = lw
      ctx.shadowBlur = blur
      ctx.stroke()
    }
    ctx.restore()
  }
}

// --- Rendering helpers (canvas) ---

/** Shared hit + outline box: measured text + tight padding. */
function getWordHitExtents(
  ctx: CanvasRenderingContext2D,
  w: TargetWord,
  layout: number,
): { halfW: number; halfH: number } {
  const fs = wordFontSize(w.scale, layout)
  ctx.font = WORD_FONT(fs)
  const m = ctx.measureText(w.text)
  const tw = m.width
  const asc = m.actualBoundingBoxAscent ?? fs * 0.72
  const desc = m.actualBoundingBoxDescent ?? fs * 0.28
  const px = WORD_BOX_PAD_X * layout
  const py = WORD_BOX_PAD_Y * layout
  return {
    halfW: tw / 2 + px,
    halfH: (asc + desc) / 2 + py,
  }
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
  layout: number,
): TargetWord | null {
  const sorted = [...words].sort((a, b) => b.scale - a.scale)
  for (const w of sorted) {
    const { halfW, halfH } = getWordHitExtents(ctx, w, layout)
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
  layout: number,
) {
  for (const w of words) {
    const fs = wordFontSize(w.scale, layout)
    ctx.save()
    let a = w.opacity
    if (w.hitFlash > 0) a = clamp(w.opacity + w.hitFlash * 0.35, 0, 1)
    ctx.globalAlpha = clamp(a, 0, 1)
    const jitter =
      w.jitterT > 0 ? Math.sin(w.jitterT * 90) * (w.jitterT * 2.2) : 0
    ctx.translate(w.x + jitter, w.y)
    ctx.rotate(w.angle)
    ctx.font = WORD_FONT(fs)
    const { halfW, halfH } = getWordHitExtents(ctx, w, layout)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = fg
    ctx.globalAlpha = clamp(a, 0, 1)
    ctx.fillText(w.text, 0, 0)

    if (w.bites.length > 0) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = '#000'
      for (const b of w.bites) {
        fillJaggedBiteHole(ctx, b.lx, b.ly, b.r, b.jagSeed)
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    ctx.strokeStyle = fg
    ctx.lineWidth = 1
    ctx.globalAlpha = clamp(a * 0.32, 0, 0.45)
    ctx.strokeRect(-halfW, -halfH, halfW * 2, halfH * 2)
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

/** Every successful hit — big radial burst at impact. */
function spawnHitExplosion(
  parts: FxParticle[],
  x: number,
  y: number,
  cap: number,
) {
  const room = cap - parts.length
  const budget = Math.min(175, room)
  for (let i = 0; i < budget; i++) {
    const ang = Math.random() * Math.PI * 2
    const sp = 220 + Math.random() * 640
    parts.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      life: 0.5 + Math.random() * 0.55,
      maxLife: 0.62 + Math.random() * 0.58,
      size: 2.2 + Math.random() * 6.5,
    })
  }
  const slow = Math.min(90, cap - parts.length)
  for (let i = 0; i < slow; i++) {
    const ang = Math.random() * Math.PI * 2
    const sp = 80 + Math.random() * 220
    parts.push({
      x,
      y,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      life: 0.65 + Math.random() * 0.75,
      maxLife: 0.85 + Math.random() * 0.7,
      size: 3 + Math.random() * 7,
    })
  }
}

/** Word fully cleared — extra finale burst at its center. */
function spawnWordDestroyExplosion(
  parts: FxParticle[],
  x: number,
  y: number,
  cap: number,
) {
  const budget = Math.min(240, cap - parts.length)
  for (let i = 0; i < budget; i++) {
    const ang = Math.random() * Math.PI * 2
    const sp = 160 + Math.random() * 520
    parts.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 16,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      life: 0.55 + Math.random() * 0.65,
      maxLife: 0.7 + Math.random() * 0.65,
      size: 2.5 + Math.random() * 7,
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
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const nextShootingAtRef = useRef(0)
  const starfieldWarpRef = useRef(false)
  const idleTextRef = useRef<HTMLDivElement>(null)

  const phaseRef = useRef<Phase>('idle')
  const wordsRef = useRef<TargetWord[]>([])
  const particlesRef = useRef<FxParticle[]>([])
  const lasersRef = useRef<LaserBolt[]>([])
  const nextWordId = useRef(0)
  const spawnAccRef = useRef(0)
  const gameT0Ref = useRef(0)
  const explodeT0Ref = useRef(0)
  const winddownT0Ref = useRef(0)
  const rafRef = useRef<number>(0)
  const dprRef = useRef(1)
  const sizeRef = useRef({ w: 1, h: 1 })
  /** Rem-anchored: canvas word + hit target scale vs playfield (narrow = smaller, harder to camp). */
  const gameWordLayoutScaleRef = useRef(1)
  const hudTrackRef = useRef<HudCellTrack>({
    active: false,
    x: 0,
    y: 0,
    w: 1,
    h: 1,
  })
  const lastHitRef = useRef(0)
  const comboRef = useRef(0)
  const scoreRef = useRef(0)
  const codenameRef = useRef('')
  /** One UUID per run — sent with leaderboard submit to block duplicate POSTs for the same game. */
  const gameSessionIdRef = useRef('')

  const [codename, setCodename] = useState(() => generateUniqueCodename())
  const [uiPhase, setUiPhase] = useState<'idle' | 'game' | 'end'>('idle')
  /** True only during active shooting (after explosion), not during explode phase */
  const [combatHud, setCombatHud] = useState(false)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [highScores, setHighScores] = useState<HighScoreEntry[]>(() =>
    topLeaderboardEntries(loadLocalLeaderboard(), LEADERBOARD_DISPLAY_LIMIT),
  )
  /** 1-based global rank after the latest completed run (server) or offline merge. */
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null)
  const [finalRunScore, setFinalRunScore] = useState(0)
  const [finalRunCodename, setFinalRunCodename] = useState('')
  /** Set after a run fully completes; null = never finished a game this browser */
  const [lastTargetsHit, setLastTargetsHit] = useState<number | null>(() =>
    loadLastTargetsHit(),
  )
  /** Short-lived center hint after “Start game” (fades in, shows ~3s, fades out). */
  const [shootHintShow, setShootHintShow] = useState(false)
  const enteredGameRef = useRef(false)
  const gameMotionProfileRef = useRef<GameMotionProfile>(DEFAULT_GAME_MOTION)

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    codenameRef.current = codename
  }, [codename])

  useEffect(() => {
    let cancelled = false
    void fetchLeaderboardTop().then((rows) => {
      if (!cancelled) setHighScores(rows)
    })
    return () => {
      cancelled = true
    }
  }, [])

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

  useEffect(() => {
    if (uiPhase !== 'game') {
      queueMicrotask(() => setShootHintShow(false))
      return
    }
    queueMicrotask(() => setShootHintShow(true))
    const t = window.setTimeout(() => {
      setShootHintShow(false)
    }, Math.round(1000 * SHOOT_HINT_FADE_S) + SHOOT_HINT_READ_MS)
    return () => {
      window.clearTimeout(t)
    }
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
    try {
      gameSessionIdRef.current =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `run-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    } catch {
      gameSessionIdRef.current = `run-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    }
    setCombatHud(false)
    phaseRef.current = 'explode'
    explodeT0Ref.current = performance.now()
    syncHudActive()
    setUiPhase('game')
    particlesRef.current = []
    lasersRef.current = []
    spawnGreetingExplosion(particlesRef.current, ox, oy, MAX_PARTICLES)
  }, [syncHudActive])

  const resetRun = useCallback(() => {
    phaseRef.current = 'idle'
    wordsRef.current = []
    particlesRef.current = []
    lasersRef.current = []
    spawnAccRef.current = 0
    gameT0Ref.current = 0
    nextWordId.current = 0
    setScore(0)
    setCombo(0)
    comboRef.current = 0
    lastHitRef.current = 0
    setCodename(generateUniqueCodename())
    setLeaderboardRank(null)
    setUiPhase('idle')
    setCombatHud(false)
    enteredGameRef.current = false
    syncHudActive()
  }, [syncHudActive])

  const tryAgain = useCallback(() => {
    resetRun()
  }, [resetRun])

  const exitToIdle = useCallback(() => {
    const ph = phaseRef.current
    const shouldSubmitToLeaderboard =
      (ph === 'game' || ph === 'winddown') && scoreRef.current > 0

    if (shouldSubmitToLeaderboard) {
      const fs = scoreRef.current
      const fn = codenameRef.current
      const sid = gameSessionIdRef.current
      void (async () => {
        const submitResult = await submitLeaderboardEntry(fs, fn, sid)
        setLeaderboardRank(submitResult.rank)
        const latest = await fetchLeaderboardTop()
        setHighScores(latest)
        persistLastTargetsHit(fs)
        setLastTargetsHit(fs)
        setCodename(generateUniqueCodename())
      })()
    }

    phaseRef.current = 'idle'
    wordsRef.current = []
    particlesRef.current = []
    lasersRef.current = []
    spawnAccRef.current = 0
    gameT0Ref.current = 0
    nextWordId.current = 0
    setScore(0)
    scoreRef.current = 0
    setCombo(0)
    comboRef.current = 0
    lastHitRef.current = 0
    if (!shouldSubmitToLeaderboard) {
      setLeaderboardRank(null)
    }
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
      const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      gameWordLayoutScaleRef.current = gameWordLayoutScale(w, remPx)
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
        shootingStarsRef.current.length = 0
        nextShootingAtRef.current = 0
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Starfield: twinkle when idle/end; radial “warp” while uiPhase === 'game'; shooting stars ~3s
  useEffect(() => {
    const canvas = starsCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reducedStarMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let last = performance.now()
    let fgCached = '#fafafa'
    let lastFgSample = 0
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
      if (now - lastFgSample > 900) {
        lastFgSample = now
        fgCached =
          getComputedStyle(document.documentElement).getPropertyValue('--color-fg').trim() ||
          '#fafafa'
      }
      const fg = fgCached
      const cx = w / 2
      const cy = h / 2
      const stars = starsRef.current
      if (stars.length === 0) return

      for (const s of stars) {
        if (warp) {
          const dx = s.x - cx
          const dy = s.y - cy
          const dist = Math.hypot(dx, dy) + 0.001
          const rush = (165 + dist * 0.62) / 15
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

      if (!reducedStarMotion) {
        if (nextShootingAtRef.current === 0) {
          nextShootingAtRef.current = now + 600 + Math.random() * 1400
        }
        if (now >= nextShootingAtRef.current) {
          pushShootingStar(w, h, shootingStarsRef.current)
          nextShootingAtRef.current =
            now + SHOOTING_SPAWN_MIN_MS + Math.random() * SHOOTING_SPAWN_JITTER_MS
        }
        const shots = shootingStarsRef.current
        for (let i = shots.length - 1; i >= 0; i--) {
          const st = shots[i]!
          st.x += st.ux * st.speed * dt
          st.y += st.uy * st.speed * dt
          const oob = st.x < -200 || st.x > w + 200 || st.y < -200 || st.y > h + 200
          if (oob) shots.splice(i, 1)
        }
        ctx.globalAlpha = 1
        for (const st of shots) {
          drawShootingStreak(ctx, st, fg, warp)
        }
      }
      ctx.globalAlpha = 1
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Pointer: HUD cell track (1:1 follow while shooting; global CustomCursor shows reticle)
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
      const layout = gameWordLayoutScaleRef.current

      const root = document.documentElement
      const cs = getComputedStyle(root)
      const fg = cs.getPropertyValue('--color-fg').trim() || '#fafafa'
      const hud =
        cs.getPropertyValue('--color-hud').trim() || '#ffffff'

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cw, ch)

      // Explosion → game
      if (phaseRef.current === 'explode') {
        if (now - explodeT0Ref.current >= EXPLODE_MS) {
          phaseRef.current = 'game'
          gameT0Ref.current = now
          spawnAccRef.current = 0
          gameMotionProfileRef.current = rollGameMotionProfile()
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
      const lasers = lasersRef.current

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

      // Lasers: resolve hit when bolt reaches aim point
      for (let i = lasers.length - 1; i >= 0; i--) {
        const L = lasers[i]
        if (now - L.t0 < L.durationMs) continue
        const mx = L.tx
        const my = L.ty
        const list = wordsRef.current
        const hit = hitTestWords(ctx, list, mx, my, layout)
        if (hit) {
          const idx = list.findIndex((w) => w.id === hit.id)
          if (idx >= 0) {
            const w = list[idx]
            const fs = wordFontSize(w.scale, layout)
            const { lx, ly } = worldToLocal(mx, my, w.x, w.y, w.angle)
            const holeCount = 2 + Math.floor(Math.random() * 2)
            const scatter = fs * 0.22
            for (let h = 0; h < holeCount; h++) {
              const ox = (Math.random() - 0.5) * scatter
              const oy = (Math.random() - 0.5) * scatter * 1.05
              const biteR = Math.max(8, fs * (0.14 + Math.random() * 0.12))
              w.bites.push({
                lx: lx + ox,
                ly: ly + oy,
                r: biteR,
                jagSeed: Math.random() * 4000 + h * 31.17,
              })
            }
            w.health -= 1
            w.hitFlash = 1
            w.jitterT = 0.18

            spawnHitExplosion(particlesRef.current, mx, my, MAX_PARTICLES)

            if (w.health <= 0) {
              spawnWordDestroyExplosion(
                particlesRef.current,
                w.x,
                w.y,
                MAX_PARTICLES,
              )
              list.splice(idx, 1)
            }

            const tnow = now
            if (tnow - lastHitRef.current < COMBO_WINDOW_MS) {
              comboRef.current += 1
            } else {
              comboRef.current = 1
            }
            lastHitRef.current = tnow
            setCombo(comboRef.current)
            setScore((s) => {
              const n = s + 1
              scoreRef.current = n
              return n
            })
          }
        }
        lasers.splice(i, 1)
      }

      const gameElapsed =
        ph === 'game' || ph === 'winddown'
          ? now - gameT0Ref.current
          : 0
      const timeT = clamp(gameElapsed / GAME_DURATION_MS, 0, 1)
      const mot = gameMotionProfileRef.current
      const spawnInterval =
        lerp(SPAWN_INTERVAL_SEC, SPAWN_INTERVAL_SEC * 0.55, timeT) *
        mot.spawnIntervalMul

      // Spawn (game only) — entry path + drift come from `spawnTargetWord` + per-run `mot`
      if (ph === 'game' && words.length < MAX_WORDS) {
        spawnAccRef.current += dt
        while (
          spawnAccRef.current >= spawnInterval &&
          words.length < MAX_WORDS
        ) {
          spawnAccRef.current -= spawnInterval
          const id = nextWordId.current++
          words.push(spawnTargetWord(cw, ch, id))
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
          word.scale = Math.min(
            word.scale + word.speed * dt,
            WORD_SCALE_MAX,
          )
          word.angle += word.spinRate * dt

          word.wanderPhase += mot.whimsyPhaseSpeed * dt
          const vm = Math.hypot(word.vx, word.vy) || 1
          const px = -word.vy / vm
          const py = word.vx / vm
          const wobble =
            mot.whimsyLateral *
            Math.sin(word.wanderPhase * word.wanderFreq + word.id * 0.37)
          word.vx += px * wobble * dt
          word.vy += py * wobble * dt

          const cx = cw / 2
          const cy = ch / 2
          const ox = word.x - cx
          const oy = word.y - cy
          const dist = Math.hypot(ox, oy) + 12
          const outward = mot.outward
          word.vx += (ox / dist) * outward * dt
          word.vy += (oy / dist) * outward * dt

          const loop =
            mot.whimsyLateral *
            mot.loopMul *
            Math.cos(word.wanderPhase * word.wanderFreq * 0.72 + word.id)
          word.vx += (-oy / dist) * loop * dt
          word.vy += (ox / dist) * loop * dt

          const vMag = Math.hypot(word.vx, word.vy)
          const vCap = mot.vCap
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

      // Winddown → end (leaderboard + next codename in background)
      if (phaseRef.current === 'winddown') {
        if (
          words.length === 0 ||
          now - winddownT0Ref.current > WINDDOWN_MAX_MS
        ) {
          const fs = scoreRef.current
          const fn = codenameRef.current
          phaseRef.current = 'end'
          wordsRef.current = []
          lasersRef.current = []
          setActive(false)
          setCombatHud(false)
          setFinalRunScore(fs)
          setFinalRunCodename(fn)
          setUiPhase('end')
          void (async () => {
            const sid = gameSessionIdRef.current
            const submitResult = await submitLeaderboardEntry(fs, fn, sid)
            setLeaderboardRank(submitResult.rank)
            const latest = await fetchLeaderboardTop()
            setHighScores(latest)
            persistLastTargetsHit(fs)
            setLastTargetsHit(fs)
            setCodename(generateUniqueCodename())
          })()
        }
      }

      drawParticles(ctx, parts, fg)
      drawWords(ctx, words, fg, layout)
      drawLasers(ctx, lasers, now, hud)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [setActive, syncHudActive, setCombo, setScore])

  const onCanvasPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const phase = phaseRef.current
      if (phase !== 'game' && phase !== 'winddown') return

      const el = containerRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const mx = e.clientX - r.left
      const my = e.clientY - r.top

      const { h: ch } = sizeRef.current
      const sx = mx
      const sy = ch - 18
      const dist = Math.hypot(mx - sx, my - sy) || 1
      const durationMs = clamp(
        (dist / LASER_SPEED_PX_S) * 1000,
        LASER_DURATION_MIN_MS,
        LASER_DURATION_MAX_MS,
      )
      lasersRef.current.push({
        sx,
        sy,
        tx: mx,
        ty: my,
        t0: performance.now(),
        durationMs,
      })
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
      <div className="pointer-events-none absolute inset-0 z-20 flex min-h-0 flex-col p-2 max-lg:p-2.5 sm:max-lg:p-3 lg:max-[1439px]:p-3.5 port-xl:p-5">
        <div className="flex shrink-0 items-start justify-between gap-2 max-lg:gap-2.5 sm:max-lg:gap-3 port-xl:gap-3">
          <div className="min-w-0" style={{ fontSize: '10px' }}>
            <div className="mb-1 font-normal normal-case tracking-[0.08em] text-fg/60">
              Introduction / Mini-game
            </div>
            <div className="uppercase tracking-[0.14em] text-fg/75">
              YOUR CODENAME:{' '}
              {(uiPhase === 'end' ? finalRunCodename : codename).toUpperCase()}
            </div>
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
                  <IdleGreetingTypewriter containerRef={idleTextRef} />
                  <span
                    className="quadrant-cell relative mt-6 inline-flex [--quadrant-chamfer:clamp(5px,0.9vmin,9px)]"
                  >
                    <button
                      type="button"
                      className="pointer-events-auto relative z-10 border-0 bg-transparent px-5 py-2.5 text-[12px] font-normal uppercase tracking-[0.12em] text-fg transition-colors duration-200 hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg"
                      onClick={(e) => {
                        e.preventDefault()
                        beginExplosion()
                      }}
                    >
                      Start game
                    </button>
                  </span>
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
                      Score: {finalRunScore}
                    </p>
                    <p className="mt-1 text-[11px] text-fg/70 md:text-xs">
                      Codename: {finalRunCodename}
                    </p>
                    {leaderboardRank != null && (
                      <p className="mt-1 text-[11px] font-medium text-fg/85 md:text-xs">
                        Global rank: #{leaderboardRank}
                      </p>
                    )}
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
            <div className="min-w-0 max-w-[58%] text-fg/50">
              <div className="text-fg/65">Global leaderboard:</div>
              {Array.from({ length: LEADERBOARD_DISPLAY_LIMIT }, (_, i) => {
                const e = highScores[i]
                const n = i + 1
                return (
                  <div
                    key={e ? e.id : `pad-${i}`}
                    className="tabular-nums leading-relaxed"
                  >
                    {e ? (
                      <>
                        <span className="text-white">{`#${n}`}</span>
                        <span>
                          {' '}
                          {e.codename.toUpperCase()} —{' '}
                        </span>
                        <span className="font-bold text-white">{e.score}</span>
                      </>
                    ) : (
                      '—'
                    )}
                  </div>
                )
              })}
            </div>
            <div className="text-right">
              <div className="text-2xl font-medium tabular-nums leading-none text-fg md:text-3xl">
                {uiPhase === 'idle'
                  ? lastTargetsHit == null
                    ? 0
                    : lastTargetsHit
                  : uiPhase === 'end'
                    ? finalRunScore
                    : score}
              </div>
              <div className="mt-0.5 uppercase tracking-[0.1em] text-fg/55">
                {uiPhase === 'idle' && lastTargetsHit != null
                  ? 'Targets hit last'
                  : 'Targets hit'}
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

      <AnimatePresence>
        {uiPhase === 'game' && shootHintShow && (
          <motion.div
            key="shoot-hint"
            role="status"
            aria-live="polite"
            className="pointer-events-none absolute inset-0 z-[30] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: SHOOT_HINT_FADE_S, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="max-w-[min(100%,20rem)] text-center text-sm font-medium leading-snug text-fg [text-shadow:0_0_1.5rem_rgb(0_0_0/0.85),0_0_0.25rem_rgb(0_0_0/0.4)] md:text-base">
              Click and shoot the flying words
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
