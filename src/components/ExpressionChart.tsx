import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { cellTypes } from '../data'
import type { CellTypeId, Gene } from '../data/schema'
import { ExpressionNote } from './ExpressionNote'
import { Term } from './Term'

const SELECTED = '#0072B2' // Okabe-Ito blue
const OTHER = '#94A3B8' // slate-400

/** One gene's score across all five cell types. Selected cell is marked by color AND a ▶ label. */
export function ExpressionChart({ gene, selected }: { gene: Gene; selected: CellTypeId }) {
  const rows = cellTypes.map((c) => ({
    id: c.id,
    // Score lives in the label so a 0 (no bar) is still readable.
    label: `${c.id === selected ? '▶ ' : ''}${c.name} · ${gene.expression[c.id]}`,
    score: gene.expression[c.id],
  }))
  return (
    <figure>
      <figcaption className="font-semibold">
        How strongly does each cell type use {gene.symbol}?{' '}
        <span className="font-normal text-slate-600">
          (<Term id="gene_expression">expression</Term> score, 0–100, approximate)
        </span>
      </figcaption>
      <div className="mt-2 h-56 w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
            <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="label" width={200} tick={{ fontSize: 13 }} />
            <Bar dataKey="score" isAnimationActive={false} radius={[0, 4, 4, 0]}>
              {rows.map((r) => (
                <Cell key={r.id} fill={r.id === selected ? SELECTED : OTHER} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>{gene.symbol} expression score by cell type (0–100, approximate)</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <th scope="row">{r.label}</th>
              <td>{r.score} out of 100</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ExpressionNote className="mt-2" />
    </figure>
  )
}
