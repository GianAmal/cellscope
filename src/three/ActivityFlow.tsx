// A few drifting particles standing for the one process an organelle is
// animated doing — glucose crossing the membrane, ATP leaving the
// mitochondria, RNA leaving the nucleus, and so on.
//
// What the particles mean, and what losing a protein does to them, are both
// data (`organelles[].activity` and `proteins[].knockout.effect`). This file
// only draws the motion. Knocking a gene out does not automatically stop the
// flow: a protein whose loss the sources say is covered by others keeps it
// running.
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { CellShape, KnockoutEffect, OrganelleId } from '../data/schema'
import { golgiAt, mitochondria, nucleusAt } from './layout'

const PARTICLES = 8
const GEOMETRY = new THREE.SphereGeometry(0.045, 10, 8)

/** Speed multiplier once the gene is knocked out. */
const SPEED_WHEN_LOST: Record<KnockoutEffect, number> = {
  stops: 0,
  reduces: 0.3,
  unchanged: 1,
}

interface Path {
  from: THREE.Vector3
  to: THREE.Vector3
  offset: number
}

export interface ActivityFlowProps {
  shape: CellShape
  organelle: OrganelleId
  effect: KnockoutEffect
  knockedOut: boolean
  dimmed: boolean
}

export function ActivityFlow({ shape, organelle, effect, knockedOut, dimmed }: ActivityFlowProps) {
  const group = useRef<THREE.Group>(null)
  const time = useRef(0)
  const speed = useRef(1)

  const paths = useMemo(() => buildPaths(shape, organelle), [shape, organelle])
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#F0E442', // Okabe-Ito yellow: reads as "stuff moving", not an organelle
        transparent: true,
      }),
    [],
  )

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    // Ease between running and stopped, so it slows rather than snapping.
    const target = knockedOut ? SPEED_WHEN_LOST[effect] : 1
    speed.current += (target - speed.current) * Math.min(delta * 3, 1)
    time.current += delta * 0.35 * speed.current

    material.opacity = (dimmed ? 0.3 : 0.9) * (0.35 + 0.65 * speed.current)

    g.children.forEach((child, i) => {
      const p = paths[i]
      const t = (time.current + p.offset) % 1
      child.position.lerpVectors(p.from, p.to, t)
      // Fade in and out at the ends so they don't pop.
      const edge = Math.min(t, 1 - t) / 0.18
      child.scale.setScalar(Math.min(edge, 1))
    })
  })

  return (
    <group ref={group} name={`activity-${organelle}`}>
      {paths.map((_, i) => (
        <mesh key={i} geometry={GEOMETRY} material={material} raycast={() => null} />
      ))}
    </group>
  )
}

function buildPaths(shape: CellShape, organelle: OrganelleId): Path[] {
  const v = (a: [number, number, number]) => new THREE.Vector3(...a)
  const out: Path[] = []

  for (let i = 0; i < PARTICLES; i++) {
    const a = (i / PARTICLES) * Math.PI * 2
    const offset = i / PARTICLES
    const inner = interiorPoint(shape, a, i)

    switch (organelle) {
      // Molecules crossing in from outside.
      case 'plasma_membrane':
        out.push({ from: surfacePoint(shape, a, 1.55), to: v(inner), offset })
        break
      // ATP leaving the mitochondria.
      case 'mitochondrion': {
        const hosts = mitochondria(shape)
        out.push({ from: v(hosts[i % hosts.length].position), to: v(inner), offset })
        break
      }
      // RNA copies leaving the nucleus.
      case 'nucleus':
        out.push({ from: v(nucleusAt(shape)), to: v(inner), offset })
        break
      // New proteins travelling from the ER towards the Golgi.
      case 'er': {
        const [nx, ny, nz] = nucleusAt(shape)
        out.push({
          from: new THREE.Vector3(nx + Math.cos(a) * 0.5, ny, nz + Math.sin(a) * 0.4),
          to: v(golgiAt(shape)),
          offset,
        })
        break
      }
      // Vesicles shipping out from the Golgi to the surface.
      case 'golgi':
        out.push({ from: v(golgiAt(shape)), to: surfacePoint(shape, a, 1.0), offset })
        break
      // Sugar being broken down as it drifts through the cytosol.
      case 'cytosol':
        out.push({ from: v(interiorPoint(shape, a + Math.PI, i)), to: v(inner), offset })
        break
    }
  }
  return out
}

function interiorPoint(shape: CellShape, a: number, i: number): [number, number, number] {
  const wobble = ((i % 3) - 1) * 0.22
  switch (shape) {
    case 'elongated':
      return [Math.cos(a) * 1.15, Math.sin(a) * 0.3 + wobble * 0.3, Math.sin(a * 1.7) * 0.28]
    case 'biconcave':
      return [Math.cos(a) * 0.8, wobble * 0.1, Math.sin(a) * 0.8]
    case 'branched':
      return [Math.cos(a) * 0.4, Math.sin(a) * 0.4 + wobble * 0.2, Math.sin(a * 1.3) * 0.3]
    case 'round':
      return [Math.cos(a) * 0.8, Math.sin(a) * 0.7 + wobble * 0.2, Math.sin(a * 1.4) * 0.6]
  }
}

function surfacePoint(shape: CellShape, a: number, scale: number): THREE.Vector3 {
  switch (shape) {
    case 'elongated':
      return new THREE.Vector3(Math.cos(a) * 1.5 * scale, Math.sin(a) * 0.75 * scale, Math.cos(a * 1.6) * 0.5 * scale)
    case 'biconcave':
      return new THREE.Vector3(Math.cos(a) * 1.15 * scale, Math.sin(a * 2) * 0.18 * scale, Math.sin(a) * 1.15 * scale)
    case 'branched':
      return new THREE.Vector3(Math.cos(a) * 0.75 * scale, Math.sin(a) * 0.75 * scale, Math.sin(a * 1.5) * 0.5 * scale)
    case 'round':
      return new THREE.Vector3(Math.cos(a) * 1.25 * scale, Math.sin(a) * 1.15 * scale, Math.sin(a * 1.3) * 0.9 * scale)
  }
}
