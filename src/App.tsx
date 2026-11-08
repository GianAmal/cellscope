import { CompareView } from './components/CompareView'
import { ExploreView } from './components/ExploreView'
import { Header } from './components/Header'
import { HowToRead } from './components/HowToRead'
import { SelectionProvider, useSelection } from './state/selection'

function Main() {
  const { sel } = useSelection()
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <HowToRead />
      {sel.mode === 'explore' ? <ExploreView /> : <CompareView />}
    </main>
  )
}

export default function App() {
  return (
    <SelectionProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <Main />
        <footer className="mx-auto max-w-6xl px-4 pb-8 text-sm text-slate-600">
          A teaching tool, not a simulator. Facts come from UniProt, NCBI Gene, the Human Protein Atlas, MedlinePlus
          and OpenStax; every gene links to its sources.
        </footer>
      </div>
    </SelectionProvider>
  )
}
