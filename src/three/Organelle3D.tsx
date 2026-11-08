// One organelle, drawn as however many instances its layout calls for.
// Named so it can be highlighted, dimmed or clicked on its own.
import { useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { OrganelleId } from '../data/schema'
import { DIM_OPACITY, NORMAL_OPACITY, ORGANELLE_COLOR } from './palette'
import type { OrganelleLayout } from './layout'

export interface Organelle3DProps {
  id: OrganelleId
  name: string
  layout: OrganelleLayout
  /** Size multiplier from cellTypes[].organelleScale (1 = default). */
  sizeScale: number
  selected: boolean
  dimmed: boolean
  hovered: boolean
  onHover: (id: OrganelleId | null) => void
  onSelect: (id: OrganelleId) => void
}

export function Organelle3D({
  id,
  name,
  layout,
  sizeScale,
  selected,
  dimmed,
  hovered,
  onHover,
  onSelect,
}: Organelle3DProps) {
  const color = ORGANELLE_COLOR[id]

  // One material per visual state, reused across this organelle's instances.
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.45,
      metalness: 0.02,
      transparent: true,
    })
    return m
  }, [color])

  useLayoutEffect(() => {
    material.opacity = dimmed ? DIM_OPACITY : NORMAL_OPACITY
    material.emissive.set(selected || hovered ? color : '#000000')
    material.emissiveIntensity = selected ? 0.55 : hovered ? 0.3 : 0
  }, [material, color, dimmed, selected, hovered])

  const grow = (selected ? 1.12 : hovered ? 1.06 : 1) * sizeScale

  return (
    <group
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
      {layout.instances.map((inst, i) => (
        <mesh
          key={`${id}-${i}`}
          geometry={layout.geometry}
          material={material}
          position={inst.position}
          rotation={inst.rotation}
          scale={(inst.scale ?? 1) * grow}
          // Labels for assistive tech live in the 2D organelle list, which
          // drives the same selection state as these meshes.
          userData={{ organelle: id, label: name }}
        />
      ))}
    </group>
  )
}
