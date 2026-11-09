// The 3D cell. Everything it draws comes from cells.json via props: which
// organelles exist, how big they are, the cell's shape, and which named parts
// of the outline are clickable. No gene, protein or expression value is
// referenced here (those arrive in Phase 4).
import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { CellType, KnockoutEffect, OrganelleId, ProteinPrimitive } from '../data/schema'
import { getOrganelle, getPart, partsForShape } from '../data'
import { ActivityFlow } from './ActivityFlow'
import { CellShell } from './CellShell'
import { CellTransition } from './CellTransition'
import { Protein3D } from './Protein3D'
import { copiesFor } from './proteinLayout'
import { Organelle3D } from './Organelle3D'
import { organelleLayout } from './layout'
import { SHELL_RADIUS, SHELL_VIEW } from './shapes'

/** Everything the scene needs to draw the selected gene's protein. */
export interface SceneProtein {
  id: string
  geneSymbol: string
  name: string
  location: OrganelleId
  primitive: ProteinPrimitive
  color: string
  baseCount: number
  /** This gene's 0-100 score in the cell on screen. */
  expression: number
  /** False when this cell type has no such organelle. */
  organellePresent: boolean
  /** The reader has knocked this gene out. */
  knockedOut: boolean
  /** What the sources say losing it does to the organelle's process. */
  effect: KnockoutEffect
}

export interface CellSceneProps {
  cell: CellType
  /** Selected organelle id or cell-part id. */
  focus: string | null
  /** The selected gene's protein, or null when no gene is selected. */
  protein: SceneProtein | null
  onSelectOrganelle: (id: OrganelleId | null) => void
  onSelectPart: (id: string | null) => void
}

export function CellScene({ cell, focus, protein, onSelectOrganelle, onSelectPart }: CellSceneProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const radius = SHELL_RADIUS[cell.shape]
  const view = SHELL_VIEW[cell.shape]
  const partIds = new Set(partsForShape(cell.shape).map((p) => p.id))

  const labelId = hovered ?? focus
  const labelName = labelId ? (getPart(labelId)?.name ?? getOrganelle(labelId as OrganelleId)?.name ?? labelId) : null

  /** The shell reports one id; route it to a part or an organelle. */
  const selectFromShell = (id: string) =>
    partIds.has(id) ? onSelectPart(id) : onSelectOrganelle(id as OrganelleId)

  const clearAll = () => {
    onSelectOrganelle(null)
    onSelectPart(null)
  }

  const copies = protein ? copiesFor(protein.baseCount, protein.expression) : 0

  const drawn = cell.organelles
    .map((id) => ({ id, layout: organelleLayout(cell.shape, id) }))
    .filter((o): o is { id: OrganelleId; layout: NonNullable<ReturnType<typeof organelleLayout>> } => o.layout !== null)

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900 sm:h-96">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [view.distance * 0.26, view.targetY + view.distance * 0.22, view.distance], fov: 42 }}
        onPointerMissed={clearAll}
        style={{ cursor: hovered ? 'pointer' : 'grab' }}
      >
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} />
        <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#9ec5fe" />

        <Suspense fallback={null}>
          <CellTransition trigger={cell.id}>
          <CellShell
            shape={cell.shape}
            hasCytosol={cell.organelles.includes('cytosol')}
            focus={focus}
            hovered={hovered}
            onHover={setHovered}
            onSelect={selectFromShell}
          />

          {drawn.map(({ id, layout }) => (
            <Organelle3D
              key={id}
              id={id}
              name={getOrganelle(id)?.name ?? id}
              layout={layout}
              sizeScale={cell.organelleScale[id] ?? 1}
              selected={focus === id}
              dimmed={focus !== null && focus !== id}
              hovered={hovered === id}
              onHover={(h) => setHovered(h)}
              onSelect={onSelectOrganelle}
            />
          ))}

          {protein && protein.organellePresent && (
            <ActivityFlow
              shape={cell.shape}
              organelle={protein.location}
              effect={protein.effect}
              knockedOut={protein.knockedOut}
              dimmed={focus !== null && focus !== protein.location}
            />
          )}

          {protein && copies > 0 && (
            <Protein3D
              // Remount on any change so the copies animate in again.
              key={`${protein.id}-${cell.id}-${protein.expression}`}
              proteinId={protein.id}
              shape={cell.shape}
              location={protein.location}
              primitive={protein.primitive}
              color={protein.color}
              baseCount={protein.baseCount}
              expression={protein.expression}
              dimmed={focus !== null && focus !== protein.location}
              knockedOut={protein.knockedOut}
            />
          )}
          </CellTransition>
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          target={[0, view.targetY, 0]}
          minDistance={radius * 1.1}
          maxDistance={view.distance * 2.2}
        />
      </Canvas>

      {labelName && (
        <p className="pointer-events-none absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-sm font-semibold text-slate-900 shadow">
          {labelName}
          {focus === labelId && <span className="ml-1 font-normal text-slate-600">· selected</span>}
        </p>
      )}
      {protein && (
        <p className="pointer-events-none absolute bottom-8 left-3 right-3 rounded-md bg-slate-950/80 px-2 py-1.5 text-xs text-slate-100 sm:bottom-2 sm:right-48">
          {protein.knockedOut ? (
            <>
              <span className="font-semibold">{protein.geneSymbol}</span> knocked out — no {protein.name} in this
              cell.
            </>
          ) : copies > 0 ? (
            <>
              <span className="font-semibold">{protein.geneSymbol}</span> → {protein.name} in the{' '}
              {getOrganelle(protein.location)?.name.toLowerCase() ?? protein.location}.{' '}
              <span className="text-slate-300">
                {copies} {copies === 1 ? 'copy' : 'copies'} drawn for a score of {protein.expression}/100 — an
                illustration, not a real count.
              </span>
            </>
          ) : protein.organellePresent ? (
            <>
              <span className="font-semibold">{protein.geneSymbol}</span> scores 0 in this cell type, so none of its
              protein is drawn.
            </>
          ) : (
            <>
              <span className="font-semibold">{protein.geneSymbol}</span>'s protein works in the{' '}
              {getOrganelle(protein.location)?.name.toLowerCase() ?? protein.location}, which this cell doesn't have.
            </>
          )}
        </p>
      )}
      <p className="pointer-events-none absolute bottom-2 right-3 text-xs text-slate-400">
        Drag to rotate · scroll to zoom · click a part
      </p>
    </div>
  )
}
