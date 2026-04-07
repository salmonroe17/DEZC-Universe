import { createContext } from 'react'

export type HudShooterContextValue = {
  active: boolean
  setActive: (v: boolean) => void
}

const defaultValue: HudShooterContextValue = {
  active: false,
  setActive: () => {},
}

export const HudShooterContext = createContext<HudShooterContextValue>(defaultValue)
