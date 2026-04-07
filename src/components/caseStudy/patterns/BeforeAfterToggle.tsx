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

  return (
    <ChamferFrame
      clipToChamfer={false}
      className="comparison-toggle-shell h-14 w-full max-w-[294px] [--quadrant-chamfer:clamp(16px,5.5vmin,24px)]"
      innerClassName="relative z-10 h-full min-h-0 w-full p-0"
    >
      <button
        type="button"
        onClick={() => onModeChange('before')}
        className={`comparison-toggle-btn-before absolute inset-y-0 left-0 w-1/2 cursor-pointer border-0 text-center font-normal text-base leading-none transition-colors focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
          !afterActive
            ? 'bg-fg text-bg'
            : 'bg-transparent text-fg hover:bg-fg/[0.06]'
        }`}
      >
        {beforeLabel}
      </button>
      <button
        type="button"
        onClick={() => onModeChange('after')}
        className={`comparison-toggle-btn-after absolute inset-y-0 right-0 w-1/2 cursor-pointer border-0 text-center font-normal text-base leading-none transition-colors focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg/55 ${
          afterActive
            ? 'bg-fg text-bg'
            : 'bg-transparent text-fg hover:bg-fg/[0.06]'
        }`}
      >
        {afterLabel}
      </button>
    </ChamferFrame>
  )
}
