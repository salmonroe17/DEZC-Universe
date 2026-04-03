import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { pageTransitionVariants } from './variants'

type PageTransitionProps = {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariants}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  )
}
