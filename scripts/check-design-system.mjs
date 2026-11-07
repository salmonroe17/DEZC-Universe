import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'

async function loadTs(file) {
  const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 } })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}
const { portfolioTheme, themePalettes, fixedColors, themeGlyphColors } = await loadTs('src/design-system/theme.ts')
const { contrastRatio } = await loadTs('src/design-system/contrast.ts')
assert.equal(contrastRatio('#ffffff', '#000000'), 21)
assert.equal(contrastRatio('#ffffff', '#ffffff'), 1)
assert.ok(themePalettes[portfolioTheme.activeTheme], 'Published theme must exist')
const roles = Object.keys(themePalettes.grey).sort()
let pairs = 0
for (const [name, palette] of Object.entries(themePalettes)) {
  assert.deepEqual(Object.keys(palette).sort(), roles, `${name}: every theme must define the same semantic roles`)
  for (const foreground of ['fg', 'fg-muted', 'fg-subtle', 'hud']) for (const background of ['bg', 'surface', 'elevated']) {
    const ratio = contrastRatio(palette[foreground], palette[background])
    assert.ok(ratio >= 4.5, `${name}: ${foreground} on ${background} is only ${ratio.toFixed(2)}:1`)
    pairs++
  }
  for (const color of themeGlyphColors[name]) assert.ok(contrastRatio(color, palette.bg) >= 3, `${name}: animated 404 glyph must remain legible`)
}
assert.ok(contrastRatio(fixedColors['on-media-paper'], fixedColors['media-paper']) >= 4.5)
assert.ok(contrastRatio(fixedColors['on-scrim'], fixedColors.scrim) >= 4.5)
const inventory = JSON.parse(fs.readFileSync('src/generated/designSystemInventory.json', 'utf8'))
assert.equal(inventory.routes.length, 10, 'All existing route patterns must be covered')
for (const route of inventory.routes) {
  assert.ok(route.files.includes(route.file), route.path)
  assert.ok(route.sharedFiles.includes('src/layouts/RootLayout.tsx'), route.path)
}
for (const album of ['Bobaghosteas', 'Neon drawings', 'Japan photos', 'Concert Photos', 'A Marriage Proposal', 'EEDENN', 'D.AI.SY']) {
  assert.ok(inventory.assets.some((a) => a.file.includes(`Side quest albums/${album}/`) && a.usedBy.includes('src/data/sidequests.ts')), `Album missing from import.meta.glob references: ${album}`)
}
const distFiles = fs.existsSync('dist/assets') ? fs.readdirSync('dist/assets').filter((p) => p.endsWith('.js')) : []
for (const file of distFiles) {
  const source = fs.readFileSync(`dist/assets/${file}`, 'utf8')
  assert.ok(!source.includes('ds-workbench') && !source.includes('schemaVersion') && !source.includes('design-system-editor-v1'), `Local editor leaked into production: ${file}`)
}
console.log(`Design system checks passed: ${pairs} theme contrast pairs, 2 fixed surface pairs, ${inventory.routes.length} routes, 7 albums; editor excluded from ${distFiles.length} production JS bundles.`)
