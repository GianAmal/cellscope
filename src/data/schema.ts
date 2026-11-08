// Types for src/data/cells.json. Mirrors PROJECT_PLAN.md section 5.
// The runtime ID lists below are shared with scripts/validate-data.ts so the
// types and the validator can never disagree.

export const ORGANELLE_IDS = [
  'nucleus',
  'cytosol',
  'plasma_membrane',
  'mitochondrion',
  'er',
  'golgi',
] as const
export type OrganelleId = (typeof ORGANELLE_IDS)[number]

/** The five cell types locked in PROJECT_PLAN.md section 1. */
export const CELL_TYPE_IDS = ['neuron', 'muscle', 'hepatocyte', 'rbc', 'beta'] as const
export type CellTypeId = (typeof CELL_TYPE_IDS)[number]

/** Drives the 3D shell in Phase 3. */
export const CELL_SHAPES = ['round', 'elongated', 'branched', 'biconcave'] as const
export type CellShape = (typeof CELL_SHAPES)[number]

/** Stylized mesh used to draw a protein in 3D. Purely visual, not biological. */
export const PROTEIN_PRIMITIVES = ['cluster', 'sphere', 'rod', 'ring'] as const
export type ProteinPrimitive = (typeof PROTEIN_PRIMITIVES)[number]

/** Word limits for plain-language fields (bio-curator rules). */
export const PLAIN_SUMMARY_MAX_WORDS = 25
export const WHAT_HAPPENS_IF_BROKEN_MAX_WORDS = 30

export interface Meta {
  version: number
  /** Shown in the UI next to every expression value. */
  expressionNote: string
}

export interface Organelle {
  id: OrganelleId
  name: string
  blurb: string
  /** At least one source URL (textbook page, NCBI Bookshelf, HPA, ...). */
  sources: string[]
}

export interface CellType {
  id: CellTypeId
  name: string
  blurb: string
  shape: CellShape
  /** Organelles drawn for this cell type (e.g. mature red blood cells lack a nucleus). */
  organelles: OrganelleId[]
  /** Optional per-organelle size multiplier for the 3D scene. 1 = default. */
  organelleScale: Partial<Record<OrganelleId, number>>
  /** Gene IDs that characterize this cell type. Must exist in `genes`. */
  signatureGenes: string[]
  /** At least one source URL backing the blurb and organelle list. */
  sources: string[]
}

/**
 * Illustrative 0-100 score per cell type, derived from Human Protein Atlas data.
 * Not a raw measurement — see Meta.expressionNote.
 */
export type Expression = Record<CellTypeId, number>

export interface Gene {
  id: string
  /** Official HGNC symbol. */
  symbol: string
  fullName: string
  /** Max 25 words, readable by a 15-year-old. */
  plainSummary: string
  /** Exactly one protein per gene (deliberate simplification). */
  proteinId: string
  expression: Expression
  /** At least one primary-source URL (UniProt, NCBI Gene, HPA, ...). */
  sources: string[]
}

export interface ProteinVisual {
  primitive: ProteinPrimitive
  /** Hex color, e.g. "#e8833a". */
  color: string
  /** Base number of instances drawn at expression 100. */
  count: number
}

export interface Protein {
  id: string
  name: string
  geneId: string
  location: OrganelleId
  job: string
  /** Max 30 words, readable by a 15-year-old. */
  whatHappensIfBroken: string
  visual: ProteinVisual
}

export interface CellData {
  meta: Meta
  organelles: Organelle[]
  cellTypes: CellType[]
  genes: Gene[]
  proteins: Protein[]
}
