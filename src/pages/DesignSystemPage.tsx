import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { SidebarSimple, MagnifyingGlass, CaretRight, ArrowUpRight, ArrowLeft, X, Stack, Palette, File, ImageSquare, ShieldCheck, SquaresFour } from '@phosphor-icons/react'
import inventory from '../design-system/inventory'
import { useSiteTheme } from '../contexts/useSiteTheme'
import { hasDesignSystemAccess, lockDesignSystem } from '../design-system/editorAccess'
import { fixedColors, portfolioTheme, themeLabels, themePalettes, type ThemeId } from '../design-system/theme'
import { contrastRatio } from '../design-system/contrast'
import { auditRenderedContrast, type RouteContrastResult } from '../design-system/renderedContrast'
import { ChamferFrame } from '../components/system/ChamferFrame'
import { TimelinePillsRow } from '../components/caseStudy/patterns/TimelinePillsRow'
import { BeforeAfterToggle } from '../components/caseStudy/patterns/BeforeAfterToggle'
import { PortfolioAccordion } from '../components/system/PortfolioAccordion'
import { OverviewShowcase } from '../design-system/OverviewShowcase'
import { visualStories, visualStoryGroups, pageSections } from '../design-system/visualCatalog'
import { VisualComponentGallery, VisualStoryView, VisualPages, VisualFoundations } from '../design-system/VisualLibrary'
import './design-system.css'

type Module = typeof inventory.modules[number]
type Tab = 'Overview' | 'System guide' | 'Foundations' | 'Pages' | 'Components' | 'Media' | 'Contrast'
const controlClass = 'ds-control'
const byFile = new Map(inventory.modules.map((m) => [m.file, m]))
const text = (value: unknown) => JSON.stringify(value).toLowerCase()

function TechnicalReference({ title, children }: { title: string; children: ReactNode }) {
  const [open,setOpen]=useState(false)
  return <details className="ds-technical-reference" onToggle={(event)=>setOpen(event.currentTarget.open)}><summary>{title}</summary>{open&&children}</details>
}

function Section({ title, children, note }: { title: string; children: ReactNode; note?: string }) {
  return <section id={title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')} className="ds-section"><div className="ds-section-heading"><h2>{title}</h2>{note && <p>{note}</p>}</div>{children}</section>
}

function Source({ file, line }: { file: string; line?: number }) {
  return <code className="ds-source" title="Repository source and line">{file}{line ? `:${line}` : ''}</code>
}

function ModuleRecord({ module: m, expanded = false }: { module: Module; expanded?: boolean }) {
  return <details className="ds-record" open={expanded || undefined}>
    <summary><span>{m.file.split('/').at(-1)}</span><span className="ds-meta">{m.components.length} definitions · {m.instances.length} placements · {m.controls.length} controls / media</span></summary>
    <div className="ds-record-body"><Source file={m.file} />
      {m.components.length > 0 && <><h4>Component definitions & inputs</h4>{m.components.map((c) => <div className="ds-row" key={`${c.name}-${c.line}`}><strong>{c.name}</strong><Source file={m.file} line={c.line} /><pre>{c.signature || 'No inputs'}</pre></div>)}</>}
      {m.sections.length > 0 && <><h4>Sections, headings & anchors</h4><div className="ds-table-wrap"><table><thead><tr><th>Element</th><th>Content / anchor</th><th>Source line</th></tr></thead><tbody>{m.sections.map((s, i) => <tr key={i}><td>{s.tag}</td><td>{s.text || s.id || 'Dynamic content'}{s.text && s.id ? <code> #{s.id}</code> : ''}</td><td>{s.line}</td></tr>)}</tbody></table></div></>}
      {m.instances.length > 0 && <><h4>Every component placement</h4><p className="ds-note">Repeated data-driven cards share one placement. Their content and mapped collections remain in the source.</p>{m.instances.map((c, i) => <details className="ds-nested" key={i}><summary><code>{c.name}</code><span className="ds-meta">Line {c.line} · {c.props.length} properties</span></summary><pre>{c.props.map((p) => `${p.name}: ${p.value}`).join('\n') || 'Default properties'}</pre></details>)}</>}
      {m.cards.length > 0 && <details className="ds-nested"><summary>Card, panel & section anatomy ({m.cards.length})</summary>{m.cards.map((c, i) => <details key={i} className="ds-nested"><summary>{c.name} · line {c.line}</summary><pre>{c.content}{c.truncated ? '\n… Open the source for the full block.' : ''}</pre></details>)}</details>}
      {m.collections.length > 0 && <details className="ds-nested"><summary>Content collections & variants ({m.collections.length})</summary>{m.collections.map((c, i) => <details key={i} className="ds-nested"><summary>{c.name} · line {c.line}</summary><pre>{c.content}{c.truncated ? '\n… Open the source for the full collection.' : ''}</pre></details>)}</details>}
      {m.controls.length > 0 && <details className="ds-nested"><summary>Native controls, SVGs, canvas & media ({m.controls.length})</summary>{m.controls.map((c, i) => <div className="ds-row" key={i}><strong>{c.tag} · line {c.line}</strong><span>{c.label}</span><pre>{c.props.map((p) => `${p.name}: ${p.value}`).join('\n')}</pre></div>)}</details>}
      <details className="ds-nested"><summary>Styles, states & token references</summary><h4>CSS variables</h4><pre>{m.tokenRefs.join('\n') || 'Uses utility classes / inherited styles'}</pre><h4>Utility classes (including responsive and interaction variants)</h4><div className="ds-tags">{m.classes.map((c) => <code key={c}>{c}</code>)}</div></details>
      {m.colors.length > 0 && <details className="ds-nested"><summary>Literal colors & fallback values ({m.colors.length})</summary><p className="ds-note">Includes brand effects, canvas fallbacks, fixed media surfaces and comments. A literal is a review item, not automatically an error.</p>{m.colors.map((c, i) => <div className="ds-row" key={i}><code>{c.value}</code><span>Line {c.line}</span></div>)}</details>}
      <details className="ds-nested"><summary>Dependencies ({m.imports.length})</summary><pre>{m.imports.join('\n') || 'No local dependencies'}</pre></details>
    </div>
  </details>
}

function Specimens() {
  const [after, setAfter] = useState(false)
  return <Section title="Live specimens" note="Real shared components, rendered with the active theme.">
    <div className="ds-specimens">
      <ChamferFrame innerClassName="bg-elevated p-6"><p className="text-fg">ChamferFrame</p><p className="mt-2 text-sm text-fg-muted">Shared card / media frame</p></ChamferFrame>
      <ChamferFrame meteorTrail innerClassName="bg-surface p-6"><p className="text-fg">Meteor border</p><p className="mt-2 text-sm text-fg-subtle">Motion follows the theme accent.</p></ChamferFrame>
      <div className="ds-panel"><button className={controlClass}>Default button</button><button className={controlClass} disabled>Disabled</button><label className="ds-field">Text input<input className={controlClass} placeholder="Focus to inspect the ring" /></label></div>
      <div className="ds-panel"><BeforeAfterToggle mode={after ? 'after' : 'before'} onModeChange={(v) => setAfter(v === 'after')} /><p className="text-sm text-fg-muted">Comparison · {after ? 'After' : 'Before'}</p></div>
    </div>
    <div className="ds-panel ds-timeline"><TimelinePillsRow stepLabels={['Discover', 'Define', 'Design', 'Deliver']} /></div>
  </Section>
}

function Foundations({ query }: { query: string }) {
  const { theme } = useSiteTheme()
  const tokens = inventory.modules.flatMap((m) => m.tokens.map((t) => ({ ...t, file: m.file }))).filter((t) => text(t).includes(query))
  const classes = [...new Set(inventory.modules.flatMap((m) => m.classes))].filter((c) => c.toLowerCase().includes(query)).sort()
  const groups = [
    { title: 'Typography', pattern: /^(?:(?:[^:]+):)*(?:text|font|leading|tracking)-/, note: 'Space Mono is the main interface face. Font size, weight, line height, tracking and responsive variants are recorded below.' },
    { title: 'Spacing & dimensions', pattern: /^(?:(?:[^:]+):)*(?:p[xytrbl]?|m[xytrbl]?|gap(?:-[xy])?|w|h|min-w|max-w|min-h|max-h)-/, note: 'Existing values are retained to preserve layout. Shared page gutters: 16px → 20px → 24px. Maximum frame: 1440px; 12 columns; 24px gutters.' },
    { title: 'Shape, borders & elevation', pattern: /(?:rounded-|border-|ring-|shadow-)/, note: 'ChamferFrame and quadrant cells share the clipped outline. Existing per-component chamfer sizes, hairlines and effect shadows are preserved.' },
    { title: 'Motion & interaction states', pattern: /(?:duration-|ease-|opacity-|hover:|focus|disabled:|motion-reduce:|group-|data-)/, note: 'Includes hover, focus, selected, disabled, touch and reduced-motion variants used in the source.' },
  ]
  return <>
    <Section title="Semantic color roles" note="One palette controls the site, case studies, presentation decks, SVG accents and canvas consumers."><div className="ds-swatches">{Object.entries(themePalettes[theme]).map(([name, color]) => <div className="ds-swatch" key={name}><div style={{ backgroundColor: color }} /><code>--color-{name}</code><span>{color}</span></div>)}</div></Section>
    <Section title="Fixed media & effect roles" note="Artwork keeps its original palette. White media surfaces use on-media-paper; dark scrims use on-scrim."><div className="ds-swatches">{Object.entries(fixedColors).map(([name, color]) => <div className="ds-swatch" key={name}><div style={{ backgroundColor: color }} /><code>{name}</code><span>{color}</span></div>)}</div></Section>
    <Section title="Type specimens"><div className="ds-panel ds-type">{['display', 'title', 'lead', 'body', 'small'].map((role) => <div key={role}><span className="ds-meta">{role}</span><p style={{ fontSize: `var(--text-${role})`, lineHeight: `var(--text-${role}--line-height)`, letterSpacing: `var(--text-${role}--letter-spacing)` }}>Design systems behind the screens.</p></div>)}</div></Section>
    <Section title="Declared foundation tokens" note="All CSS variable declarations, including responsive overrides and component-local geometry."><div className="ds-table-wrap"><table><thead><tr><th>Token</th><th>Value</th><th>Source</th></tr></thead><tbody>{tokens.map((t, i) => <tr key={i}><td><code>{t.name}</code></td><td><code>{t.value}</code></td><td><Source file={t.file} line={t.line} /></td></tr>)}</tbody></table></div></Section>
    {groups.map((g) => <Section key={g.title} title={g.title} note={g.note}><details className="ds-record"><summary>All values used ({classes.filter((c) => g.pattern.test(c)).length})</summary><div className="ds-tags ds-record-body">{classes.filter((c) => g.pattern.test(c)).map((c) => <code key={c}>{c}</code>)}</div></details></Section>)}
    <Section title="Responsive behavior"><div className="ds-panel"><p>Small mobile: 0–389 · Large mobile: 390–767 · Tablet: 768–1023 · Desktop: 1024–1439 · Large desktop: 1440+</p><p>Home changes from stacked cards to a two-column grid. Case studies use a five-track rail on desktop with a mobile table of contents. Side quests use their own full-height viewer. Existing Tailwind sm / md / lg variants remain recorded alongside portfolio breakpoints.</p></div></Section>
    <Section title="Animation catalog"><div className="ds-tags">{inventory.modules.flatMap((m) => m.animations).map((a) => <code key={a}>{a}</code>)}</div></Section>
    <Specimens />
  </>
}

function PageMap({ query, selectedPath }: { query: string; selectedPath?: string }) {
  const [preview, setPreview] = useState<string | null>(null)
  return <Section title="Every page" note="Expand a route to trace its sections, component placements, controls, styles and dependencies. Shared site chrome is listed separately.">
    {inventory.routes.filter((r) => (!selectedPath || r.path === selectedPath) && text(r).includes(query)).map((r) => <details className="ds-record" key={r.path} open={selectedPath ? true : undefined}><summary><span>{r.path}</span><span className="ds-meta">{r.files.length} source modules · {r.sections.length} section / heading records</span></summary><div className="ds-record-body"><Source file={r.file} /><div className="ds-actions"><Link className={controlClass} to={r.path === '*' || r.path === '/*' ? '/not-a-page' : r.path.includes(':') ? '/sidequest/bobaghosteas' : r.path}>Open page ↗</Link><button className={controlClass} onClick={() => setPreview(preview === r.path ? null : r.path)}>Toggle live page preview</button></div>{preview === r.path && <iframe className="ds-page-preview" src={r.path.includes(':') ? '/sidequest/bobaghosteas' : r.path === '/*' ? '/not-a-page' : r.path} title={`${r.component} live preview`} />}{r.files.map((file) => byFile.get(file) && <ModuleRecord key={file} module={byFile.get(file)!} />)}<details className="ds-nested"><summary>Shared navigation, footer & shell ({r.sharedFiles.length} modules)</summary>{r.sharedFiles.map((file) => byFile.get(file) && <ModuleRecord key={file} module={byFile.get(file)!} />)}</details></div></details>)}
  </Section>
}

function Media({ query }: { query: string }) {
  const [kind, setKind] = useState('All')
  const [limit, setLimit] = useState(30)
  const filtered = useMemo(() => inventory.assets.filter((a) => text(a).includes(query) && (kind === 'All' || a.kind === kind)), [query, kind])
  return <Section title="Media library" note="Every local image, illustration, photo, video and font, with references and route usage. Images are classified from their folders; verify ambiguous artwork visually. Generated derivatives and files without a static reference are identified.">
    <div className="ds-actions"><label>Type <select className={controlClass} value={kind} onChange={(e) => { setKind(e.target.value); setLimit(30) }}>{['All', ...new Set(inventory.assets.map((a) => a.kind))].map((k) => <option key={k}>{k}</option>)}</select></label><span className="ds-meta">{filtered.length} files</span></div>
    <div className="ds-media-grid">{filtered.slice(0, limit).map((a) => <article className="ds-media" key={a.file}><a href={a.url} target="_blank" rel="noreferrer" className="ds-media-preview" aria-label={`Open ${a.file}`}>{a.kind === 'Video' ? <video src={a.url} controls preload="none" /> : a.kind === 'Font' || a.kind === 'Audio' ? <span>{a.kind}</span> : <img src={a.url} alt={a.file.split('/').at(-1)} loading="lazy" />}</a><div className="ds-media-body"><span className="ds-meta">{a.kind} · {a.bytes ? `${(a.bytes / 1024).toFixed(0)} KB` : 'External'}{a.width && a.height ? ` · ${a.width} × ${a.height}` : ''}</span><Source file={a.file} /><span className="ds-meta">{a.usage}</span><details><summary>Usage · {a.routes.length} routes</summary><pre>{a.usedBy.join('\n') || 'No direct source reference found. May be a generated or dynamically referenced file.'}</pre><pre>{a.routes.join('\n')}</pre></details></div></article>)}</div>
    {limit < filtered.length && <button className={controlClass} onClick={() => setLimit((n) => n + 30)}>Load 30 more ({filtered.length - limit} remaining)</button>}
  </Section>
}

function Contrast() {
  const { theme } = useSiteTheme()
  const frame = useRef<HTMLIFrameElement>(null)
  const [results, setResults] = useState<RouteContrastResult[]>([])
  const [running, setRunning] = useState(false)
  const [current, setCurrent] = useState('')
  const [resultTheme, setResultTheme] = useState(theme)
  async function runAudit() {
    if (!frame.current || running) return
    setRunning(true)
    setResults([])
    setResultTheme(theme)
    const routes = inventory.routes.map((r) => r.path.includes(':') ? '/sidequest/bobaghosteas' : r.path === '/*' ? '/contrast-check-not-found' : r.path)
    routes.push(...['neon-drawings', 'japan-adventures', 'concert-adventures', 'a-marriage-proposal', 'eedenn', 'daisy'].map((s) => `/sidequest/${s}`))
    for (const path of routes) {
      setCurrent(path)
      const iframe = frame.current
      if (!iframe) break
      if (document.documentElement.dataset.theme !== theme) { setResults((previous) => [...previous, { path, checked: 0, findings: [], error: 'Theme changed during the audit. Run it again.' }]); break }
      try {
        await new Promise<void>((resolve, reject) => {
          const timeout = window.setTimeout(() => { iframe.onload = null; reject(new Error('Page load timed out')) }, 20000)
          iframe.onload = () => { window.clearTimeout(timeout); iframe.onload = null; resolve() }
          iframe.src = path
        })
        await iframe.contentDocument?.fonts.ready
        await new Promise((resolve) => window.setTimeout(resolve, 1600))
        const result = auditRenderedContrast(iframe.contentDocument!)
        setResults((previous) => [...previous, { path, ...result }])
      } catch (error) {
        setResults((previous) => [...previous, { path, checked: 0, findings: [], error: String(error) }])
      }
    }
    setRunning(false)
    setCurrent('')
    if (frame.current) frame.current.src = 'about:blank'
  }
  return <>
    <Section title="Token contrast matrix" note="Calculated for opaque text on each base surface. Normal text ≥ 4.5:1; large text ≥ 3:1. Alpha text, imagery, hover states and effects need rendered review."><div className="ds-table-wrap"><table><thead><tr><th>Theme / foreground</th>{['bg', 'surface', 'elevated'].map((s) => <th key={s}>{s}</th>)}</tr></thead><tbody>{Object.entries(themePalettes).flatMap(([id, palette]) => ['fg', 'fg-muted', 'fg-subtle', 'hud'].map((fg) => <tr key={`${id}-${fg}`}><td>{themeLabels[id as ThemeId]} · {fg}</td>{['bg', 'surface', 'elevated'].map((bg) => { const ratio = contrastRatio(palette[fg]!, palette[bg]!); return <td key={bg}><span className={`ds-status ${ratio >= 4.5 ? 'ds-pass' : 'ds-review'}`}>{ratio.toFixed(2)}:1 · {ratio >= 4.5 ? 'Pass' : 'Review'}</span></td> })}</tr>))}</tbody></table></div></Section>
    <Section title="Rendered page audit" note="Runs each route and all seven albums in a desktop preview using the current theme. Checks visible DOM text, transparency and ancestor opacity. Closed modals, alternate slides, hover states, text inside images/video/canvas, blend effects and gradients require manual visual review. A clean matrix alone does not certify every screen.">
      <div className="ds-actions"><button className={controlClass} disabled={running} onClick={() => void runAudit()}>{running ? `Checking ${current}…` : `Audit all pages · ${themeLabels[theme]}`}</button>{results.length > 0 && <button className={controlClass} onClick={() => { const blob = new Blob([JSON.stringify({ theme: resultTheme, viewport: '1440 × 1000', capturedAt: new Date().toISOString(), results }, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `portfolio-contrast-${resultTheme}.json`; a.click(); URL.revokeObjectURL(a.href) }}>Download results</button>}</div>
      <iframe ref={frame} title="Contrast audit workspace" className="ds-audit-frame" aria-hidden inert src="about:blank" />
      <div role="status" className="ds-note">{running ? current : results.length ? `${results.length} routes checked using ${themeLabels[resultTheme]}. Findings include effects requiring visual review.${resultTheme !== theme ? ' Theme changed; rerun to check the current preview.' : ''}` : 'Ready. The existing leaderboard gate and other protected states are not bypassed.'}</div>
      {results.map((r) => <details className="ds-record" key={r.path}><summary><span>{r.path}</span><span className="ds-meta">{r.error ?? `${r.checked} text samples · ${r.findings.length} review items`}</span></summary><div className="ds-table-wrap"><table><thead><tr><th>Text</th><th>Ratio</th><th>Review</th><th>Element</th></tr></thead><tbody>{r.findings.map((f, i) => <tr key={i}><td>{f.text}</td><td>{f.ratio}:1 / {f.required}:1</td><td>{f.review ? 'Effect / gradient: visual check' : 'Contrast below threshold'}</td><td><code>{f.selector}</code></td></tr>)}</tbody></table></div></details>)}
    </Section>
    <Section title="Theme acceptance checklist"><div className="ds-panel"><p>Review desktop and mobile; open navigation dialogs, every before/after state, presentation decks and thumbnails; inspect game intro / play / end, leaderboard loading / empty / error states, legal tabs, album controls, focus rings and disabled buttons. Inspect original media for text baked into the pixels.</p><p>Theme-sensitive UI uses semantic colors. Paired media surfaces stay fixed. Muted text remains legible; intentional low-opacity decorative layers are reviewed separately.</p></div></Section>
  </>
}


type Selection = { tab: Tab; label?: string; file?: string; component?: string; route?: string; anchor?: string; story?: string; section?: string }
const foundationGroups = [
  { name: 'Colors', items: [{ label: 'Semantic colors', anchor: 'semantic-color-roles' }, { label: 'Media & effect colors', anchor: 'fixed-media-effect-roles' }, { label: 'Token reference', anchor: 'declared-foundation-tokens' }] },
  { name: 'Typography', items: [{ label: 'Type scale & specimens', anchor: 'type-specimens' }, { label: 'Fonts & text styles', anchor: 'typography' }] },
  { name: 'Layout & geometry', items: [{ label: 'Spacing & dimensions', anchor: 'spacing-dimensions' }, { label: 'Borders & elevation', anchor: 'shape-borders-elevation' }, { label: 'Responsive behavior', anchor: 'responsive-behavior' }] },
  { name: 'Motion & states', items: [{ label: 'Interaction states', anchor: 'motion-interaction-states' }, { label: 'Animations', anchor: 'animation-catalog' }, { label: 'Live specimens', anchor: 'live-specimens' }] },
]
const pageLabels: Record<string, string> = {
  '/': 'Home', '/case-study/carbon-neutral-club': 'Carbon Neutral Club', '/case-study/super-app': 'Super app',
  '/case-study/ibm-envizi': 'IBM Envizi', '/case-study/design-systems': 'Systems behind the screens',
  '/case-study/components': 'Case-study reference', '/sidequest/:sidequestId': 'Side quests',
  '/leaderboard': 'Global leaderboard', '/privacy': 'Legal', '/*': '404 / Not found',
}
function TreeGroup({ label, children, count, searching, initial = false, icon }: { label: string; children: ReactNode; count?: number; searching: boolean; initial?: boolean; icon?: ReactNode }) {
  return <PortfolioAccordion className="ds-tree-group" defaultOpen={searching || initial} summary={<><CaretRight size={13} className="ds-tree-chevron" />{icon}<span>{label}</span>{count !== undefined && <small>{count}</small>}</>}><div className="ds-tree-children">{children}</div></PortfolioAccordion>
}

function TreeItem({ label, active, onClick, kind = 'C', subtitle }: { label: string; active?: boolean; onClick: () => void; kind?: string; subtitle?: string }) {
  return <button type="button" className="ds-tree-item" aria-current={active ? 'page' : undefined} onClick={onClick} title={subtitle ?? label}><span className={`ds-tree-kind ds-tree-kind--${kind.toLowerCase()}`} aria-hidden>{kind}</span><span>{label}</span></button>
}

function SystemGuide({ select }: { select: (selection: Selection) => void }) {
  const { theme } = useSiteTheme()
  const quickLinks: { tab: Tab; description: string; icon: ReactNode }[] = [
    { tab: 'Foundations', description: 'Color, typography, spacing and motion.', icon: <Palette size={20} /> },
    { tab: 'Components', description: 'Try the actual controls, cards and patterns.', icon: <Stack size={20} /> },
    { tab: 'Pages', description: 'Open real pages and inspect individual sections.', icon: <File size={20} /> },
    { tab: 'Media', description: 'Photos, illustrations, videos and original artwork.', icon: <ImageSquare size={20} /> },
  ]
  return <>
    <div className="ds-overview-banner"><span className="ds-badge">Portfolio / Design system</span><h2>A place for every<br />building block.</h2><p>Explore the foundations, components and pages that bring the portfolio together. One shared system, ready for what comes next.</p><div className="ds-actions"><button className="ds-control ds-primary" onClick={() => select({ tab: 'Components' })}>Explore components <ArrowUpRight size={14} /></button><button className={controlClass} onClick={() => select({ tab: 'Foundations' })}>View foundations</button></div><div className="ds-banner-art" aria-hidden><div /><div /><div /><span>DEZ / SYSTEM</span></div></div>
    <div className="ds-stats">{Object.entries({pages:inventory.stats.routes,components:visualStories.length,'page sections':Object.values(pageSections).reduce((n,sections)=>n+sections.length,0),media:inventory.stats.assets,'theme palettes':Object.keys(themePalettes).length,'foundation groups':foundationGroups.length}).map(([name, value]) => <div key={name}><span>{name === 'instances' ? 'Component placements' : name}</span><strong>{value}</strong><small>{name === 'assets' ? 'Original media & fonts' : name === 'routes' ? 'Across the entire portfolio' : 'Visual library'}</small></div>)}</div>
    <div className="ds-overview-grid"><section className="ds-dashboard-card ds-quick-links"><div className="ds-card-heading"><h2>Explore the system</h2><p>Everything has a home.</p></div>{quickLinks.map((link) => <button key={link.tab} onClick={() => select({ tab: link.tab })}><span className="ds-quick-icon">{link.icon}</span><span><strong>{link.tab}</strong><small>{link.description}</small></span><ArrowUpRight size={15} /></button>)}</section>
    <section className="ds-dashboard-card"><div className="ds-card-heading"><h2>Your current palette</h2><p>{themeLabels[theme]} · Applied across this browser’s preview</p></div><div className="ds-overview-palette">{['bg', 'elevated', 'cell-border', 'fg-muted', 'fg', 'hud'].map((role) => <div key={role}><div style={{ backgroundColor: themePalettes[theme][role] }} /><code>{role}</code></div>)}</div><div className="ds-palette-sample"><span className="ds-sample-badge">Live preview</span><h3>Systems behind the screens.</h3><p>Shared color roles keep the interface consistent as the portfolio evolves.</p><button className="ds-control ds-primary" onClick={() => select({ tab: 'Foundations', anchor: 'semantic-color-roles', label: 'Semantic colors' })}>Inspect color tokens <ArrowUpRight size={14} /></button></div></section></div>
    <Section title="Page directory" note="Open the actual pages, with desktop, mobile and section previews."><div className="ds-coverage">{inventory.routes.map((route) => <button key={route.path} className="ds-panel" onClick={() => select({ tab: 'Pages', route: route.path, label: pageLabels[route.path] })}><span className="ds-page-card-icon"><File size={17} /><ArrowUpRight size={15} /></span><strong>{pageLabels[route.path] ?? route.path}</strong><code>{route.path}</code><span>{pageSections[route.path]?.length ?? 0} page sections · Live preview</span></button>)}</div></Section>
    <div className="ds-overview-grid"><section className="ds-dashboard-card"><div className="ds-card-heading"><h2>Built for theme changes</h2><p>A deliberate workflow from preview to publish.</p></div><ol className="ds-workflow">{['Preview a palette in the sidebar.', 'Inspect components, pages and media boundaries.', 'Check contrast and review responsive states.', 'Set activeTheme in the owner configuration.'].map((step, i) => <li key={step}><span>{i + 1}</span>{step}</li>)}</ol></section><section className="ds-dashboard-card"><div className="ds-card-heading"><h2>Contrast & quality</h2><p>Check the details before a new theme goes live.</p></div><div className="ds-quality-icon"><ShieldCheck size={32} /></div><p className="ds-note">Test semantic color pairs and rendered text across every route. Gradients, media and interaction states remain part of the visual review.</p><button className={controlClass} onClick={() => select({ tab: 'Contrast' })}>Open contrast checks <ArrowUpRight size={14} /></button></section></div>
  </>
}

export default function DesignSystemPage() {
  const { theme, setTheme } = useSiteTheme()
  const [selection, setSelection] = useState<Selection>({ tab: 'Overview' })
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(() => !window.matchMedia('(max-width: 767px)').matches)
  const scrollRef = useRef<HTMLDivElement>(null)
  const q = query.trim().toLowerCase()
  const searching = q.length > 0
  const matches = (value: string) => value.toLowerCase().includes(q)
  const select = (next: Selection) => {
    setSelection(next)
    if (window.matchMedia('(max-width: 767px)').matches) setSidebarOpen(false)
  }
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [selection])
  if (!hasDesignSystemAccess()) return <Navigate to="/leaderboard" replace />
  const selectedStory = visualStories.find((story) => story.id === selection.story)
  const selectedModule = selectedStory ? byFile.get(selectedStory.source) : selection.file ? byFile.get(selection.file) : undefined
  const title = selection.label ?? selection.tab
  const descriptions: Record<Tab, string> = {
    Overview: 'Every building block, together.',
    'System guide': 'Coverage, configuration and the workflow behind the portfolio.',
    Foundations: 'The visual language of the portfolio, from tokens to interaction states.',
    Components: 'A visual library of the portfolio’s controls, navigation, cards and patterns. Open an example and try it.',
    Pages: 'Browse the actual portfolio pages. Switch between desktop and mobile, or jump to a section.',
    Media: 'Original artwork, photos, videos and fonts in one searchable library.',
    Contrast: 'Review text contrast and the details that keep every theme readable.',
  }
  const visibleGroups = visualStoryGroups.map((group) => ({ ...group, stories: group.stories.filter((story) => matches(`${story.name} ${story.group} ${story.description}`)) })).filter((group) => group.stories.length)
  const visibleRoutes = inventory.routes.filter((r) => matches(`${pageLabels[r.path]} ${r.path} ${r.component}`))
  const visibleFoundations = foundationGroups.map((group) => ({ ...group, items: group.items.filter((item) => matches(`${group.name} ${item.label}`)) })).filter((group) => group.items.length)
  const hasResults = visibleGroups.length || visibleRoutes.length || visibleFoundations.length || matches('Overview System guide Media Photos Illustrations Videos Fonts Contrast Accessibility Audit')
  return <main className={`ds-workbench ds-studio ${sidebarOpen ? 'ds-sidebar-open' : 'ds-sidebar-collapsed'} ${selection.tab==='Overview'?'ds-showcase-view':''}`}>
    {sidebarOpen && <button type="button" className="ds-sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
    <aside id="design-system-navigation" className="ds-sidebar" aria-label="Design system navigation">
      <div className="ds-sidebar-brand"><span className="ds-brand-mark"><SquaresFour size={21} weight="fill" /></span>{sidebarOpen && <span><strong>Portfolio system</strong><small>Dez Chang</small></span>}<button className="ds-icon-button" onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'} aria-expanded={sidebarOpen}><SidebarSimple size={19} /></button></div>
      {sidebarOpen ? <><div className="ds-sidebar-search"><MagnifyingGlass size={16} /><input type="search" aria-label="Search design system navigation" placeholder="Find a component or page…" value={query} onChange={(e) => setQuery(e.target.value)} />{query && <button aria-label="Clear navigation search" onClick={() => setQuery('')}><X size={13} /></button>}</div>
      <div className="ds-sidebar-tree"><div className="ds-nav-caption">WORKSPACE <span>Hidden access</span></div><nav aria-label="System explorer">
        {matches('Overview') && <TreeItem label="Overview" kind="O" active={selection.tab === 'Overview'} onClick={() => select({ tab: 'Overview' })} />}
        {visibleFoundations.length > 0 && <TreeGroup key={`foundations-${searching}`} label="Foundations" count={foundationGroups.reduce((n, g) => n + g.items.length, 0)} searching={searching} initial icon={<Palette size={16} />}><TreeItem label="All foundations" kind="F" active={selection.tab === 'Foundations' && !selection.anchor} onClick={() => select({ tab: 'Foundations' })} />{visibleFoundations.map((group) => <TreeGroup key={`${group.name}-${searching}`} label={group.name} searching={searching}>{group.items.map((item) => <TreeItem key={item.anchor} label={item.label} kind="F" active={selection.anchor === item.anchor} onClick={() => select({ tab: 'Foundations', anchor: item.anchor, label: item.label })} />)}</TreeGroup>)}</TreeGroup>}
        {visibleGroups.length > 0 && <TreeGroup key={`components-${searching}`} label="Components" count={visualStories.length} searching={searching} initial icon={<Stack size={16} />}><TreeItem label="All components" kind="C" active={selection.tab === 'Components' && !selection.story} onClick={() => select({ tab: 'Components' })} />{visibleGroups.map((group) => <TreeGroup key={`${group.name}-${searching}`} label={group.name} count={group.stories.length} searching={searching} initial>{group.stories.map((story) => <TreeItem key={story.id} label={story.name} kind="C" active={selection.story === story.id} onClick={() => select({tab:'Components',story:story.id,label:story.name})} />)}</TreeGroup>)}</TreeGroup>}
        {visibleRoutes.length > 0 && <TreeGroup key={`pages-${searching}`} label="Pages" count={inventory.stats.routes} searching={searching} icon={<File size={16} />}><TreeItem label="All pages" kind="P" active={selection.tab === 'Pages' && !selection.route} onClick={() => select({ tab: 'Pages' })} />{visibleRoutes.map((route) => <TreeGroup key={`${route.path}-${searching}`} label={pageLabels[route.path] ?? route.path} searching={searching}><TreeItem label="Full page preview" kind="P" active={selection.route === route.path && !selection.section} onClick={() => select({ tab: 'Pages', route: route.path, label: pageLabels[route.path] })} />{pageSections[route.path]?.map((section) => <TreeItem key={section.id} label={section.label} kind="P" active={selection.route===route.path && selection.section===section.id} onClick={()=>select({tab:'Pages',route:route.path,section:section.id,label:section.label})}/>)}</TreeGroup>)}</TreeGroup>}
        {matches('System guide Configuration Coverage')&&<TreeItem label="System guide" kind="G" active={selection.tab==='System guide'} onClick={()=>select({tab:'System guide'})}/>}
        {matches('Media Photos Illustrations Videos Fonts') && <TreeItem label="Media library" kind="M" active={selection.tab === 'Media'} onClick={() => select({ tab: 'Media' })} />}
        {matches('Contrast Accessibility Audit') && <TreeItem label="Contrast & quality" kind="A" active={selection.tab === 'Contrast'} onClick={() => select({ tab: 'Contrast' })} />}
        {!hasResults && <p className="ds-search-empty">No matches for “{query}”.<br />Try a component or file name.</p>}
      </nav></div><div className="ds-editor"><div className="ds-editor-label"><span className="ds-live-dot" /><label htmlFor="ds-theme">Theme preview</label><span>Editor</span></div><select id="ds-theme" className={controlClass} value={theme} onChange={(e) => setTheme(e.target.value as ThemeId)}>{Object.entries(themeLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select><div className="ds-editor-bottom"><span>Published: {themeLabels[portfolioTheme.activeTheme]}</span><button onClick={() => setTheme(portfolioTheme.activeTheme)}>Reset</button></div></div></> : <div className="ds-collapsed-links">{[{tab:'Overview' as Tab,icon:<SquaresFour size={19}/>},{tab:'Foundations' as Tab,icon:<Palette size={19}/>},{tab:'Components' as Tab,icon:<Stack size={19}/>},{tab:'Pages' as Tab,icon:<File size={19}/>},{tab:'Media' as Tab,icon:<ImageSquare size={19}/>},{tab:'Contrast' as Tab,icon:<ShieldCheck size={19}/>}].map((item) => <button key={item.tab} className="ds-icon-button" aria-label={item.tab} title={item.tab} aria-current={selection.tab === item.tab ? 'page' : undefined} onClick={() => select({tab:item.tab})}>{item.icon}</button>)}</div>}
    </aside>
    <div className="ds-main"><header className="ds-topbar"><div><button className="ds-icon-button" onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? 'Hide navigation sidebar' : 'Show navigation sidebar'} aria-expanded={sidebarOpen} aria-controls="design-system-navigation"><SidebarSimple size={18} /></button><span className="ds-topbar-divider"/><span>Design system</span><CaretRight size={12}/><strong>{selection.tab}</strong></div><div><Link to="/" className="ds-back-link"><ArrowLeft size={14}/>Portfolio</Link><button className="ds-control" onClick={() => { setTheme(portfolioTheme.activeTheme); lockDesignSystem(); window.location.assign('/leaderboard') }}>Lock & exit</button></div></header>
    <div className="ds-main-scroll" ref={scrollRef}><div className="ds-content"><header className="ds-doc-header"><div className="ds-eyebrow">{selection.tab === 'Overview' ? 'YOUR WORKSPACE' : selection.tab}</div><h1>{title}</h1><p>{selectedStory?.description ?? descriptions[selection.tab]}</p></header>
      {selection.tab === 'Overview' && <OverviewShowcase inspect={id=>{if(id==='@colors')select({tab:'Foundations',anchor:'semantic-color-roles',label:'Semantic colors'});else if(id==='@typography')select({tab:'Foundations',anchor:'type-specimens',label:'Typography'});else {const story=visualStories.find(s=>s.id===id);if(story)select({tab:'Components',story:id,label:story.name})}}}/> }
      {selection.tab === 'System guide' && <SystemGuide select={select}/>}
      {selection.tab === 'Foundations' && <><VisualFoundations focus={selection.anchor}/><TechnicalReference title="Technical reference · tokens & source"><Foundations query=""/></TechnicalReference></>}
      {selection.tab === 'Pages' && <><VisualPages path={selection.route} section={selection.section} onSelect={(path,label,section)=>select({tab:'Pages',route:path,label:pageLabels[path] && !section ? pageLabels[path]:label,section})}/><TechnicalReference title="Technical reference · page structure & source"><PageMap query="" selectedPath={selection.route}/></TechnicalReference></>}
      {selection.tab === 'Components' && (selectedStory ? <><VisualStoryView key={selectedStory.id} story={selectedStory}/>{selectedModule&&<TechnicalReference key={`source-${selectedStory.id}`} title="Technical reference · component source"><ModuleRecord module={selectedModule} expanded/></TechnicalReference>}</> : <><VisualComponentGallery onSelect={(story)=>select({tab:'Components',story:story.id,label:story.name})}/><TechnicalReference title="Technical reference · complete source inventory">{inventory.modules.map((m)=><ModuleRecord key={m.file} module={m}/>)}</TechnicalReference></>)}
      {selection.tab === 'Media' && <Media query="" />}
      {selection.tab === 'Contrast' && <Contrast />}
      <footer className="ds-footnote"><span>Portfolio system · Design system workspace</span><span>Inventory updated {new Date(inventory.generatedAt).toLocaleDateString()}</span></footer>
    </div></div></div>
  </main>
}
