// The 3D cell. Everything it draws comes from cells.json via props: which
// organelles exist, how big they are, and the cell's shape. No gene, protein
// or expression value is referenced here (those arrive in Phase 4).
import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { CellType, OrganelleId } from '../data/schema'
import { getOrganelle } from '../data'
import { CellShell } from './CellShell'
import { Organelle3D } from './Organelle3D'
import { organelleLayout } from './layout'
import { SHELL_RADIUS } from './shapes'

export interface CellSceneProps {
  cell: CellType
  selected: OrganelleId | null
  onSelect: (id: OrganelleId | null) => void
}

export function CellScene({ cell, selected, onSelect }: CellSceneProps) {
  const [hovered, setHovered] = useState<OrganelleId | null>(null)
  const radius = SHELL_RADIUS[cell.shape]
  const label = hovered ?? selected
  const labelName = label ? (getOrganelle(label)?.name ?? label) : null

  const drawn = cell.organelles
    .map((id) => ({ id, layout: organelleLayout(cell.shape, id) }))
    .filter((o): o is { id: OrganelleId; layout: NonNullable<ReturnType<typeof organelleLayout>> } => o.layout !== null)

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900 sm:h-96">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [radius * 0.5, radius * 0.45, radius * 2.0], fov: 42 }}
        onPointerMissed={() => onSelect(null)}
        style={{ cursor: hovered ? 'pointer' : 'grab' }}
      >
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} />
        <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#9ec5fe" />

        <Suspense fallback={null}>
          <CellShell
            shape={cell.shape}
            hasCytosol={cell.organelles.includes('cytosol')}
            membraneSelected={selected === 'plasma_membrane'}
            cytosolSelected={selected === 'cytosol'}
            dimmed={selected !== null && selected !== 'plasma_membrane' && selected !== 'cytosol'}
            hovered={hovered === 'plasma_membrane'}
            onHover={(h) => setHovered(h ? 'plasma_membrane' : null)}
            onSelect={() => onSelect('plasma_membrane')}
          />

          {drawn.map(({ id, layout }) => (
            <Organelle3D
              key={id}
              id={id}
              name={getOrganelle(id)?.name ?? id}
              layout={layout}
              sizeScale={cell.organelleScale[id] ?? 1}
              selected={selected === id}
              dimmed={selected !== null && selected !== id}
              hovered={hovered === id}
              onHover={setHovered}
              onSelect={onSelect}
            />
          ))}
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={radius * 1.1}
          maxDistance={radius * 5}
        />
      </Canvas>

      {labelName && (
        <p className="pointer-events-none absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-sm font-semibold text-slate-900 shadow">
          {labelName}
          {selected === label && <span className="ml-1 font-normal text-slate-600">· selected</span>}
        </p>
      )}
      <p className="pointer-events-none absolute bottom-2 right-3 text-xs text-slate-400">
        Drag to rotate · scroll to zoom · click a part
      </p>
    </div>
  )
}
