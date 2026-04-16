import type { ReactNode } from 'react'

type ProblemStatementFrameProps = {
  id?: string
  /** Small caps label centered on the top rule (default: Problem). */
  label?: string
  children: ReactNode
  /** Renders below the dashed rule (still inside the section). */
  afterRule?: ReactNode
  className?: string
  /** Extra classes on the bracketed statement row (e.g. `font-mono`). */
  framedStatementClassName?: string
}

/** SVG bracket stroke matches body scale (~1px–2px); stretches with row height. */
function ProblemBracket({
  side,
  accentClassName = 'text-fg',
}: {
  side: 'left' | 'right'
  accentClassName?: string
}) {
  const d =
    side === 'left'
      ? 'M 12 4 H 3 V 96 H 12'
      : 'M 2 4 H 11 V 96 H 2'
  return (
    <div
      className={`flex w-[0.5em] shrink-0 self-stretch text-current ${accentClassName}`}
      aria-hidden
    >
      <svg className="h-full min-h-0 w-full" viewBox="0 0 14 100" preserveAspectRatio="none">
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="square"
          strokeLinejoin="miter"
          vectorEffect="nonScalingStroke"
        />
      </svg>
    </div>
  )
}

const bodyRowFlex =
  'flex items-stretch justify-center gap-1 text-[1.75rem] leading-relaxed md:gap-2 md:text-[2rem] md:leading-relaxed'

function ProblemFramedRow({
  children,
  accentClassName,
  className = '',
}: {
  children: ReactNode
  accentClassName: string
  /** Merged after base row styles (e.g. font-mono). */
  className?: string
}) {
  return (
    <div className={[bodyRowFlex, className].filter(Boolean).join(' ')}>
      <ProblemBracket side="left" accentClassName={accentClassName} />
      <div
        className={`flex min-w-0 flex-1 flex-col justify-center gap-4 text-center font-normal md:gap-6 ${accentClassName}`}
      >
        {children}
      </div>
      <ProblemBracket side="right" accentClassName={accentClassName} />
    </div>
  )
}

export type ProblemStatementGlitchFramedBlockProps = {
  children: ReactNode
  /** Extra classes on the outer bracket row (same scale as Problem statement body). */
  frameClassName?: string
  /** Extra classes on the relative glitch wrapper (e.g. max width). */
  containerClassName?: string
}

/**
 * RGB ghost glitch + full-height SVG brackets — same treatment as the body copy in
 * {@link ProblemStatementFrame}, for reuse in other sections.
 */
export function ProblemStatementGlitchFramedBlock({
  children,
  frameClassName = '',
  containerClassName = '',
}: ProblemStatementGlitchFramedBlockProps) {
  return (
    <div className={['relative mx-auto w-full min-w-0', containerClassName].filter(Boolean).join(' ')}>
      <div className="problem-statement-glitch-ghost problem-statement-glitch-ghost--c pointer-events-none absolute inset-0 z-0">
        <ProblemFramedRow accentClassName="text-[rgba(94,214,255,0.82)]" className={frameClassName}>
          {children}
        </ProblemFramedRow>
      </div>
      <div className="problem-statement-glitch-ghost problem-statement-glitch-ghost--r pointer-events-none absolute inset-0 z-0">
        <ProblemFramedRow accentClassName="text-[rgba(255,105,145,0.82)]" className={frameClassName}>
          {children}
        </ProblemFramedRow>
      </div>
      <div className="relative z-10">
        <ProblemFramedRow accentClassName="text-fg" className={frameClassName}>
          {children}
        </ProblemFramedRow>
      </div>
    </div>
  )
}

/**
 * Framed problem / statement block: solid rule with centered label, brackets around body copy
 * (bracket height follows the text block), dashed rule below, optional `afterRule` under that line.
 */
export function ProblemStatementFrame({
  id,
  label = 'Problem',
  children,
  afterRule = null,
  className = '',
  framedStatementClassName = '',
}: ProblemStatementFrameProps) {
  return (
    <section id={id} className={`w-full ${className}`}>
      <div className="relative flex justify-center">
        <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-cell-border" aria-hidden />
        <span className="relative bg-bg px-4 text-[10px] font-normal uppercase tracking-[0.14em] text-fg md:text-[11px]">
          {label}
        </span>
      </div>

      <div className="relative mx-auto mt-10 max-w-4xl px-2 md:mt-14 md:px-4">
        <ProblemStatementGlitchFramedBlock frameClassName={framedStatementClassName}>
          {children}
        </ProblemStatementGlitchFramedBlock>
      </div>

      <div
        className="mt-10 border-t border-dashed border-cell-border md:mt-14"
        aria-hidden
      />
      {afterRule ? <div className="mt-10 w-full md:mt-14">{afterRule}</div> : null}
    </section>
  )
}
