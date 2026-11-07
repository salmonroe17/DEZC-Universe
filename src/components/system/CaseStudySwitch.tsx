import type { ButtonHTMLAttributes } from 'react'
import { caseStudyChamferToggleTrackClassName, caseStudyChamferToggleKnobClassName } from '../caseStudy/patterns/caseStudyPatternStyles'

/** Annotation switch shared by the real case studies, decks and catalog. */
export function CaseStudySwitch({ checked, className = '', ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { checked: boolean }) {
  return <button type="button" {...props} data-ui="switch" role="switch" aria-checked={checked} className={`${caseStudyChamferToggleTrackClassName(checked)} ${className}`}><span aria-hidden className={caseStudyChamferToggleKnobClassName(checked)}/></button>
}
