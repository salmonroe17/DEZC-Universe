import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import sharp from 'sharp'

const root = process.cwd()
const slash = (p) => p.split(path.sep).join('/')
function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [slash(path.join(dir, e.name))])
}
const sourcePaths = walk('src').filter((p) => /\.(tsx?|css)$/.test(p) && !p.startsWith('src/generated/') && !p.startsWith('src/design-system/') && !p.endsWith('DesignSystemPage.tsx'))
const texts = new Map(sourcePaths.map((p) => [p, fs.readFileSync(p, 'utf8')]))
function resolve(from, spec) {
  if (!spec.startsWith('.')) return null
  const base = slash(path.normalize(path.join(path.dirname(from), spec)))
  return [base, `${base}.tsx`, `${base}.ts`, `${base}/index.ts`, `${base}/index.tsx`].find((p) => texts.has(p)) ?? null
}
const modules = sourcePaths.map((file) => {
  const source = texts.get(file)
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  const line = (node) => ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1
  const imports = new Set()
  const components = []
  const instances = []
  const sections = []
  const controls = []
  const cards = []
  const collections = []
  const classes = new Set()
  const literals = []
  const globs = []
  function attr(node, name) {
    const a = node.attributes?.properties.find((p) => ts.isJsxAttribute(p) && p.name.getText(ast) === name)
    if (!a?.initializer) return null
    return ts.isStringLiteral(a.initializer) ? a.initializer.text : a.initializer.getText(ast).slice(0, 240)
  }
  function visit(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const target = resolve(file, node.moduleSpecifier.text)
      if (target) imports.add(target)
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      const target = resolve(file, node.arguments[0].text)
      if (target) imports.add(target)
    }
    if (ts.isCallExpression(node) && node.expression.getText(ast) === 'import.meta.glob' && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) globs.push(node.arguments[0].text)
    if (ts.isFunctionDeclaration(node) && node.name && /^[A-Z]/.test(node.name.text)) components.push({ name: node.name.text, line: line(node), signature: node.parameters.map((p) => p.getText(ast)).join(', ').slice(0, 800) })
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && /^[A-Z][a-z]/.test(node.name.text) && node.initializer && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) components.push({ name: node.name.text, line: line(node), signature: node.initializer.parameters.map((p) => p.getText(ast)).join(', ').slice(0, 800) })
    if (ts.isVariableDeclaration(node) && node.initializer && (ts.isArrayLiteralExpression(node.initializer) || ts.isObjectLiteralExpression(node.initializer))) {
      const value = node.initializer.getText(ast)
      if (value.length > 20 && /[A-Za-z]{3}/.test(value)) collections.push({ name: node.name.getText(ast), line: line(node), content: value.slice(0, 24000), truncated: value.length > 24000 })
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      literals.push(node.text)
      // Includes classes shared in constants and conditional template branches.
      node.text.split(/\s+/).filter((c) => /^(?:(?:[\w/-]+|\[[^\]]+\]):)*(?:text|bg|border|ring|fill|stroke|shadow|rounded|p[xytrbl]?|m[xytrbl]?|gap(?:-[xy])?|grid|font|leading|tracking|duration|ease|opacity|w|h|min-w|max-w|min-h|max-h)-/.test(c)).forEach((c) => classes.add(c))
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(ast)
      const className = attr(node, 'className') ?? attr(node, 'innerClassName')
      const props = node.attributes.properties.filter(ts.isJsxAttribute).map((p) => ({ name: p.name.getText(ast), value: p.initializer ? (ts.isStringLiteral(p.initializer) ? p.initializer.text : p.initializer.getText(ast)).slice(0, 240) : 'true' }))
      if (/Frame$|Card$|Panel$|Section$/.test(tag) || tag === 'article' || (className && /quadrant-cell|rounded.*border|border.*rounded/.test(className))) {
        const content = ts.isJsxOpeningElement(node) ? node.parent.getText(ast) : node.getText(ast)
        cards.push({ name: tag, line: line(node), props, content: content.slice(0, 12000), truncated: content.length > 12000 })
      }
      if (/^[A-Z]/.test(tag)) instances.push({ name: tag, line: line(node), props })
      if (['section', 'article', 'h1', 'h2', 'h3', 'h4', 'main'].includes(tag) || attr(node, 'id')) {
        const parent = ts.isJsxOpeningElement(node) ? node.parent : null
        const text = parent && ts.isJsxElement(parent) ? parent.children.filter(ts.isJsxText).map((n) => n.text).join(' ').replace(/\s+/g, ' ').trim() : ''
        sections.push({ tag, line: line(node), id: attr(node, 'id'), text, className })
      }
      if (['button', 'input', 'select', 'textarea', 'a', 'Link', 'NavLink', 'dialog', 'canvas', 'svg', 'img', 'video', 'iframe'].includes(tag)) controls.push({ tag, line: line(node), label: attr(node, 'aria-label') ?? attr(node, 'alt') ?? attr(node, 'title'), className, props })
    }
    ts.forEachChild(node, visit)
  }
  if (!file.endsWith('.css')) visit(ast)
  const tokenRefs = [...new Set([...source.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]))].sort()
  const colors = [...source.matchAll(/#[\da-fA-F]{3,8}\b|rgba?\([^\n;)]+\)/g)].map((m) => ({ value: m[0], line: source.slice(0, m.index).split('\n').length }))
  const tokens = [...source.matchAll(/(--[\w-]+)\s*:\s*([^;\n]+);/g)].map((m) => ({ name: m[1], value: m[2].trim(), line: source.slice(0, m.index).split('\n').length }))
  const animations = [...new Set([...source.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]))]
  return { file, imports: [...imports].sort(), components, instances, sections, controls, cards, collections, classes: [...classes].sort(), tokenRefs, colors, tokens, animations, globs, literals }
})
const moduleByPath = new Map(modules.map((m) => [m.file, m]))
function dependencies(file, seen = new Set()) {
  if (seen.has(file) || !moduleByPath.has(file)) return seen
  seen.add(file)
  for (const child of moduleByPath.get(file).imports) dependencies(child, seen)
  return seen
}
// Read route definitions from App rather than maintaining a second route catalog.
const app = ts.createSourceFile('src/App.tsx', texts.get('src/App.tsx'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const lazyPages = new Map()
function findLazy(node) {
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
    const match = node.initializer.getText(app).match(/import\(['"]([^'"]+)['"]\)/)
    if (match) lazyPages.set(node.name.text, resolve('src/App.tsx', match[1]))
  }
  ts.forEachChild(node, findLazy)
}
findLazy(app)
const routes = []
function findRoutes(node) {
  if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(app) === 'Route') {
    const attributes = node.attributes.properties.filter(ts.isJsxAttribute)
    const routePath = attributes.find((a) => a.name.getText(app) === 'path')?.initializer
    const index = attributes.some((a) => a.name.getText(app) === 'index')
    const element = attributes.find((a) => a.name.getText(app) === 'element')?.initializer?.getText(app)
    const component = element?.match(/<([A-Za-z]+)/)?.[1]
    const file = lazyPages.get(component)
    if (file) {
      const url = index ? '/' : ts.isStringLiteral(routePath ?? node) ? `/${routePath.text}`.replace(/\/+/g, '/') : null
      if (url && url !== '/design-system') {
        const ownFiles = [...dependencies(file)].sort()
        const sharedFiles = [...dependencies('src/layouts/RootLayout.tsx')].sort()
        routes.push({ path: url, component, file, files: ownFiles, sharedFiles, sections: ownFiles.flatMap((p) => moduleByPath.get(p).sections.map((s) => ({ ...s, file: p }))) })
      }
    }
  }
  ts.forEachChild(node, findRoutes)
}
findRoutes(app)

const mediaExt = /\.(png|jpe?g|gif|webp|avif|svg|mp4|webm|mov|woff2?|ttf|otf|mp3|wav)$/i
const assetRoots = ['src/assets', 'public', 'CNC photos', 'DS case study assets', 'Dot art circles', 'IBM case study assets', 'Metadata', 'Side quest albums', 'Super assets']
function globRegex(pattern) {
  return new RegExp('^' + pattern.replace(/[.+^$()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\0').replace(/\*/g, '[^/]*').replace(/\0/g, '.*').replace(/\{([^}]+)\}/g, (_, list) => `(${list.split(',').join('|')})`) + '$', 'i')
}
const assets = await Promise.all(assetRoots.flatMap(walk).filter((p) => mediaExt.test(p)).map(async (file) => {
  const publicPath = file.startsWith('public/') ? '/' + file.slice(7) : null
  const usedBy = modules.filter((m) => m.literals.some((literal) => {
    const normalized = slash(path.normalize(path.join(path.dirname(m.file), literal.split('?')[0])))
    return normalized === file || (publicPath && literal.split('?')[0] === publicPath)
  }) || m.globs.some((g) => globRegex(slash(path.normalize(path.join(path.dirname(m.file), g)))).test(file))).map((m) => m.file)
  const ext = path.extname(file).toLowerCase()
  const kind = /\.(mp4|webm|mov)$/.test(ext) ? 'Video' : /\.(woff2?|ttf|otf)$/.test(ext) ? 'Font' : /\.(mp3|wav)$/.test(ext) ? 'Audio' : /(?:photos|Japan|Concert|Proposal)/i.test(file) ? 'Photo' : /(?:dot-art|Dot art|Neon|Bobaghost|EEDENN|D.AI.SY)/i.test(file) ? 'Illustration' : 'Image / artwork'
  let width = null
  let height = null
  if (!['Video', 'Font', 'Audio'].includes(kind)) {
    try { const meta = await sharp(file).metadata(); width = meta.width ?? null; height = meta.height ?? null } catch { /* Unsupported media stays listed. */ }
  }
  return { file, url: publicPath ?? '/' + file.split('/').map(encodeURIComponent).join('/'), kind, width, height, bytes: fs.statSync(file).size, usedBy, routes: routes.filter((r) => [...r.files, ...r.sharedFiles].some((f) => usedBy.includes(f))).map((r) => r.path), usage: usedBy.length ? 'Referenced' : file.includes('case-study-media/') ? 'Generated media derivative' : 'No static reference found' }
}))
const externalMedia = new Map()
for (const m of modules) for (const literal of m.literals) {
  if (/^https?:\/\//.test(literal) && /\.(gif|png|jpe?g|svg|webp|mp4|webm)(?:\?|$)/i.test(literal)) {
    const files = externalMedia.get(literal) ?? []
    files.push(m.file)
    externalMedia.set(literal, [...new Set(files)])
  }
}
for (const [url, usedBy] of externalMedia) assets.push({ file: url, url, kind: /\.(mp4|webm)/i.test(url) ? 'Video' : 'External image', width: null, height: null, bytes: 0, usedBy, routes: routes.filter((r) => [...r.files, ...r.sharedFiles].some((f) => usedBy.includes(f))).map((r) => r.path), usage: 'External reference · original colors' })
const fontUrl = fs.readFileSync('index.html', 'utf8').match(/https:\/\/fonts.googleapis.com\/css2[^"\s]+/)?.[0]
if (fontUrl) assets.push({ file: 'Space Mono · Google Fonts stylesheet', url: fontUrl, kind: 'Font', width: null, height: null, bytes: 0, usedBy: ['index.html'], routes: routes.map((r) => r.path), usage: 'External font · 400 / 700 / italic' })
for (const m of modules) delete m.literals
const inventory = {
  schemaVersion: 1, generatedAt: new Date().toISOString(),
  scope: 'All application TS/TSX/CSS modules, declared routes, JSX component instances, DOM controls, section anchors, token declarations/references, utility classes, animation names, and media files. Static references include import.meta.glob. Runtime-generated paths and conditional states still require visual review.',
  routes, modules, assets,
  stats: { routes: routes.length, modules: modules.length, components: modules.reduce((n, m) => n + m.components.length, 0), instances: modules.reduce((n, m) => n + m.instances.length, 0), assets: assets.length, controls: modules.reduce((n, m) => n + m.controls.length, 0) },
}
fs.mkdirSync(path.join(root, 'src/generated'), { recursive: true })
fs.writeFileSync(path.join(root, 'src/generated/designSystemInventory.json'), JSON.stringify(inventory))
console.log('[design-system] ' + JSON.stringify(inventory.stats))
