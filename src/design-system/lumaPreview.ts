export const lumaPaletteOptions={
 ion:{label:'Ion · cyan / violet / hot pink',family:9,start:'#18e4ff',mid:'#6950ff',end:'#ff50da',ink:'#b9c8ff'},
 voltage:{label:'Voltage · electric blue / cyan / lime',family:11,start:'#2878ff',mid:'#22deef',end:'#d8ff64',ink:'#a6eaf5'},
 opal:{label:'Opal · aqua / lilac / rose',family:10,start:'#6be8dc',mid:'#a68bff',end:'#ff96b5',ink:'#e0ceff'},

 aurora:{label:'Aurora · blue / violet / peach',family:8,start:'#315ce5',mid:'#8a4ed4',end:'#da658b',ink:'#3047b5'},
 lagoon:{label:'Lagoon · cyan / blue',family:0,start:'#087f91',mid:'#315ce5',end:'#9767d6',ink:'#146a80'},
 orchid:{label:'Orchid · violet / rose',family:1,start:'#6947cf',mid:'#b74daa',end:'#d86491',ink:'#713e9e'},
 dusk:{label:'Dusk · indigo / coral',family:6,start:'#3945ba',mid:'#a35baa',end:'#d87159',ink:'#783f88'},
 plasma:{label:'Plasma · teal / fuchsia / amber',family:3,start:'#10d9ce',mid:'#eb3cb8',end:'#ffb94f',ink:'#bcceff'},
 candy:{label:'Candy · pink / sky / violet',family:10,start:'#ff8bd5',mid:'#72d5fa',end:'#a276ff',ink:'#e6c6ff'},
 citrus:{label:'Citrus · lime / yellow / orange',family:11,start:'#a9ed48',mid:'#ffd84b',end:'#ff894d',ink:'#e1efb2'},
 tide:{label:'Tide · seafoam / turquoise / blue',family:0,start:'#8aebce',mid:'#20bfc8',end:'#3c78e8',ink:'#b6e8ef'},
 ultraviolet:{label:'Ultraviolet · violet / cobalt / cyan',family:9,start:'#a13ef2',mid:'#4657ef',end:'#31d5fa',ink:'#c9ccff'},
 sorbet:{label:'Sorbet · coral / peach / lavender',family:6,start:'#ff7b8a',mid:'#ffc28f',end:'#b497f2',ink:'#f4d1e0'},
 boreal:{label:'Boreal · mint / ice / periwinkle',family:10,start:'#8ce5bf',mid:'#a0def5',end:'#9699ef',ink:'#d2e6fa'},
 flare:{label:'Flare · tangerine / hot pink / blue',family:4,start:'#ff864b',mid:'#ed49b3',end:'#4974f7',ink:'#f0c4ed'},
 cobalt:{label:'Cobalt · blue / periwinkle / gold',family:8,start:'#356bea',mid:'#9c9bf5',end:'#efc975',ink:'#d3d5ff'},
 rosewater:{label:'Rosewater · rose / blush / peach',family:1,start:'#c95f99',mid:'#edb0d0',end:'#ffd0af',ink:'#f6d3e5'},
 jade:{label:'Jade · emerald / mint / lime',family:0,start:'#249b86',mid:'#75d8ad',end:'#c3ed72',ink:'#b9e8d2'},
 ruby:{label:'Ruby · crimson / magenta / lilac',family:1,start:'#e04b6d',mid:'#cd52bc',end:'#b79aef',ink:'#f3c6e7'},
 marine:{label:'Marine · navy / azure / aqua',family:0,start:'#34549b',mid:'#338fc9',end:'#6ce0d9',ink:'#b9d9f7'},
 apricot:{label:'Apricot · amber / rose / blue',family:6,start:'#efb566',mid:'#e58eac',end:'#83b0ec',ink:'#f0d8cf'},
} as const
export type LumaPreviewOptions={palette:keyof typeof lumaPaletteOptions;font:'Manrope'|'DM Sans'|'Space Grotesk';primary:'gradient'|'solid';mode:'light'|'dark'}
export const defaultLumaPreview:LumaPreviewOptions={palette:'ion',font:'Manrope',primary:'gradient',mode:'dark'}
export function parseLumaPreview(raw:string|null):LumaPreviewOptions {
 try{const v=JSON.parse(raw??'{}');return {palette:Object.hasOwn(lumaPaletteOptions,v.palette)?v.palette:'ion',font:['Manrope','DM Sans','Space Grotesk'].includes(v.font)?v.font:'Manrope',primary:v.primary==='solid'?'solid':'gradient',mode:v.mode==='light'?'light':'dark'}}catch{return defaultLumaPreview}
}
export function lumaPreviewVariables(options:LumaPreviewOptions) {
 const p=lumaPaletteOptions[options.palette]
 return {...(options.mode==='light'?{'--color-bg':'#edf2fc','--color-surface':'#f5f8ff','--color-elevated':'#e8eef9','--color-fg':'#142641','--color-fg-muted':'#304760','--color-fg-subtle':'#405773','--color-border':'#9aacc7'}:{}),'--font-sans':`"${options.font}", sans-serif`,'--font-mono':`"${options.font}", sans-serif`,'--color-hud':options.mode==='light'?'#3047ad':'#d2dcff','--color-cell-hover':options.mode==='light'?'#3047ad':'#f7f9ff','--glass-accent-start':p.start,'--glass-accent-mid':p.mid,'--glass-accent-end':p.end,'--primary-start':options.primary==='gradient'?p.start:p.ink,'--primary-mid':options.primary==='gradient'?p.mid:p.ink,'--primary-end':options.primary==='gradient'?p.end:p.ink,'--primary-paint':options.primary==='gradient'?`linear-gradient(110deg,${p.start},${p.mid},${p.end})`:p.ink}
}
