import { useMemo, useState, type ReactNode } from 'react'
import { HudShooterContext } from './hudShooterContext'

export function HudShooterProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)
  const value = useMemo(() => ({ active, setActive }), [active])
  return (
    <HudShooterContext.Provider value={value}>{children}</HudShooterContext.Provider>
  )
}
