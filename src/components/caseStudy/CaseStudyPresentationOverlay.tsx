import type { Dispatch, PointerEvent as ReactPointerEvent, ReactNode, SetStateAction } from 'react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { toPng } from 'html-to-image'
import {
  ArrowClockwise,
  CaretLeft,
  CaretRight,
  Image as ImageIcon,
  Minus,
  Plus,
  SlidersHorizontal,
  TextAa,
  X,
} from '@phosphor-icons/react'
import { AmbientVerticalLines } from '../AmbientVerticalLines'
import {
  ThemeSwatchSelectedIndicator,
  themeSwatchSelectedDotOnColorClass,
  themeSwatchSelectedDotOnLightFillClass,
} from '../ThemeSwatches'
import { CaseStudyScrollProgressBar } from './CaseStudyScrollProgressBar'

/** Icons sit inside 24×24 control buttons (Phosphor size ≈ visual glyph). */
const iconInCtrl = { size: 16 as const, weight: 'regular' as const, className: 'shrink-0 text-current' }

const PRESENTATION_BODY_CLASS = 'case-study-presentation-overlay-open'

const BAR_H = 48
const THUMB_STRIP_H = 100
/** Top / bottom presentation chrome fly-in/out (Tailwind `duration-[250ms]`). */
const controlsBarGridAnimClass =
  'transition-[grid-template-rows] duration-[250ms] ease-out motion-reduce:transition-none'
const controlsBarTransformAnimClass =
  'transition-transform duration-[250ms] ease-out motion-reduce:transition-none'

const TEXT_SCALE_MIN = 0.5
const TEXT_SCALE_MAX = 3
const TEXT_SCALE_STEP = 0.25
const IMAGE_SCALE_MIN = 0.5
const IMAGE_SCALE_MAX = 3
const IMAGE_SCALE_STEP = 0.25

function snapScaleToStep(value: number, step: number): number {
  const inv = 1 / step
  return Math.round(value * inv) / inv
}

const PRESS_HOLD_DELAY_MS = 220
const PRESS_HOLD_INTERVAL_MS = 48

export type PresentationTheme = 'gray' | 'turquoise' | 'pink' | 'blue' | 'white'

const PRESENTATION_CAPTURE_BG: Record<PresentationTheme, string> = {
  gray: '#101010',
  turquoise: '#0b1312',
  pink: '#100a12',
  blue: '#0a0e16',
  white: '#ffffff',
}

function BarDivider() {
  return <span className="mx-0.5 h-4 w-px shrink-0 bg-cell-border" aria-hidden />
}

/** True when the slide subtree has raster/video media (skip DOM capture — use static thumb). */
function slideHasRasterMedia(root: HTMLElement): boolean {
  return !!root.querySelector('img, video, picture, iframe, canvas')
}

function idleFrame(): Promise<void> {
  return new Promise((resolve) => {
    const ric = globalThis.requestIdleCallback as ((cb: () => void, opts?: { timeout: number }) => number) | undefined
    if (typeof ric === 'function') {
      ric(() => resolve(), { timeout: 600 })
    } else {
      window.setTimeout(resolve, 24)
    }
  })
}

const ctrlBtnClass =
  'flex size-6 shrink-0 items-center justify-center rounded border border-cell-border bg-elevated/90 text-sm font-medium text-fg shadow-sm transition-[background-color,opacity,transform] duration-200 ease-out hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-35'

const thumbStripMiniLabelClass =
  'flex h-full w-full items-center justify-center px-1 text-center text-[6px] font-medium leading-tight text-fg line-clamp-2'

/** Presentation deck theme swatches — mirrors site header pattern (see ThemeSwatches). */
const PRESENTATION_SWATCH: Record<
  PresentationTheme,
  { selected: string; idle: string; label: string; selectedDot: string }
> = {
  gray: {
    selected: 'bg-zinc-500 border-0',
    idle: 'border border-zinc-400 bg-transparent',
    label: 'Grey',
    selectedDot: themeSwatchSelectedDotOnColorClass,
  },
  turquoise: {
    selected: 'bg-teal-400 border-0',
    idle: 'border-2 border-teal-400 bg-transparent',
    label: 'Turquoise',
    selectedDot: themeSwatchSelectedDotOnColorClass,
  },
  pink: {
    selected: 'bg-fuchsia-400 border-0',
    idle: 'border-2 border-fuchsia-400 bg-transparent',
    label: 'Pink',
    selectedDot: themeSwatchSelectedDotOnColorClass,
  },
  blue: {
    selected: 'bg-blue-400 border-0',
    idle: 'border-2 border-blue-400 bg-transparent',
    label: 'Blue',
    selectedDot: themeSwatchSelectedDotOnColorClass,
  },
  white: {
    selected: 'bg-white border border-zinc-500',
    idle: 'border-2 border-zinc-400 bg-transparent',
    label: 'White',
    selectedDot: themeSwatchSelectedDotOnLightFillClass,
  },
}

type PanPoint = { x: number; y: number }

type ImageSlidePanViewportProps = {
  active: boolean
  imageScale: number
  pan: PanPoint
  setPan: Dispatch<SetStateAction<PanPoint>>
  children: ReactNode
}

/** Wheel + drag pan for scaled image slides; clamps so empty margin stays minimal. */
function ImageSlidePanViewport({ active, imageScale, pan, setPan, children }: ImageSlidePanViewportProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const panRef = useRef(pan)
  panRef.current = pan
  const dragRef = useRef<{ pointerId: number; sx: number; sy: number; ox: number; oy: number } | null>(null)

  const clampPan = useCallback(
    (x: number, y: number) => {
      const root = rootRef.current
      const inner = innerRef.current
      if (!root || !inner) return { x, y }
      const rw = root.clientWidth
      const rh = root.clientHeight
      const cw = inner.scrollWidth * imageScale
      const ch = inner.scrollHeight * imageScale
      const maxX = Math.max(0, (cw - rw) / 2)
      const maxY = Math.max(0, (ch - rh) / 2)
      return {
        x: Math.min(maxX, Math.max(-maxX, x)),
        y: Math.min(maxY, Math.max(-maxY, y)),
      }
    },
    [imageScale],
  )

  useEffect(() => {
    if (!active) return
    const el = rootRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setPan((p) => clampPan(p.x - e.deltaX, p.y - e.deltaY))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [active, clampPan, setPan])

  useLayoutEffect(() => {
    if (!active) return
    setPan((p) => clampPan(p.x, p.y))
  }, [active, clampPan, imageScale, setPan])

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const t = e.target as HTMLElement | null
    if (t?.closest?.('button, a[href], input, textarea, select, [role="tab"], [role="switch"]')) return
    dragRef.current = {
      pointerId: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      ox: panRef.current.x,
      oy: panRef.current.y,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = dragRef.current
      if (!d || d.pointerId !== e.pointerId) return
      const dx = e.clientX - d.sx
      const dy = e.clientY - d.sy
      setPan(clampPan(d.ox + dx, d.oy + dy))
    },
    [clampPan, setPan],
  )

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (d && d.pointerId === e.pointerId) dragRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* */
    }
  }, [])

  return (
    <div
      ref={rootRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative flex min-h-full min-w-full flex-1 cursor-grab overflow-hidden active:cursor-grabbing"
    >
      <div
        ref={innerRef}
        className="mx-auto flex min-h-min w-full min-w-0 flex-col justify-center will-change-transform"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${imageScale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export type CaseStudyPresentationSlide = {
  /** Same structure and styling as the case study page — horizontal deck only adds viewport paging. */
  content: ReactNode
  /** Optional preview URL; also see {@link CaseStudyPresentationOverlayProps.thumbnailSrcs}. */
  thumbnailSrc?: string
  /**
   * When `'text'`, slide is omitted from the horizontal deck while {@link textSlidesVisible} is false.
   * Omit or use `'image'` for slides that should always appear.
   */
  slideKind?: 'image' | 'text'
  /**
   * When {@link slideKind} is `'text'`, shown in the thumbnail strip instead of a captured/static image
   * (short title, ~6px centered).
   */
  thumbnailLabel?: string
  /**
   * When {@link slideKind} is `'image'` and set with {@link thumbnailLabel}, the strip shows that label
   * instead of a static preview (e.g. external GIF thumbs that would otherwise fall back to a slide number).
   */
  thumbnailStripUseLabel?: boolean
  /** When true, thumbnail strip shows centered "Video" instead of a static/captured image. */
  thumbnailIsVideo?: boolean
}

type CaseStudyPresentationOverlayProps = {
  open: boolean
  activeIndex: number
  slides: CaseStudyPresentationSlide[]
  /** Parallel to `slides` (same length optional); wins over per-slide `thumbnailSrc` when set. */
  thumbnailSrcs?: readonly (string | undefined)[]
  onClose: () => void
  onActiveIndexChange: (index: number) => void
  /**
   * Initial state for the “Text slides” control when the overlay opens.
   * Default false (image-first deck). Use true for decks with few text slides that should
   * stay visible without toggling (e.g. Super: single Intro text slide).
   */
  initialTextSlidesVisible?: boolean
}

function isSlideVisibleInDeck(slide: CaseStudyPresentationSlide, textSlidesVisible: boolean): boolean {
  return slide.slideKind !== 'text' || textSlidesVisible
}

function usePointerHoldRepeat(onRepeat: () => void, canRepeat: boolean) {
  const delayRef = useRef<number | undefined>(undefined)
  const intervalRef = useRef<number | undefined>(undefined)
  const onRepeatRef = useRef(onRepeat)
  onRepeatRef.current = onRepeat

  const clearTimers = useCallback(() => {
    window.clearTimeout(delayRef.current)
    window.clearInterval(intervalRef.current)
    delayRef.current = undefined
    intervalRef.current = undefined
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const startHold = useCallback(() => {
    clearTimers()
    onRepeatRef.current()
    delayRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => onRepeatRef.current(), PRESS_HOLD_INTERVAL_MS)
    }, PRESS_HOLD_DELAY_MS)
  }, [clearTimers])

  const pointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!canRepeat || e.button !== 0) return
      e.currentTarget.setPointerCapture(e.pointerId)
      startHold()
    },
    [canRepeat, startHold],
  )

  const pointerStop = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* not captured */
      }
      clearTimers()
    },
    [clearTimers],
  )

  return useMemo(
    () => ({
      onPointerDown: pointerDown,
      onPointerUp: pointerStop,
      onPointerCancel: pointerStop,
      onPointerLeave: pointerStop,
    }),
    [pointerDown, pointerStop],
  )
}

export function CaseStudyPresentationOverlay({
  open,
  activeIndex,
  slides,
  thumbnailSrcs,
  onClose,
  onActiveIndexChange,
  initialTextSlidesVisible = false,
}: CaseStudyPresentationOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const controlsToggleRef = useRef<HTMLButtonElement>(null)
  const ignoreScrollEmitRef = useRef(false)
  const lastEmittedFullIndexRef = useRef(activeIndex)
  const scrollRafRef = useRef<number | null>(null)
  const thumbStripRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)

  const [controlsVisible, setControlsVisible] = useState(false)
  const [textSlidesVisible, setTextSlidesVisible] = useState(false)
  const [textScale, setTextScale] = useState(1)
  const [imageScale, setImageScale] = useState(1)
  const [theme, setTheme] = useState<PresentationTheme>('gray')
  const [imagePan, setImagePan] = useState<PanPoint>({ x: 0, y: 0 })

  const slideCaptureRootsRef = useRef<Array<HTMLDivElement | null>>([])
  const captureRunIdRef = useRef(0)
  const [capturedThumbs, setCapturedThumbs] = useState<Record<number, string>>({})
  const skipVisualRecaptureDebounce = useRef(true)

  useEffect(() => {
    if (!open) {
      slideCaptureRootsRef.current = []
      setCapturedThumbs({})
      skipVisualRecaptureDebounce.current = true
      wasOpenRef.current = false
      lastVisibleDeckKeyRef.current = ''
      return
    }
    if (!wasOpenRef.current) {
      wasOpenRef.current = true
      setControlsVisible(false)
      setTextSlidesVisible(initialTextSlidesVisible)
      setTextScale(1)
      setImageScale(1)
      setTheme('gray')
    }
  }, [open, initialTextSlidesVisible])

  const visibleEntries = useMemo(
    () =>
      slides
        .map((slide, fullIndex) => ({ slide, fullIndex }))
        .filter(({ slide }) => isSlideVisibleInDeck(slide, textSlidesVisible)),
    [slides, textSlidesVisible],
  )

  const visibleDeckKey = useMemo(() => visibleEntries.map((e) => e.fullIndex).join(','), [visibleEntries])
  const lastVisibleDeckKeyRef = useRef('')

  const visibleIndexFromFull = useCallback(
    (full: number) => visibleEntries.findIndex((e) => e.fullIndex === full),
    [visibleEntries],
  )

  const resolveFullIndexForDeck = useCallback(
    (full: number) => {
      if (visibleEntries.length === 0) return 0
      if (visibleIndexFromFull(full) >= 0) return full
      for (let i = full - 1; i >= 0; i--) {
        if (visibleIndexFromFull(i) >= 0) return i
      }
      return visibleEntries[0]?.fullIndex ?? 0
    },
    [visibleEntries, visibleIndexFromFull],
  )

  const resolvedActiveFullIndex = useMemo(
    () => resolveFullIndexForDeck(activeIndex),
    [activeIndex, resolveFullIndexForDeck],
  )

  useEffect(() => {
    setImagePan({ x: 0, y: 0 })
  }, [resolvedActiveFullIndex, imageScale])

  useLayoutEffect(() => {
    if (!open) return
    if (resolvedActiveFullIndex !== activeIndex) {
      onActiveIndexChange(resolvedActiveFullIndex)
    }
  }, [open, activeIndex, resolvedActiveFullIndex, onActiveIndexChange])

  /** Per-slide preview only (no forward-fill) so image thumbnails stay aligned to the correct slide. */
  const resolvedThumbs = useMemo(
    () => slides.map((slide, i) => thumbnailSrcs?.[i] ?? slide.thumbnailSrc),
    [slides, thumbnailSrcs],
  )

  const runCaptureThumbnails = useCallback(async () => {
    const runId = ++captureRunIdRef.current
    setCapturedThumbs({})
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    })
    if (runId !== captureRunIdRef.current) return
    const bg = PRESENTATION_CAPTURE_BG[theme]
    for (const { fullIndex, slide } of visibleEntries) {
      if (runId !== captureRunIdRef.current) return
      const node = slideCaptureRootsRef.current[fullIndex]
      if (!node || node.offsetWidth < 12 || node.offsetHeight < 12) continue
      const isTextSlide = slide.slideKind === 'text'
      // Text slides use {@link CaseStudyPresentationSlide.thumbnailLabel} in the strip — no DOM capture.
      if (isTextSlide) continue
      // Image slides: skip DOM capture when stills exist (use static).
      if (slideHasRasterMedia(node)) continue
      const captureNode = node
      try {
        const dataUrl = await toPng(captureNode, {
          cacheBust: true,
          pixelRatio: 1,
          width: 340,
          height: 192,
          backgroundColor: bg,
        })
        if (runId !== captureRunIdRef.current) return
        setCapturedThumbs((prev) => ({ ...prev, [fullIndex]: dataUrl }))
      } catch {
        const fb = resolvedThumbs[fullIndex]
        if (fb && runId === captureRunIdRef.current) {
          setCapturedThumbs((prev) => ({ ...prev, [fullIndex]: fb }))
        }
      }
      await idleFrame()
    }
  }, [resolvedThumbs, theme, visibleEntries])

  useEffect(() => {
    if (!open) return
    slideCaptureRootsRef.current.length = slides.length
    void runCaptureThumbnails()
  }, [open, slides.length, runCaptureThumbnails])

  useEffect(() => {
    if (!open) return
    if (skipVisualRecaptureDebounce.current) {
      skipVisualRecaptureDebounce.current = false
      return
    }
    const id = window.setTimeout(() => void runCaptureThumbnails(), 360)
    return () => clearTimeout(id)
  }, [open, textScale, theme, imageScale, textSlidesVisible, controlsVisible, runCaptureThumbnails])

  useEffect(() => {
    if (!open) return
    let t: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(t)
      t = window.setTimeout(() => void runCaptureThumbnails(), 480)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
    }
  }, [open, runCaptureThumbnails])

  const readVisibleScrollIndex = useCallback(() => {
    const el = scrollRef.current
    if (!el || visibleEntries.length === 0) return 0
    const w = el.clientWidth
    if (w <= 0) return 0
    return Math.min(visibleEntries.length - 1, Math.max(0, Math.round(el.scrollLeft / w)))
  }, [visibleEntries.length])

  const emitScrollIndex = useCallback(() => {
    if (ignoreScrollEmitRef.current) return
    const vi = readVisibleScrollIndex()
    const full = visibleEntries[vi]?.fullIndex ?? 0
    if (full !== lastEmittedFullIndexRef.current) {
      lastEmittedFullIndexRef.current = full
      onActiveIndexChange(full)
    }
  }, [onActiveIndexChange, readVisibleScrollIndex, visibleEntries])

  const onScroll = useCallback(() => {
    if (scrollRafRef.current !== null) return
    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null
      emitScrollIndex()
    })
  }, [emitScrollIndex])

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
    }
  }, [])

  useLayoutEffect(() => {
    if (!open || !scrollRef.current || visibleEntries.length === 0) return
    const el = scrollRef.current
    const w = el.clientWidth
    if (w <= 0) return
    const vi = visibleEntries.findIndex((e) => e.fullIndex === resolvedActiveFullIndex)
    if (vi < 0) return
    const target = vi * w
    const deckReshaped = lastVisibleDeckKeyRef.current !== visibleDeckKey
    lastVisibleDeckKeyRef.current = visibleDeckKey
    const diff = Math.abs(el.scrollLeft - target)
    if (deckReshaped || diff > w * 1.05) {
      ignoreScrollEmitRef.current = true
      el.scrollLeft = target
      lastEmittedFullIndexRef.current = resolvedActiveFullIndex
      queueMicrotask(() => {
        ignoreScrollEmitRef.current = false
      })
    }
  }, [resolvedActiveFullIndex, open, visibleEntries, visibleDeckKey])

  useEffect(() => {
    if (!open) return
    lastEmittedFullIndexRef.current = visibleEntries[readVisibleScrollIndex()]?.fullIndex ?? resolvedActiveFullIndex
  }, [open, readVisibleScrollIndex, resolvedActiveFullIndex, visibleEntries])

  useEffect(() => {
    if (!open) return
    const onResize = () => {
      const el = scrollRef.current
      if (!el || visibleEntries.length === 0) return
      const w = el.clientWidth
      if (w <= 0) return
      const vi = readVisibleScrollIndex()
      ignoreScrollEmitRef.current = true
      el.scrollLeft = vi * w
      lastEmittedFullIndexRef.current = visibleEntries[vi]?.fullIndex ?? 0
      queueMicrotask(() => {
        ignoreScrollEmitRef.current = false
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open, readVisibleScrollIndex, visibleEntries])

  useLayoutEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add(PRESENTATION_BODY_CLASS)
    return () => {
      document.body.style.overflow = prev
      document.body.classList.remove(PRESENTATION_BODY_CLASS)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    controlsToggleRef.current?.focus({ preventScroll: true })
  }, [open])

  const goRelative = useCallback(
    (delta: number, smooth: boolean) => {
      const el = scrollRef.current
      if (!el || visibleEntries.length === 0) return
      const w = el.clientWidth
      if (w <= 0) return
      const fromVi = readVisibleScrollIndex()
      const nextVi = Math.min(visibleEntries.length - 1, Math.max(0, fromVi + delta))
      const nextFull = visibleEntries[nextVi]?.fullIndex ?? 0
      if (smooth) {
        el.scrollTo({ left: nextVi * w, behavior: 'smooth' })
      } else {
        ignoreScrollEmitRef.current = true
        el.scrollLeft = nextVi * w
        lastEmittedFullIndexRef.current = nextFull
        onActiveIndexChange(nextFull)
        queueMicrotask(() => {
          ignoreScrollEmitRef.current = false
        })
      }
    },
    [onActiveIndexChange, readVisibleScrollIndex, visibleEntries],
  )

  const goToFullIndex = useCallback(
    (fullIndex: number) => {
      const el = scrollRef.current
      if (!el || visibleEntries.length === 0) return
      const w = el.clientWidth
      if (w <= 0) return
      const vi = visibleEntries.findIndex((e) => e.fullIndex === fullIndex)
      if (vi < 0) return
      ignoreScrollEmitRef.current = true
      el.scrollLeft = vi * w
      lastEmittedFullIndexRef.current = fullIndex
      onActiveIndexChange(fullIndex)
      queueMicrotask(() => {
        ignoreScrollEmitRef.current = false
      })
    },
    [onActiveIndexChange, visibleEntries],
  )

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'ArrowLeft' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement | null
        if (t?.closest('input, textarea, select, [contenteditable="true"]')) return
        e.preventDefault()
        goRelative(-1, true)
      }
      if (e.key === 'ArrowRight' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement | null
        if (t?.closest('input, textarea, select, [contenteditable="true"]')) return
        e.preventDefault()
        goRelative(1, true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goRelative, onClose, open])

  useLayoutEffect(() => {
    if (!open || !controlsVisible || visibleEntries.length === 0) return
    const strip = thumbStripRef.current
    if (!strip) return
    const vi = visibleIndexFromFull(resolvedActiveFullIndex)
    if (vi < 0) return
    const btn = strip.querySelector<HTMLButtonElement>(`[data-presentation-thumb="${vi}"]`)
    btn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [resolvedActiveFullIndex, open, controlsVisible, visibleEntries, visibleIndexFromFull])

  const bumpTextScale = useCallback((d: number) => {
    setTextScale((s) => {
      const n = snapScaleToStep(s + d, TEXT_SCALE_STEP)
      return Math.min(TEXT_SCALE_MAX, Math.max(TEXT_SCALE_MIN, n))
    })
  }, [])

  const bumpImageScale = useCallback((d: number) => {
    setImageScale((z) => {
      const n = snapScaleToStep(z + d, IMAGE_SCALE_STEP)
      return Math.min(IMAGE_SCALE_MAX, Math.max(IMAGE_SCALE_MIN, n))
    })
  }, [])

  const textMinusHold = usePointerHoldRepeat(() => bumpTextScale(-TEXT_SCALE_STEP), textScale > TEXT_SCALE_MIN + 1e-6)
  const textPlusHold = usePointerHoldRepeat(() => bumpTextScale(TEXT_SCALE_STEP), textScale < TEXT_SCALE_MAX - 1e-6)
  const imageMinusHold = usePointerHoldRepeat(
    () => bumpImageScale(-IMAGE_SCALE_STEP),
    imageScale > IMAGE_SCALE_MIN + 1e-6,
  )
  const imagePlusHold = usePointerHoldRepeat(
    () => bumpImageScale(IMAGE_SCALE_STEP),
    imageScale < IMAGE_SCALE_MAX - 1e-6,
  )

  const deckProgressValue = useMemo(() => {
    if (visibleEntries.length <= 1) return 0
    const vi = visibleIndexFromFull(resolvedActiveFullIndex)
    const clampedVi = vi < 0 ? 0 : vi
    return clampedVi / (visibleEntries.length - 1)
  }, [resolvedActiveFullIndex, visibleEntries.length, visibleIndexFromFull])

  if (!open || typeof document === 'undefined' || slides.length === 0) return null

  const safeFullIndex = Math.min(Math.max(0, resolvedActiveFullIndex), slides.length - 1)
  const activeVisibleIndex = Math.max(0, visibleIndexFromFull(safeFullIndex))

  const overlayClass = [
    'case-study-presentation-overlay fixed left-0 top-0 z-[100000] box-border flex h-[100dvh] w-screen cursor-auto flex-col overflow-hidden font-mono text-fg antialiased transition-[color,background-color] duration-200 ease-out motion-reduce:transition-none',
    `presentation-theme-${theme}`,
  ].join(' ')

  const renderControlsToggle = (className?: string) => (
    <button
      ref={controlsToggleRef}
      type="button"
      className={className ?? ctrlBtnClass}
      aria-pressed={controlsVisible}
      aria-label={controlsVisible ? 'Hide presentation controls' : 'Show presentation controls'}
      onClick={() => setControlsVisible((v) => !v)}
    >
      <SlidersHorizontal {...iconInCtrl} aria-hidden />
    </button>
  )

  return createPortal(
    <div
      className={overlayClass}
      style={{ width: '100vw' }}
      role="dialog"
      aria-modal="true"
      aria-label="Presentation"
    >
      <div className="presentation-ambient-stack pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-bg transition-colors duration-200 ease-out motion-reduce:transition-none" />
        <div
          className={`figma-ambient-lines-shell transition-opacity duration-200 ease-out motion-reduce:transition-none ${
            theme === 'white' ? 'opacity-[0.22]' : 'opacity-100'
          }`}
        >
          <div className="relative min-h-dvh w-full">
            <AmbientVerticalLines />
          </div>
        </div>
      </div>

      {!controlsVisible ? (
        <div className="pointer-events-auto fixed left-2 top-2 z-[100005] md:left-3 md:top-3">{renderControlsToggle()}</div>
      ) : null}

      <div className="pointer-events-auto fixed right-2 top-2 z-[100006] md:right-3 md:top-3">
        <button
          type="button"
          aria-label="Close presentation"
          onClick={onClose}
          className={ctrlBtnClass}
        >
          <X {...iconInCtrl} aria-hidden />
        </button>
      </div>

      <div
        className={`relative z-[100003] grid shrink-0 overflow-hidden ${controlsBarGridAnimClass}`}
        style={{ gridTemplateRows: controlsVisible ? '1fr' : '0fr' }}
        inert={!controlsVisible ? true : undefined}
        aria-hidden={!controlsVisible}
      >
        <div className="min-h-0 overflow-hidden">
          <header
            className={`flex w-full shrink-0 items-center gap-1 border-b border-cell-border/50 bg-elevated/85 px-2 py-1 backdrop-blur-md will-change-transform md:gap-1.5 md:px-3 ${controlsBarTransformAnimClass} ${
              controlsVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
            style={{ minHeight: BAR_H }}
          >
            <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-1 overflow-x-auto md:gap-1.5 md:px-0">
              {renderControlsToggle()}

              <BarDivider />

              <span className="flex shrink-0 pl-0.5 text-fg-muted" aria-hidden>
                <TextAa {...iconInCtrl} />
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={textSlidesVisible}
                aria-label={textSlidesVisible ? 'Text slides on' : 'Text slides off'}
                onClick={() => setTextSlidesVisible((v) => !v)}
                className={`relative mx-0.5 h-5 w-9 shrink-0 rounded-full border transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 motion-reduce:transition-none ${
                  textSlidesVisible
                    ? 'border-black bg-white shadow-sm'
                    : 'border-white bg-black shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-hud)_22%,transparent)]'
                }`}
              >
                <span
                  className={`absolute left-[3px] top-1/2 size-3 rounded-full shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none ${
                    textSlidesVisible ? 'bg-black' : 'bg-white'
                  }`}
                  style={{
                    transform: textSlidesVisible ? 'translate(1.125rem, -50%)' : 'translate(0, -50%)',
                  }}
                />
              </button>
              <button
                type="button"
                className={ctrlBtnClass}
                aria-label="Increase text size"
                {...textPlusHold}
                disabled={textScale >= TEXT_SCALE_MAX - 1e-6}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return
                  e.preventDefault()
                  bumpTextScale(TEXT_SCALE_STEP)
                }}
              >
                <Plus {...iconInCtrl} aria-hidden />
              </button>
              <button
                type="button"
                className={ctrlBtnClass}
                aria-label="Decrease text size"
                {...textMinusHold}
                disabled={textScale <= TEXT_SCALE_MIN + 1e-6}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return
                  e.preventDefault()
                  bumpTextScale(-TEXT_SCALE_STEP)
                }}
              >
                <Minus {...iconInCtrl} aria-hidden />
              </button>
              <button type="button" className={ctrlBtnClass} aria-label="Reset text size" onClick={() => setTextScale(1)}>
                <ArrowClockwise {...iconInCtrl} aria-hidden />
              </button>

              <BarDivider />

              <span className="flex shrink-0 pl-0.5 text-fg-muted" aria-hidden>
                <ImageIcon {...iconInCtrl} />
              </span>
              <button
                type="button"
                className={ctrlBtnClass}
                aria-label="Increase image scale"
                {...imagePlusHold}
                disabled={imageScale >= IMAGE_SCALE_MAX - 1e-6}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return
                  e.preventDefault()
                  bumpImageScale(IMAGE_SCALE_STEP)
                }}
              >
                <Plus {...iconInCtrl} aria-hidden />
              </button>
              <button
                type="button"
                className={ctrlBtnClass}
                aria-label="Decrease image scale"
                {...imageMinusHold}
                disabled={imageScale <= IMAGE_SCALE_MIN + 1e-6}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return
                  e.preventDefault()
                  bumpImageScale(-IMAGE_SCALE_STEP)
                }}
              >
                <Minus {...iconInCtrl} aria-hidden />
              </button>
              <button type="button" className={ctrlBtnClass} aria-label="Reset image scale" onClick={() => setImageScale(1)}>
                <ArrowClockwise {...iconInCtrl} aria-hidden />
              </button>

              <BarDivider />

              <div className="flex shrink-0 items-center gap-1.5 pl-0.5" role="group" aria-label="Presentation theme">
                {(['gray', 'turquoise', 'pink', 'blue', 'white'] as const).map((t) => {
                  const sw = PRESENTATION_SWATCH[t]
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-label={sw.label}
                      aria-pressed={theme === t}
                      onClick={() => setTheme(t)}
                      className={`relative size-[18px] shrink-0 rounded-sm transition-[transform,background-color,border-color] duration-150 ease-out hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
                        theme === t ? `${sw.selected}` : sw.idle
                      }`}
                    >
                      {theme === t ? <ThemeSwatchSelectedIndicator className={sw.selectedDot} /> : null}
                    </button>
                  )
                })}
              </div>
            </div>
          </header>
        </div>
      </div>

      <div className="relative z-[100002] w-full shrink-0">
        <CaseStudyScrollProgressBar value={deckProgressValue} aria-label="Presentation slide progress" />
      </div>

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="relative z-[1] flex min-h-0 w-full flex-1 flex-row overflow-x-auto overflow-y-hidden"
        >
          {visibleEntries.map(({ slide, fullIndex }) => (
            <div
              key={fullIndex}
              className="box-border flex h-full min-h-0 shrink-0 cursor-auto"
              style={{ flex: '0 0 100%', width: '100%' }}
              aria-hidden={fullIndex !== safeFullIndex}
            >
              <div
                className="presentation-slide-body relative z-[1] box-border h-full min-h-0 w-full min-w-0 cursor-auto overflow-y-auto overflow-x-hidden px-5 py-8 transition-[zoom] duration-200 ease-out motion-reduce:transition-none md:px-10 md:py-10"
                style={{
                  /* Text +/- only affects text slides; default textScale 1 ⇒ 1.5× vs original copy. */
                  zoom: slide.slideKind === 'text' ? textScale * 1.5 : 1,
                }}
              >
                {slide.slideKind !== 'text' ? (
                  fullIndex === safeFullIndex ? (
                    <ImageSlidePanViewport
                      active
                      imageScale={imageScale}
                      pan={imagePan}
                      setPan={setImagePan}
                    >
                      <div
                        ref={(el) => {
                          slideCaptureRootsRef.current[fullIndex] = el
                        }}
                        className="presentation-slide-capture-root flex min-h-full w-full min-w-0 flex-col justify-center"
                      >
                        {slide.content}
                      </div>
                    </ImageSlidePanViewport>
                  ) : (
                    <div
                      className="presentation-slide-visual-scale mx-auto flex min-h-full w-full min-w-0 max-w-full flex-col justify-center"
                      style={{
                        transform: `scale(${imageScale})`,
                        transformOrigin: 'center center',
                      }}
                    >
                      <div
                        ref={(el) => {
                          slideCaptureRootsRef.current[fullIndex] = el
                        }}
                        className="presentation-slide-capture-root flex min-h-full w-full min-w-0 flex-col justify-center"
                      >
                        {slide.content}
                      </div>
                    </div>
                  )
                ) : (
                  <div
                    ref={(el) => {
                      slideCaptureRootsRef.current[fullIndex] = el
                    }}
                    className="presentation-slide-capture-root presentation-slide-text-v mx-auto flex min-h-full w-full min-w-0 max-w-full flex-col"
                  >
                    {slide.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`z-[4] grid w-full shrink-0 overflow-hidden ${controlsBarGridAnimClass}`}
          style={{ gridTemplateRows: controlsVisible ? '1fr' : '0fr' }}
          inert={!controlsVisible ? true : undefined}
          aria-hidden={!controlsVisible}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              ref={thumbStripRef}
              className={`flex w-full shrink-0 flex-col border-t border-cell-border bg-bg/95 backdrop-blur-sm will-change-transform ${controlsBarTransformAnimClass} ${
                controlsVisible ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{ height: THUMB_STRIP_H }}
            >
              <div className="flex h-full min-h-0 w-full items-stretch gap-2 px-2 py-2 md:gap-3 md:px-3">
                <button
                  type="button"
                  aria-label="Previous slide"
                  disabled={activeVisibleIndex <= 0}
                  onClick={() => goRelative(-1, true)}
                  className={`${ctrlBtnClass} my-auto self-center`}
                >
                  <CaretLeft {...iconInCtrl} aria-hidden />
                </button>
                <div className="flex min-h-0 min-w-0 flex-1 items-center gap-2 overflow-x-auto overflow-y-hidden md:gap-2.5">
                  {visibleEntries.map(({ slide, fullIndex }, vi) => {
                    const active = fullIndex === safeFullIndex
                    const staticThumb = resolvedThumbs[fullIndex]
                    const captured = capturedThumbs[fullIndex]
                    const isTextSlide = slide.slideKind === 'text'
                    const label = slide.thumbnailLabel?.trim()
                    const showVideoThumb = slide.thumbnailIsVideo === true
                    const showStripLabel =
                      !!label && (isTextSlide || slide.thumbnailStripUseLabel === true)
                    const thumbSrc = staticThumb ?? captured
                    return (
                      <button
                        key={fullIndex}
                        type="button"
                        data-presentation-thumb={vi}
                        aria-label={`Go to slide ${fullIndex + 1}`}
                        aria-current={active ? 'true' : undefined}
                        onClick={() => goToFullIndex(fullIndex)}
                        className={`relative h-20 w-[5.5rem] shrink-0 overflow-hidden rounded-sm border bg-elevated/40 transition-[opacity,box-shadow,border-color] duration-200 ease-out motion-reduce:transition-none md:w-24 ${
                          active
                            ? 'border-fg opacity-100 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-hud)_72%,transparent)]'
                            : 'border-cell-border opacity-70 hover:opacity-100'
                        }`}
                      >
                        {showVideoThumb ? (
                          <span className={thumbStripMiniLabelClass}>Video</span>
                        ) : showStripLabel ? (
                          <span className={thumbStripMiniLabelClass}>{label}</span>
                        ) : thumbSrc ? (
                          <img
                            src={thumbSrc}
                            alt=""
                            decoding="async"
                            loading="lazy"
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[10px] text-fg-muted">
                            {fullIndex + 1}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  aria-label="Next slide"
                  disabled={activeVisibleIndex >= visibleEntries.length - 1}
                  onClick={() => goRelative(1, true)}
                  className={`${ctrlBtnClass} my-auto self-center`}
                >
                  <CaretRight {...iconInCtrl} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
