import { Children, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import inventory from './inventory'
import { useSiteTheme } from '../contexts/useSiteTheme'
import { themePalettes } from './theme'
import { LeaderboardGate } from '../components/LeaderboardGate'
import { HudLoadingScreen } from '../components/HudLoadingScreen'
import { CaseStudyLazyVideo } from '../components/caseStudy/CaseStudyLazyVideo'
import { PresentationExamples } from './PresentationExamples'
import { VisualPagePreview } from './VisualLibrary'
import { CursorStates, CursorPlayground, CardCornerExamples } from './InteractionExamples'
import { PortfolioButton, PortfolioTextField } from '../components/system/PortfolioControls'
import { PortfolioTab } from '../components/system/PortfolioTabs'
import { ChamferFrame } from '../components/system/ChamferFrame'
import { SiteTopBar } from '../components/SiteTopBar'
import { SiteFooter } from '../components/SiteFooter'
import { SidebarNav } from '../components/system/SidebarNav'
import { ComparisonShowcase } from '../components/caseStudy/patterns/ComparisonShowcase'
import { TimelinePillsRow } from '../components/caseStudy/patterns/TimelinePillsRow'
import { KpiMetricsGrid } from '../components/caseStudy/patterns/KpiMetricsGrid'
import { CaseStudyScrollProgressBar } from '../components/caseStudy/CaseStudyScrollProgressBar'
import { CaseStudiesCardModal } from '../components/CaseStudiesCardModal'
import { ShowTellQuadrantModal } from '../components/ShowTellQuadrantModal'
import { NotFound404Glyph } from '../components/NotFound404Glyph'
import { ExperimentalCaseStudiesPanel } from '../components/ExperimentalCaseStudiesPanel'
import { DecisionSection } from '../components/sections/DecisionSection'
import { ProblemStatementFrame } from '../components/caseStudy/patterns/ProblemStatementFrame'

const video=inventory.assets.find(a=>a.kind==='Video'&&a.usedBy.length&&!a.file.includes('ARCHIVE'))
const sections=[{id:'intro',label:'Introduction'},{id:'overview',label:'Overview'},{id:'design',label:'The design'},{id:'impact',label:'Impact'}]
// Large, composed previews need a whole row; smaller specimens share two columns.
const fullRowSpecimens = new Set(['hero', 'metrics', 'presentation', 'side-quests', 'biography', 'case-study-card', 'decisions', 'image', 'video'])
function ShowcaseItem({children,span}:{children:ReactNode;span:number}) {
  const host=useRef<HTMLDivElement>(null)
  const [rows,setRows]=useState(16)
  useEffect(()=>{const content=host.current?.firstElementChild;if(!content)return;const update=()=>setRows(Math.max(1,Math.ceil((content.getBoundingClientRect().height+16)/24)));const observer=new ResizeObserver(update);update();observer.observe(content);return()=>observer.disconnect()},[])
  return <div ref={host} className="ds-showcase-grid-item" style={{gridColumn:`span ${span}`,gridRowEnd:`span ${rows}`}}>{children}</div>
}
function ShowcaseColumns({children}:{children:ReactNode}) {
  const host=useRef<HTMLDivElement>(null)
  const [columns,setColumns]=useState(2)
  useEffect(()=>{const el=host.current;if(!el)return;const update=()=>setColumns(el.clientWidth<740?1:2);const observer=new ResizeObserver(update);update();observer.observe(el);return()=>observer.disconnect()},[])
  return <div ref={host} className="ds-showcase-masonry" style={{gridTemplateColumns:`repeat(${columns},minmax(0,1fr))`}}>{Children.toArray(children).map((child,i)=>{const id=isValidElement<{story:string}>(child)?child.props.story:'';const span=columns===2&&fullRowSpecimens.has(id)?2:1;return <ShowcaseItem key={id||i} span={span}>{child}</ShowcaseItem>})}</div>
}
function Tile({ title, story, children, inspect, className='' }: {title:string;story:string;children:ReactNode;inspect:(id:string)=>void;className?:string}) {
  return <section data-specimen={story} className={`ds-showcase-tile ${className}`}><header><h2>{title}</h2><button onClick={()=>inspect(story)} aria-label={`Inspect ${title}`} title={`Inspect ${title}`}><ArrowUpRight size={14}/></button></header><div className="ds-showcase-tile-body">{children}</div></section>
}
export function OverviewShowcase({ inspect }: {inspect:(id:string)=>void}) {
  const {theme}=useSiteTheme()
  const [name,setName]=useState('')
  const [tab,setTab]=useState(0)
  const [active,setActive]=useState('intro')
  const [modal,setModal]=useState<'case'|'side'|null>(null)
  const [progress,setProgress]=useState(0.6)
  const [saved,setSaved]=useState(false)
  return <div className="ds-showcase-root"><div className="ds-showcase-site-nav"><SiteTopBar/></div><ShowcaseColumns>
    <Tile title="Leaderboard gate" story="password" inspect={inspect}><LeaderboardGate password={name} onPasswordChange={setName} onSubmit={event=>{event.preventDefault();setSaved(true)}}/>{saved&&<p className="ds-showcase-caption">Preview submitted locally.</p>}</Tile>
    <Tile title="Introduction & shooting game" story="hero" inspect={inspect} className="ds-showcase-game"><VisualPagePreview path="/" section={'[data-design-section="hero"]'} isolate compact/></Tile>
    <Tile title="Theme palette" story="@colors" inspect={inspect}><div className="ds-showcase-colors">{Object.entries(themePalettes[theme]).map(([role,color])=><div key={role} title={`${role}: ${color}`}><span style={{background:color}}/><small>{role}</small></div>)}</div><div className="ds-showcase-type"><span className="text-fg-subtle">Space Mono / 400</span><strong>Aa Bb Cc</strong><p>Systems behind the screens.</p><small>Primary text · Muted text · Subtle text</small></div></Tile>
    <Tile title="Section sidebar" story="sidebar" inspect={inspect}><SidebarNav embedded sections={sections} activeId={active} onNavigate={setActive}/><div className="ds-showcase-selection">Selected: {sections.find(s=>s.id===active)?.label}</div></Tile>
    <Tile title="Cursor & interaction" story="cursor-interactions" inspect={inspect}><CursorStates/><CursorPlayground compact/></Tile>
    <Tile title="Case-study presentation" story="presentation" inspect={inspect}><PresentationExamples compact/></Tile>
    <Tile title="Navigation dialogs" story="lightbox" inspect={inspect}><p className="ds-showcase-caption">Open the actual navigation overlays.</p><PortfolioButton onClick={()=>setModal('case')}>Open case studies</PortfolioButton><PortfolioButton onClick={()=>setModal('side')}>Open side quests</PortfolioButton></Tile>
    <Tile title="Card corners" story="card-corners" inspect={inspect}><CardCornerExamples compact/><ChamferFrame meteorTrail innerClassName="bg-elevated p-5"><p className="font-mono text-xs text-fg">One shared outline.</p><p className="mt-2 font-mono text-[10px] text-fg-muted">Inset border + clipped fill + optional meteor.</p></ChamferFrame></Tile>
    <Tile title="Legal tabs" story="tabs" inspect={inspect}><div className="ds-showcase-tabs" role="tablist" aria-label="Showcase tabs">{['Privacy','Terms','Cookies'].map((label,i)=><PortfolioTab id={`overview-tab-${i}`} controls="overview-tab-panel" selected={tab===i} onSelect={()=>setTab(i)} key={label}>{label}</PortfolioTab>)}</div><div role="tabpanel" id="overview-tab-panel" aria-labelledby={`overview-tab-${tab}`} className="ds-showcase-tab-panel">{['Privacy policy','Terms & conditions','Cookie policy'][tab]}</div></Tile>
    <Tile title="Metrics" story="metrics" inspect={inspect}><div className="ds-metrics-container"><div className="ds-metrics-grid grid grid-cols-12 gap-6"><KpiMetricsGrid metrics={[{value:'40%',label:'Less time',description:'Illustrative outcome.'},{value:'3×',label:'Faster delivery',description:'Illustrative outcome.'},{value:'12',label:'Shared patterns',description:'Illustrative outcome.'}]}/></div></div><small className="ds-showcase-caption">Illustrative metric values</small><div className="py-5"><CaseStudyScrollProgressBar value={progress}/></div><input type="range" aria-label="Showcase reading progress" min="0" max="1" step="0.01" value={progress} onChange={e=>setProgress(Number(e.target.value))}/></Tile>
    <Tile title="Project rows" story="rows" inspect={inspect}><ExperimentalCaseStudiesPanel layout="footer"/></Tile>
    <Tile title="Case-study imagery" story="image" inspect={inspect}><VisualPagePreview path="/case-study/super-app" section="super-navigation-section" compact/><p className="ds-showcase-caption">Actual page media: click an image to open its presentation.</p></Tile>
    <Tile title="Before & after" story="comparison" inspect={inspect}><ComparisonShowcase title="Before and after" before={<img src="/Super%20assets/s1.png" alt="Before specimen"/>} after={<img src="/Super%20assets/s2.png" alt="After specimen"/>}/></Tile>
    <Tile title="Timeline" story="timeline" inspect={inspect}><TimelinePillsRow stepLabels={['01','02','03']}/><div className="ds-showcase-timeline-labels"><span>Discover</span><span>Design</span><span>Deliver</span></div></Tile>
    <Tile title="Statement" story="statement" inspect={inspect}><ProblemStatementFrame label="The problem"><p>Make the complex feel simple.</p></ProblemStatementFrame></Tile>
    <Tile title="Feedback states" story="loading" inspect={inspect}><div className="ds-showcase-feedback"><div><div className="ds-state-loading"><HudLoadingScreen/></div><small>Loading</small></div><div className="ds-showcase-404"><NotFound404Glyph/><small>Not found</small></div></div><PortfolioTextField aria-label="Invalid field preview" aria-invalid="true" defaultValue="hello@"/><small className="ds-showcase-caption">Enter a complete email address.</small><PortfolioTextField aria-label="Disabled field preview" disabled placeholder="Unavailable"/></Tile>
    {video&&<Tile title="Video" story="video" inspect={inspect}><ChamferFrame innerClassName="bg-media-dark"><CaseStudyLazyVideo src={video.url} ariaLabel="Portfolio walkthrough"/></ChamferFrame><p className="ds-showcase-caption">Actual lazy-loaded autoplay video · Original media</p></Tile>}
    <Tile title="Side-quest timeline" story="side-quests" inspect={inspect}><VisualPagePreview path="/" section="[data-show-tell-quadrant]" isolate compact/></Tile>
    <Tile title="Case-study card" story="case-study-card" inspect={inspect}><ExperimentalCaseStudiesPanel layout="footer"/></Tile>
    <Tile title="Insight → decision → outcome" story="decisions" inspect={inspect}><DecisionSection items={[{insight:'People need a clear place to start.',decision:'Bring the primary actions together.',outcome:'A focused experience with fewer steps.'}]}/></Tile>
    <Tile title="Biography & artwork" story="biography" inspect={inspect}><VisualPagePreview path="/" section={'[data-design-section="biography"]'} isolate compact/></Tile>
  </ShowcaseColumns><div className="ds-showcase-footer"><SiteFooter/></div><CaseStudiesCardModal open={modal==='case'} onClose={()=>setModal(null)}/><ShowTellQuadrantModal open={modal==='side'} onClose={()=>setModal(null)}/></div>
}
