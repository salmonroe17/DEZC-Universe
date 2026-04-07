import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

const DEFAULT_BAR_CLASS =
  'site-frosted-nav fixed inset-x-0 top-0 z-[80] flex flex-wrap items-center justify-between gap-4 py-4 figma-frame'

type CaseStudyPortaledHeaderProps = {
  children: ReactNode
  /** Merged after defaults for the fixed wrapper (layout row: space-between). */
  className?: string
}

/**
 * Fixed frosted header portaled to `document.body` + in-flow spacer so content clears the bar.
 * Use on any route that needs the case-study-style top chrome without duplicating ResizeObserver logic.
 */
export function CaseStudyPortaledHeader({
  children,
  className = '',
}: CaseStudyPortaledHeaderProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(56)

  useLayoutEffect(() => {
    const el = barRef.current
    if (!el) return undefined

    const sync = () => setHeight(Math.ceil(el.getBoundingClientRect().height))
    sync()

    const ro = new ResizeObserver(sync)
    ro.observe(el)
    window.addEventListener('resize', sync)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [])

  const bar = (
    <div ref={barRef} className={[DEFAULT_BAR_CLASS, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )

  return (
    <>
      {typeof document !== 'undefined' ? createPortal(bar, document.body) : null}
      <div className="shrink-0" style={{ height }} aria-hidden />
    </>
  )
}
