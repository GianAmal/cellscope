// The cell's outer shell. The shell IS the plasma membrane, so clicking it
// selects that organelle. It is drawn back-faces-only, which is the cutaway:
// the near wall disappears so you look straight inside. Three.js raycasting
// honours material.side, so clicks also pass through the near wall to the
// organelles behind it. The faint inner fill stands in for the cytosol.
import { useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { CellShape } from '../data/schema'
import { DIM_OPACITY, ORGANELLE_COLOR, SHELL_OPACITY } from './palette'
import { shellParts } from './shapes'

export interface CellShellProps {
  shape: CellShape
  hasCytosol: boolean
  membraneSelected: boolean
  cytosolSelected: boolean
  dimmed: boolean
  hovered: boolean
  onHover: (hovering: boolean) => void
  onSelect: () => void
}

export function CellShell({
  shape,
  hasCytosol,
  membraneSelected,
  cytosolSelected,
  dimmed,
  hovered,
  onHover,
  onSelect,
}: CellShellProps) {
  const parts = shellParts(shape)

  // Two materials: hollow parts you see into, solid parts you see.
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: ORGANELLE_COLOR.plasma_membrane,
        transparent: true,
        side: THREE.BackSide,
        roughness: 0.3,
        depthWrite: false,
      }),
    [],
  )

  const solidMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: ORGANELLE_COLOR.plasma_membrane,
        transparent: true,
        side: THREE.FrontSide,
        roughness: 0.35,
      }),
    [],
  )

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
    material.opacity = dimmed ? SHELL_OPACITY * 0.5 : membraneSelected || hovered ? 0.42 : SHELL_OPACITY
    material.emissive.set(membraneSelected ? ORGANELLE_COLOR.plasma_membrane : '#000000')
    material.emissiveIntensity = membraneSelected ? 0.5 : 0
    solidMaterial.opacity = dimmed ? 0.25 : membraneSelected || hovered ? 0.85 : 0.6
    solidMaterial.emissive.set(membraneSelected ? ORGANELLE_COLOR.plasma_membrane : '#000000')
    solidMaterial.emissiveIntensity = membraneSelected ? 0.4 : 0
    fill.opacity = cytosolSelected ? 0.5 : dimmed ? DIM_OPACITY * 0.3 : 0.12
  }, [material, solidMaterial, fill, dimmed, hovered, membraneSelected, cytosolSelected])

  return (
    <group>
      <group
        name="plasma_membrane"
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(true)
        }}
        onPointerOut={() => onHover(false)}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        {parts.map((p) => (
          <mesh
            key={p.key}
            geometry={p.geometry}
            material={p.solid ? solidMaterial : material}
            position={p.position}
            rotation={p.rotation}
          />
        ))}
      </group>

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
