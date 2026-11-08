import { useEffect, useRef } from 'react'
import { cellHasOrganelle, cellName, getGene, getOrganelle, proteinFor } from '../data'
import { useSelection } from '../state/selection'
import { ExpressionChart } from './ExpressionChart'
import { Score } from './ExpressionNote'
import { SourceList } from './SourceList'
import { Term } from './Term'

export function GeneDetail() {
  const { sel } = useSelection()
  const gene = sel.gene ? getGene(sel.gene) : undefined
  const ref = useRef<HTMLElement>(null)
  const prevGene = useRef(sel.gene)

  // On narrow screens the panel sits below the gene list: bring it into view
  // when the user picks a different gene (not on first load).
  useEffect(() => {
    if (prevGene.current === sel.gene) return
    prevGene.current = sel.gene
    if (sel.gene && window.matchMedia('(max-width: 767px)').matches) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [sel.gene])

  const panel = 'md:sticky md:top-4 md:max-h-[calc(100vh-2rem)] md:self-start md:overflow-y-auto'

  if (!gene) {
    return (
      <section ref={ref} className={`flex min-h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-6 text-center text-slate-600 ${panel}`}>
        <p>
          Pick a gene from the list to see the protein it makes, what that protein does, and what happens if it's
          broken.
        </p>
      </section>
    )
  }

  const protein = proteinFor(gene)
  const organelle = protein ? getOrganelle(protein.location) : undefined
  const present = protein ? cellHasOrganelle(sel.cell, protein.location) : true
  const cell = cellName(sel.cell).toLowerCase()

  return (
    <section
      ref={ref}
      aria-labelledby="gene-title"
      className={`space-y-5 rounded-lg border border-slate-200 bg-white p-4 ${panel}`}
    >
      <header>
        <p className="text-sm font-medium text-slate-500">
          <Term id="gene">Gene</Term>
        </p>
        <h2 id="gene-title" className="text-2xl font-bold">
          <span className="font-mono">{gene.symbol}</span>{' '}
          <span className="text-lg font-normal text-slate-600">— {gene.fullName}</span>
        </h2>
        <p className="mt-2 text-lg">{gene.plainSummary}</p>
        <p className="mt-1 text-sm text-slate-600">
          Score in the {cell}: <Score value={gene.expression[sel.cell]} /> (approximate)
        </p>
      </header>

      {protein && (
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">
            The <Term id="protein">protein</Term> it makes
          </p>
          <h3 className="text-xl font-semibold">{protein.name}</h3>
          <dl className="mt-3 space-y-3">
            <div>
              <dt className="font-semibold">Where it works</dt>
              <dd>
                {organelle?.name ?? protein.location}
                {organelle && <span className="text-slate-600"> — {organelle.blurb}</span>}
                {!present && (
                  <p className="mt-1 rounded border-l-4 border-oi-orange bg-amber-50 p-2 text-sm">
                    <span aria-hidden="true">⚠ </span>A {cell} has no {organelle?.name.toLowerCase()}, so this protein
                    isn't found there.
                  </p>
                )}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Its job</dt>
              <dd>{protein.job}</dd>
            </div>
          </dl>
        </div>
      )}

      {protein && (
        <div className="rounded-lg border-l-4 border-oi-vermillion bg-orange-50 p-4">
          <h3 className="font-semibold">
            <span aria-hidden="true">⚠ </span>What happens if it's broken
          </h3>
          <p className="mt-1">{protein.whatHappensIfBroken}</p>
        </div>
      )}

      <ExpressionChart gene={gene} selected={sel.cell} />
      <SourceList sources={gene.sources} />
    </section>
  )
}
