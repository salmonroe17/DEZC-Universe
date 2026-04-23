import { CaretLeft, CaretRight, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from '@phosphor-icons/react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import type { MouseEvent } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CaseStudiesCardModal } from '../components/CaseStudiesCardModal'
import { ThemeSwatches } from '../components/ThemeSwatches'
import { SIDEQUESTS, getSideQuestById, getSideQuestIndexById } from '../data/sidequests'

/** Calm ease, not bouncy — 220ms rail / image */
const MOTION_EASE = [0.25, 0.1, 0.25, 1] as const
const CAROUSEL_SLOT_SIZES = [16, 24, 40, 24, 16] as const
const DURATION_IMAGE_S = 0.22

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
  const slotIndices =
    n === 0
      ? [0, 0, 0, 0, 0]
      : [0, 1, 2, 3, 4].map((slot) => mod(selectedIndex + slot - 2, n))
  const hasSlotDuplicate = new Set(slotIndices).size < slotIndices.length
  const layoutTx = (reducedMotion: boolean) =>
    reducedMotion
      ? { type: 'tween' as const, duration: 0.01, ease: MOTION_EASE }
      : { type: 'spring' as const, stiffness: 420, damping: 36, mass: 0.8 }

  return (
    <div
      className={[
        'relative box-border flex h-[58px] w-full min-w-0 shrink-0 items-stretch py-2',
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

      <div className="relative min-w-0 flex-1">
        {/* Rail: horizontal through vertical center */}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[1px] min-h-[1px] -translate-y-1/2"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--color-cell-border) 10%, var(--color-cell-border) 90%, transparent 100%)',
          }}
          aria-hidden
        />
        <div className="viewer-carousel-strip relative z-[1] flex h-full w-full min-w-0 items-center justify-center overflow-hidden">
          <LayoutGroup id="sidequest-carousel-5up">
            <div className="grid w-full min-w-0 max-w-3xl grid-cols-5 place-items-center gap-1.5 px-1.5 min-[500px]:gap-2 min-[500px]:px-2 md:gap-3 md:px-3">
              {[0, 1, 2, 3, 4].map((slot) => {
                const sidequestIndex = slotIndices[slot]!
                const sq = SIDEQUESTS[sidequestIndex]!
                const size = CAROUSEL_SLOT_SIZES[slot]!
                const isCenter = slot === 2
                // Stable id for shared layout: one per sidequest. Duplicates in strip need a slot-unique id (no cross-slot link).
                const layoutIdForTile = hasSlotDuplicate
                  ? `sqc-${String(sq.id)}-slot${String(slot)}`
                  : `sqc-${String(sq.id)}`
                return (
                  <button
                    key={`slot-${slot}`}
                    type="button"
                    aria-label={`${isCenter ? 'Selected: ' : ''}Select ${sq.title}`}
                    aria-current={isCenter ? 'true' : undefined}
                    onClick={() => onSelectIndex(sidequestIndex)}
                    className={[
                      'group relative flex h-full w-full min-w-0 max-w-full items-center justify-center',
                      'font-mono font-normal',
                      FOCUS_1,
                    ].join(' ')}
                  >
                    <span className="relative flex w-full min-w-0 max-w-full flex-col items-center justify-center">
                      <motion.span
                        layout
                        layoutId={layoutIdForTile}
                        initial={false}
                        transition={{ layout: layoutTx(reducedMotion) }}
                        style={{ width: size, height: size, maxWidth: '100%' }}
                        className={[
                          'relative z-[1] box-border flex shrink-0 flex-col items-stretch justify-center overflow-hidden rounded-[2px]',
                          isCenter
                            ? [
                                LINE_SEL,
                                'bg-elevated',
                                'opacity-100',
                                'shadow-[0_0_24px_color-mix(in_srgb,var(--color-hud)_16%,transparent),0_0_1px_color-mix(in_srgb,var(--color-fg)_22%,transparent)]',
                              ].join(' ')
                            : [LINE, LINE_HOVER, 'bg-surface'].join(' '),
                        ].join(' ')}
                      >
                        {sq.cover ? (
                          <>
                            <img
                              src={sq.cover}
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
                            {!isCenter ? (
                              <span
                                className={[
                                  'pointer-events-none absolute inset-0 z-[1] bg-bg/50',
                                  'transition-[background-color,opacity] duration-200 ease-out',
                                  'group-hover:bg-bg/28',
                                ].join(' ')}
                                aria-hidden
                              />
                            ) : null}
                          </>
                        ) : (
                          <span className="relative block h-full w-full">
                            <span className="block h-full w-full bg-fg/[0.05]" />
                            {!isCenter ? (
                              <span
                                className="pointer-events-none absolute inset-0 z-[1] bg-bg/40"
                                aria-hidden
                              />
                            ) : null}
                          </span>
                        )}
                      </motion.span>
                      <span
                        className={[
                          'pointer-events-none absolute -bottom-1 left-1/2 z-0 h-3 w-[130%] max-w-[3.5rem] -translate-x-1/2',
                          'rounded-full opacity-0 blur-md transition-[opacity,box-shadow] duration-200 ease-out',
                          'group-hover:opacity-100 group-hover:shadow-[0_6px_24px_8px_color-mix(in_srgb,var(--color-fg)_12%,transparent)]',
                        ].join(' ')}
                        aria-hidden
                      />
                    </span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>
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
            <img
              src={src}
              alt=""
              className={[
                'absolute inset-0 h-full w-full object-cover transition-[filter] duration-200 ease-out',
                active ? 'grayscale-0' : 'grayscale group-hover:grayscale-0',
              ].join(' ')}
              draggable={false}
            />
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
  const imageRef = useRef<HTMLImageElement | null>(null)
  const panRef = useRef(pan)
  const zoomRef = useRef(zoom)
  const panDrag = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)

  useEffect(() => {
    setZoom(MAIN_IMAGE_ZOOM_MIN)
    setPan({ x: 0, y: 0 })
  }, [imageKey])
  useEffect(() => {
    panRef.current = pan
  }, [pan])
  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  const applyClamp = useCallback(() => {
    const c = containerRef.current
    const img = imageRef.current
    if (!c || !img) return
    const cw = c.clientWidth
    const ch = c.clientHeight
    const bw = img.offsetWidth
    const bh = img.offsetHeight
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

  const onImageLoad = useCallback(() => {
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
      const img = imageRef.current
      if (!c || !img) return
      const cw = c.clientWidth
      const ch = c.clientHeight
      const bw = img.offsetWidth
      const bh = img.offsetHeight
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
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-bg">
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
                className="flex max-h-full max-w-full items-center justify-center"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : DURATION_IMAGE_S, ease: MOTION_EASE }}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              >
                <div
                  className="flex max-h-full max-w-full select-none"
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
                  <img
                    ref={imageRef}
                    src={src}
                    alt=""
                    onLoad={onImageLoad}
                    className="max-h-full max-w-full object-contain antialiased [image-rendering:auto] pointer-events-none"
                    style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
                    draggable={false}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="h-full w-full min-h-[12rem] flex-1 bg-fg/5"
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
          className="pointer-events-auto absolute bottom-3 right-3 z-10 flex items-center gap-1.5"
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

export default function SideQuestViewerPage() {
  const { sidequestId } = useParams()
  const navigate = useNavigate()
  const [imageIndex, setImageIndex] = useState(0)
  const [caseStudiesModalOpen, setCaseStudiesModalOpen] = useState(false)
  const caseStudiesNavRef = useRef<HTMLButtonElement | null>(null)

  const current = getSideQuestById(sidequestId)
  const selectedIndex = getSideQuestIndexById(sidequestId)

  useEffect(() => {
    setImageIndex(0)
  }, [sidequestId])

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
        const c = sidequestId ? getSideQuestById(sidequestId) : null
        const n = c?.images.length ?? 0
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
  }, [caseStudiesModalOpen, goHome, onNext, onPrev, setImageIndex, sidequestId])

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

  const images = current.images
  const hasImages = images.length > 0
  const safeImageIndex = hasImages ? Math.min(imageIndex, images.length - 1) : 0
  const mainSrc = hasImages ? images[safeImageIndex]! : null
  const mainKey = `${current.id}-${safeImageIndex}`

  return (
    <div
      className={[
        'sidequest-viewer flex h-dvh max-h-dvh w-full min-w-0 flex-col overflow-hidden',
        'bg-bg text-fg',
        'font-mono font-normal not-italic',
        'antialiased subpixel-antialiased [text-rendering:optimizeLegibility]',
      ].join(' ')}
    >
      <header
        className={[
          'sticky top-0 z-40 grid h-[46px] w-full min-w-0 shrink-0',
          'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3 md:gap-4',
          'pl-4 pr-0',
          LINE_HEADER_B,
          'bg-bg',
        ].join(' ')}
      >
        <nav
          className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 justify-self-start text-[10px] font-normal leading-none text-fg md:gap-x-2 md:text-[11px]"
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

        <div className="flex shrink-0 justify-center justify-self-center">
          <ThemeSwatches />
        </div>

        <div className="flex justify-self-end">
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
      </header>

      <SideQuestCarousel
        selectedIndex={selectedIndex}
        onSelectIndex={goSidequest}
        onPrev={onPrev}
        onNext={onNext}
      />

      <main
        className={[
          'box-border flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden',
          'min-[1024px]:grid min-[1024px]:min-h-0',
          'min-[1024px]:grid-cols-[minmax(0,68fr)_minmax(0,32fr)]',
          'min-[1024px]:items-stretch min-[1024px]:gap-0',
        ].join(' ')}
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col min-[1024px]:h-full min-[1024px]:self-stretch">
          <MainImageView src={mainSrc} imageKey={mainKey} />
        </div>

        <aside
          className={[
            'box-border flex min-h-0 w-full min-w-0',
            'border-t border-t-cell-border min-[1024px]:border-t-0',
            'min-[1024px]:border-l min-[1024px]:border-l-cell-border',
            'pl-4 pr-4 pb-4 pt-4',
            'min-[1024px]:h-full min-[1024px]:min-h-0 min-[1024px]:max-h-full min-[1024px]:self-stretch',
            'min-[1024px]:pl-[26px] min-[1024px]:pr-4 min-[1024px]:pb-4 min-[1024px]:pt-[14px]',
          ].join(' ')}
        >
          <div
            className={[
              'sidequest-viewer__scroll',
              'min-h-0 w-full min-w-0',
              'min-[1024px]:max-h-full min-[1024px]:min-h-0 min-[1024px]:flex-1',
              'min-[1024px]:overflow-y-auto',
              'max-[1023px]:max-h-[48vh] max-[1023px]:overflow-y-auto',
            ].join(' ')}
          >
            <div className="w-full max-w-full border-b border-b-cell-border pb-6">
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
            <div className="mt-6 w-full">
              <ThumbnailGrid
                images={images}
                selectedImageIndex={safeImageIndex}
                onSelectImage={setImageIndex}
              />
            </div>
          </div>
        </aside>
      </main>

      <CaseStudiesCardModal open={caseStudiesModalOpen} onClose={closeCaseStudiesModal} />
    </div>
  )
}
