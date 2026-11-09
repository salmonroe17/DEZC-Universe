import { useEffect, useMemo, useState } from 'react'
import { FormStudy, type StudyForm } from '../components/gradients/FormStudy'
import { LumaPaletteDropdown } from './LumaPaletteDropdown'
import { lumaPaletteOptions } from './lumaPreview'
import { CaseStudySwitch } from '../components/system/CaseStudySwitch'
import './luma-prototype.css'

const forms = [
  { id:'solar', label:'Solar lens', technique:'3D disk · optical lensing approximation', description:'A polished reflective sphere inside golden accretion filaments.' },
  { id:'spectral', label:'Spectral singularity', technique:'3D disk · optical lensing approximation', description:'A reflective sphere, inclined disk and chromatic light paths.' },
  { id:'cat', label:'Ghost cat', technique:'Ray-marched volume', description:'A moving glass head with gradient reflections, luminous eyes and a timed blink.' },
  { id:'vortex', label:'Chromatic well', technique:'Ray-marched toroidal volume', description:'Cyan, violet, magenta and orange wrap around a deep central field.' },
  { id:'ribbon', label:'Folded spectrum', technique:'Ray-marched twisted ribbon', description:'A vertical S-shaped ribbon with warm and cool folds and fine grain.' },
  { id:'cube', label:'Refractive cube', technique:'Ray-marched glass · exit-face refraction', description:'Beveled geometry with transparent faces and blue, cyan and amber reflections.' },
  { id:'halo', label:'Prismatic corona', technique:'Ray-marched corona · spectral scattering', description:'A breathing, vibrating corona scattering dispersed spectral rays.' },
  { id:'pastel', label:'Opal volume', technique:'Ray-marched blended volumes', description:'Unequal, deforming volumes stretch into necks, merge and divide.' },
  { id:'rings', label:'Orbital radiance', technique:'Procedural optics · concentric dispersion', description:'Two iridescent rings, a translucent center and four breathing light points.' },
  { id:'flare', label:'Horizontal light beam', technique:'Procedural optics · horizontal anamorphic flare', description:'A horizontal light axis with chromatic rings and drifting lens ghosts.' },
  { id:'starburst', label:'Prismatic starburst', technique:'Procedural optics · diffraction and lens ghosts', description:'Fine radiating rays and a diagonal chain of dispersed reflections.' },
  { id:'target', label:'Prismatic target', technique:'Procedural optics · animated targeting field', description:'A horizontal pulse beam, breathing crosshair arms and streaming radial light inside a target ring.' },
  { id:'water', label:'Liquid water', technique:'Ray-traced animated height field', description:'Crossing swells with surface reflections, refracted color and moving caustics.' },
  { id:'ripples', label:'Droplet ripples', technique:'Ray-traced animated height field', description:'Repeated drop impacts launch expanding rings that cross and fade.' },
] as const

type FormSettings={blur:number;colors:[string,string,string];brightness:number;sphere?:boolean;customColors?:[string,string,string]}
const defaults:Record<StudyForm,FormSettings>={
 solar:{sphere:true,blur:1,colors:['#dda348','#fff2c4','#e99063'],brightness:0},
 spectral:{sphere:true,blur:1,colors:['#55cde4','#aa88f0','#ffd18e'],brightness:0},
 cat:{blur:3,colors:['#45cddd','#8881ec','#ee9dc9'],brightness:0},
 vortex:{blur:9,colors:['#26d6d0','#a25ae1','#f7ac63'],brightness:0},
 ribbon:{blur:4,colors:['#ff6748','#bd4daa','#4e3bdf'],brightness:0},
 cube:{blur:1,colors:['#5998e4','#a3e6e0','#ffd298'],brightness:.20},
 halo:{blur:3,colors:['#407bb2','#9c91d0','#dc9c4f'],brightness:0},
 pastel:{blur:6,colors:['#54cfde','#9984ec','#efa3ce'],brightness:0},
 rings:{blur:.5,colors:['#858de0','#c5b6ed','#f7b7c8'],brightness:0},
 flare:{blur:.5,colors:['#7bbfdb','#b59ce6','#edbd71'],brightness:0},
 starburst:{blur:.5,colors:['#82c8e6','#b7b0ed','#f1c298'],brightness:0},
 target:{blur:.5,colors:['#74cbdc','#ad9ee9','#efb5ce'],brightness:0},
 water:{blur:0,colors:['#66b6d2','#a7d9e1','#a29ada'],brightness:0},
 ripples:{blur:0,colors:['#80bacc','#c4e4e7','#a8a0d7'],brightness:0},
}
const archivedIds=new Set<StudyForm>(['flare','rings','solar','spectral'])
const paletteColors=(key:keyof typeof lumaPaletteOptions):[string,string,string]=>{const p=lumaPaletteOptions[key];return[p.start,p.mid,p.end]}
const matchingPalette=(colors:readonly string[])=>Object.keys(lumaPaletteOptions).find(key=>paletteColors(key as keyof typeof lumaPaletteOptions).every((color,i)=>color.toLowerCase()===colors[i]?.toLowerCase()))??'custom'

const storageKey='dezc-form-study-materials-v1'
type SavedDefaults={forms:Partial<Record<StudyForm,FormSettings>>;motion?:boolean}
const defaultsKey='dezc-form-study-defaults-v1'
function readSavedDefaults():SavedDefaults{
 const result:SavedDefaults={forms:{}}
 try{const saved=JSON.parse(localStorage.getItem(defaultsKey)??'{}') as SavedDefaults
  if(typeof saved.motion==='boolean')result.motion=saved.motion
  for(const id of Object.keys(defaults) as StudyForm[]){const value=saved.forms?.[id]
   if(!value||!Array.isArray(value.colors)||value.colors.length!==3||!value.colors.every(color=>/^#[0-9a-f]{6}$/i.test(color)))continue
   const next:FormSettings={...structuredClone(defaults[id]),colors:[...value.colors]}
   if(typeof value.blur==='number'&&Number.isFinite(value.blur))next.blur=Math.max(0,Math.min(24,value.blur))
   if(typeof value.brightness==='number'&&Number.isFinite(value.brightness))next.brightness=Math.max(0,Math.min(.65,value.brightness))
   if(typeof value.sphere==='boolean')next.sphere=value.sphere
   if(Array.isArray(value.customColors)&&value.customColors.length===3&&value.customColors.every(color=>/^#[0-9a-f]{6}$/i.test(color)))next.customColors=[...value.customColors]
   result.forms[id]=next
  }
 }catch{/* Invalid or unavailable saved defaults leave the original forms available. */}
 return result
}
function loadSettings():Record<StudyForm,FormSettings>{
 const result=structuredClone(defaults)
 try{const saved=JSON.parse(localStorage.getItem(storageKey)??'{}') as Record<string,Partial<FormSettings>>
  for(const id of Object.keys(defaults) as StudyForm[]){const value=saved[id];if(!value)continue
   if(typeof value.sphere==='boolean')result[id].sphere=value.sphere
   if(typeof value.blur==='number'&&Number.isFinite(value.blur))result[id].blur=Math.max(0,Math.min(24,value.blur))
   if(typeof value.brightness==='number'&&Number.isFinite(value.brightness))result[id].brightness=Math.max(0,Math.min(.65,value.brightness))
   if(Array.isArray(value.colors)&&value.colors.length===3&&value.colors.every(color=>/^#[0-9a-f]{6}$/i.test(color)))result[id].colors=[...value.colors] as [string,string,string]
   if(Array.isArray(value.customColors)&&value.customColors.length===3&&value.customColors.every(color=>/^#[0-9a-f]{6}$/i.test(color)))result[id].customColors=[...value.customColors] as [string,string,string]
   else if(matchingPalette(result[id].colors)==='custom')result[id].customColors=[...result[id].colors]
  }
 }catch{/* An unavailable or older preview cache falls back to the built-in materials. */}
 return {...result,...readSavedDefaults().forms}
}

export function ThreeDForms() {
  const [storedSettings,setSettings]=useState<Record<StudyForm,FormSettings>>(loadSettings)
  const settings=useMemo(()=>({...defaults,...storedSettings}),[storedSettings])
  const [savedDefaults,setSavedDefaults]=useState<SavedDefaults>(readSavedDefaults)
  const [notice,setNotice]=useState('')
  const [transparencyGrid,setTransparencyGrid]=useState(false)
  const [motion,setMotion]=useState(()=>readSavedDefaults().motion??!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const effectiveDefaults=useMemo(()=>({...defaults,...savedDefaults.forms}),[savedDefaults])
  const saveDefault=(id?:StudyForm)=>{const next:SavedDefaults=id?{...savedDefaults,forms:{...savedDefaults.forms,[id]:structuredClone(settings[id])}}:{forms:structuredClone(settings),motion};setSavedDefaults(next);try{localStorage.setItem(defaultsKey,JSON.stringify(next));setNotice(id?`${forms.find(form=>form.id===id)?.label} default saved in this browser.`:'All form defaults and motion preference saved in this browser.')}catch{setNotice('Defaults saved for this visit; browser storage is unavailable.')}}
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(settings))}catch{/* Material editing still works when storage is unavailable. */}},[settings])
  const update=(id:StudyForm,change:Partial<FormSettings>)=>{setNotice('');setSettings(current=>({...current,[id]:{...defaults[id],...current[id],...change}}))}
  const customColors=(id:StudyForm)=>settings[id].customColors??defaults[id].colors
  const customOptions=forms.map(form=>({value:`custom:${form.id}`,label:`${form.label} · custom`,paint:`linear-gradient(120deg,${customColors(form.id).join(',')})`}))
  const selectedPalette=(colors:readonly string[],preferred?:StudyForm)=>{
   const order=preferred?[preferred,...forms.map(form=>form.id).filter(id=>id!==preferred)]:forms.map(form=>form.id)
   const custom=order.find(id=>customColors(id).every((color,i)=>color.toLowerCase()===colors[i]?.toLowerCase()))
   return custom?`custom:${custom}`:matchingPalette(colors)
  }
  const allSame=Object.values(settings).every(value=>value.colors.every((color,i)=>color===settings.solar.colors[i]))
  const globalPalette=allSame?selectedPalette(settings.solar.colors):'individual'
  const colorsFor=(key:string)=>key.startsWith('custom:')?customColors(key.slice(7) as StudyForm):Object.hasOwn(lumaPaletteOptions,key)?paletteColors(key as keyof typeof lumaPaletteOptions):null
  const applyPalette=(key:string)=>{
   if(key==='individual'){setSettings(current=>Object.fromEntries(Object.entries({...defaults,...current}).map(([id,value])=>[id,{...value,colors:[...(value.customColors??defaults[id as StudyForm].colors)]}])) as Record<StudyForm,FormSettings>);return}
   const colors=colorsFor(key);if(!colors)return
   setSettings(current=>Object.fromEntries(Object.entries({...defaults,...current}).map(([id,value])=>[id,{...value,colors:[...colors]}])) as Record<StudyForm,FormSettings>)
  }
  const renderForm=(form:typeof forms[number])=>{const value=settings[form.id];const preset=selectedPalette(value.colors,form.id)
        return <article key={form.id} data-study={form.id} aria-label={form.label}>
          <div className="luma-form-render"><FormStudy form={form.id} motion={motion} {...value}/></div>
          <h2>{form.label}</h2><span className="ds-form-technique">{form.technique}</span><p>{form.description}</p>
          <fieldset className="ds-form-settings"><legend>{form.label} controls</legend>
            <div className="ds-form-setting"><label htmlFor={`${form.id}-blur`}>Blur <output>{value.blur}px</output></label><input id={`${form.id}-blur`} type="range" min="0" max="24" step=".5" value={value.blur} onChange={event=>update(form.id,{blur:Number(event.target.value)})}/></div>
            <div className="ds-form-setting"><label id={`${form.id}-palette-label`}>Gradient</label><LumaPaletteDropdown id={`${form.id}-palette`} label={`${form.label} palette`} value={preset} extraOptions={[...customOptions.filter(option=>option.value===`custom:${form.id}`),...customOptions.filter(option=>option.value!==`custom:${form.id}`)]} onChange={key=>{const colors=colorsFor(key);if(colors)update(form.id,{colors:[...colors]})}}/></div>
            {(form.id==='solar'||form.id==='spectral')&&<div className="ds-form-setting"><label id={`${form.id}-sphere-label`}>Reflective sphere</label><CaseStudySwitch checked={value.sphere!==false} aria-labelledby={`${form.id}-sphere-label`} onClick={()=>update(form.id,{sphere:value.sphere===false})}/></div>}
            <div className="ds-form-color-stops">{value.colors.map((color,index)=><label key={index}><input type="color" aria-label={`${form.label} gradient stop ${index+1}`} value={color} onChange={event=>{const colors:[string,string,string]=[...value.colors];colors[index]=event.target.value;update(form.id,{colors,customColors:[...colors]})}}/><span>{color}</span></label>)}</div>
            <div className="ds-form-gradient" aria-hidden style={{background:`linear-gradient(90deg,${value.colors.join(',')})`}}/>
            {form.id==='cube'&&<div className="ds-form-setting"><label htmlFor="cube-lightness">Face lightness <output>{Math.round(value.brightness*100)}%</output></label><input id="cube-lightness" type="range" min="0" max=".65" step=".01" value={value.brightness} onChange={event=>update('cube',{brightness:Number(event.target.value)})}/></div>}
            <div className="ds-form-save-actions"><button type="button" aria-label={`Save ${form.label} as default`} onClick={()=>saveDefault(form.id)}>{notice.startsWith(`${form.label} default saved`)?'Saved as default':'Save as default'}</button><button type="button" onClick={()=>update(form.id,structuredClone(effectiveDefaults[form.id]))}>Reset {form.label}</button></div>
          </fieldset>
        </article>
  }
  return <div className={`luma-prototype ds-forms-page ${transparencyGrid?'ds-forms-transparency-grid':''}`}>
    <section className="luma-panel ds-forms-controls" aria-label="3D form controls">
      <div className="ds-forms-global-palette"><label>Palette · all forms</label><LumaPaletteDropdown label="All forms palette" value={globalPalette} onChange={applyPalette} extraOptions={[{value:'individual',label:'Use each form’s saved custom gradient'},...customOptions]}/></div>
      <label id="forms-grid-label">Transparency grid</label><CaseStudySwitch checked={transparencyGrid} aria-labelledby="forms-grid-label" onClick={()=>setTransparencyGrid(!transparencyGrid)}/>
      <label id="forms-motion-label">Motion</label>
      <CaseStudySwitch checked={motion} aria-labelledby="forms-motion-label" onClick={()=>setMotion(!motion)}/>
      <button type="button" onClick={()=>saveDefault()}>Save all as defaults</button><button type="button" onClick={()=>{setSettings(structuredClone(effectiveDefaults));if(savedDefaults.motion!==undefined)setMotion(savedDefaults.motion)}}>Reset all forms</button>
      <p>Choose a palette for every form, or edit each form below with its own blur and three-stop gradient. Custom gradients appear first in every picker and stay saved when you try presets. Save as default stores your chosen settings in this browser; Reset restores that saved default. Motion respects your device preference on entry.</p>
    </section>
    <p className="ds-form-save-notice" role="status" aria-live="polite">{notice}</p>
    <section className="luma-forms" aria-label="Rendered geometry">
      {forms.filter(form=>!archivedIds.has(form.id)).map(renderForm)}
    </section>
    <details className="ds-forms-archive"><summary>Archived forms <span>{archivedIds.size} studies</span></summary><p>Earlier explorations, preserved with their materials, controls and saved defaults.</p><section className="luma-forms" aria-label="Archived forms">{forms.filter(form=>archivedIds.has(form.id)).map(renderForm)}</section></details>
  </div>
}
