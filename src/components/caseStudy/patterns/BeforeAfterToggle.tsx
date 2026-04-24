import { ChamferFrame } from '../../system/ChamferFrame'

export type BeforeAfterMode = 'before' | 'after'

type BeforeAfterToggleProps = {
  mode: BeforeAfterMode
  onModeChange: (mode: BeforeAfterMode) => void
  beforeLabel?: string
  afterLabel?: string
}

/** Chamfered before/after control (CSS: `.comparison-toggle-*` in `index.css`). */
export function BeforeAfterToggle({
  mode,
  onModeChange,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: BeforeAfterToggleProps) {
  const afterActive = mode === 'after'

  const inactiveClass =
    'bg-transparent text-fg [@media(hover:hover)]:hover:bg-fg/[0.06]'

  return (
    <>
      <ChamferFrame
        clipToChamfer={false}
        className="comparison-toggle-shell hidden h-14 w-full max-w-[294px] min-w-0 md:block [--quadrant-chamfer:clamp(16px,5.5vmin,24px)]"
        innerClassName="relative z-10 h-full min-h-0 w-full p-0"
      >
        <button
          type="button"
          onClick={() => onModeChange('before')}
          className={`comparison-toggle-btn-before absolute inset-y-0 left-0 w-1/2 cursor-pointer border-0 text-center text-[0.9375rem] font-normal leading-none transition-colors focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 sm:text-base ${
            !afterActive ? 'bg-fg text-bg' : inactiveClass
          }`}
        >
          {beforeLabel}
        </button>
        <button
          type="button"
          onClick={() => onModeChange('after')}
          className={`comparison-toggle-btn-after absolute inset-y-0 right-0 w-1/2 cursor-pointer border-0 text-center text-[0.9375rem] font-normal leading-none transition-colors focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 sm:text-base ${
            afterActive ? 'bg-fg text-bg' : inactiveClass
          }`}
        >
          {afterLabel}
        </button>
      </ChamferFrame>

      <div
        className="flex w-full min-w-0 max-w-[min(100%,20rem)] flex-col overflow-hidden rounded-sm border border-cell-border/90 bg-elevated/20 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-cell-border)_50%,transparent)] md:hidden"
        role="group"
        aria-label="Before and after"
      >
        <button
          type="button"
          onClick={() => onModeChange('before')}
          className={`h-11 w-full min-w-0 cursor-pointer border-0 px-3 py-2 text-center text-[0.8125rem] font-normal leading-tight transition-colors sm:text-sm ${
            !afterActive ? 'bg-fg text-bg' : `text-fg ${inactiveClass}`
          }`}
        >
          {beforeLabel}
        </button>
        <div className="h-px w-full shrink-0 bg-cell-border/70" aria-hidden />
        <button
          type="button"
          onClick={() => onModeChange('after')}
          className={`h-11 w-full min-w-0 cursor-pointer border-0 px-3 py-2 text-center text-[0.8125rem] font-normal leading-tight transition-colors sm:text-sm ${
            afterActive ? 'bg-fg text-bg' : `text-fg ${inactiveClass}`
          }`}
        >
          {afterLabel}
        </button>
      </div>
    </>
  )
}
