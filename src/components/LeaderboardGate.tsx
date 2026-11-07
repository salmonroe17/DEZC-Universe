import { useId, type FormEventHandler } from 'react'
import { PortfolioButton, PortfolioTextField } from './system/PortfolioControls'

/** Shared visual gate; authentication remains the caller's responsibility. */
export function LeaderboardGate({ password, onPasswordChange, onSubmit, error = false }: {
  password: string
  onPasswordChange: (value: string) => void
  onSubmit: FormEventHandler<HTMLFormElement>
  error?: boolean
}) {
  const id = useId()
  return <form onSubmit={onSubmit} className="mt-8 max-w-sm rounded border border-cell-border/80 bg-elevated/30 p-4 font-mono">
    <label htmlFor={id} className="block text-[10px] uppercase tracking-[0.1em] text-fg-muted">Password</label>
    <PortfolioTextField id={id} type="password" autoComplete="off" value={password} onChange={event => onPasswordChange(event.target.value)} className="mt-2" aria-invalid={error || undefined} aria-describedby={error ? `${id}-error` : undefined}/>
    {error && <p id={`${id}-error`} className="mt-2 text-xs text-fg-muted" role="alert">Incorrect password.</p>}
    <PortfolioButton type="submit" className="mt-4">View leaderboard</PortfolioButton>
  </form>
}
