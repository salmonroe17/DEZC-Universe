import type { ReactNode } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AmbientVerticalLines } from '../AmbientVerticalLines'

const PRESENTATION_BODY_CLASS = 'case-study-presentation-overlay-open'

export type CaseStudyPresentationSlide = {
  /** Same structure and styling as the case study page — horizontal deck only adds viewport paging. */
  content: ReactNode
}

type CaseStudyPresentationOverlayProps = {
  open: boolean
  activeIndex: number
  slides: CaseStudyPresentationSlide[]
  onClose: () => void
}

export function CaseStudyPresentationOverlay({
  open,
  activeIndex,
  slides,
  onClose,
}: CaseStudyPresentationOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const syncScrollToActive = useCallback(() => {
    const el = scrollRef.current
    if (!el || !open) return
    const w = el.clientWidth
    el.scrollLeft = activeIndex * w
  }, [activeIndex, open])

  useLayoutEffect(() => {
    syncScrollToActive()
  }, [syncScrollToActive])

  useEffect(() => {
    if (!open) return
    const onResize = () => syncScrollToActive()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open, syncScrollToActive])

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
    closeBtnRef.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open || typeof document === 'undefined' || slides.length === 0) return null

  const safeIndex = Math.min(Math.max(0, activeIndex), slides.length - 1)

  return createPortal(
    <div
      className="case-study-presentation-overlay fixed left-0 top-0 z-[100000] box-border h-screen w-screen cursor-auto overflow-hidden font-mono text-fg antialiased"
      style={{ width: '100vw', height: '100vh' }}
      role="dialog"
      aria-modal="true"
      aria-label="Presentation"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-bg" />
        <div className="figma-ambient-lines-shell">
          <div className="relative min-h-dvh w-full">
            <AmbientVerticalLines />
          </div>
        </div>
      </div>
      <button
        ref={closeBtnRef}
        type="button"
        aria-label="Close presentation"
        onClick={onClose}
        className="fixed right-4 top-4 z-[100002] flex size-11 cursor-pointer items-center justify-center border border-cell-border bg-elevated p-0 text-xl font-light leading-none text-fg shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55"
      >
        ×
      </button>

      <div
        ref={scrollRef}
        className="relative z-[1] flex h-full w-full flex-row overflow-x-auto overflow-y-hidden"
        style={{ height: '100%' }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="box-border flex h-screen w-screen shrink-0 cursor-auto"
            style={{ width: '100vw', height: '100vh' }}
            aria-hidden={i !== safeIndex}
          >
            <div className="relative z-[1] flex h-full min-h-0 w-full min-w-0 cursor-auto flex-col overflow-y-auto overflow-x-hidden px-5 py-10 md:px-10 md:py-12">
              {slide.content}
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body,
  )
}
