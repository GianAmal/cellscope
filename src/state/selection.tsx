// One shared selection state for the whole app — the 2D panels and the 3D
// scene both read and write it, so the views can never drift apart. State is
// mirrored to the URL hash so a view can be bookmarked or shared.
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'
import { CELL_TYPE_IDS, ORGANELLE_IDS, type CellTypeId, type OrganelleId } from '../data/schema'
import { cellHasOrganelle, getGene } from '../data'

export type Mode = 'explore' | 'compare'

export interface Selection {
  mode: Mode
  cell: CellTypeId
  gene: string | null
  /** Organelle highlighted in the 3D scene and the organelle list. */
  organelle: OrganelleId | null
  compare: [CellTypeId, CellTypeId]
  /** 3D is an enhancement: the app stays fully usable with it off. */
  show3d: boolean
}

type Action =
  | { type: 'setMode'; mode: Mode }
  | { type: 'setCell'; cell: CellTypeId }
  | { type: 'setGene'; gene: string | null }
  | { type: 'setOrganelle'; organelle: OrganelleId | null }
  | { type: 'setCompare'; index: 0 | 1; cell: CellTypeId }
  | { type: 'openGene'; gene: string; cell?: CellTypeId }
  | { type: 'set3d'; on: boolean }
  | { type: 'replace'; sel: Selection }

const DEFAULT: Selection = {
  mode: 'explore',
  cell: 'muscle',
  gene: null,
  organelle: null,
  compare: ['muscle', 'neuron'],
  show3d: true,
}

const isCell = (v: unknown): v is CellTypeId => CELL_TYPE_IDS.includes(v as CellTypeId)
const isOrganelle = (v: unknown): v is OrganelleId => ORGANELLE_IDS.includes(v as OrganelleId)

function fromHash(hash: string): Selection {
  const p = new URLSearchParams(hash.replace(/^#/, ''))
  const cmp = (p.get('compare') ?? '').split(',')
  const gene = p.get('gene')
  const org = p.get('organelle')
  const cell = isCell(p.get('cell')) ? (p.get('cell') as CellTypeId) : DEFAULT.cell
  // `?no3d=1` (search string) also turns 3D off, as the plan specifies.
  const noSearch = new URLSearchParams(window.location.search).get('no3d')
  return {
    mode: p.get('mode') === 'compare' ? 'compare' : 'explore',
    cell,
    gene: gene && getGene(gene) ? gene : null,
    organelle: isOrganelle(org) && cellHasOrganelle(cell, org) ? org : null,
    compare: [isCell(cmp[0]) ? cmp[0] : DEFAULT.compare[0], isCell(cmp[1]) ? cmp[1] : DEFAULT.compare[1]],
    show3d: p.get('no3d') !== '1' && noSearch !== '1',
  }
}

function toHash(s: Selection): string {
  const p = new URLSearchParams({ mode: s.mode, cell: s.cell, compare: s.compare.join(',') })
  if (s.gene) p.set('gene', s.gene)
  if (s.organelle) p.set('organelle', s.organelle)
  if (!s.show3d) p.set('no3d', '1')
  return '#' + p.toString()
}

function reducer(s: Selection, a: Action): Selection {
  switch (a.type) {
    case 'setMode':
      return { ...s, mode: a.mode }
    case 'setCell':
      // Drop the organelle if the new cell type doesn't have it.
      return {
        ...s,
        cell: a.cell,
        organelle: s.organelle && cellHasOrganelle(a.cell, s.organelle) ? s.organelle : null,
      }
    case 'setGene':
      return { ...s, gene: a.gene }
    case 'setOrganelle':
      // Idempotent on purpose: a 3D click can hit two meshes of the same
      // organelle, and a toggle would select then immediately deselect.
      return { ...s, organelle: a.organelle }
    case 'setCompare': {
      const compare: [CellTypeId, CellTypeId] = [...s.compare]
      compare[a.index] = a.cell
      return { ...s, compare }
    }
    case 'openGene':
      return { ...s, mode: 'explore', gene: a.gene, cell: a.cell ?? s.cell }
    case 'set3d':
      return { ...s, show3d: a.on }
    case 'replace':
      return a.sel
  }
}

const Ctx = createContext<{ sel: Selection; dispatch: (a: Action) => void } | null>(null)

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [sel, dispatch] = useReducer(reducer, undefined, () => fromHash(window.location.hash))

  // Follow links, bookmarks and Back/Forward that change only the hash.
  useEffect(() => {
    const onHash = () => dispatch({ type: 'replace', sel: fromHash(window.location.hash) })
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const next = toHash(sel)
    if (window.location.hash !== next) window.history.replaceState(null, '', next)
  }, [sel])

  return <Ctx.Provider value={{ sel, dispatch }}>{children}</Ctx.Provider>
}

export function useSelection() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSelection must be used inside <SelectionProvider>')
  return ctx
}
