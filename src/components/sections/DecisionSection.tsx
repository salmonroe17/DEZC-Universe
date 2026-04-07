import type { DecisionSectionProps } from '../../types/caseStudy'
import { ChamferFrame } from '../system/ChamferFrame'

export function DecisionSection({ title, items }: DecisionSectionProps) {
  return (
    <div>
      {title ? (
        <h2 className="text-2xl font-bold tracking-tight text-zinc-50 md:text-3xl">{title}</h2>
      ) : null}
      <ul className={`flex flex-col gap-4 ${title ? 'mt-8 md:mt-10' : ''}`}>
        {items.map((item, i) => (
          <li key={i} className="list-none">
            <ChamferFrame innerClassName="bg-zinc-900/25 px-5 py-5 md:px-6 md:py-6">
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Insight
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                  {item.insight}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Decision
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                  {item.decision}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Outcome
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
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
