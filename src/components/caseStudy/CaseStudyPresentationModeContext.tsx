import { createContext } from 'react'

/** Wired from {@link CaseStudyShowcaseScaffold}; ChamferFrame reads this when `presentationMediaIndex` is set. */
export type CaseStudyPresentationModeHandler = (index: number) => void

export const CaseStudyPresentationModeContext = createContext<CaseStudyPresentationModeHandler | null>(
  null,
)
