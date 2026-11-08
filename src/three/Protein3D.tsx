// The selected gene's protein, drawn inside the organelle it works in.
//
// Nothing biological is decided here: the organelle, colour, shape and base
// count all arrive as props from cells.json, and the number of copies comes
// from this gene's expression score in the cell currently on screen.
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { CellShape, OrganelleId, ProteinPrimitive } from '../data/schema'
import { PROTEIN_GEOMETRY, copiesFor, proteinPlacements, sizeFor } from './proteinLayout'

const GROW_SECONDS = 0.45
const STAGGER_SECONDS = 0.035

export interface Protein3DProps {
  /** Protein id — also seeds the scatter, so each protein sits differently. */
  proteinId: string
  shape: CellShape
  location: OrganelleId
  primitive: ProteinPrimitive
  color: string
  /** `visual.count`: copies drawn at a score of 100. */
  baseCount: number
  /** This gene's 0-100 score in the cell on screen. */
  expression: number
  dimmed: boolean
}

export function Protein3D({
  proteinId,
  shape,
  location,
  primitive,
  color,
  baseCount,
  expression,
  dimmed,
}: Protein3DProps) {
  const group = useRef<THREE.Group>(null)
  const elapsed = useRef(0)

  const copies = copiesFor(baseCount, expression)
  const size = sizeFor(expression)

  const placements = useMemo(
    () => proteinPlacements(shape, location, copies, proteinId),
    [shape, location, copies, proteinId],
  )

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.3,
        roughness: 0.35,
        transparent: true,
      }),
    [color],
  )

  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // Grow each copy in, slightly staggered, so you can see them arrive.
  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    material.opacity = dimmed ? 0.45 : 1
    if (reduceMotion) {
      for (const child of g.children) child.scale.setScalar(size)
      return
    }
    elapsed.current += delta
    let settled = true
    g.children.forEach((child, i) => {
      const t = (elapsed.current - i * STAGGER_SECONDS) / GROW_SECONDS
      const p = Math.min(Math.max(t, 0), 1)
      if (p < 1) settled = false
      // Ease out, with a small overshoot so copies pop into place.
      const eased = 1 - Math.pow(1 - p, 3)
      const overshoot = p < 1 ? 1 + Math.sin(p * Math.PI) * 0.18 : 1
      child.scale.setScalar(size * eased * overshoot)
    })
    if (settled) elapsed.current = GROW_SECONDS + g.children.length * STAGGER_SECONDS
  })

  if (copies === 0) return null

  return (
    <group ref={group} name={`protein-${proteinId}`}>
      {placements.map((p, i) => (
        <mesh
          key={i}
          geometry={PROTEIN_GEOMETRY[primitive]}
          material={material}
          position={p.position}
          rotation={p.rotation}
          scale={0}
          raycast={() => null}
        />
      ))}
    </group>
  )
}
