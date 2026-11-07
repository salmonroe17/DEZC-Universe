import { ChamferFrame } from './ChamferFrame'

type PlaceholderVisualProps = {
  label: string
  className?: string
}

/** Chamfered placeholder for case study visuals. */
export function PlaceholderVisual({ label, className = '' }: PlaceholderVisualProps) {
  return (
    <ChamferFrame
      className={`chamfer-media-border w-full ${className}`}
      innerClassName="flex min-h-[200px] items-center justify-center bg-elevated/35 px-4 py-8 md:min-h-[240px]"
    >
      <p className="max-w-xs text-center text-[11px] leading-relaxed text-fg-subtle md:max-w-sm md:text-xs">
        {label}
      </p>
    </ChamferFrame>
  )
}
