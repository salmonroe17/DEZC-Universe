import type { SplitSectionProps } from '../../types/caseStudy'

export function SplitSection({
  title,
  description,
  bullets,
  visual,
  reverse = false,
}: SplitSectionProps) {
  const copy = (
    <>
      <h2 className="text-2xl font-bold tracking-tight text-zinc-50 md:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-zinc-400 md:text-base">{description}</p>
      ) : null}
      {bullets && bullets.length > 0 ? (
        <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-zinc-400 marker:text-zinc-600 md:text-base">
          {bullets.map((b, i) => (
            <li key={`${i}-${b}`}>{b}</li>
          ))}
        </ul>
      ) : null}
    </>
  )

  if (visual == null) {
    return <div className="max-w-xl">{copy}</div>
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
      <div className={`max-w-xl ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>{copy}</div>
      <div className={`min-w-0 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>{visual}</div>
    </div>
  )
}
