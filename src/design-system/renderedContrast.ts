export type ContrastFinding = { text: string; selector: string; ratio: number; required: number; foreground: string; background: string; review: boolean }
export type RouteContrastResult = { path: string; checked: number; findings: ContrastFinding[]; error?: string }

/** Visible DOM text only. Artwork, canvas glyphs, video and gradients require visual review. */
export function auditRenderedContrast(doc: Document): Omit<RouteContrastResult, 'path'> {
  const view = doc.defaultView
  if (!view) return { checked: 0, findings: [], error: 'Preview document unavailable' }
  const canvas = doc.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  function rgba(color: string): number[] {
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)
    return [...ctx.getImageData(0, 0, 1, 1).data].map((c, i) => i === 3 ? c / 255 : c)
  }
  function over(top: number[], bottom: number[]) {
    const a = top[3]! + bottom[3]! * (1 - top[3]!)
    return [0, 1, 2].map((i) => a ? (top[i]! * top[3]! + bottom[i]! * bottom[3]! * (1 - top[3]!)) / a : 0).concat(a)
  }
  function luminance(c: number[]) {
    const linear = c.slice(0, 3).map((v) => { const n = v / 255; return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4 })
    return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722
  }
  const findings: ContrastFinding[] = []
  let checked = 0
  const seen = new Set<string>()
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  let textNode: Node | null
  while ((textNode = walker.nextNode())) {
    const element = textNode.parentElement
    const text = textNode.textContent?.replace(/\s+/g, ' ').trim()
    if (!element || !text || element.closest('script,style,[aria-hidden="true"],[inert],button:disabled,[aria-disabled="true"]')) continue
    const style = view.getComputedStyle(element)
    if (style.visibility === 'hidden' || style.display === 'none' || !element.getClientRects().length) continue
    const chain: HTMLElement[] = []
    let current: HTMLElement | null = element
    let opacity = 1
    let review = false
    while (current) {
      chain.unshift(current)
      const s = view.getComputedStyle(current)
      opacity *= Number(s.opacity)
      if (s.backgroundImage !== 'none' || s.mixBlendMode !== 'normal' || s.filter !== 'none') review = true
      current = current.parentElement
    }
    if (opacity < 0.01) continue
    let background = [255, 255, 255, 1]
    for (const ancestor of chain) background = over(rgba(view.getComputedStyle(ancestor).backgroundColor), background)
    const foreground = rgba(style.color)
    foreground[3] = foreground[3]! * opacity
    const painted = over(foreground, background)
    const a = luminance(painted)
    const b = luminance(background)
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    const size = parseFloat(style.fontSize)
    const required = size >= 24 || (size >= 18.66 && parseInt(style.fontWeight) >= 700) ? 3 : 4.5
    const selector = `${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}.${[...element.classList].slice(0, 3).join('.')}`
    const key = `${text}:${style.color}:${background.join(',')}:${opacity}`
    if (seen.has(key)) continue
    seen.add(key)
    checked++
    if (ratio < required || review) findings.push({ text: text.slice(0, 160), selector, ratio: Math.round(ratio * 100) / 100, required, foreground: style.color, background: `rgb(${background.slice(0, 3).map(Math.round).join(', ')})`, review })
  }
  return { checked, findings }
}
