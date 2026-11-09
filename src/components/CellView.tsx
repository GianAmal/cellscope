// The 3D cell plus its organelle list. The list works on its own, so the page
// is complete with 3D switched off (`?no3d=1`, or the toggle here).
import { Suspense, lazy } from 'react'
import { cellHasOrganelle, getCell, getGene, proteinFor } from '../data'
import { useSelection } from '../state/selection'
import { CellPartList } from './CellPartList'
import { OrganelleList } from './OrganelleList'

// Loaded only when 3D is on, so the 2D app never downloads three.js.
const CellScene = lazy(() => import('../three/CellScene').then((m) => ({ default: m.CellScene })))

export function CellView() {
  const { sel, dispatch } = useSelection()
  const cell = getCell(sel.cell)
  if (!cell) return null

  // The scene gets plain values, never the data module: the same selection
  // drives this panel, the gene detail and the 3D, so they cannot drift.
  const gene = sel.gene ? getGene(sel.gene) : undefined
  const protein = gene ? proteinFor(gene) : undefined
  const sceneProtein =
    gene && protein
      ? {
          id: protein.id,
          geneSymbol: gene.symbol,
          name: protein.name,
          location: protein.location,
          primitive: protein.visual.primitive,
          color: protein.visual.color,
          baseCount: protein.visual.count,
          expression: gene.expression[cell.id],
          organellePresent: cellHasOrganelle(cell.id, protein.location),
          knockedOut: sel.knockout,
          effect: protein.knockout.effect,
        }
      : null

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
            focus={sel.organelle ?? sel.cellPart}
            protein={sceneProtein}
            onSelectOrganelle={(organelle) => dispatch({ type: 'setOrganelle', organelle })}
            onSelectPart={(part) => dispatch({ type: 'setPart', part })}
          />
        </Suspense>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
          The 3D view is off. Everything it shows is listed below in words.
        </p>
      )}

      <CellPartList cell={cell} />
      <OrganelleList cell={cell} />
    </section>
  )
}
