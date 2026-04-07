import { useEffect, useMemo, useRef, useState } from 'react'
import type { KPISectionProps } from '../../../types/caseStudy'
import { caseStudyScrollAnchorClass, caseStudySectionHeadingClass } from './caseStudyPatternStyles'

type KpiMetricsGridProps = KPISectionProps & {
  headingId?: string
}

type ParsedKpi = {
  prefix: string
  to: number
  suffix: string
  fractionDigits: number
}

function parseKpiNumeric(raw: string): ParsedKpi | null {
  const trimmed = raw.trim()
  const match = trimmed.match(/^(.*?)(-?\d[\d,]*\.?\d*)(.*)$/s)
  if (!match) return null

  const prefix = match[1] ?? ''
  const numStr = (match[2] ?? '').replace(/,/g, '')
  const suffix = (match[3] ?? '').trim()
  if (suffix && /\d/.test(suffix)) return null

  const to = Number.parseFloat(numStr)
  if (Number.isNaN(to)) return null

  const frac = numStr.includes('.') ? (numStr.split('.')[1]?.length ?? 0) : 0
  return { prefix, to, suffix, fractionDigits: frac }
}

function formatKpiNumber(n: number, fractionDigits: number): string {
  if (fractionDigits > 0) return n.toFixed(fractionDigits)
  return String(Math.round(n))
}

function easeOutCubic(t: number): number {
  const u = 1 - t
  return 1 - u * u * u
}

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = () => setReduce(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduce
}

const kpiValueGlowClass = 'kpi-metric-value-glow'

function KpiAnimatedValue({ value }: { value: string }) {
  const parsed = useMemo(() => parseKpiNumeric(value), [value])
  const reduceMotion = usePrefersReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!parsed || reduceMotion) return
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setInView(entry.isIntersecting)
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [parsed, reduceMotion])

  useEffect(() => {
    if (!parsed || reduceMotion || !inView) return

    const durationMs = 620
    let start: number | null = null
    let frame = 0

    const step = (now: number) => {
      if (start === null) start = now
      const t = Math.min(1, (now - start) / durationMs)
      setProgress(easeOutCubic(t))
      if (t < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(frame)
      setProgress(0)
    }
  }, [parsed, inView, reduceMotion])

  if (!parsed) {
    return <span className={kpiValueGlowClass}>{value}</span>
  }

  if (reduceMotion) {
    return (
      <span className={kpiValueGlowClass}>
        {parsed.prefix}
        {formatKpiNumber(parsed.to, parsed.fractionDigits)}
        {parsed.suffix}
      </span>
    )
  }

  const n = inView ? parsed.to * progress : 0
  const text = `${parsed.prefix}${formatKpiNumber(n, parsed.fractionDigits)}${parsed.suffix}`

  return (
    <span ref={ref} className={kpiValueGlowClass}>
      {text}
    </span>
  )
}

/** KPI row: large tabular values + label + description (canvas layout; no chamfer cards). */
export function KpiMetricsGrid({ title, metrics, headingId }: KpiMetricsGridProps) {
  return (
    <>
      {title ? (
        <h2
          id={headingId}
          className={`${caseStudySectionHeadingClass} ${caseStudyScrollAnchorClass}`}
        >
          {title}
        </h2>
      ) : null}
      {metrics.map((k, i) => (
        <div key={`${k.label}-${i}`} className="col-span-12 md:col-span-4">
          <p className="text-4xl font-normal tabular-nums tracking-tight text-fg md:text-[76px] md:leading-none">
            <KpiAnimatedValue value={k.value} />
          </p>
          <p className="mt-2 text-sm font-medium text-fg">{k.label}</p>
          {k.description ? (
            <p className="mt-3 text-xs leading-relaxed text-fg-muted md:text-sm">{k.description}</p>
          ) : null}
        </div>
      ))}
    </>
  )
}
