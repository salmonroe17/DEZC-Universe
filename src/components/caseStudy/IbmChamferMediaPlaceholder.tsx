/**
 * Layout-only placeholder: matches Carbon case study image frames using the same source pixel ratio
 * (width:height) so full-width media chamfers have the same height as the real PNGs.
 */
type IbmChamferMediaPlaceholderProps = {
  pixelWidth: number
  pixelHeight: number
  label?: string
  className?: string
}

export function IbmChamferMediaPlaceholder({
  pixelWidth,
  pixelHeight,
  label = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt — placeholder.',
  className = '',
}: IbmChamferMediaPlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden border border-dashed border-fg/10 bg-surface/20 ${
        className.trim() ? className : 'w-full'
      }`}
      style={{ aspectRatio: `${pixelWidth} / ${pixelHeight}` }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <p className="m-0 max-w-lg text-center text-xs leading-relaxed text-fg-muted [text-wrap:balance] md:text-sm">
          {label}
        </p>
      </div>
    </div>
  )
}

/** In-flow “spacer” for toggle stacks: same role as the invisible &lt;img /&gt; in Carbon (sets box height from asset ratio). */
export function IbmToggleAspectSpacer({ pixelWidth, pixelHeight }: { pixelWidth: number; pixelHeight: number }) {
  return (
    <div
      aria-hidden
      className="w-full"
      style={{ aspectRatio: `${pixelWidth} / ${pixelHeight}` }}
    />
  )
}
