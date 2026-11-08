import { data } from '../data'

/** The "values are approximate" note. Shown next to every expression number. */
export function ExpressionNote({ className = '' }: { className?: string }) {
  return (
    <p className={`text-xs text-slate-600 ${className}`}>
      <span aria-hidden="true">ⓘ </span>
      <strong>Approximate.</strong> {data.meta.expressionNote}
    </p>
  )
}

/** A score with its unit, e.g. "72 / 100". */
export function Score({ value }: { value: number }) {
  return (
    <span className="tabular-nums">
      {value}
      <span className="text-slate-500"> / 100</span>
    </span>
  )
}
