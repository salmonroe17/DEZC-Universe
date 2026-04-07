import { ComparisonShowcase } from '../caseStudy/patterns'
import type { ComparisonSectionProps } from '../../types/caseStudy'

export function ComparisonSection({
  title,
  before,
  after,
  bullets,
  caption,
  titleAlign = 'center',
}: ComparisonSectionProps) {
  return (
    <ComparisonShowcase
      title={title}
      titleAlign={titleAlign}
      before={before}
      after={after}
      bullets={bullets}
      caption={caption}
    />
  )
}
