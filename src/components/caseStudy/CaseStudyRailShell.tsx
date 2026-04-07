import type { ReactNode } from 'react'
import { FigmaFrame, FigmaRailGrid } from '../system/FigmaGrid'

type CaseStudyRailShellProps = {
  /** Left-rail content (TOC, meta, etc.). */
  sidebar: ReactNode
  /** Main column (hero, sections, footer slots). */
  children: ReactNode
  frameClassName?: string
  gridClassName?: string
  asideClassName?: string
  mainClassName?: string
}

const defaultAsideClass =
  'min-w-0 lg:col-span-1 lg:pr-[var(--figma-gutter)]'

const defaultMainClass = 'min-w-0 lg:col-span-4'

/**
 * Shared Figma rail (5-track grid): one sidebar column + four-track main.
 * Wire the same shell on production case studies, component reference pages, or future long-form pages.
 */
export function CaseStudyRailShell({
  sidebar,
  children,
  frameClassName = '',
  gridClassName = '',
  asideClassName = '',
  mainClassName = '',
}: CaseStudyRailShellProps) {
  return (
    <FigmaFrame className={frameClassName}>
      <FigmaRailGrid className={gridClassName}>
        <aside className={[defaultAsideClass, asideClassName].filter(Boolean).join(' ')}>
          {sidebar}
        </aside>
        <div className={[defaultMainClass, mainClassName].filter(Boolean).join(' ')}>
          {children}
        </div>
      </FigmaRailGrid>
    </FigmaFrame>
  )
}
