import { PortfolioButton } from './PortfolioControls'
export function PortfolioContentSwitcher({value,onChange,options,label='Content view'}:{value:string;onChange:(value:string)=>void;options:{value:string;label:string}[];label?:string}){
 return <div className="portfolio-content-switcher" role="group" aria-label={label}>{options.map(option=><PortfolioButton key={option.value} aria-pressed={value===option.value} data-selected={value===option.value||undefined} onClick={()=>onChange(option.value)}>{option.label}</PortfolioButton>)}</div>
}
