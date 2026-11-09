declare module 'liquid-gl' {
 export interface LiquidLens { destroy():void }
 interface LiquidGL {
  (options:Record<string,unknown>):LiquidLens|LiquidLens[]|null
  registerDynamic(selector:string):void
 }
 const liquidGL:LiquidGL
 export default liquidGL
}
