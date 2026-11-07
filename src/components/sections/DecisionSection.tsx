import type { DecisionSectionProps } from '../../types/caseStudy'
import { ChamferFrame } from '../system/ChamferFrame'

export function DecisionSection({ title, items }: DecisionSectionProps) {
  return (
    <div>
      {title ? (
        <h2 className="text-2xl font-bold tracking-tight text-fg md:text-3xl">{title}</h2>
      ) : null}
      <ul className={`flex flex-col gap-4 ${title ? 'mt-8 md:mt-10' : ''}`}>
        {items.map((item, i) => (
          <li key={i} className="list-none">
            <ChamferFrame innerClassName="bg-elevated/25 px-5 py-5 md:px-6 md:py-6">
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
                  Insight
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg/85 md:text-base">
                  {item.insight}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
                  Decision
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg/85 md:text-base">
                  {item.decision}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
                  Outcome
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg/85 md:text-base">
                  {item.outcome}
                </p>
              </div>
            </div>
            </ChamferFrame>
          </li>
        ))}
      </ul>
    </div>
  )
}
