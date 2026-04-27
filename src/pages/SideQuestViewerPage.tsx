import { CaretLeft, CaretRight, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { MouseEvent, RefObject } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CaseStudiesCardModal } from '../components/CaseStudiesCardModal'
import { ThemeSwatches } from '../components/ThemeSwatches'
import {
  SIDEQUESTS,
  getSideQuestById,
  getSideQuestIndexById,
  isSideQuestVideoUrl,
  type SideQuestEntry,
} from '../data/sidequests'

/** Calm ease — main image crossfade (not the thumbnail rail) */
const MOTION_EASE = [0.25, 0.1, 0.25, 1] as const
const DURATION_IMAGE_S = 0.22

const CAROUSEL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const CAROUSEL_DURATION = 0.38

type RailOffset = -2 | -1 | 0 | 1 | 2

/** All tiles are laid out in a 40px box; `scale` shrinks the 24/16 look. Inset = half the max tile. */
const RAIL_TILE_MAX_PX = 40
const RAIL_HALF = RAIL_TILE_MAX_PX / 2
const RAIL_HIDDEN_NUDGE_PX = 28
const RAIL_OFFSCREEN_STEP_PX = 40
const RAIL_TOP = '50%'

function scaleForOffset(offset: -2 | -1 | 0 | 1 | 2): number {
  if (offset === 0) return 1
  if (offset === -1 || offset === 1) return 0.6
  return 0.4
}

const MAIN_IMAGE_ZOOM_MIN = 1
const MAIN_IMAGE_ZOOM_MAX = 3
const MAIN_IMAGE_ZOOM_STEP = 0.25

/** 1px hairlines — `border-cell-border` follows `html[data-theme]` (see index.css). */
const LINE = 'box-border border-solid [border-width:1px] border-cell-border'
const LINE_HOVER = 'hover:border-fg/32'
const LINE_SEL = 'box-border border-solid [border-width:1px] border-fg/42'
const LINE_HEADER_B = 'box-border border-solid [border-width:0_0_1px_0] border-b-cell-border'
/** Rail: bottom hairline only — top comes from `LINE_HEADER_B` (avoid 2px stack under header row) */
const LINE_RAIL_TB = 'box-border border-solid [border-width:0_0_1px_0] border-b-cell-border'

/**
 * Below lg: hero fills a tall, stable viewport band (document scroll — not a nested sticky pane).
 * 52vh → 58vh (sm) → 60vh (md), capped for very large tablets.
 */
const MOBILE_HERO_MIN_H_CLASSES =
  'max-lg:min-h-[clamp(420px,52vh,760px)] sm:max-lg:min-h-[clamp(420px,58vh,760px)] md:max-lg:min-h-[clamp(420px,60vh,760px)]'

const FOCUS_1 =
  'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-fg)_40%,transparent)]'

const mainImageZoomButtonClass = [
  'flex size-9 shrink-0 touch-manipulation select-none items-center justify-center rounded-[2px]',
  'font-mono font-normal',
  LINE,
  LINE_HOVER,
  FOCUS_1,
  'bg-elevated/90 text-fg/70 backdrop-blur-sm',
  'transition-[color,background-color,border-color,transform] duration-200 ease-out',
  'hover:bg-elevated hover:text-fg/90',
  'disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-elevated/90 disabled:hover:text-fg/70',
].join(' ')

const phosphorInChrome = { size: 24 as const, weight: 'regular' as const, className: 'shrink-0 text-current' as const }

/** Modifier+click on “Case studies” — same pattern as case study showcase pages. */
const CASE_STUDIES_NAV_MODIFIER_TO = '/case-study/components'
const caseStudiesNavButtonClass =
  'cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-inherit underline decoration-cell-border underline-offset-[3px] hover:decoration-hud'

const carouselArrowClass = [
  'flex size-[38px] shrink-0 touch-none select-none items-center justify-center rounded-[2px]',
  'font-mono font-normal',
  FOCUS_1,
  'border-0 bg-transparent text-fg/45',
  'transition-[color,opacity,transform] ease-out duration-200',
  'hover:scale-105 motion-reduce:hover:scale-100 hover:text-fg/72',
  'active:opacity-90 active:scale-100',
].join(' ')

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

/** Shortest signed offset on the ring: selectedIndex + d ≡ index (mod n). */
function signedOffsetFromSelected(selectedIndex: number, index: number, n: number): number {
  if (n <= 0) return 0
  let d = (index - selectedIndex) % n
  if (d > n / 2) d -= n
  if (d < -n / 2) d += n
  return d
}

type CarouselTarget = {
  left: string
  top: string
  x: number
  y: number
  scale: number
  opacity: number
  z: number
  pointer: boolean
  offset: RailOffset | null
}

function carouselTargetFor(selectedIndex: number, index: number, n: number): CarouselTarget {
  const d = signedOffsetFromSelected(selectedIndex, index, n)
  const y = -RAIL_HALF
  if (d >= -2 && d <= 2) {
    const o = d as RailOffset
    const i = o + 2
    const leftPct = (i + 0.5) * 20
    return {
      left: `${leftPct}%`,
      top: RAIL_TOP,
      x: -RAIL_HALF,
      y,
      scale: scaleForOffset(o),
      opacity: 1,
      z: o === 0 ? 30 : 20 - 5 * Math.abs(o),
      pointer: true,
      offset: o,
    }
  }
  const steps = Math.abs(d) - 2
  const extra = RAIL_OFFSCREEN_STEP_PX * steps
  if (d > 2) {
    return {
      left: '100%',
      top: RAIL_TOP,
      x: RAIL_HIDDEN_NUDGE_PX + extra,
      y,
      scale: 0.35,
      opacity: 0,
      z: 0,
      pointer: false,
      offset: null,
    }
  }
  return {
    left: '0%',
    top: RAIL_TOP,
    x: -RAIL_TILE_MAX_PX - RAIL_HIDDEN_NUDGE_PX - extra,
    y,
    scale: 0.35,
    opacity: 0,
    z: 0,
    pointer: false,
    offset: null,
  }
}

function clampMainImagePan(
  pan: { x: number; y: number },
  contentW: number,
  contentH: number,
  containerW: number,
  containerH: number,
  zoom: number,
): { x: number; y: number } {
  if (contentW <= 0 || contentH <= 0 || containerW <= 0 || containerH <= 0) {
    return { x: 0, y: 0 }
  }
  const sw = contentW * zoom
  const sh = contentH * zoom
  const maxX = Math.max(0, (sw - containerW) / 2)
  const maxY = Math.max(0, (sh - containerH) / 2)
  return {
    x: Math.max(-maxX, Math.min(maxX, pan.x)),
    y: Math.max(-maxY, Math.min(maxY, pan.y)),
  }
}

function SideQuestCarousel({
  selectedIndex,
  onSelectIndex,
  onPrev,
  onNext,
}: {
  selectedIndex: number
  onSelectIndex: (index: number) => void
  onPrev: () => void
  onNext: () => void
}) {
  const reducedMotion = useReducedMotion() ?? false
  const n = SIDEQUESTS.length

  const transition = reducedMotion
    ? { duration: 0.01, ease: CAROUSEL_EASE }
    : { duration: CAROUSEL_DURATION, ease: CAROUSEL_EASE }

  if (n === 0) {
    return null
  }

  return (
    <div
      className={[
        'relative box-border flex h-[58px] w-full min-w-0 shrink-0 items-stretch py-2',
        'max-lg:sticky max-lg:top-[46px] max-lg:z-[35] max-lg:bg-bg',
        LINE_RAIL_TB,
        'bg-bg',
        'pl-4 pr-4',
      ].join(' ')}
    >
      <div className="flex w-[38px] shrink-0 items-center justify-center">
        <button type="button" className={carouselArrowClass} aria-label="Previous sidequest" onClick={onPrev}>
          <CaretLeft {...phosphorInChrome} aria-hidden />
        </button>
      </div>

      <div className="relative min-h-0 min-w-0 flex-1 self-stretch">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[1px] min-h-[1px] -translate-y-1/2"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--color-cell-border) 10%, var(--color-cell-border) 90%, transparent 100%)',
          }}
          aria-hidden
        />
        <div
          className="viewer-carousel-strip relative z-[1] h-full w-full min-w-0 overflow-hidden"
          style={{ minHeight: 44 }}
        >
          <div className="relative h-full w-full min-w-0 [contain:layout_style]">
            {Array.from({ length: n }, (_, sidequestIndex) => {
              const sq = SIDEQUESTS[sidequestIndex]!
              const t = carouselTargetFor(selectedIndex, sidequestIndex, n)
              const isCenter = sidequestIndex === selectedIndex
              const { left, top, x, y, scale: s, opacity, z, pointer, offset } = t
              return (
                <motion.button
                  key={String(sidequestIndex)}
                  type="button"
                  layout={false}
                  initial={false}
                  animate={{ left, top, x, y, opacity, scale: s }}
                  transition={transition}
                  style={{ zIndex: z }}
                  className={[
                    'absolute h-10 w-10 will-change-transform',
                    'font-mono font-normal',
                    FOCUS_1,
                    pointer ? 'pointer-events-auto' : 'pointer-events-none',
                  ].join(' ')}
                  tabIndex={pointer ? 0 : -1}
                  aria-hidden={!pointer}
                  aria-label={
                    pointer ? (isCenter ? `Selected: ${sq.title}` : `Select ${sq.title}`) : undefined
                  }
                  aria-current={isCenter && pointer ? 'true' : undefined}
                  onClick={() => {
                    if (pointer && sidequestIndex !== selectedIndex) onSelectIndex(sidequestIndex)
                  }}
                >
                  <span
                    className={[
                      'group relative box-border flex size-full flex-col',
                      'items-stretch justify-center overflow-hidden rounded-[2px] origin-center',
                      isCenter
                        ? [
                            LINE_SEL,
                            'bg-elevated',
                            'shadow-[0_0_20px_color-mix(in_srgb,var(--color-hud)_20%,transparent),0_0_1px_color-mix(in_srgb,var(--color-fg)_18%,transparent)]',
                          ].join(' ')
                        : [LINE, LINE_HOVER, 'bg-surface'].join(' '),
                    ].join(' ')}
                  >
                    {sq.coverImage ? (
                      <>
                        {isSideQuestVideoUrl(sq.coverImage) ? (
                          <video
                            src={sq.coverImage}
                            muted
                            playsInline
                            loop
                            autoPlay
                            className={[
                              'h-full w-full object-cover',
                              isCenter
                                ? 'grayscale-0'
                                : [
                                    'grayscale opacity-50',
                                    'transition-[filter,opacity] duration-200 ease-out',
                                    'group-hover:opacity-80 group-hover:grayscale-[0.2]',
                                  ].join(' '),
                            ].join(' ')}
                            aria-hidden
                          />
                        ) : (
                          <img
                            src={sq.coverImage}
                            alt=""
                            className={[
                              'h-full w-full object-cover',
                              isCenter
                                ? 'grayscale-0'
                                : [
                                    'grayscale opacity-50',
                                    'transition-[filter,opacity] duration-200 ease-out',
                                    'group-hover:opacity-80 group-hover:grayscale-[0.2]',
                                  ].join(' '),
                            ].join(' ')}
                            draggable={false}
                          />
                        )}
                        {!isCenter && offset != null && offset !== 0 ? (
                          <span
                            className="pointer-events-none absolute inset-0 z-[1] bg-bg/50 transition-[background-color,opacity] duration-200 group-hover:bg-bg/28"
                            aria-hidden
                          />
                        ) : null}
                      </>
                    ) : (
                      <span className="relative block h-full w-full">
                        <span className="block h-full w-full bg-fg/[0.05]" />
                        {!isCenter && offset != null && offset !== 0 ? (
                          <span className="pointer-events-none absolute inset-0 z-[1] bg-bg/40" aria-hidden />
                        ) : null}
                      </span>
                    )}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex w-[38px] shrink-0 items-center justify-center">
        <button type="button" className={carouselArrowClass} aria-label="Next sidequest" onClick={onNext}>
          <CaretRight {...phosphorInChrome} aria-hidden />
        </button>
      </div>
    </div>
  )
}

function ThumbnailGrid({
  images,
  selectedImageIndex,
  onSelectImage,
}: {
  images: readonly string[]
  selectedImageIndex: number
  onSelectImage: (index: number) => void
}) {
  const placeholders = images.length === 0 ? 4 : 0
  return (
    <div className="grid w-full grid-cols-4 gap-2">
      {images.map((src, i) => {
        const active = i === selectedImageIndex
        return (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => onSelectImage(i)}
            aria-current={active ? 'true' : undefined}
            className={[
              'group relative aspect-square w-full min-w-0 cursor-pointer overflow-hidden rounded-[2px]',
              'font-mono font-normal',
              'transition-[border-color,box-shadow,filter] ease-out duration-200',
              FOCUS_1,
              active
                ? [LINE_SEL, 'shadow-[0_0_20px_color-mix(in_srgb,var(--color-fg)_8%,transparent)]'].join(' ')
                : [LINE, LINE_HOVER, 'hover:brightness-105'].join(' '),
            ].join(' ')}
          >
            {isSideQuestVideoUrl(src) ? (
              <video
                src={src}
                muted
                playsInline
                loop
                autoPlay
                className={[
                  'absolute inset-0 h-full w-full object-cover transition-[filter] duration-200 ease-out',
                  active ? 'grayscale-0' : 'grayscale group-hover:grayscale-0',
                ].join(' ')}
                aria-hidden
              />
            ) : (
              <img
                src={src}
                alt=""
                className={[
                  'absolute inset-0 h-full w-full object-cover transition-[filter] duration-200 ease-out',
                  active ? 'grayscale-0' : 'grayscale group-hover:grayscale-0',
                ].join(' ')}
                draggable={false}
              />
            )}
            {active ? (
              <>
                <span
                  className="pointer-events-none absolute inset-0 z-[1] bg-bg/55"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center p-1"
                  aria-hidden
                >
                  <span className="rounded-[2px] bg-elevated/90 px-1.5 py-0.5 font-mono text-[10px] font-normal leading-none text-fg/95">
                    Selected
                  </span>
                </span>
              </>
            ) : null}
          </button>
        )
      })}
      {placeholders > 0
        ? Array.from({ length: placeholders }, (_, i) => (
            <div
              key={`ph-${i}`}
              className="aspect-square w-full min-w-0 rounded-[2px] box-border border-dashed [border-width:1px] border-cell-border/90 bg-fg/[0.03]"
              aria-hidden
            />
          ))
        : null}
    </div>
  )
}

const zoomIconProps = { size: 16 as const, weight: 'regular' as const, className: 'shrink-0 text-current' as const }

function MainImageView({ src, imageKey }: { src: string | null; imageKey: string }) {
  const reducedMotion = useReducedMotion() ?? false
  const [zoom, setZoom] = useState(MAIN_IMAGE_ZOOM_MIN)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null)
  const panRef = useRef(pan)
  const zoomRef = useRef(zoom)
  const panDrag = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)
  const isVideo = src != null && isSideQuestVideoUrl(src)

  useEffect(() => {
    panRef.current = pan
  }, [pan])
  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  const applyClamp = useCallback(() => {
    const c = containerRef.current
    const el = contentRef.current
    if (!c || !el) return
    const cw = c.clientWidth
    const ch = c.clientHeight
    const bw = el.offsetWidth
    const bh = el.offsetHeight
    if (bw <= 0 || bh <= 0) return
    setPan((p) => clampMainImagePan(p, bw, bh, cw, ch, zoomRef.current))
  }, [])

  useLayoutEffect(() => {
    applyClamp()
  }, [zoom, imageKey, src, applyClamp])

  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    const ro = new ResizeObserver(() => {
      applyClamp()
    })
    ro.observe(c)
    return () => ro.disconnect()
  }, [applyClamp])

  const onMediaReady = useCallback(() => {
    applyClamp()
  }, [applyClamp])

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAIN_IMAGE_ZOOM_MAX, Math.round((z + MAIN_IMAGE_ZOOM_STEP) * 100) / 100))
  }, [])
  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(MAIN_IMAGE_ZOOM_MIN, Math.round((z - MAIN_IMAGE_ZOOM_STEP) * 100) / 100)
      if (next <= MAIN_IMAGE_ZOOM_MIN) {
        setPan({ x: 0, y: 0 })
      }
      return next
    })
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (zoomRef.current <= MAIN_IMAGE_ZOOM_MIN) return
      e.preventDefault()
      panDrag.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: panRef.current.x,
        origY: panRef.current.y,
      }
      setIsPanning(true)
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [],
  )
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = panDrag.current
      if (!d) return
      e.preventDefault()
      const c = containerRef.current
      const el = contentRef.current
      if (!c || !el) return
      const cw = c.clientWidth
      const ch = c.clientHeight
      const bw = el.offsetWidth
      const bh = el.offsetHeight
      if (bw <= 0 || bh <= 0) return
      const nx = d.origX + (e.clientX - d.startX)
      const ny = d.origY + (e.clientY - d.startY)
      setPan(clampMainImagePan({ x: nx, y: ny }, bw, bh, cw, ch, zoomRef.current))
    },
    [],
  )
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (panDrag.current) {
      panDrag.current = null
      setIsPanning(false)
      try {
        ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    }
  }, [])

  const canZoomIn = zoom < MAIN_IMAGE_ZOOM_MAX - 0.0001
  const canZoomOut = zoom > MAIN_IMAGE_ZOOM_MIN + 0.0001
  const isZoomed = zoom > MAIN_IMAGE_ZOOM_MIN

  return (
    <div
      className={[
        'relative flex min-w-0 flex-col overflow-hidden bg-bg',
        MOBILE_HERO_MIN_H_CLASSES,
        'max-lg:flex-none',
        'lg:min-h-0 lg:flex-1',
      ].join(' ')}
    >
      <div
        ref={containerRef}
        className="relative min-h-0 w-full min-w-0 flex-1 overflow-hidden"
        style={{ touchAction: isZoomed ? 'none' : 'auto' }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-0">
          <AnimatePresence mode="wait" initial={false}>
            {src ? (
              <motion.div
                key={imageKey}
                className="flex h-full w-full max-h-full max-w-full items-center justify-center"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : DURATION_IMAGE_S, ease: MOTION_EASE }}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              >
                <div
                  className="flex h-full w-full max-h-full max-w-full select-none items-center justify-center"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  style={{
                    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                    transformOrigin: 'center center',
                    cursor: isZoomed ? (isPanning ? 'grabbing' : 'grab') : 'default',
                  }}
                >
                  {isVideo ? (
                    <video
                      ref={(el) => {
                        contentRef.current = el
                      }}
                      src={src}
                      muted
                      playsInline
                      loop
                      autoPlay
                      onLoadedMetadata={onMediaReady}
                      className="max-h-full max-w-full object-contain antialiased pointer-events-none"
                      style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
                    />
                  ) : (
                    <img
                      ref={(el) => {
                        contentRef.current = el
                      }}
                      src={src}
                      alt=""
                      onLoad={onMediaReady}
                      className="max-h-full max-w-full object-contain antialiased [image-rendering:auto] pointer-events-none"
                      style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
                      draggable={false}
                    />
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="h-full w-full min-h-[12rem] flex-1 bg-fg/5 lg:min-h-0"
                style={{ minHeight: 'min(50%, 240px)' }}
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : DURATION_IMAGE_S, ease: MOTION_EASE }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      {src ? (
        <div
          className="pointer-events-auto absolute bottom-3 left-3 z-10 flex items-center gap-1.5"
          role="group"
          aria-label="Image zoom controls"
        >
          <button
            type="button"
            className={mainImageZoomButtonClass}
            onClick={zoomOut}
            disabled={!canZoomOut}
            aria-label="Zoom out"
          >
            <MagnifyingGlassMinus {...zoomIconProps} aria-hidden />
          </button>
          <button
            type="button"
            className={mainImageZoomButtonClass}
            onClick={zoomIn}
            disabled={!canZoomIn}
            aria-label="Zoom in"
          >
            <MagnifyingGlassPlus {...zoomIconProps} aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  )
}

function SideQuestViewerCopy({ current }: { current: SideQuestEntry }) {
  return (
    <div className="w-full max-w-full">
      <p className="font-mono text-xs font-normal uppercase tracking-[0.22em] text-fg-subtle">
        Sidequest:
      </p>
      <h1 className="mt-4 max-w-full text-balance font-mono text-[32px] font-normal leading-tight tracking-[-0.02em] text-fg">
        {current.title}
      </h1>
      <p className="mt-4 max-w-full font-mono text-[12px] font-normal leading-[1.6] text-fg-muted">
        {current.description}
      </p>
    </div>
  )
}

function SideQuestViewerShell({
  current,
  selectedIndex,
  caseStudiesModalOpen,
  caseStudiesNavRef,
  closeCaseStudiesModal,
  onCaseStudiesNavClick,
}: {
  current: SideQuestEntry
  selectedIndex: number
  caseStudiesModalOpen: boolean
  caseStudiesNavRef: RefObject<HTMLButtonElement | null>
  closeCaseStudiesModal: () => void
  onCaseStudiesNavClick: (e: MouseEvent<HTMLButtonElement>) => void
}) {
  const navigate = useNavigate()
  const [imageIndex, setImageIndex] = useState(0)

  const goHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  const goSidequest = useCallback(
    (index: number) => {
      const sq = SIDEQUESTS[mod(index, SIDEQUESTS.length)]
      if (!sq) return
      navigate(`/sidequest/${sq.id}`, { replace: true })
    },
    [navigate],
  )

  const onPrev = useCallback(() => {
    goSidequest(selectedIndex - 1)
  }, [goSidequest, selectedIndex])

  const onNext = useCallback(() => {
    goSidequest(selectedIndex + 1)
  }, [goSidequest, selectedIndex])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (caseStudiesModalOpen) return
        e.preventDefault()
        goHome()
        return
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const n = current.galleryImages.length
        if (n > 1) {
          setImageIndex((i) =>
            e.key === 'ArrowLeft' ? mod(i - 1, n) : mod(i + 1, n),
          )
        } else {
          if (e.key === 'ArrowLeft') onPrev()
          else onNext()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [caseStudiesModalOpen, current.galleryImages.length, goHome, onNext, onPrev])

  const images = current.galleryImages
  const hasImages = images.length > 0
  const safeImageIndex = hasImages ? Math.min(imageIndex, images.length - 1) : 0
  const mainSrc = hasImages ? images[safeImageIndex]! : null
  const mainKey = `${current.id}-${safeImageIndex}`

  return (
    <div
      className={[
        'sidequest-viewer flex w-full min-w-0 flex-col',
        'max-lg:min-h-dvh max-lg:overflow-x-clip',
        'lg:h-dvh lg:max-h-dvh lg:overflow-hidden lg:min-h-0',
        'bg-bg text-fg',
        'font-mono font-normal not-italic',
        'antialiased subpixel-antialiased [text-rendering:optimizeLegibility]',
      ].join(' ')}
    >
      <header
        className={[
          'sticky top-0 z-40 grid h-[46px] w-full min-w-0 shrink-0',
          'items-center pl-4 pr-0',
          'grid-cols-[minmax(0,1fr)_auto] gap-2 sm:gap-3',
          'lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4',
          LINE_HEADER_B,
          'bg-bg',
        ].join(' ')}
      >
        <nav
          className="flex min-w-0 flex-wrap items-center justify-self-start gap-x-1.5 gap-y-1 text-[10px] font-normal leading-none text-fg md:gap-x-2 md:text-[11px]"
          aria-label="Site"
        >
          <Link
            to="/"
            className="underline decoration-cell-border underline-offset-[3px] hover:decoration-hud"
          >
            Home
          </Link>
          <span className="text-fg-muted">•</span>
          <button
            ref={caseStudiesNavRef}
            type="button"
            className={caseStudiesNavButtonClass}
            onClick={onCaseStudiesNavClick}
          >
            Case studies
          </button>
        </nav>

        <div className="flex min-w-0 max-lg:shrink-0 max-lg:items-center max-lg:justify-end max-lg:gap-2 sm:max-lg:gap-3 lg:contents">
          <div className="flex max-lg:shrink-0 max-lg:items-center lg:shrink-0 lg:items-center lg:justify-center lg:justify-self-center">
            <ThemeSwatches />
          </div>
          <div className="flex min-w-0 max-lg:shrink-0 max-lg:justify-end lg:justify-self-end">
            <div className="box-border flex h-[46px] w-[46px] shrink-0">
              <div className="h-full w-px shrink-0 bg-cell-border" aria-hidden />
              <button
                type="button"
                onClick={goHome}
                className={[
                  'group flex h-full min-h-0 min-w-0 flex-1 items-center justify-center',
                  'border-0 p-0',
                  'font-mono font-normal',
                  'bg-transparent text-fg/50',
                  'transition-[color,background-color] ease-out duration-200',
                  'hover:bg-fg/5 hover:text-fg/90',
                  FOCUS_1,
                ].join(' ')}
                aria-label="Close and return home"
              >
                <X
                  size={24}
                  weight="regular"
                  className={[
                    'shrink-0 text-current',
                    'transition-[color,opacity,transform] duration-200 ease-out',
                    'group-hover:scale-105 group-hover:opacity-100 motion-reduce:group-hover:scale-100',
                  ].join(' ')}
                  aria-hidden
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SideQuestCarousel
        selectedIndex={selectedIndex}
        onSelectIndex={goSidequest}
        onPrev={onPrev}
        onNext={onNext}
      />

      <main
        className={[
          'box-border flex w-full min-w-0 flex-col',
          'max-lg:flex-none max-lg:overflow-visible',
          'lg:min-h-0 lg:flex-1 lg:overflow-hidden',
        ].join(' ')}
      >
        <section
          className={[
            'box-border w-full shrink-0 border-b border-cell-border lg:hidden',
            'px-4 pb-6 pt-4',
          ].join(' ')}
        >
          <SideQuestViewerCopy current={current} />
        </section>

        <div
          className={[
            'flex min-h-0 w-full min-w-0 flex-1 flex-col',
            'lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,68fr)_minmax(0,32fr)] lg:overflow-hidden',
          ].join(' ')}
        >
          <div className="flex min-h-0 min-w-0 max-w-full flex-col max-lg:flex-none lg:h-full lg:self-stretch">
            <MainImageView key={mainKey} src={mainSrc} imageKey={mainKey} />
          </div>

          <aside
            className={[
              'box-border flex w-full min-w-0 flex-col',
              'max-lg:flex-none',
              'border-t border-t-cell-border lg:border-t-0',
              'lg:border-l lg:border-l-cell-border',
              'lg:min-h-0 lg:overflow-hidden lg:self-stretch',
              'px-4 pb-4 pt-4',
              'lg:pl-[26px] lg:pr-4 lg:pb-4 lg:pt-[14px]',
            ].join(' ')}
          >
            <section
              className={[
                'hidden w-full shrink-0 border-b border-cell-border pb-5 lg:block',
              ].join(' ')}
            >
              <SideQuestViewerCopy current={current} />
            </section>
            <div
              className={[
                'sidequest-viewer__scroll',
                'w-full min-w-0',
                'lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pt-4',
              ].join(' ')}
            >
              <ThumbnailGrid
                images={images}
                selectedImageIndex={safeImageIndex}
                onSelectImage={setImageIndex}
              />
            </div>
          </aside>
        </div>
      </main>

      <CaseStudiesCardModal open={caseStudiesModalOpen} onClose={closeCaseStudiesModal} />
    </div>
  )
}

export default function SideQuestViewerPage() {
  const { sidequestId } = useParams()
  const [caseStudiesModalOpen, setCaseStudiesModalOpen] = useState(false)
  const caseStudiesNavRef = useRef<HTMLButtonElement | null>(null)

  const current = getSideQuestById(sidequestId)
  const selectedIndex = getSideQuestIndexById(sidequestId)

  const closeCaseStudiesModal = useCallback(() => {
    setCaseStudiesModalOpen(false)
    queueMicrotask(() => caseStudiesNavRef.current?.focus({ preventScroll: true }))
  }, [])

  const onCaseStudiesNavClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      window.open(CASE_STUDIES_NAV_MODIFIER_TO, '_blank', 'noopener,noreferrer')
      return
    }
    setCaseStudiesModalOpen(true)
  }

  if (!sidequestId || !current) {
    const fallback = SIDEQUESTS[0]
    if (!fallback) return null
    return (
      <>
        <Navigate to={`/sidequest/${fallback.id}`} replace />
        <CaseStudiesCardModal open={caseStudiesModalOpen} onClose={closeCaseStudiesModal} />
      </>
    )
  }

  return (
    <SideQuestViewerShell
      key={current.id}
      current={current}
      selectedIndex={selectedIndex}
      caseStudiesModalOpen={caseStudiesModalOpen}
      caseStudiesNavRef={caseStudiesNavRef}
      closeCaseStudiesModal={closeCaseStudiesModal}
      onCaseStudiesNavClick={onCaseStudiesNavClick}
    />
  )
}
