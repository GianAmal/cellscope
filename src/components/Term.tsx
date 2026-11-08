import { useId, type ReactNode } from 'react'
import { getGloss } from '../data'

/**
 * A technical term with a plain-language gloss on hover or keyboard focus.
 * Definitions come from cells.json `glossary`; unknown ids render as plain text.
 */
export function Term({ id, children }: { id: string; children: ReactNode }) {
  const gloss = getGloss(id)
  const tipId = useId()
  if (!gloss) return <>{children}</>
  return (
    <span className="group relative inline-block">
      <button
        type="button"
        aria-describedby={tipId}
        className="cursor-help underline decoration-dotted decoration-2 underline-offset-4"
      >
        {children}
      </button>
      <span
        role="tooltip"
        id={tipId}
        className="pointer-events-none invisible absolute bottom-full left-0 z-30 mb-2 w-64 max-w-[80vw] rounded-md bg-slate-900 p-2 text-left text-sm font-normal text-white opacity-0 shadow-lg transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        <strong>{gloss.term}:</strong> {gloss.definition}
      </span>
    </span>
  )
}
