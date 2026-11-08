// The 3D cell plus its organelle list. The list works on its own, so the page
// is complete with 3D switched off (`?no3d=1`, or the toggle here).
import { Suspense, lazy } from 'react'
import { getCell } from '../data'
import { useSelection } from '../state/selection'
import { OrganelleList } from './OrganelleList'

// Loaded only when 3D is on, so the 2D app never downloads three.js.
const CellScene = lazy(() => import('../three/CellScene').then((m) => ({ default: m.CellScene })))

export function CellView() {
  const { sel, dispatch } = useSelection()
  const cell = getCell(sel.cell)
  if (!cell) return null

  return (
    <section aria-labelledby="cell-view-title" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="cell-view-title" className="text-xl font-semibold">
          Inside a {cell.name.toLowerCase()}
        </h2>
        <button
          type="button"
          aria-pressed={sel.show3d}
          onClick={() => dispatch({ type: 'set3d', on: !sel.show3d })}
          className="rounded-md border-2 border-slate-300 px-3 py-1.5 text-sm font-medium hover:border-slate-500"
        >
          {sel.show3d ? 'Turn off 3D view' : 'Turn on 3D view'}
        </button>
      </div>

      {sel.show3d ? (
        <Suspense
          fallback={
            <div className="flex h-80 items-center justify-center rounded-lg border border-slate-200 bg-slate-900 text-slate-300 sm:h-96">
              Loading the 3D cell…
            </div>
          }
        >
          <CellScene
            cell={cell}
            selected={sel.organelle}
            onSelect={(organelle) => dispatch({ type: 'setOrganelle', organelle })}
          />
        </Suspense>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
          The 3D view is off. Everything it shows is listed below in words.
        </p>
      )}

      <OrganelleList cell={cell} />
    </section>
  )
}
