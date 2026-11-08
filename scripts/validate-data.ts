// Validates src/data/cells.json (or a path given as the first argument)
// against the shape in src/data/schema.ts plus cross-reference rules.
// Usage: npm run validate:data [-- path/to/file.json]
// Exit code 0 = valid (warnings allowed), 1 = errors.

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  CELL_SHAPES,
  CELL_TYPE_IDS,
  ORGANELLE_IDS,
  PLAIN_SUMMARY_MAX_WORDS,
  PROTEIN_PRIMITIVES,
  WHAT_HAPPENS_IF_BROKEN_MAX_WORDS,
} from '../src/data/schema.ts'

type Obj = Record<string, unknown>

const errors: string[] = []
const warnings: string[] = []
const err = (path: string, msg: string) => errors.push(`${path}: ${msg}`)
const warn = (path: string, msg: string) => warnings.push(`${path}: ${msg}`)

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

function str(o: Obj, key: string, path: string, maxWords?: number): string | undefined {
  const v = o[key]
  if (typeof v !== 'string' || v.trim() === '') {
    err(`${path}.${key}`, 'must be a non-empty string')
    return undefined
  }
  if (/TODO/i.test(v)) warn(`${path}.${key}`, `contains a TODO: "${v}"`)
  if (maxWords !== undefined && wordCount(v) > maxWords) {
    err(`${path}.${key}`, `has ${wordCount(v)} words (max ${maxWords})`)
  }
  return v
}

function oneOf<T extends string>(o: Obj, key: string, allowed: readonly T[], path: string): T | undefined {
  const v = o[key]
  if (typeof v !== 'string' || !allowed.includes(v as T)) {
    err(`${path}.${key}`, `must be one of ${allowed.join(' | ')} (got ${JSON.stringify(v)})`)
    return undefined
  }
  return v as T
}

function arr(o: Obj, key: string, path: string): unknown[] {
  const v = o[key]
  if (!Array.isArray(v)) {
    err(`${path}.${key}`, 'must be an array')
    return []
  }
  return v
}

function checkSources(o: Obj, path: string) {
  const sources = arr(o, 'sources', path)
  if (sources.length === 0) err(`${path}.sources`, 'needs at least one source URL')
  sources.forEach((s, j) => {
    if (typeof s !== 'string' || !/^https?:\/\/\S+$/.test(s)) err(`${path}.sources[${j}]`, `not a valid URL: ${JSON.stringify(s)}`)
  })
}

function checkUnique(items: Obj[], section: string) {
  const seen = new Set<string>()
  items.forEach((item, i) => {
    const id = item.id
    if (typeof id !== 'string') return
    if (seen.has(id)) err(`${section}[${i}].id`, `duplicate id "${id}"`)
    seen.add(id)
  })
}

// ---------- load ----------
const file = resolve(process.argv[2] ?? 'src/data/cells.json')
let data: unknown
try {
  data = JSON.parse(readFileSync(file, 'utf8'))
} catch (e) {
  console.error(`✗ Could not read/parse ${file}: ${(e as Error).message}`)
  process.exit(1)
}
if (!isObj(data)) {
  console.error('✗ Top level must be an object')
  process.exit(1)
}

// ---------- meta ----------
if (!isObj(data.meta)) err('meta', 'must be an object')
else {
  if (typeof data.meta.version !== 'number') err('meta.version', 'must be a number')
  str(data.meta, 'expressionNote', 'meta')
}

const organelles = arr(data, 'organelles', '$').filter((v, i) => isObj(v) || (err(`organelles[${i}]`, 'must be an object'), false)) as Obj[]
const cellTypes = arr(data, 'cellTypes', '$').filter((v, i) => isObj(v) || (err(`cellTypes[${i}]`, 'must be an object'), false)) as Obj[]
const genes = arr(data, 'genes', '$').filter((v, i) => isObj(v) || (err(`genes[${i}]`, 'must be an object'), false)) as Obj[]
const proteins = arr(data, 'proteins', '$').filter((v, i) => isObj(v) || (err(`proteins[${i}]`, 'must be an object'), false)) as Obj[]

;[
  [organelles, 'organelles'],
  [cellTypes, 'cellTypes'],
  [genes, 'genes'],
  [proteins, 'proteins'],
].forEach(([items, name]) => checkUnique(items as Obj[], name as string))

const definedOrganelles = new Set(organelles.map((o) => o.id))
const geneById = new Map(genes.map((g) => [g.id, g]))
const proteinById = new Map(proteins.map((p) => [p.id, p]))

// ---------- organelles ----------
organelles.forEach((o, i) => {
  const p = `organelles[${i}]`
  oneOf(o, 'id', ORGANELLE_IDS, p)
  str(o, 'name', p)
  str(o, 'blurb', p)
  checkSources(o, p)
})

// ---------- cellTypes ----------
cellTypes.forEach((c, i) => {
  const p = `cellTypes[${i}]`
  oneOf(c, 'id', CELL_TYPE_IDS, p)
  str(c, 'name', p)
  str(c, 'blurb', p)
  oneOf(c, 'shape', CELL_SHAPES, p)
  arr(c, 'organelles', p).forEach((id, j) => {
    if (!ORGANELLE_IDS.includes(id as never)) err(`${p}.organelles[${j}]`, `unknown organelle "${id}"`)
    else if (!definedOrganelles.has(id)) err(`${p}.organelles[${j}]`, `organelle "${id}" is not defined in organelles[]`)
  })
  if (!isObj(c.organelleScale)) err(`${p}.organelleScale`, 'must be an object (use {} for none)')
  else {
    for (const [k, v] of Object.entries(c.organelleScale)) {
      if (!ORGANELLE_IDS.includes(k as never)) err(`${p}.organelleScale.${k}`, 'unknown organelle')
      if (typeof v !== 'number' || !(v > 0)) err(`${p}.organelleScale.${k}`, 'must be a positive number')
    }
  }
  arr(c, 'signatureGenes', p).forEach((g, j) => {
    if (!geneById.has(g)) err(`${p}.signatureGenes[${j}]`, `gene "${g}" not found in genes[]`)
  })
  checkSources(c, p)
})

// ---------- genes ----------
genes.forEach((g, i) => {
  const p = `genes[${i}]`
  str(g, 'id', p)
  const symbol = str(g, 'symbol', p)
  if (symbol && g.id !== symbol) warn(p, `id "${g.id}" differs from symbol "${symbol}"`)
  str(g, 'fullName', p)
  str(g, 'plainSummary', p, PLAIN_SUMMARY_MAX_WORDS)
  const proteinId = str(g, 'proteinId', p)
  if (proteinId) {
    const prot = proteinById.get(proteinId)
    if (!prot) err(`${p}.proteinId`, `protein "${proteinId}" not found in proteins[]`)
    else if (prot.geneId !== g.id) err(`${p}.proteinId`, `protein "${proteinId}" points back to gene "${prot.geneId}", not "${g.id}"`)
  }
  if (!isObj(g.expression)) err(`${p}.expression`, 'must be an object')
  else {
    for (const ct of CELL_TYPE_IDS) {
      const v = g.expression[ct]
      if (typeof v !== 'number' || v < 0 || v > 100) err(`${p}.expression.${ct}`, `must be a number 0-100 (got ${JSON.stringify(v)})`)
    }
    for (const k of Object.keys(g.expression)) {
      if (!CELL_TYPE_IDS.includes(k as never)) err(`${p}.expression.${k}`, 'unknown cell type')
    }
  }
  checkSources(g, p)
})

// ---------- proteins ----------
proteins.forEach((pr, i) => {
  const p = `proteins[${i}]`
  str(pr, 'id', p)
  str(pr, 'name', p)
  const geneId = str(pr, 'geneId', p)
  if (geneId) {
    const gene = geneById.get(geneId)
    if (!gene) err(`${p}.geneId`, `gene "${geneId}" not found in genes[]`)
    else if (gene.proteinId !== pr.id) err(`${p}.geneId`, `gene "${geneId}" points to protein "${gene.proteinId}", not "${pr.id}" (one gene → one protein)`)
  }
  const loc = oneOf(pr, 'location', ORGANELLE_IDS, p)
  if (loc && !definedOrganelles.has(loc)) err(`${p}.location`, `organelle "${loc}" is not defined in organelles[]`)
  str(pr, 'job', p)
  str(pr, 'whatHappensIfBroken', p, WHAT_HAPPENS_IF_BROKEN_MAX_WORDS)
  if (!isObj(pr.visual)) err(`${p}.visual`, 'must be an object')
  else {
    oneOf(pr.visual, 'primitive', PROTEIN_PRIMITIVES, `${p}.visual`)
    if (typeof pr.visual.color !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(pr.visual.color)) err(`${p}.visual.color`, 'must be a #rrggbb hex color')
    const n = pr.visual.count
    if (typeof n !== 'number' || !Number.isInteger(n) || n < 1) err(`${p}.visual.count`, 'must be a positive integer')
  }
})

// ---------- report ----------
const summary = `${organelles.length} organelles, ${cellTypes.length} cell types, ${genes.length} genes, ${proteins.length} proteins`
for (const w of warnings) console.warn(`⚠ ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`)
  console.error(`\n✗ ${file} is INVALID — ${errors.length} error(s), ${warnings.length} warning(s). (${summary})`)
  process.exit(1)
}
console.log(`✓ ${file} is valid — ${summary}, ${warnings.length} warning(s).`)
