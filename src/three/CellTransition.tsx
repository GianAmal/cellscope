// A short settle animation played whenever `trigger` changes — used when the
// cell type switches, so the new shell and its proteins arrive rather than
// snapping in. Not a vertex morph between shapes: the geometries are
// different meshes, so this is a scale-and-settle, which is honest about
// being a transition rather than pretending one cell deforms into another.
import { useEffect, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SECONDS = 0.4

export function CellTransition({ trigger, children }: { trigger: string; children: ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const elapsed = useRef(SECONDS)
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    elapsed.current = reduceMotion.current ? SECONDS : 0
  }, [trigger])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    if (elapsed.current >= SECONDS) {
      g.scale.setScalar(1)
      return
    }
    elapsed.current += delta
    const p = Math.min(elapsed.current / SECONDS, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    g.scale.setScalar(0.82 + 0.18 * eased)
  })

  return <group ref={group}>{children}</group>
}
