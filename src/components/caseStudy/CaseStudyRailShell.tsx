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
  /** When true, the rail column is hidden and main spans the full five-track width at `lg+`. */
  sidebarHidden?: boolean
}

const defaultAsideClass =
  'min-w-0 max-lg:hidden lg:col-span-1 lg:pr-[var(--figma-gutter)]'

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
  sidebarHidden = false,
}: CaseStudyRailShellProps) {
  const mainSpanClass = sidebarHidden ? 'lg:col-span-5' : 'lg:col-span-4'

  return (
    <FigmaFrame className={frameClassName}>
      <FigmaRailGrid className={gridClassName}>
        <aside
          id="case-study-sidebar"
          className={[
            defaultAsideClass,
            asideClassName,
            sidebarHidden ? 'hidden' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {sidebar}
        </aside>
        <div
          className={['min-w-0 max-w-full', mainSpanClass, mainClassName].filter(Boolean).join(' ')}
        >
          {children}
        </div>
      </FigmaRailGrid>
    </FigmaFrame>
  )
}
