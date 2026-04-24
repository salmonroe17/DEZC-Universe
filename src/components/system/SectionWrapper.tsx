import type { ReactNode } from 'react'

type SectionWrapperProps = {
  id: string
  children: ReactNode
  className?: string
}

export function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-[calc(var(--cs-components-header-h,7.5rem)+0.75rem)] ${className}`}
    >
      {children}
    </section>
  )
}
