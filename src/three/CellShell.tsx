// The cell's outer shell.
//
// Pieces tagged with a `partId` (a neuron's dendrites, cell body, axon and
// axon terminals) are separately clickable and labelled from cells.json.
// Untagged pieces are just the boundary, and select the plasma membrane.
//
// Hollow pieces are drawn back-faces-only: the near wall disappears so you see
// the organelles inside, and because three.js raycasting honours
// `material.side`, clicks pass through it to them. Thin pieces are solid —
// there is nothing to look into, and back faces make them read as flat spikes.
import { useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { CellShape } from '../data/schema'
import { DIM_OPACITY, ORGANELLE_COLOR, SHELL_OPACITY } from './palette'
import { shellParts, type ShellPart } from './shapes'

export const MEMBRANE = 'plasma_membrane'

export interface CellShellProps {
  shape: CellShape
  hasCytosol: boolean
  /** The selected organelle id or cell-part id. */
  focus: string | null
  hovered: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
}

/** Pieces grouped by what clicking them selects. */
function groupParts(parts: ShellPart[]): Map<string, ShellPart[]> {
  const groups = new Map<string, ShellPart[]>()
  for (const p of parts) {
    const id = p.partId ?? MEMBRANE
    const list = groups.get(id)
    if (list) list.push(p)
    else groups.set(id, [p])
  }
  return groups
}

export function CellShell({ shape, hasCytosol, focus, hovered, onHover, onSelect }: CellShellProps) {
  const parts = shellParts(shape)
  const groups = useMemo(() => groupParts(parts), [parts])

  // One material per group and face-side, reused across renders; only their
  // mutable fields change when the selection does.
  const materials = useMemo(() => {
    const m = new Map<string, THREE.MeshStandardMaterial>()
    for (const [id, list] of groupParts(parts)) {
      for (const solid of [false, true]) {
        if (list.some((p) => Boolean(p.solid) === solid)) m.set(`${id}:${solid}`, buildMaterial(solid))
      }
    }
    return m
  }, [parts])

  const fill = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ORGANELLE_COLOR.cytosol,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  )

  useLayoutEffect(() => {
    for (const [key, mat] of materials) {
      const id = key.slice(0, key.lastIndexOf(':'))
      const solid = key.endsWith(':true')
      // Selecting the plasma membrane lights up the whole boundary.
      const active = focus === id || focus === MEMBRANE
      const warm = active || hovered === id
      const dim = focus !== null && !active
      mat.opacity = solid ? (dim ? 0.22 : warm ? 0.9 : 0.6) : dim ? SHELL_OPACITY * 0.5 : warm ? 0.42 : SHELL_OPACITY
      mat.emissive.set(active ? ORGANELLE_COLOR.plasma_membrane : '#000000')
      mat.emissiveIntensity = active ? (solid ? 0.45 : 0.5) : 0
    }
    fill.opacity = focus === 'cytosol' ? 0.5 : focus !== null ? DIM_OPACITY * 0.3 : 0.12
  }, [materials, fill, focus, hovered])

  return (
    <group>
      {[...groups].map(([id, list]) => (
        <group
          key={id}
          name={id}
          onPointerOver={(e) => {
            e.stopPropagation()
            onHover(id)
          }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(id)
          }}
        >
          {list.map((p) => (
            <mesh
              key={p.key}
              geometry={p.geometry}
              material={materials.get(`${id}:${Boolean(p.solid)}`)}
              position={p.position}
              rotation={p.rotation}
              scale={focus === id && id !== MEMBRANE ? 1.06 : 1}
            />
          ))}
        </group>
      ))}

      {hasCytosol &&
        parts
          .filter((p) => !p.solid)
          .map((p) => (
            <mesh
              key={`fill-${p.key}`}
              geometry={p.geometry}
              material={fill}
              position={p.position}
              rotation={p.rotation}
              scale={0.97}
              raycast={() => null}
            />
          ))}
    </group>
  )
}

function buildMaterial(solid: boolean) {
  return new THREE.MeshStandardMaterial({
    color: ORGANELLE_COLOR.plasma_membrane,
    transparent: true,
    side: solid ? THREE.FrontSide : THREE.BackSide,
    roughness: solid ? 0.35 : 0.3,
    depthWrite: false,
  })
}
