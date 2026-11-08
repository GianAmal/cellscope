// Keyboard-accessible list of a cell's named outer parts — a neuron's
// dendrites, cell body, axon and axon terminals. Shares one selection with the
// 3D scene, so clicking a button and clicking the shape do the same thing.
// Renders nothing for cell shapes that have no named parts.
import { partsForShape } from '../data'
import type { CellType } from '../data/schema'
import { useSelection } from '../state/selection'
import { SourceList } from './SourceList'

export function CellPartList({ cell }: { cell: CellType }) {
  const { sel, dispatch } = useSelection()
  const parts = partsForShape(cell.shape)
  if (parts.length === 0) return null

  const chosen = parts.find((p) => p.id === sel.cellPart)

  return (
    <section aria-labelledby="parts-title" className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 id="parts-title" className="font-semibold">
        Parts of a {cell.name.toLowerCase()}
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        The outside of the cell. Follow them in order to trace a signal through it.
      </p>

      <ol className="mt-3 flex flex-wrap gap-2">
        {parts.map((p, i) => {
          const active = sel.cellPart === p.id
          return (
            <li key={p.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => dispatch({ type: 'setPart', part: active ? null : p.id })}
                className={`rounded-md border-2 px-3 py-1.5 text-sm font-medium ${
                  active ? 'border-oi-blue bg-oi-blue text-white' : 'border-slate-300 hover:border-slate-500'
                }`}
              >
                <span className={active ? 'text-sky-100' : 'text-slate-500'}>{i + 1}. </span>
                {p.name}
                {active && <span aria-hidden="true"> ✓</span>}
              </button>
            </li>
          )
        })}
      </ol>

      <div aria-live="polite" className="mt-3">
        {chosen ? (
          <div className="rounded-md bg-slate-50 p-3">
            <p className="font-semibold">{chosen.name}</p>
            <p className="mt-1 text-sm text-slate-700">{chosen.blurb}</p>
            <div className="mt-2">
              <SourceList sources={chosen.sources} title="Source" />
            </div>
            <button
              type="button"
              onClick={() => dispatch({ type: 'setPart', part: null })}
              className="mt-2 text-sm font-medium text-oi-blue underline underline-offset-2"
            >
              Clear selection
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No part selected.</p>
        )}
      </div>
    </section>
  )
}
