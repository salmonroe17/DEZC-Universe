import { PortfolioDropdown, type DropdownOption } from '../components/system/PortfolioDropdown'
import { lumaPaletteOptions } from './lumaPreview'

export function LumaPaletteDropdown({value,onChange,label='Palette',id,customLabel,extraOptions=[]}:{value:string;onChange:(value:string)=>void;label?:string;id?:string;customLabel?:string;extraOptions?:DropdownOption[]}){
 return <PortfolioDropdown id={id} label={label} value={value} onChange={onChange} options={[
  ...extraOptions,
  ...(customLabel?[{value:'custom',label:customLabel}]:[]),
  ...Object.entries(lumaPaletteOptions).map(([value,p])=>({value,label:p.label,paint:`linear-gradient(120deg,${p.start},${p.mid},${p.end})`}))
 ]}/>
}
