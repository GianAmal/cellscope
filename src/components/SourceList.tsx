/** Readable source links: shows the site name, links to the full URL. */
export function SourceList({ sources, title = 'Sources' }: { sources: string[]; title?: string }) {
  if (sources.length === 0) return null
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <ul className="mt-1 space-y-1 text-sm">
        {sources.map((url) => (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="break-words text-oi-blue underline underline-offset-2 hover:text-slate-900"
            >
              {label(url)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function label(url: string): string {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    const names: Record<string, string> = {
      'uniprot.org': 'UniProt',
      'ncbi.nlm.nih.gov': 'NCBI Gene',
      'proteinatlas.org': 'Human Protein Atlas',
      'medlineplus.gov': 'MedlinePlus Genetics',
      'pubmed.ncbi.nlm.nih.gov': 'PubMed',
      'openstax.org': 'OpenStax',
      'genome.gov': 'NHGRI Genetics Glossary',
    }
    const last = u.pathname.split('/').filter(Boolean).pop() ?? ''
    return `${names[host] ?? host}${last ? ` — ${decodeURIComponent(last).replace(/[+-]/g, ' ')}` : ''}`
  } catch {
    return url
  }
}
