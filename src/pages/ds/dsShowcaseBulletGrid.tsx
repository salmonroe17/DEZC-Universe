import { chunkBulletItems } from './dsShowcaseData'

type DsBulletGridProps = {
  items: readonly string[]
  ulClass: string
  listMarginClass?: string
  liClassName?: string
}

/**
 * Same grid as {@link DesignSystemsShowcasePage}: splits long lists into columns (max 4 items per column).
 */
export function DsBulletGrid({ items, ulClass, listMarginClass, liClassName = '' }: DsBulletGridProps) {
  const margin = listMarginClass === undefined ? 'mt-2' : listMarginClass
  const chunks = chunkBulletItems(items)
  if (chunks.length === 0) return null
  if (chunks.length === 1) {
    return (
      <ul className={[margin, ulClass].filter(Boolean).join(' ')}>
        {chunks[0].map((line) => (
          <li key={line} className={liClassName}>
            {line}
          </li>
        ))}
      </ul>
    )
  }
  const gridClass = [
    margin,
    'grid',
    'grid-cols-1',
    'gap-x-6',
    chunks.length === 2 ? 'gap-y-0 sm:grid-cols-2' : 'gap-y-4 sm:grid-cols-2 lg:grid-cols-3',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={gridClass}>
      {chunks.map((chunk, index) => (
        <ul key={index} className={ulClass}>
          {chunk.map((line) => (
            <li key={line} className={liClassName}>
              {line}
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}
