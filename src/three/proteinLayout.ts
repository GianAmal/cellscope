// Where a protein's copies are scattered inside a cell.
//
// Positions are deterministic: the same gene in the same cell always lands in
// the same places, so re-rendering never makes the scene jitter. They are a
// stylized teaching layout, not measured positions — the "shapes_stylized"
// reading note tells the reader so.
import * as THREE from 'three'
import type { CellShape, OrganelleId, ProteinPrimitive } from '../data/schema'
import { golgiAt, mitochondria, nucleusAt } from './layout'

/** Small, fast, seeded PRNG (mulberry32) so layouts are reproducible. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Stable seed from a string, so each protein scatters differently. */
function seedFrom(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export const PROTEIN_GEOMETRY: Record<ProteinPrimitive, THREE.BufferGeometry> = {
  cluster: new THREE.IcosahedronGeometry(0.075, 1),
  sphere: new THREE.SphereGeometry(0.085, 16, 12),
  rod: new THREE.CapsuleGeometry(0.035, 0.13, 6, 12),
  ring: new THREE.TorusGeometry(0.075, 0.026, 10, 20),
}

/** Roughly how far the inside of each shape extends, for scattering. */
const INTERIOR: Record<CellShape, { x: number; y: number; z: number }> = {
  round: { x: 0.95, y: 0.95, z: 0.95 },
  elongated: { x: 1.35, y: 0.4, z: 0.4 },
  biconcave: { x: 0.9, y: 0.12, z: 0.9 },
  branched: { x: 0.45, y: 0.45, z: 0.45 },
}

export interface ProteinPlacement {
  position: [number, number, number]
  rotation: [number, number, number]
}

/**
 * `count` placements for a protein living in `location`, inside `shape`.
 * `key` seeds the scatter (pass the protein id) so it is stable but differs
 * between proteins.
 */
export function proteinPlacements(
  shape: CellShape,
  location: OrganelleId,
  count: number,
  key: string,
): ProteinPlacement[] {
  const rand = rng(seedFrom(`${key}:${shape}:${location}`))
  const spin = (): [number, number, number] => [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI]
  const out: ProteinPlacement[] = []

  for (let i = 0; i < count; i++) {
    out.push({ position: pick(shape, location, i, rand), rotation: spin() })
  }
  return out
}

function pick(
  shape: CellShape,
  location: OrganelleId,
  i: number,
  rand: () => number,
): [number, number, number] {
  const jitter = (r: number) => (rand() - 0.5) * 2 * r

  switch (location) {
    case 'nucleus': {
      const [x, y, z] = nucleusAt(shape)
      return [x + jitter(0.26), y + jitter(0.26), z + jitter(0.26)]
    }
    case 'golgi': {
      const [x, y, z] = golgiAt(shape)
      return [x + jitter(0.22), y + 0.1 + jitter(0.12), z + jitter(0.22)]
    }
    case 'mitochondrion': {
      // Sit on the mitochondria themselves, cycling through them.
      const hosts = mitochondria(shape)
      const host = hosts[i % hosts.length].position
      return [host[0] + jitter(0.13), host[1] + jitter(0.13), host[2] + jitter(0.13)]
    }
    case 'er': {
      // Around the ER ring, which encircles the nucleus.
      const [x, y, z] = nucleusAt(shape)
      const a = rand() * Math.PI * 2
      const r = 0.5 + jitter(0.07)
      return [x + Math.cos(a) * r, y + jitter(0.3), z + Math.sin(a) * r * 0.75]
    }
    case 'plasma_membrane':
      return onSurface(shape, rand)
    case 'cytosol': {
      const b = INTERIOR[shape]
      return [jitter(b.x), jitter(b.y), jitter(b.z)]
    }
  }
}

/** A point on (or just inside) the cell's outer surface. */
function onSurface(shape: CellShape, rand: () => number): [number, number, number] {
  const a = rand() * Math.PI * 2
  switch (shape) {
    case 'elongated': {
      // Around the barrel of the fibre.
      const x = (rand() - 0.5) * 2.4
      return [x, Math.sin(a) * 0.6, Math.cos(a) * 0.6]
    }
    case 'biconcave': {
      const r = 1.05 + (rand() - 0.5) * 0.08
      return [Math.cos(a) * r, (rand() - 0.5) * 0.3, Math.sin(a) * r]
    }
    case 'branched': {
      // On the cell body, where the scale makes them readable.
      const t = Math.acos(2 * rand() - 1)
      return [Math.sin(t) * Math.cos(a) * 0.66, Math.cos(t) * 0.66, Math.sin(t) * Math.sin(a) * 0.66]
    }
    case 'round': {
      const t = Math.acos(2 * rand() - 1)
      return [Math.sin(t) * Math.cos(a) * 1.16, Math.cos(t) * 1.16, Math.sin(t) * Math.sin(a) * 1.16]
    }
  }
}

/**
 * How many copies to draw for an expression score.
 *
 * The score is already a log-scaled 0-100 value (see docs/curation/README.md),
 * so this is a plain proportion of the protein's own `visual.count`. A gene
 * that is present at all gets at least one copy, so "a little" never looks
 * identical to "none".
 */
export function copiesFor(baseCount: number, expression: number): number {
  if (expression <= 0) return 0
  return Math.max(1, Math.round((baseCount * expression) / 100))
}

/** Mild size change on top of the count, so strong expression reads clearly. */
export function sizeFor(expression: number): number {
  return 0.8 + (0.45 * Math.min(expression, 100)) / 100
}
