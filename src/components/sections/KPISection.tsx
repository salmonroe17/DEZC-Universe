import { useId } from 'react'
import type { KPISectionProps } from '../../types/caseStudy'
import { KpiMetricsGrid } from '../caseStudy/patterns/KpiMetricsGrid'
import { FigmaGrid12 } from '../system/FigmaGrid'

export function KPISection({ title, metrics, headingId: headingIdProp }: KPISectionProps) {
  const autoId = useId()
  const titleId = headingIdProp ?? autoId

  return (
    <FigmaGrid12 aria-labelledby={title ? titleId : undefined}>
      <KpiMetricsGrid title={title} metrics={metrics} headingId={title ? titleId : undefined} />
    </FigmaGrid12>
  )
}
