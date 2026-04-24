/** Shared case study copy — single source for the Design Systems page and presentation deck. */

export const DS_PHILOSOPHY_EXPERIENCE_PARAS: readonly string[] = [
  "Over the years, I've created, rebuilt, and maintained 8+ design systems across mobile apps, web platforms, startups, and enterprise products.",
  'Some systems were built from scratch. Others were inherited in chaos and restructured to scale.',
  'I treat design systems as products, not libraries.',
]

export const DS_PHILOSOPHY_COMPANIES: readonly string[] = [
  'Anchr',
  'IBM',
  'Carbon Neutral Club',
  'Sherpa',
  'Super',
  'Drop',
  'HomeVisit',
  'Corelogic',
  'Sensibill',
  'Thriver',
]

export const DS_COMPONENTS_AT_SCALE_BULLETS: readonly string[] = [
  'Buttons + states + variants',
  'Navigation systems',
  'Cards',
  'Modals',
  'Tables',
  'Forms',
  'Dropdowns',
  'Search patterns',
  'Empty / loading / error states',
]

export const DS_STATES_VARIANTS_BULLETS: readonly string[] = [
  'Hover',
  'Focus',
  'Disabled',
  'Loading',
  'Success',
  'Warning',
  'Destructive',
  'Empty states',
  'Validation errors',
  'Overflow text',
  'Translated text',
  'Mobile breakpoints',
]

export const DS_RULES_PREVENT_CHAOS_BULLETS: readonly string[] = [
  'Interaction rules',
  'Responsive rules',
  'Do / don\'t usage patterns',
  'Hierarchy rules',
  'Spacing rules',
  'Application logic',
  'Accessibility expectations',
]

export const DS_BUILT_REAL_WORLD_BULLETS: readonly string[] = [
  'Localization',
  'Multi-language expansion',
  'Right-to-left layouts',
  'Currency differences',
  'Date formats',
  'Light / dark mode',
  'Enterprise density needs',
  'Mobile responsiveness',
]

export const DS_DESIGN_ENGINEERING_BULLETS: readonly string[] = [
  'naming conventions',
  'specs and measurements',
  'token references',
  'state logic',
  'reusable patterns',
  'implementation notes',
  'acceptance criteria support',
]

export const DS_IA_EXAMPLES_BULLETS: readonly string[] = [
  'Atomic design organization',
  'Page hierarchies',
  'Reusable libraries',
  'Versioning patterns',
  'Archived explorations',
  'Flowchart systems',
  'Searchable component docs',
]

export const DS_PROBLEM_BODY_LEFT: readonly string[] = [
  'Early teams move fast without one.',
  'Then growth creates friction.',
  'A strong design system turns that friction into leverage.',
]

export const DS_PROBLEM_WITHOUT_DS_BULLETS: readonly string[] = [
  'Duplicate components',
  'Inconsistent UI',
  'Slower design cycles',
  'Unclear developer handoff',
  'Rework across teams',
  'Product debt hidden in plain sight',
]

export const DS_MY_PHILOSOPHY_OPTIMIZE_BULLETS: readonly string[] = [
  'Speed of execution',
  'Consistency across teams',
  'Developer clarity',
  'Scalability over time',
  'Accessibility by default',
  'Flexibility without chaos',
]

export const DS_FOUNDATIONS_BULLETS: readonly string[] = [
  'Spacing scales',
  'Typography systems',
  'Grid logic',
  'Color tokens',
  'Elevation / shadows',
  'Border radius rules',
  'Motion principles',
  'Light + dark themes',
]

export const DS_RETRO_WHAT_UNLOCKS_BULLETS: readonly string[] = [
  'Faster design output',
  'Cleaner handoff',
  'Reduced duplicate work',
  'More consistent UX',
  'Easier onboarding for new hires',
  'Higher confidence in releases',
  'Scalable experimentation',
]

export const DS_RETRO_LEARNED_BULLETS: readonly string[] = [
  'Adoption matters more than perfection',
  'Documentation matters as much as visuals',
  'Simplicity beats over-engineering',
  'Maintenance is part of design',
  'Systems should accelerate people, not slow them down',
]

export const MAX_BULLETS_PER_COLUMN = 4

export function chunkBulletItems<T>(items: readonly T[], maxPerColumn: number = MAX_BULLETS_PER_COLUMN): T[][] {
  if (items.length === 0) return []
  const out: T[][] = []
  for (let i = 0; i < items.length; i += maxPerColumn) {
    out.push(items.slice(i, i + maxPerColumn) as T[])
  }
  return out
}

/** Max width for Design Systems presentation text slides. */
export const DS_DECK_MAX_W = 'mx-auto w-full max-w-[min(100%,1156px)]'
