// One shared selection state for the whole app (2D panels now, 3D scene in
// Phase 4), so the views can never drift apart. State is mirrored to the URL
// hash so a view can be bookmarked or shared.
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'
import { CELL_TYPE_IDS, type CellTypeId } from '../data/schema'
import { getGene } from '../data'

export type Mode = 'explore' | 'compare'

export interface Selection {
  mode: Mode
  cell: CellTypeId
  gene: string | null
  compare: [CellTypeId, CellTypeId]
}

type Action =
  | { type: 'setMode'; mode: Mode }
  | { type: 'setCell'; cell: CellTypeId }
  | { type: 'setGene'; gene: string | null }
  | { type: 'setCompare'; index: 0 | 1; cell: CellTypeId }
  | { type: 'openGene'; gene: string; cell?: CellTypeId }
  | { type: 'replace'; sel: Selection }

const DEFAULT: Selection = { mode: 'explore', cell: 'muscle', gene: null, compare: ['muscle', 'neuron'] }

const isCell = (v: unknown): v is CellTypeId => CELL_TYPE_IDS.includes(v as CellTypeId)

function fromHash(hash: string): Selection {
  const p = new URLSearchParams(hash.replace(/^#/, ''))
  const cmp = (p.get('compare') ?? '').split(',')
  const gene = p.get('gene')
  return {
    mode: p.get('mode') === 'compare' ? 'compare' : 'explore',
    cell: isCell(p.get('cell')) ? (p.get('cell') as CellTypeId) : DEFAULT.cell,
    gene: gene && getGene(gene) ? gene : null,
    compare: [isCell(cmp[0]) ? cmp[0] : DEFAULT.compare[0], isCell(cmp[1]) ? cmp[1] : DEFAULT.compare[1]],
  }
}

function toHash(s: Selection): string {
  const p = new URLSearchParams({ mode: s.mode, cell: s.cell, compare: s.compare.join(',') })
  if (s.gene) p.set('gene', s.gene)
  return '#' + p.toString()
}

function reducer(s: Selection, a: Action): Selection {
  switch (a.type) {
    case 'setMode':
      return { ...s, mode: a.mode }
    case 'setCell':
      return { ...s, cell: a.cell }
    case 'setGene':
      return { ...s, gene: a.gene }
    case 'setCompare': {
      const compare: [CellTypeId, CellTypeId] = [...s.compare]
      compare[a.index] = a.cell
      return { ...s, compare }
    }
    case 'openGene':
      return { ...s, mode: 'explore', gene: a.gene, cell: a.cell ?? s.cell }
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
