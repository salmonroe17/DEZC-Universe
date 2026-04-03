import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type HudShooterContextValue = {
  active: boolean
  setActive: (v: boolean) => void
}

const defaultValue: HudShooterContextValue = {
  active: false,
  setActive: () => {},
}

const HudShooterContext = createContext<HudShooterContextValue>(defaultValue)

export function HudShooterProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)
  const value = useMemo(() => ({ active, setActive }), [active])
  return (
    <HudShooterContext.Provider value={value}>
      {children}
    </HudShooterContext.Provider>
  )
}

export function useHudShooterGame(): HudShooterContextValue {
  return useContext(HudShooterContext)
}
