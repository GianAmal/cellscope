import { useId } from 'react'
import { cellTypes, getCell, getOrganelle, topGenes } from '../data'
import type { CellTypeId } from '../data/schema'
import { useSelection } from '../state/selection'
import { ExpressionNote, Score } from './ExpressionNote'
import { Term } from './Term'

const TOP_N = 6

export function CompareView() {
  const { sel } = useSelection()
  return (
    <section aria-labelledby="compare-title" className="space-y-4">
      <div>
        <h2 id="compare-title" className="text-xl font-semibold">
          Compare two cell types
        </h2>
        <p className="text-slate-600">
          Different cell types use the same <Term id="gene">genes</Term> to very different degrees. See which genes
          each one uses most.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CompareColumn index={0} cell={sel.compare[0]} />
        <CompareColumn index={1} cell={sel.compare[1]} />
      </div>
      <ExpressionNote />
    </section>
  )
}

function CompareColumn({ index, cell }: { index: 0 | 1; cell: CellTypeId }) {
  const { dispatch } = useSelection()
  const selectId = useId()
  const c = getCell(cell)
  const genes = topGenes(cell, TOP_N)
  if (!c) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <label htmlFor={selectId} className="block text-sm font-medium text-slate-600">
        {index === 0 ? 'First' : 'Second'} cell type
      </label>
      <select
        id={selectId}
        value={cell}
        onChange={(e) => dispatch({ type: 'setCompare', index, cell: e.target.value as CellTypeId })}
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-lg font-semibold"
      >
        {cellTypes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <p className="mt-2 text-slate-700">{c.blurb}</p>
      <p className="mt-2 text-sm text-slate-600">
        <strong>Organelles:</strong> {c.organelles.map((o) => getOrganelle(o)?.name ?? o).join(', ')}
      </p>

      <h3 className="mt-4 font-semibold">Top genes in this cell</h3>
      <p className="text-xs text-slate-600">Score 0–100, approximate. Select a gene to explore it.</p>
      <ol className="mt-2 space-y-2">
        {genes.map((g, i) => (
          <li key={g.id}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'openGene', gene: g.id, cell })}
              className="w-full rounded-md border border-slate-200 p-2 text-left hover:border-slate-400"
            >
              <span className="flex items-baseline justify-between gap-2">
                <span>
                  <span className="text-slate-500">{i + 1}. </span>
                  <span className="font-mono font-semibold">{g.symbol}</span>
                  {c.signatureGenes.includes(g.id) && (
                    <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-xs text-white">★ signature</span>
                  )}
                </span>
                <Score value={g.expression[cell]} />
              </span>
              <span className="mt-1 block h-2 rounded bg-slate-100" aria-hidden="true">
                <span className="block h-2 rounded bg-oi-blue" style={{ width: `${g.expression[cell]}%` }} />
              </span>
              <span className="mt-1 block text-sm text-slate-600">{g.plainSummary}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
