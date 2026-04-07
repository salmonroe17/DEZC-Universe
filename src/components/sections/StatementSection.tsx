import type { StatementSectionProps } from '../../types/caseStudy'

export function StatementSection({ statement, subtext }: StatementSectionProps) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-2xl font-semibold leading-snug tracking-tight text-zinc-50 md:text-3xl md:leading-tight">
        {statement}
      </p>
      {subtext ? (
        <p className="mt-6 text-sm leading-relaxed text-zinc-400 md:text-base">{subtext}</p>
      ) : null}
    </div>
  )
}
