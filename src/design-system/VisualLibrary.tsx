import { CaseStudySwitch } from '../components/system/CaseStudySwitch'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, MagnifyingGlass, Plus, X } from '@phosphor-icons/react'
import inventory from './inventory'
import fidelity from '../generated/componentFidelity.json'
import { siteContexts } from './siteContexts'
import { visualStories, visualStoryGroups, type VisualStory, pageSections } from './visualCatalog'
import { fixedColors, themePalettes } from './theme'
import { useSiteTheme } from '../contexts/useSiteTheme'
import { PortfolioButton, PortfolioIconButton, PortfolioTextField } from '../components/system/PortfolioControls'
import { PortfolioTab } from '../components/system/PortfolioTabs'
import { ChamferFrame } from '../components/system/ChamferFrame'
import { SidebarNav } from '../components/system/SidebarNav'
import { SiteTopBar } from '../components/SiteTopBar'
import { SiteFooter } from '../components/SiteFooter'
import { BeforeAfterToggle } from '../components/caseStudy/patterns/BeforeAfterToggle'
import { ComparisonShowcase } from '../components/caseStudy/patterns/ComparisonShowcase'
import { TimelinePillsRow } from '../components/caseStudy/patterns/TimelinePillsRow'
import { KpiMetricsGrid } from '../components/caseStudy/patterns/KpiMetricsGrid'
import { ProblemStatementFrame } from '../components/caseStudy/patterns/ProblemStatementFrame'
import { CaseStudyScrollProgressBar } from '../components/caseStudy/CaseStudyScrollProgressBar'
import { CaseStudiesCardModal } from '../components/CaseStudiesCardModal'
import { ShowTellQuadrantModal } from '../components/ShowTellQuadrantModal'
import { ExperimentalCaseStudiesPanel } from '../components/ExperimentalCaseStudiesPanel'
import { LeaderboardCityFilter } from '../components/LeaderboardCityFilter'
import { HudLoadingScreen } from '../components/HudLoadingScreen'
import { NotFound404Glyph } from '../components/NotFound404Glyph'
import { DecisionSection } from '../components/sections/DecisionSection'
import { PresentationExamples } from './PresentationExamples'
import { ComponentDocumentation } from './ComponentDocumentation'
import { CursorStates, CursorPlayground, CardCornerExamples, AccordionExamples } from './InteractionExamples'
import { LeaderboardGate } from '../components/LeaderboardGate'
import { CaseStudyLazyVideo } from '../components/caseStudy/CaseStudyLazyVideo'
import { StatementSection } from '../components/sections/StatementSection'

const sampleImage = inventory.assets.find((a) => a.file.includes('Japan photos/jp01')) ?? inventory.assets.find((a) => a.kind === 'Photo')!
const sampleArt = inventory.assets.find((a) => a.file.includes('Bobaghosteas/bg2')) ?? sampleImage
const sampleVideo = inventory.assets.find((a) => a.kind === 'Video' && a.usedBy.length && !a.file.includes('ARCHIVE'))
const navSections = [{ id: 'intro', label: 'Introduction' }, { id: 'overview', label: 'Overview' }, { id: 'problem', label: 'The problem' }, { id: 'design', label: 'The design' }, { id: 'impact', label: 'Impact' }]

function Example({ title, children, description, wide = false }: { title: string; children: ReactNode; description?: string; wide?: boolean }) {
  return <section className={`ds-example ${wide ? 'ds-example-wide' : ''}`}><div className="ds-example-label"><h2>{title}</h2><span>Component specimen</span></div><div className="ds-example-canvas font-mono">{children}</div>{description && <p className="ds-example-description">{description}</p>}</section>
}

export function VisualPagePreview({ path, section, isolate = false, compact = false }: { path: string; section?: string; isolate?: boolean; compact?: boolean }) {
  const { theme } = useSiteTheme()
  const [viewport, setViewport] = useState(0)
  const [width, setWidth] = useState(800)
  const [reload, setReload] = useState(0)
  const [readyKey, setReadyKey] = useState('')
  const previewKey = `${path}-${section}-${theme}-${viewport}-${reload}`
  const host = useRef<HTMLDivElement>(null)
  const iframe = useRef<HTMLIFrameElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    const el = host.current
    if (!el) return
    const observer = new ResizeObserver(() => setWidth(el.clientWidth))
    setWidth(el.clientWidth)
    observer.observe(el)
    return () => { observer.disconnect(); clearTimeout(timer.current) }
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [path, section, theme, viewport, reload])
  const previewHeight = compact ? section?.includes('hero')?520:360 : isolate ? 500 : 740
  const frameWidth = viewport || width
  const scale = Math.min(1, width / frameWidth)
  const url = path === '/*' ? '/not-a-page' : path.includes(':') ? '/sidequest/bobaghosteas' : path
  const legalHash = path === '/privacy' && section && ['privacy','terms','cookies'].includes(section) ? `#${section}` : ''
  function focusSection() {
    let attempts = 0
    const check = () => {
      const doc = iframe.current?.contentDocument
      if (!doc) return
      const target = section ? (section.startsWith('[') || section.startsWith('.') ? doc.querySelector(section) : (doc.getElementById(section) ?? doc.querySelector(section))) : doc.querySelector('main')
      if ((!target || doc.body.textContent?.trim() === 'Loading…') && attempts++ < 60) { timer.current = setTimeout(check, 100); return }
      if (!target) { setReadyKey(previewKey); return }
      if (isolate && section) {
        const style = doc.createElement('style')
        style.textContent = 'html,body,#root{height:auto!important;min-height:0!important;overflow:visible!important}body{padding:24px!important}body *{visibility:hidden!important} [data-ds-isolated], [data-ds-isolated] *{visibility:visible!important} [data-ds-isolated]{position:absolute!important;inset:24px 24px auto!important;width:calc(100% - 48px)!important;height:auto!important;min-height:360px!important;max-height:none!important;opacity:1!important}'
        if(compact) style.textContent = style.textContent.replaceAll('24px','12px').replace('360px','320px').replace('48px','24px')
        if(section.includes('hero'))style.textContent += `[data-ds-isolated]{height:${compact?492:460}px!important;min-height:0!important}`
        doc.head.appendChild(style)
        target.setAttribute('data-ds-isolated','true')
        iframe.current?.contentWindow?.scrollTo(0,0)
      } else if (section && !legalHash) target.scrollIntoView({ block: 'start' })
      setReadyKey(previewKey)
    }
    clearTimeout(timer.current)
    check()
  }
  return <div className={`ds-live-page ${compact?'ds-live-page-compact':''}`}>{!compact&&<div className="ds-preview-toolbar"><span><span className="ds-live-dot" />{section ? 'Live page section' : 'Live page'}</span><div><button aria-pressed={viewport === 0} onClick={() => setViewport(0)}>Fit width</button><button aria-pressed={viewport === 1440} onClick={() => setViewport(1440)}>Desktop</button><button aria-pressed={viewport === 390} onClick={() => setViewport(390)}>Mobile</button><button onClick={() => setReload((v) => v + 1)}>Reload</button><Link to={url + legalHash} target="_blank" rel="noreferrer">Open page <ArrowUpRight size={13}/></Link></div></div>}<div ref={host} className="ds-live-page-stage" style={{ height: previewHeight }}>{readyKey !== previewKey && <div className="ds-page-loading" role="status"><span className="ds-mini-loader"/>Opening live preview…</div>}<iframe loading={compact?'lazy':'eager'} ref={iframe} key={previewKey} src={url + legalHash} title={`Live preview of ${path}${section ? ` — ${section}` : ''}`} onLoad={focusSection} style={{ opacity: readyKey === previewKey ? 1 : 0, width: frameWidth, height: previewHeight / scale, transform: `translateX(-50%) scale(${scale})` }} /></div></div>
}

function ImageExamples() {
  return <Example title="Actual case-study image and presentation" wide description="This is the page itself. Click its media to open the same presentation visitors see."><VisualPagePreview path="/case-study/super-app" section="super-navigation-section"/></Example>
}

function TabsExample() {
  const labels = ['Privacy policy','Terms & conditions','Cookie policy']
  const [active,setActive]=useState(0)
  return <Example title="Legal navigation tabs" wide><div role="tablist" aria-label="Example legal sections" className="rounded border border-cell-border/80 bg-elevated/20 p-1" onKeyDown={(event)=>{let next=active;if(event.key==='ArrowRight')next=(active+1)%3;else if(event.key==='ArrowLeft')next=(active+2)%3;else if(event.key==='Home')next=0;else if(event.key==='End')next=2;else return;event.preventDefault();setActive(next);event.currentTarget.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]?.focus()}}><div className="flex flex-wrap gap-1">{labels.map((label,i)=><PortfolioTab key={label} id={`demo-legal-tab-${i}`} controls={`demo-legal-panel-${i}`} selected={active===i} onSelect={()=>setActive(i)}>{label}</PortfolioTab>)}</div></div><div role="tabpanel" id={`demo-legal-panel-${active}`} aria-labelledby={`demo-legal-tab-${active}`} className="mt-6 rounded border border-border bg-surface p-6"><h3 className="text-lg text-fg">{labels[active]}</h3><p className="mt-3 text-sm leading-relaxed text-fg-muted">{active===0?'How the portfolio handles information, including the optional mini-game and leaderboard.':active===1?'The terms for browsing this portfolio and using its interactive features.':'The browser storage used by the portfolio, including local preferences and the leaderboard.'}</p><Link to={`/privacy${active===1?'#terms':active===2?'#cookies':''}`} target="_blank" className="mt-5 inline-block text-xs text-fg underline decoration-cell-border underline-offset-4">Read the complete page ↗</Link></div></Example>
}

function StoryExamples({ id }: { id: string }) {
  const [value, setValue] = useState('')
  const [active, setActive] = useState('intro')
  const [on, setOn] = useState(false)
  const [modal, setModal] = useState<'case' | 'side' | null>(null)
  const [progress, setProgress] = useState(0.45)
  const [excluded, setExcluded] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  switch (id) {
    case 'cursor': return <><Example title="Reticle types"><CursorStates/></Example><Example title="Live cursor"><CursorPlayground/></Example></>
    case 'cursor-interactions': return <><Example title="Target behavior & particle trail"><CursorPlayground/></Example><Example title="Resting, hover and text entry"><CursorStates/></Example></>
    case 'accordion': return <Example title="Disclosure types & states"><AccordionExamples/></Example>
    case 'card-corners': return <><Example title="Chamfer sizes"><CardCornerExamples/></Example><Example title="Outline and inner fill"><ChamferFrame meteorTrail innerClassName="bg-elevated p-8"><h3 className="text-lg text-fg">A single shared silhouette.</h3><p className="mt-3 text-sm text-fg-muted">The top-right and bottom-left cuts belong to both the outline and the fill.</p></ChamferFrame></Example></>
    case 'buttons': return <><Example title="Default, selected & disabled"><div className="ds-example-row"><PortfolioButton onClick={() => setOn(!on)}>{on ? 'Saved' : 'Save changes'}{on && <Check className="ml-2 inline" size={13}/>}</PortfolioButton><PortfolioButton variant="solid" onClick={() => setOn(!on)}>Selected action</PortfolioButton><PortfolioButton disabled>Disabled action</PortfolioButton></div><p className="mt-4 text-xs text-fg-muted">Click Save changes to try a completed state.</p></Example><Example title="Sizes & content"><div className="ds-example-row"><PortfolioButton size="compact">Compact</PortfolioButton> <PortfolioButton>Default action</PortfolioButton><PortfolioButton size="large"><Plus size={14} className="mr-2 inline"/>Add item</PortfolioButton></div></Example></>
    case 'icon-buttons': return <><Example title="Close, previous, next & copy"><div className="ds-example-row"><PortfolioIconButton aria-label="Close example" onClick={() => setValue('Closed')}><X size={16}/></PortfolioIconButton><PortfolioIconButton aria-label="Previous example" onClick={() => setValue('Previous')}><ArrowLeft size={16}/></PortfolioIconButton><PortfolioIconButton aria-label="Next example" onClick={() => setValue('Next')}><ArrowRight size={16}/></PortfolioIconButton><PortfolioIconButton aria-label="Copy example" onClick={() => { setCopied(!copied); setValue(copied ? 'Copy reset' : 'Copied') }}>{copied ? <Check size={16}/> : <Copy size={16}/>}</PortfolioIconButton><PortfolioIconButton aria-label="Disabled icon button" disabled><Plus size={16}/></PortfolioIconButton></div><p className="mt-5 text-xs text-fg-muted" role="status">{value || 'Each icon button has an accessible label. Try one.'}</p></Example></>
    case 'links': return <><Example title="Header links" wide><SiteTopBar/></Example><Example title="Footer links" wide><SiteFooter/></Example></>
    case 'text-fields': return <div className="ds-example-grid"><Example title="Default & help text"><label className="ds-demo-field">Name<PortfolioTextField aria-label="Name" placeholder="Enter your name" value={value} onChange={(e) => setValue(e.target.value)} /><small>This field is editable. Focus it to inspect the ring.</small></label></Example><Example title="Error state"><label className="ds-demo-field">Email<PortfolioTextField aria-label="Email" defaultValue="hello@" aria-invalid="true" aria-describedby="demo-field-error" /><small id="demo-field-error">Enter a complete email address.</small></label></Example><Example title="Disabled"><label className="ds-demo-field">Unavailable field<PortfolioTextField aria-label="Unavailable field" placeholder="Not editable" disabled /></label></Example><Example title="Filled"><label className="ds-demo-field">Project<PortfolioTextField aria-label="Project" defaultValue="Portfolio design system" /></label></Example></div>
    case 'password': return <Example title="Leaderboard unlock"><LeaderboardGate password={value} onPasswordChange={setValue} onSubmit={event => { event.preventDefault(); setOn(true) }}/><p className="mt-4 text-xs text-fg-muted" role="status">{on ? 'Preview submitted. No credentials were sent.' : 'The same gate rendered by the leaderboard; submission stays local.'}</p></Example>
    case 'search': return <Example title="Actual city filter"><LeaderboardCityFilter boardRows={['Toronto','Tokyo','Berlin'].map((city, i) => ({city,rank:i+1,codename:`PLAYER ${i+1}`,score:30-i,playedAt:'2026-11-06T12:00:00Z'}))} excludedCities={excluded} onExcludedCitiesChange={setExcluded}/></Example>
    case 'switch': return <Example title="Annotation switch"><div className="ds-example-row"><span className="text-sm text-fg">Show annotations</span><CaseStudySwitch checked={on} type="button" aria-label="Show annotations" onClick={() => setOn(!on)}/><span className="text-xs text-fg-muted">{on ? 'On' : 'Off'}</span></div></Example>
    case 'header': return <Example title="Portfolio header" wide description="The real header, including its clock, navigation dialogs and editing-only theme controls."><SiteTopBar /></Example>
    case 'sidebar': return <Example title="Section navigation"><div className="ds-example-row items-start"><div className="w-52"><SidebarNav embedded sections={navSections} activeId={active} onNavigate={setActive}/></div><div className="flex-1 rounded border border-border bg-elevated p-8"><span className="text-xs text-fg-muted">Selected section</span><h3 className="mt-3 text-xl text-fg">{navSections.find((s) => s.id === active)?.label}</h3></div></div></Example>
    case 'tabs': return <TabsExample />
    case 'footer': return <Example title="Portfolio footer" wide><SiteFooter /></Example>
    case 'card': return <div className="ds-example-grid"><Example title="Text card"><ChamferFrame innerClassName="bg-elevated/25 p-6"><h3 className="text-lg text-fg">A shared building block.</h3><p className="mt-3 text-sm text-fg-muted">The same chamfered silhouette appears throughout the portfolio.</p><PortfolioButton className="mt-5">View project</PortfolioButton></ChamferFrame></Example><Example title="Animated border"><ChamferFrame meteorTrail innerClassName="bg-elevated/25 p-6"><h3 className="text-lg text-fg">A little motion.</h3><p className="mt-3 text-sm text-fg-muted">The border accent follows the current theme.</p></ChamferFrame></Example><Example title="Image card" wide><ChamferFrame className="max-w-lg mx-auto" innerClassName="bg-surface"><img src={sampleArt.url} alt="Original BobaGhosteas illustration" className="h-64 w-full object-contain"/></ChamferFrame></Example></div>
    case 'rows': return <Example title="Actual project list" wide><ExperimentalCaseStudiesPanel layout="footer"/></Example>
    case 'metrics': return <Example title="Case-study metrics" wide><div className="ds-metrics-container"><div className="ds-metrics-grid grid grid-cols-12 gap-6"><KpiMetricsGrid metrics={[{value:'40%',label:'Less time',description:'An example outcome metric.'},{value:'3×',label:'Faster delivery',description:'The same component animates into view.'},{value:'12',label:'Shared patterns',description:'Values and labels use the theme.'}]}/></div></div></Example>
    case 'progress': return <Example title="Reading progress"><div className="py-12"><CaseStudyScrollProgressBar value={progress}/></div><label className="ds-demo-field max-w-sm">Progress · {Math.round(progress*100)}%<input type="range" min="0" max="1" step="0.01" value={progress} onChange={(e)=>setProgress(Number(e.target.value))}/></label></Example>
    case 'loading': return <Example title="Page loading"><div className="ds-contained-loading"><HudLoadingScreen /></div></Example>
    case 'not-found': return <Example title="404"><div className="flex flex-col items-center gap-5 py-8"><NotFound404Glyph/><p className="text-lg text-fg">This page does not exist.</p><p className="text-xs text-fg-muted">The URL may be mistyped, or the page was moved.</p></div></Example>
    case 'presentation': return <Example title="Full-screen case-study presentation" wide><PresentationExamples/></Example>
    case 'lightbox': return <><Example title="Navigation dialogs"><div className="ds-example-row"><PortfolioButton onClick={() => setModal('case')}>Open case studies</PortfolioButton><PortfolioButton onClick={() => setModal('side')}>Open side quests</PortfolioButton></div></Example><CaseStudiesCardModal open={modal==='case'} onClose={()=>setModal(null)}/><ShowTellQuadrantModal open={modal==='side'} onClose={()=>setModal(null)}/><ImageExamples/></>
    case 'image': return <ImageExamples/>
    case 'video': return <Example title="Portfolio video" wide>{sampleVideo ? <ChamferFrame innerClassName="bg-media-dark"><CaseStudyLazyVideo src={sampleVideo.url} ariaLabel="Portfolio walkthrough" className="max-h-[480px] w-full" /></ChamferFrame> : <p className="text-fg-muted">No local video is available.</p>}</Example>
    case 'timeline': return <><Example title="Single-line timeline" wide><TimelinePillsRow stepLabels={['Discover','Define','Design','Deliver']}/></Example><Example title="Multiline labels" wide><TimelinePillsRow stepLabels={['01\nResearch','02\nDirection','03\nDesign','04\nDelivery']} pillTextMode="multiline"/></Example></>
    case 'comparison': return <><Example title="Before / after control"><BeforeAfterToggle mode={on?'after':'before'} onModeChange={(mode)=>setOn(mode==='after')}/></Example><Example title="Comparison with media" wide><ComparisonShowcase title="Before and after" before={<div className="flex h-64 items-center justify-center bg-elevated text-fg-muted">Before: separate experiences</div>} after={<div className="flex h-64 flex-col items-center justify-center gap-4 bg-surface text-fg"><Check size={32}/><span>After: one shared system</span></div>} caption="Use the real toggle above the frame to switch views." visualMinClassName="min-h-64"/></Example></>
    case 'statement': return <><Example title="Original glitch statement" wide><ProblemStatementFrame label="The problem"><p>How do we make a complex experience feel simple?</p></ProblemStatementFrame></Example><Example title="Plain alternate" wide><ProblemStatementFrame label="The problem" plainStatement><p>How do we make a complex experience feel simple?</p></ProblemStatementFrame></Example><Example title="Quote & narrative" wide><StatementSection statement="Make the right thing easy to repeat." subtext="The shared statement treatment from the portfolio’s case studies."/></Example></>
    case 'decisions': return <Example title="Insight → decision → outcome" wide><DecisionSection items={[{insight:'People need a clear place to start.',decision:'Bring the most important actions together.',outcome:'A focused experience with fewer steps.'}]}/></Example>
    case 'case-study-card': return <Example title="Home case-study panel" wide><ExperimentalCaseStudiesPanel layout="footer" /></Example>
    case 'hero': return <VisualPagePreview path="/" section={'[data-design-section="hero"]'} isolate />
    case 'biography': return <VisualPagePreview path="/" section={'[data-design-section="biography"]'} isolate />
    case 'side-quests': return <VisualPagePreview path="/" section="[data-show-tell-quadrant]" isolate />
    default: return null
  }
}

export function VisualStoryView({ story }: { story: VisualStory }) {
  const audit = fidelity.stories.find(entry => entry.id === story.id)
  const publicUse = audit?.consumers.length
  const context = siteContexts[story.id]
  return <><div className="ds-story-context"><span className="ds-sample-badge">{publicUse ? 'Shared site implementation' : 'Editor-only pattern'}</span><span>{publicUse ? `Used in ${story.usedIn.join(' · ')}` : 'Not currently used by a public page'}</span></div><details className="ds-source-linkage"><summary>Source & site usage</summary><p>To change this component everywhere, edit its shared source. The catalog is a preview, not a separate editable copy.</p><code>{story.source}</code>{audit?.consumers.length ? <ul>{audit.consumers.map(file=><li key={file}><code>{file}</code></li>)}</ul> : <p>This pattern has no public-site consumer. Editing it will currently change the editor examples only.</p>}<p>Sample content and pinned state illustrations are documentation; live page previews preserve the actual composition.</p></details><ComponentDocumentation key={`docs-${story.id}`} story={story} sitePreview={context ? <><p className="ds-note">The actual page, including its content, styling and behavior. Use the controls inside it; edits to the site implementation appear here automatically. Protected pages retain their normal gate.</p><VisualPagePreview path={context.path} section={context.section}/></> : undefined} examples={<StoryExamples key={`example-${story.id}`} id={story.id}/>}/></>
}

function SharedGalleryPreview({ id }: { id: string }) {
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const element = host.current
    if (!element) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '160px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <div ref={host} className="ds-tile-preview">{visible ? <StoryExamples id={id}/> : <span>Shared component preview</span>}</div>
}

export function VisualComponentGallery({ onSelect }: { onSelect: (story: VisualStory) => void }) {
  const [search,setSearch]=useState('')
  return <><div className="ds-gallery-search"><MagnifyingGlass size={17}/><input aria-label="Search visual components" placeholder="Search buttons, cards, navigation…" value={search} onChange={(e)=>setSearch(e.target.value)}/></div>{visualStoryGroups.map((group)=>{const stories=group.stories.filter((s)=>`${s.name} ${s.group} ${s.description}`.toLowerCase().includes(search.toLowerCase()));return stories.length?<section className="ds-visual-group" key={group.name}><h2>{group.name}<span>{stories.length}</span></h2><div className="ds-visual-gallery">{stories.map((story)=><section key={story.id} className="ds-visual-tile"><SharedGalleryPreview id={story.id}/><div><button className="ds-gallery-inspect" onClick={()=>onSelect(story)}>{story.name}<ArrowUpRight size={15}/></button><p>{story.description}</p></div></section>)}</div></section>:null})}{!visualStories.some((s)=>`${s.name} ${s.group} ${s.description}`.toLowerCase().includes(search.toLowerCase()))&&<p className="ds-note">No visual components match “{search}”.</p>}</>
}

export function VisualPages({ path, section, onSelect }: {path?:string; section?:string; onSelect:(path:string,label:string,section?:string)=>void}) {
  if(path) return <><VisualPagePreview path={path} section={section}/>{pageSections[path]?.length ? <section className="ds-visual-group"><h2>Sections in this page</h2><div className="ds-section-links">{pageSections[path]!.map((s)=><button key={s.id} onClick={()=>onSelect(path,s.label,s.id)} aria-pressed={section===s.id}>{s.label}<ArrowRight size={14}/></button>)}</div></section>:null}</>
  return <div className="ds-page-gallery">{inventory.routes.map((r)=><button className="ds-page-tile" key={r.path} onClick={()=>onSelect(r.path,r.component.replace(/ShowcasePage|Page$/g,'').replace(/([a-z])([A-Z])/g,'$1 $2'))}><div className="ds-page-mini" aria-hidden><span/><div><i/><i/><i/></div><span/><div><i/><i/></div></div><strong>{r.path==='/'?'Home':r.path==='/*'?'404 / Not found':r.path.split('/').at(-1)?.replace(/-/g,' ')}</strong><span>{pageSections[r.path]?.length ?? 0} page sections</span><span className="ds-page-open">Open interactive page <ArrowUpRight size={14}/></span></button>)}</div>
}

export function VisualFoundations({ focus }: {focus?:string}) {
  const {theme}=useSiteTheme()
  const color=!focus||['semantic-color-roles','fixed-media-effect-roles','declared-foundation-tokens'].includes(focus)
  const type=!focus||['type-specimens','typography'].includes(focus)
  const spacing=!focus||['spacing-dimensions','responsive-behavior'].includes(focus)
  const shape=!focus||focus==='shape-borders-elevation'
  const motion=!focus||['motion-interaction-states','animation-catalog','live-specimens'].includes(focus)
  return <>{color&&<><section className="ds-visual-group"><h2>Color palette</h2><p className="ds-note">Live colors from the current theme. Each swatch shows its role in the interface.</p><div className="ds-foundation-colors">{Object.entries(focus==='fixed-media-effect-roles'?fixedColors:themePalettes[theme]).map(([role,value])=><div key={role}><div style={{background:value}}/><strong>{role.replace(/-/g,' ')}</strong><span>{value}</span></div>)}</div></section><Example title="Colors working together"><div className="rounded-xl border border-cell-border bg-elevated p-8"><span className="text-xs text-fg-subtle">A supporting label</span><h3 className="mt-3 text-2xl text-fg">A clear visual hierarchy.</h3><p className="mt-3 text-sm text-fg-muted">Primary, muted and subtle text remain paired with the correct surface.</p><PortfolioButton className="mt-6">Primary action</PortfolioButton></div></Example></>}{type&&<section className="ds-visual-group"><h2>Typography</h2><p className="ds-note">{theme==='luma'?'Inter is Luma’s typeface.':'Space Mono is the original portfolio’s typeface.'} The documentation shell uses a separate sans-serif face.</p>{[{role:'display',label:'Display',copy:'Systems behind the screens.'},{role:'title',label:'Title',copy:'A place for every building block.'},{role:'lead',label:'Lead',copy:'Designing clearer experiences, one shared pattern at a time.'},{role:'body',label:'Body',copy:'The portfolio uses consistent type to bring stories, navigation and interface details together.'},{role:'small',label:'Small',copy:'Supporting details, captions and labels.'}].map((item)=><div className="ds-type-visual" key={item.role}><span>{item.label}</span><p className="font-mono text-fg" style={{fontSize:`var(--text-${item.role})`,lineHeight:`var(--text-${item.role}--line-height)`}}>{item.copy}</p></div>)}</section>}{spacing&&<><section className="ds-visual-group"><h2>Spacing scale</h2><p className="ds-note">Visual reference for the spacing values used throughout the portfolio.</p><div className="ds-space-scale">{[4,8,12,16,20,24,32,40,48,64,80,96].map((size)=><div key={size}><span>{size}px</span><i style={{width:size}}/></div>)}</div></section><Example title="Page grid & gutters"><div className="ds-grid-specimen">{Array.from({length:12},(_,i)=><span key={i}>{i+1}</span>)}</div><p className="mt-4 text-xs text-fg-muted">12 columns · 24px desktop gutters · 1440px maximum frame</p></Example></>}{shape&&<><Example title="The portfolio’s chamfered silhouette"><div className="grid gap-6 md:grid-cols-2"><ChamferFrame innerClassName="bg-elevated p-8"><p className="text-fg">Default frame</p></ChamferFrame><ChamferFrame meteorTrail innerClassName="bg-elevated p-8"><p className="text-fg">Animated outline</p></ChamferFrame></div></Example><Example title="Borders & elevation"><div className="ds-elevation-specimens"><div className="border border-border">Subtle border</div><div className="border border-cell-border">Cell border</div><div className="border border-hud bg-elevated">Accent border</div></div></Example></>}{motion&&<><Example title="Animated accents"><div className="py-8"><CaseStudyScrollProgressBar value={0.6}/></div><ChamferFrame meteorTrail innerClassName="bg-elevated p-8"><p className="text-fg">The theme accent travels around the frame.</p></ChamferFrame></Example><Example title="Interaction states"><div className="ds-example-row"><PortfolioButton>Hover or focus me</PortfolioButton><PortfolioButton variant="solid">Selected</PortfolioButton><PortfolioButton disabled>Disabled</PortfolioButton></div></Example></>}</>
}
