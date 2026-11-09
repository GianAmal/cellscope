// "Knock out this gene": the payoff feature. Switching it on removes the
// protein from the 3D cell and promotes the consequences to the top of the
// panel. Every claim here comes from cells.json with its own sources.
import type { Gene, Organelle, Protein } from '../data/schema'
import { useSelection } from '../state/selection'
import { SourceList } from './SourceList'

// Phrased as a status after a dash, so it reads correctly whatever the
// organelle's activity label happens to be (singular, plural or a phrase).
const EFFECT_STATUS: Record<Protein['knockout']['effect'], string> = {
  stops: 'stopped',
  reduces: 'slowed down',
  unchanged: 'still running, because other proteins do that job',
}

const CONFIDENCE_NOTE: Record<Protein['knockout']['confidence'], string | null> = {
  high: null,
  medium: 'Evidence for this is moderate.',
  low: 'Evidence for this is limited — treat it as a rough expectation.',
}

export function KnockoutToggle({ gene }: { gene: Gene }) {
  const { sel, dispatch } = useSelection()
  const on = sel.knockout
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => dispatch({ type: 'setKnockout', on: !on })}
      className={`rounded-md border-2 px-3 py-2 text-sm font-semibold ${
        on
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-oi-vermillion text-oi-vermillion hover:bg-orange-50'
      }`}
    >
      {on ? `Put ${gene.symbol} back` : `Knock out ${gene.symbol}`}
    </button>
  )
}

/** The loud block shown at the top of the panel while the gene is knocked out. */
export function KnockoutBanner({
  gene,
  protein,
  organelle,
  cellName,
  organellePresent,
}: {
  gene: Gene
  protein: Protein
  organelle: Organelle | undefined
  cellName: string
  organellePresent: boolean
}) {
  const { sel } = useSelection()
  const ko = protein.knockout
  const score = gene.expression[sel.cell]
  const note = CONFIDENCE_NOTE[ko.confidence]

  return (
    <div className="rounded-lg border-2 border-oi-vermillion bg-orange-50 p-4">
      <h3 className="text-lg font-bold">
        <span aria-hidden="true">⚠ </span>
        {gene.symbol} is knocked out
      </h3>
      <p className="mt-1 text-sm text-slate-700">
        This cell can no longer make {protein.name}.
      </p>

      <dl className="mt-3 space-y-3">
        <div>
          <dt className="font-semibold">Inside this cell</dt>
          <dd>
            {ko.claim}
            {organelle && organellePresent && score > 0 && (
              <p className="mt-1 text-sm text-slate-700">
                In the 3D cell above: {organelle.activity.label.toLowerCase()} —{' '}
                <strong>{EFFECT_STATUS[ko.effect]}</strong>.
              </p>
            )}
            {score === 0 && (
              <p className="mt-1 text-sm text-slate-700">
                A {cellName} barely uses {gene.symbol} anyway (score {score}/100), so knocking it out changes little
                here. Try a cell type that uses it heavily.
              </p>
            )}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">In the body</dt>
          <dd>{protein.whatHappensIfBroken}</dd>
        </div>
      </dl>

      {note && (
        <p className="mt-3 rounded bg-white/70 px-2 py-1 text-sm text-slate-700">
          <span aria-hidden="true">ⓘ </span>
          {note}
        </p>
      )}

      <div className="mt-3">
        <SourceList sources={ko.sources} title="Sources for this" />
      </div>
    </div>
  )
}
