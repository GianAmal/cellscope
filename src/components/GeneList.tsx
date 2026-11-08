import { useId, useState } from 'react'
import { cellName, cellTypes, data, highestCells } from '../data'
import type { CellTypeId } from '../data/schema'
import { useSelection } from '../state/selection'
import { Score } from './ExpressionNote'
import { Term } from './Term'

export function GeneList() {
  const { sel, dispatch } = useSelection()
  const [query, setQuery] = useState('')
  const [peak, setPeak] = useState<CellTypeId | 'any'>('any')
  const searchId = useId()
  const peakId = useId()

  const q = query.trim().toLowerCase()
  const genes = data.genes
    .filter((g) => !q || [g.symbol, g.fullName, g.plainSummary].some((t) => t.toLowerCase().includes(q)))
    .filter((g) => peak === 'any' || highestCells(g).includes(peak))
    .sort((a, b) => b.expression[sel.cell] - a.expression[sel.cell] || a.symbol.localeCompare(b.symbol))

  return (
    <section aria-labelledby="pick-gene" className="rounded-lg border border-slate-200 bg-white p-3">
      <h2 id="pick-gene" className="text-xl font-semibold">
        2. Pick a <Term id="gene">gene</Term>
      </h2>
      <div className="mt-3 space-y-2">
        <label htmlFor={searchId} className="block text-sm font-medium">
          Search
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. insulin, ATP, HBB"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
        <label htmlFor={peakId} className="block text-sm font-medium">
          Most active in
        </label>
        <select
          id={peakId}
          value={peak}
          onChange={(e) => setPeak(e.target.value as CellTypeId | 'any')}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
        >
          <option value="any">Any cell type</option>
          {cellTypes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-3 text-xs text-slate-600" aria-live="polite">
        {genes.length} gene{genes.length === 1 ? '' : 's'}, sorted by score in the {cellName(sel.cell).toLowerCase()}{' '}
        (approximate).
      </p>
      <ul className="mt-2 space-y-2">
        {genes.map((g) => {
          const active = sel.gene === g.id
          const top = highestCells(g)
          return (
            <li key={g.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => dispatch({ type: 'setGene', gene: g.id })}
                className={`w-full rounded-md border-2 p-2 text-left ${
                  active ? 'border-oi-blue bg-sky-50' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-mono font-semibold">{g.symbol}</span>
                  <span className="text-sm">
                    <span className="sr-only">Score here: </span>
                    <Score value={g.expression[sel.cell]} />
                  </span>
                </span>
                <span className="block text-sm text-slate-600">{g.fullName}</span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Most active in: {top.length ? top.map(cellName).join(', ') : '—'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {genes.length === 0 && <p className="mt-2 text-sm text-slate-600">No genes match. Try a different search.</p>}
    </section>
  )
}
