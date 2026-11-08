import { cellTypes, getOrganelle } from '../data'
import { ORGANELLE_IDS } from '../data/schema'
import { useSelection } from '../state/selection'
import { Term } from './Term'

export function CellPicker() {
  const { sel, dispatch } = useSelection()
  return (
    <section aria-labelledby="pick-cell">
      <h2 id="pick-cell" className="text-xl font-semibold">
        1. Pick a cell type
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cellTypes.map((c) => {
          const active = sel.cell === c.id
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => dispatch({ type: 'setCell', cell: c.id })}
              className={`rounded-lg border-2 p-3 text-left transition-colors ${
                active ? 'border-oi-blue bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-400'
              }`}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="font-semibold">{c.name}</span>
                {active && (
                  <span className="shrink-0 rounded bg-oi-blue px-1.5 py-0.5 text-xs font-medium text-white">
                    ✓ Selected
                  </span>
                )}
              </span>
              <span className="mt-1 block text-sm text-slate-600">{c.blurb}</span>
            </button>
          )
        })}
      </div>
      <CellSummary />
    </section>
  )
}

/** Organelles the selected cell has and lacks, plus any shape caveat. */
function CellSummary() {
  const { sel } = useSelection()
  const cell = cellTypes.find((c) => c.id === sel.cell)
  if (!cell) return null
  const missing = ORGANELLE_IDS.filter((o) => !cell.organelles.includes(o))
  const name = (id: (typeof ORGANELLE_IDS)[number]) => getOrganelle(id)?.name ?? id
  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
      <p>
        <strong>
          <Term id="organelle">Organelles</Term> in a {cell.name.toLowerCase()}:
        </strong>{' '}
        {cell.organelles.map(name).join(', ')}.
      </p>
      {missing.length > 0 && (
        <p className="mt-1">
          <strong>Missing:</strong> {missing.map(name).join(', ')}.
        </p>
      )}
      {cell.shapeNote && <p className="mt-1 italic text-slate-600">{cell.shapeNote}</p>}
    </div>
  )
}
