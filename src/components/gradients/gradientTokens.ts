/** Palette families for the shared 3D renderer; CSS paint is only the non-WebGL fallback. */
export const gradientRecipes = {
 ion:{label:'Ion · neon collision',family:9,colors:['#18e4ff','#6950ff','#ff50da'],paint:'linear-gradient(120deg,#18e4ff,#6950ff,#ff50da)'},
 voltage:{label:'Voltage · electric spectrum',family:11,colors:['#2878ff','#22deef','#d8ff64'],paint:'linear-gradient(120deg,#2878ff,#22deef,#d8ff64)'},
 opal:{label:'Opal · iridescent pastels',family:10,colors:['#6be8dc','#a68bff','#ff96b5'],paint:'linear-gradient(120deg,#6be8dc,#a68bff,#ff96b5)'},

 azure:{label:'Azure',family:0,colors:['#06152e','#1249eb','#35dcf5'],paint:'linear-gradient(135deg,#1026b8,#35dcf5)'},
 iris:{label:'Iris',family:1,colors:['#2a059f','#8438ea','#ed4fee'],paint:'linear-gradient(135deg,#2a059f,#ed4fee)'},
 solar:{label:'Prism',family:2,colors:['#155de0','#f76d58','#d768ed'],paint:'linear-gradient(135deg,#155de0,#f76d58,#d768ed)'},
 triad:{label:'Turquoise / blue / magenta',family:3,colors:['#05d9c7','#102ef2','#f20aa6'],paint:'linear-gradient(135deg,#05d9c7,#102ef2,#f20aa6)'},
 ember:{label:'Coral / cobalt',family:4,colors:['#081fda','#ad53c5','#ff4026'],paint:'linear-gradient(135deg,#081fda,#ff4026)'},
 pollen:{label:'Violet / lime',family:5,colors:['#4d05cc','#887a83','#a6eb14'],paint:'linear-gradient(135deg,#4d05cc,#a6eb14)'},
 dusk:{label:'Indigo / peach',family:6,colors:['#1f0da6','#bd79c3','#ff8c59'],paint:'linear-gradient(135deg,#1f0da6,#ff8c59)'},
 silver:{label:'Ice / silver',family:7,colors:['#058cbf','#67aacd','#bfd6f2'],paint:'linear-gradient(135deg,#058cbf,#bfd6f2)'},
} as const
export type GradientRecipe = keyof typeof gradientRecipes
