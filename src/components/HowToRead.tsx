import { useEffect, useState } from 'react'
import { data } from '../data'
import { Term } from './Term'

const KEY = 'cellscope.howToRead.open'

function readOpen(): boolean {
  try {
    return window.localStorage.getItem(KEY) !== 'false'
  } catch {
    return true
  }
}

/** Intro explaining what the app shows and every deliberate simplification. */
export function HowToRead() {
  const [open, setOpen] = useState(readOpen)
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, String(open))
    } catch {
      /* storage unavailable: just don't remember */
    }
  }, [open])

  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <summary className="cursor-pointer text-lg font-semibold">How to read this</summary>
      <div className="mt-3 space-y-4 text-slate-700">
        <p>
          Pick a cell type, then a <Term id="gene">gene</Term>. You'll see the <Term id="protein">protein</Term> it
          makes, the <Term id="organelle">organelle</Term> where that protein works, what goes wrong when it's broken,
          and how strongly each cell type uses the gene (its <Term id="gene_expression">expression</Term> score).
        </p>
        {data.readingNotes.length > 0 && (
          <>
            <p className="font-medium text-slate-900">This app simplifies on purpose:</p>
            <ul className="grid gap-3 md:grid-cols-2">
              {data.readingNotes.map((n) => (
                <li key={n.id} className="rounded-md bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">{n.title}</p>
                  <p className="mt-1 text-sm">{n.text}</p>
                  {n.sources.length > 0 && (
                    <p className="mt-1 text-xs">
                      Source:{' '}
                      {n.sources.map((s, i) => (
                        <a key={s} href={s} target="_blank" rel="noreferrer" className="text-oi-blue underline">
                          {i > 0 ? ', ' : ''}
                          {new URL(s).hostname.replace(/^www\./, '')}
                        </a>
                      ))}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </details>
  )
}
