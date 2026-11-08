import { CellPicker } from './CellPicker'
import { GeneDetail } from './GeneDetail'
import { GeneList } from './GeneList'

export function ExploreView() {
  return (
    <div className="space-y-6">
      <CellPicker />
      <div className="grid gap-6 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <GeneList />
        <GeneDetail />
      </div>
    </div>
  )
}
