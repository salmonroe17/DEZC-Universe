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
      className={`scroll-mt-28 md:scroll-mt-32 ${className}`}
    >
      {children}
    </section>
  )
}
