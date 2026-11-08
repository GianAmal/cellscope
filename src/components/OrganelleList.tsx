// Keyboard-accessible list of the organelles in the selected cell. Shares the
// selection state with the 3D scene, so clicking either one highlights both.
// This list is what makes the 3D content reachable without a mouse or a GPU.
import { getOrganelle } from '../data'
import { ORGANELLE_IDS, type CellType, type OrganelleId } from '../data/schema'
import { ORGANELLE_COLOR } from '../three/palette'
import { useSelection } from '../state/selection'
import { Term } from './Term'

export function OrganelleList({ cell }: { cell: CellType }) {
  const { sel, dispatch } = useSelection()
  const present = cell.organelles
  const missing = ORGANELLE_IDS.filter((o) => !present.includes(o))
  const chosen = sel.organelle ? getOrganelle(sel.organelle) : null

  return (
    <section aria-labelledby="organelles-title" className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 id="organelles-title" className="font-semibold">
        <Term id="organelle">Organelles</Term> in a {cell.name.toLowerCase()}
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Select one to highlight it{sel.show3d ? ' in the cell' : ''} and read what it does.
      </p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {present.map((id) => {
          const o = getOrganelle(id)
          const active = sel.organelle === id
          return (
            <li key={id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() =>
                  dispatch({ type: 'setOrganelle', organelle: active ? null : id })
                }
                className={`flex items-center gap-2 rounded-md border-2 px-3 py-1.5 text-sm font-medium ${
                  active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:border-slate-500'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full border border-slate-400"
                  style={{ backgroundColor: ORGANELLE_COLOR[id] }}
                />
                {o?.name ?? id}
                {active && <span aria-hidden="true">✓</span>}
              </button>
            </li>
          )
        })}
      </ul>

      <div aria-live="polite" className="mt-3">
        {chosen ? (
          <div className="rounded-md bg-slate-50 p-3">
            <p className="font-semibold">{chosen.name}</p>
            <p className="mt-1 text-sm text-slate-700">{chosen.blurb}</p>
            <ExtraNote cell={cell} id={chosen.id as OrganelleId} />
            <button
              type="button"
              onClick={() => dispatch({ type: 'setOrganelle', organelle: null })}
              className="mt-2 text-sm font-medium text-oi-blue underline underline-offset-2"
            >
              Clear selection
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Nothing selected.</p>
        )}
      </div>

      {missing.length > 0 && (
        <p className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-700">
          <strong>Not in this cell:</strong> {missing.map((m) => getOrganelle(m)?.name ?? m).join(', ')}.
        </p>
      )}
      {cell.shapeNote && <p className="mt-2 text-sm italic text-slate-600">{cell.shapeNote}</p>}
    </section>
  )
}

/** Says when this cell type has an unusually large amount of an organelle. */
function ExtraNote({ cell, id }: { cell: CellType; id: OrganelleId }) {
  const scale = cell.organelleScale[id]
  if (!scale || scale === 1) return null
  return (
    <p className="mt-2 text-sm text-slate-700">
      <span aria-hidden="true">★ </span>A {cell.name.toLowerCase()} has an unusually large amount of this, so it is
      drawn bigger here.
    </p>
  )
}
