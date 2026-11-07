import type { StatementSectionProps } from '../../types/caseStudy'

export function StatementSection({ statement, subtext }: StatementSectionProps) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-2xl font-semibold leading-snug tracking-tight text-fg md:text-3xl md:leading-tight">
        {statement}
      </p>
      {subtext ? (
        <p className="mt-6 text-sm leading-relaxed text-fg-muted md:text-base">{subtext}</p>
      ) : null}
    </div>
  )
}
