// Typed access to src/data/cells.json plus small lookup helpers.
// Components import from here, never from the JSON directly.
import raw from './cells.json'
import {
  CELL_TYPE_IDS,
  type CellData,
  type CellPart,
  type CellShape,
  type CellType,
  type CellTypeId,
  type Gene,
  type GlossaryEntry,
  type Organelle,
  type OrganelleId,
  type Protein,
} from './schema'

// The JSON is checked against the schema by `npm run validate:data`.
export const data = raw as unknown as CellData

const byId = <T extends { id: string }>(items: T[]) => new Map(items.map((x) => [x.id, x]))

const cellMap = byId(data.cellTypes)
const geneMap = byId(data.genes)
const proteinMap = byId(data.proteins)
const organelleMap = byId(data.organelles)
const glossaryMap = byId(data.glossary)

/** Cell types in the canonical order (matches CELL_TYPE_IDS). */
export const cellTypes: CellType[] = CELL_TYPE_IDS.map((id) => cellMap.get(id)).filter(
  (c): c is CellType => c !== undefined,
)

export const getCell = (id: CellTypeId) => cellMap.get(id)
export const getGene = (id: string) => geneMap.get(id)
export const getOrganelle = (id: OrganelleId): Organelle | undefined => organelleMap.get(id)
export const getGloss = (id: string): GlossaryEntry | undefined => glossaryMap.get(id)

export function proteinFor(gene: Gene): Protein | undefined {
  return proteinMap.get(gene.proteinId)
}

/** Cell types where this gene has its maximum score (ties all returned). Empty if all 0. */
export function highestCells(gene: Gene): CellTypeId[] {
  const max = Math.max(...CELL_TYPE_IDS.map((id) => gene.expression[id]))
  if (max <= 0) return []
  return CELL_TYPE_IDS.filter((id) => gene.expression[id] === max)
}

/** Genes sorted by score in one cell type, highest first; zero scores dropped. */
export function topGenes(cell: CellTypeId, limit = Infinity): Gene[] {
  return data.genes
    .filter((g) => g.expression[cell] > 0)
    .sort((a, b) => b.expression[cell] - a.expression[cell] || a.symbol.localeCompare(b.symbol))
    .slice(0, limit)
}

/** True if the cell type contains the organelle where this protein lives. */
export function cellHasOrganelle(cell: CellTypeId, organelle: OrganelleId): boolean {
  return getCell(cell)?.organelles.includes(organelle) ?? false
}

/** Clickable named regions of a cell with this shape (empty for most shapes). */
export function partsForShape(shape: CellShape): CellPart[] {
  return data.cellParts.filter((p) => p.shape === shape)
}

export const getPart = (id: string): CellPart | undefined => data.cellParts.find((p) => p.id === id)

export const cellName = (id: CellTypeId) => getCell(id)?.name ?? id
