import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

// Resolve real imports rather than inferring use from similarly named markup.
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`])
const files=walk('src').filter(f=>/\.tsx?$/.test(f)&&!f.startsWith('src/generated/'))
const resolve=(from,spec)=>{const base=path.posix.normalize(path.posix.join(path.posix.dirname(from),spec));return [base,`${base}.tsx`,`${base}.ts`,`${base}/index.tsx`,`${base}/index.ts`].find(f=>files.includes(f))}
const modules=files.map(file=>{
 const ast=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true)
 const imports=[];const exports=[]
 ast.forEachChild(node=>{
  if(ts.isImportDeclaration(node)&&ts.isStringLiteral(node.moduleSpecifier)&&node.moduleSpecifier.text.startsWith('.')){
   const source=resolve(file,node.moduleSpecifier.text)
   if(source){const bindings=node.importClause?.namedBindings;const symbols=bindings&&ts.isNamedImports(bindings)?bindings.elements.map(e=>(e.propertyName??e.name).text):[];imports.push({source,symbols})}
  }
  if(ts.isExportDeclaration(node)&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier)&&node.moduleSpecifier.text.startsWith('.')){const source=resolve(file,node.moduleSpecifier.text);if(source)imports.push({source,symbols:node.exportClause&&ts.isNamedExports(node.exportClause)?node.exportClause.elements.map(e=>(e.propertyName??e.name).text):[]})}
  if(ts.isVariableStatement(node)&&node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword))for(const declaration of node.declarationList.declarations)if(ts.isIdentifier(declaration.name)&&/^[A-Z]/.test(declaration.name.text)&&declaration.initializer&&(ts.isArrowFunction(declaration.initializer)||ts.isFunctionExpression(declaration.initializer)||(ts.isCallExpression(declaration.initializer)&&/^(memo|forwardRef|React\.memo|React\.forwardRef)$/.test(declaration.initializer.expression.getText(ast)))))exports.push(declaration.name.text)
  if(ts.isFunctionDeclaration(node)&&node.name&&/^[A-Z]/.test(node.name.text)&&node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword))exports.push(node.name.text)
 })
 return {file,imports,exports}
})
const editor=file=>file.startsWith('src/design-system/')||file==='src/pages/DesignSystemPage.tsx'
const catalog=fs.readFileSync('src/design-system/visualCatalog.ts','utf8')
const stories=[...catalog.matchAll(/story\('([^']+)'\s*,\s*'([^']+)'[^\n]*?'(src\/[^']+)'/g)].map(m=>({id:m[1],name:m[2],source:m[3]}))
const primarySymbols={'buttons':'PortfolioButton','icon-buttons':'PresentationIconButton','text-fields':'PortfolioTextField','select':'PortfolioSelect','choices':'PortfolioChoice','password':'LeaderboardGate','accordion':'PortfolioAccordion'}
const records=stories.map(story=>{
 if(!fs.existsSync(story.source))throw new Error(`Missing source: ${story.source}`)
 const consumers=modules.filter(m=>!editor(m.file)&&m.imports.some(i=>i.source===story.source&&(!primarySymbols[story.id]||i.symbols.includes(primarySymbols[story.id])))).map(m=>m.file)
 if(!consumers.length)throw new Error(`Catalog entry ${story.id} has no production consumer. Share its implementation before adding it to the catalog.`)
 const symbols=modules.find(m=>m.file===story.source)?.exports??[]
 return {...story,symbols,consumers}
})
const components=modules.filter(m=>!editor(m.file)).flatMap(m=>m.exports.map(symbol=>({source:m.file,symbol,consumers:modules.filter(c=>!editor(c.file)&&c.imports.some(i=>i.source===m.file&&i.symbols.includes(symbol))).map(c=>c.file),stories:records.filter(s=>s.source===m.file).map(s=>s.id)})))
const output={scope:'Static source linkage audit. Imports establish shared implementation, not visual equivalence of every prop, state or wrapper. Components without a dedicated story remain accessible through live page previews.',stories:records,components}
fs.writeFileSync('src/generated/componentFidelity.json',JSON.stringify(output,null,2)+'\n')
const report=['# Component fidelity audit','',output.scope,'','## Catalog entries','','| Entry | Implementation | Production consumers |','| --- | --- | --- |',...records.map(s=>`| ${s.name} | \`${s.source}\` | ${s.consumers.length?s.consumers.map(f=>`\`${f}\``).join(', '):'Editor only; not a public-site component'} |`),'','## All exported application components','','| Component | Source | Named production importers | Dedicated entries |','| --- | --- | --- | --- |',...components.map(c=>`| ${c.symbol} | \`${c.source}\` | ${c.consumers.length} | ${c.stories.join(', ')||'Live pages only'} |`),'','This inventory intentionally reports gaps. A direct source import does not prove that documentation-only samples match every real composition. Proposed controls and pinned-state illustrations are labeled in the catalog.','']
fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/component-fidelity-audit.md',report.join('\n'))
console.log(`Audited ${records.length} catalog entries and ${components.length} exported application components.`)
