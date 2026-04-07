import type { TextSectionProps } from '../../types/caseStudy'

export function TextSection({ title, description, bullets }: TextSectionProps) {
  return (
    <div className="max-w-3xl">
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
    </div>
  )
}
