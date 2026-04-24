import { CaretDown, ListDashes, X } from '@phosphor-icons/react'
import { forwardRef, useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { NavSection } from './useCaseStudyScrollspy'
import { CASE_STUDY_SIDEBAR_TOP_ID } from './useCaseStudyScrollspy'

const MODAL_Z = 150

// --- Sticky second row (lives in portaled case study header, max-lg only) ---

type CaseStudyMobileSectionsRowProps = {
  sections: NavSection[]
  activeId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Shared with the fullscreen modal `aria-labelledby` / row `aria-controls`. */
  dialogTitleId: string
}

/**
 * Full-width second chrome row under main nav. Entire bar is one hit target; matches nav min height.
 */
export const CaseStudyMobileSectionsRow = forwardRef<HTMLButtonElement, CaseStudyMobileSectionsRowProps>(
  function CaseStudyMobileSectionsRow(
    { sections, activeId, open, onOpenChange, dialogTitleId },
    ref,
  ) {
    if (sections.length === 0) return null

    const countLabel = (() => {
      const content = sections.filter((s) => s.id !== CASE_STUDY_SIDEBAR_TOP_ID)
      const n = content.length
      if (n === 0) return null
      const idx = content.findIndex((s) => s.id === activeId)
      const oneBased = idx >= 0 ? idx + 1 : 1
      return `${oneBased} / ${n}`
    })()

    const currentLabel =
      (activeId && sections.find((s) => s.id === activeId)?.label) ??
      (activeId === CASE_STUDY_SIDEBAR_TOP_ID ? 'Top of page' : sections[0]?.label ?? '—')

    return (
      <div className="w-full min-w-0 max-w-full border-t border-cell-border/50 site-frosted-nav bg-bg/[0.88] shadow-[0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-md supports-[backdrop-filter]:bg-bg/78">
        <button
          ref={ref}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? dialogTitleId : undefined}
          onClick={() => onOpenChange(true)}
          className="cs-mobile-sections-bar group flex w-full min-h-12 max-w-full cursor-pointer select-none border-0 bg-transparent px-0 text-left text-fg outline-none transition-[background-color,box-shadow] active:bg-surface/45 [@media(hover:hover)]:hover:bg-surface/30 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-hud/55"
        >
          <div className="flex h-12 w-full min-w-0 max-w-full items-center gap-2 px-4 font-mono md:gap-3 md:px-6">
            <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-fg/85 md:text-xs">
              <span
                className="inline-flex size-4 min-h-4 min-w-4 shrink-0 items-center justify-center text-fg/85"
                aria-hidden
              >
                <ListDashes className="size-4" size={16} weight="regular" />
              </span>
              <span className="whitespace-nowrap">Sections</span>
            </span>
            <span
              className="mx-0.5 h-4 w-px shrink-0 bg-cell-border/80 md:mx-1"
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-center text-[12px] font-normal text-fg/95 sm:text-[13px]">
              {currentLabel}
            </span>
            <span className="flex shrink-0 items-center gap-1 pl-1 text-[10px] font-medium tabular-nums sm:text-[11px]">
              {countLabel ? <span className="text-fg/65">{countLabel}</span> : null}
              <span
                className="inline-flex size-4 min-h-4 min-w-4 shrink-0 items-center justify-center text-fg/40 transition-transform [@media(hover:hover)]:group-hover:translate-y-px"
                aria-hidden
              >
                <CaretDown className="size-4" size={16} weight="regular" />
              </span>
            </span>
          </div>
        </button>
      </div>
    )
  },
)

CaseStudyMobileSectionsRow.displayName = 'CaseStudyMobileSectionsRow'

// --- Fullscreen map modal (portaled) ---

type CaseStudyMobileSectionsModalProps = {
  sections: NavSection[]
  activeId: string | null
  onNavigate: (id: string) => void
  open: boolean
  onClose: () => void
  /** Must match the row’s aria-controls id when open. */
  titleId: string
}

export function CaseStudyMobileSectionsModal({
  sections,
  activeId,
  onNavigate,
  open,
  onClose,
  titleId,
}: CaseStudyMobileSectionsModalProps) {
  const reduceMotion = useReducedMotion()
  const listRef = useRef<HTMLUListElement | null>(null)
  const closeRef = useRef(onClose)
  const touchStartY = useRef(0)
  const autoTitleId = useId()
  const effectiveTitleId = titleId && titleId.length > 0 ? titleId : autoTitleId

  closeRef.current = onClose

  const onPick = useCallback(
    (id: string) => {
      onNavigate(id)
      onClose()
    },
    [onNavigate, onClose],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => {
      const el = activeId
        ? listRef.current?.querySelector<HTMLButtonElement>(`[data-section-id="${activeId}"]`)
        : listRef.current?.querySelector<HTMLButtonElement>('button')
      el?.focus()
    }, 0)
    return () => window.clearTimeout(t)
  }, [open, activeId])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  if (sections.length === 0) return null

  const transition = reduceMotion
    ? { duration: 0.01 }
    : { type: 'tween' as const, duration: 0.32, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] }

  const body = (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="cs-sections-fullscreen"
          className="fixed inset-0 flex min-h-0 min-w-0 flex-col"
          style={{ zIndex: MODAL_Z }}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={reduceMotion ? { duration: 0.01 } : { duration: 0.22 }}
        >
          <div
            className="absolute inset-0 bg-black/82 backdrop-blur-md"
            aria-hidden
            onClick={onClose}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage: `
                linear-gradient(color-mix(in srgb, var(--color-fg) 10%, transparent) 1px, transparent 1px),
                linear-gradient(90deg, color-mix(in srgb, var(--color-fg) 10%, transparent) 1px, transparent 1px)`,
              backgroundSize: '22px 22px',
            }}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={effectiveTitleId}
            className="pointer-events-auto relative z-[1] m-0 flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden bg-bg/92 shadow-[0_0_0_1px_rgba(255,255,255,0.05),inset_0_0_100px_rgba(0,200,200,0.05)]"
            initial={reduceMotion ? false : { y: 14, opacity: 0.98, filter: 'blur(5px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={reduceMotion ? undefined : { y: 10, opacity: 0, filter: 'blur(3px)' }}
            transition={transition}
            onTouchStart={(e) => {
              touchStartY.current = e.touches[0]?.clientY ?? 0
            }}
            onTouchEnd={(e) => {
              const y = e.changedTouches[0]?.clientY ?? 0
              if (touchStartY.current - y < -88) onClose()
            }}
          >
            <div
              className="flex shrink-0 items-center justify-between gap-3 border-b border-cell-border/50 px-4 py-4 font-mono md:px-6"
              onTouchStart={(e) => {
                touchStartY.current = e.touches[0]?.clientY ?? 0
              }}
              onTouchEnd={(e) => {
                const y = e.changedTouches[0]?.clientY ?? 0
                if (touchStartY.current - y < -88) onClose()
              }}
            >
              <h2
                id={effectiveTitleId}
                className="m-0 text-sm font-medium uppercase tracking-[0.2em] text-fg/90 md:text-base"
              >
                Sections
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-2 font-mono text-xs text-fg-muted transition-colors [@media(hover:hover)]:hover:text-fg"
                aria-label="Close navigation"
              >
                Close
                <span
                  className="inline-flex size-4 min-h-4 min-w-4 shrink-0 items-center justify-center text-fg"
                  aria-hidden
                >
                  <X className="size-4" size={16} weight="regular" />
                </span>
              </button>
            </div>
            <nav
              className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-2 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] md:px-4"
              aria-label="Case study sections"
            >
              <ul ref={listRef} className="m-0 flex list-none flex-col gap-0.5 p-0">
                {sections.map(({ id, label }, index) => {
                  const isActive = activeId === id
                  const n = String(index + 1).padStart(2, '0')
                  return (
                    <li key={id} className="m-0 p-0">
                      <button
                        type="button"
                        data-section-id={id}
                        onClick={() => onPick(id)}
                        className={[
                          'flex w-full min-w-0 items-baseline gap-3 border-0 py-3.5 pl-3 pr-3 text-left font-mono transition-all md:py-4',
                          isActive
                            ? 'bg-elevated/90 text-fg'
                            : 'text-fg/60 [@media(hover:hover)]:hover:bg-surface/55 [@media(hover:hover)]:hover:text-fg/95',
                        ].join(' ')}
                        style={
                          isActive
                            ? {
                                boxShadow: `
                                  inset 3px 0 0 0 color-mix(in srgb, var(--color-hud) 85%, white),
                                  0 0 0 1px color-mix(in srgb, var(--color-hud) 25%, transparent),
                                  0 0 28px color-mix(in srgb, var(--color-hud) 15%, transparent)`,
                                paddingLeft: 'calc(0.75rem - 3px)',
                              }
                            : undefined
                        }
                      >
                        <span
                          className={[
                            'w-8 shrink-0 text-[11px] tabular-nums sm:w-9 sm:text-xs',
                            isActive ? 'text-hud' : 'text-fg/35',
                          ].join(' ')}
                        >
                          {n}
                        </span>
                        <span
                          className={[
                            'min-w-0 flex-1 text-sm leading-snug sm:text-base',
                            isActive ? 'font-medium text-fg' : 'font-normal',
                          ].join(' ')}
                        >
                          {label}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  if (typeof document === 'undefined') return null
  return createPortal(body, document.body)
}

