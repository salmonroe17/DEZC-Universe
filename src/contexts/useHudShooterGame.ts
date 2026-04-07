import { useContext } from 'react'
import { HudShooterContext, type HudShooterContextValue } from './hudShooterContext'

export function useHudShooterGame(): HudShooterContextValue {
  return useContext(HudShooterContext)
}
