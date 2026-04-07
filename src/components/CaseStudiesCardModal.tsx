import { useCallback, useEffect, useRef, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import {
  CASE_STUDIES_MODAL_SHELL_WIDTH_CLASS,
  ExperimentalCaseStudiesPanel,
} from './ExperimentalCaseStudiesPanel'

type CaseStudiesCardModalProps = {
  open: boolean
  onClose: () => void
}

/**
 * Centers the same {@link ExperimentalCaseStudiesPanel} (`footer` layout) as the home grid / case
 * study footers — for quick access from in-page nav without leaving the route.
 */
export function CaseStudiesCardModal({ open, onClose }: CaseStudiesCardModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return undefined

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus({ preventScroll: true })

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  const onBackdropClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex cursor-default items-center justify-center bg-[color-mix(in_srgb,var(--color-bg)_72%,transparent)] p-4 backdrop-blur-[3px]"
      role="presentation"
      onClick={onBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Case studies"
        className={`max-h-[min(92dvh,920px)] cursor-auto overflow-y-auto overflow-x-hidden ${CASE_STUDIES_MODAL_SHELL_WIDTH_CLASS}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ExperimentalCaseStudiesPanel
          layout="footer"
          footerColumn="modal-wide"
          topRightSlot={
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-9 items-center justify-center rounded-sm border border-cell-border/80 bg-bg/95 text-fg shadow-sm transition-colors hover:border-hud/45 hover:bg-elevated/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <svg
                className="size-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          }
        />
      </div>
    </div>,
    document.body,
  )
}
