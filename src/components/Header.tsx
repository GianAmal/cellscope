import { useSelection, type Mode } from '../state/selection'

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: 'explore', label: 'Explore', hint: 'One cell, one gene at a time' },
  { id: 'compare', label: 'Compare', hint: 'Two cell types side by side' },
]

export function Header() {
  const { sel, dispatch } = useSelection()
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CellScope</h1>
          <p className="mt-1 text-slate-600">
            How genes make proteins, and how the same genes play different roles in different cells.
          </p>
        </div>
        <nav aria-label="View" className="flex gap-2">
          {MODES.map((m) => {
            const active = sel.mode === m.id
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={active}
                title={m.hint}
                onClick={() => dispatch({ type: 'setMode', mode: m.id })}
                className={`rounded-md border-2 px-4 py-2 font-medium ${
                  active
                    ? 'border-oi-blue bg-oi-blue text-white'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-slate-500'
                }`}
              >
                {active && <span aria-hidden="true">● </span>}
                {m.label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
