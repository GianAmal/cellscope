// Cell shell geometry, parameterized by the `shape` field in cells.json.
// Stylized primitives and lathe geometry only — no imported model files, and
// no biology hard-coded here (the shape comes in as data).
import * as THREE from 'three'
import type { CellShape } from '../data/schema'

export interface ShellPart {
  key: string
  geometry: THREE.BufferGeometry
  position: [number, number, number]
  rotation?: [number, number, number]
  /**
   * Hollow parts are drawn back-faces-only: the near wall disappears so you
   * see the organelles inside. Thin processes (a neuron's dendrites and axon)
   * are solid instead — there is nothing to look into, and back faces make
   * them read as flat spikes.
   */
  solid?: boolean
}

/** Half-height of the cell, used to frame the camera. */
export const SHELL_RADIUS: Record<CellShape, number> = {
  round: 1.25,
  elongated: 1.9,
  branched: 1.95,
  biconcave: 1.35,
}

function biconcaveProfile(): THREE.Vector2[] {
  // Cross-section of a red blood cell: dimpled in the middle, thick at the rim.
  const pts: [number, number][] = [
    [0.0, 0.1],
    [0.3, 0.06],
    [0.6, 0.17],
    [0.85, 0.27],
    [1.0, 0.23],
    [1.08, 0.1],
    [1.08, -0.1],
    [1.0, -0.23],
    [0.85, -0.27],
    [0.6, -0.17],
    [0.3, -0.06],
    [0.0, -0.1],
  ]
  return pts.map(([x, y]) => new THREE.Vector2(x, y))
}

/**
 * Build the shell for a shape. Geometries are created once per shape and
 * cached, so switching cell types doesn't allocate new buffers each time.
 */
const cache = new Map<CellShape, ShellPart[]>()

export function shellParts(shape: CellShape): ShellPart[] {
  const hit = cache.get(shape)
  if (hit) return hit
  const parts = build(shape)
  cache.set(shape, parts)
  return parts
}

function build(shape: CellShape): ShellPart[] {
  switch (shape) {
    case 'round':
      return [{ key: 'body', geometry: new THREE.SphereGeometry(1.2, 48, 32), position: [0, 0, 0] }]

    case 'elongated':
      // A muscle fibre: long cylinder with rounded ends, lying along X.
      return [
        {
          key: 'body',
          geometry: new THREE.CapsuleGeometry(0.62, 2.4, 12, 32),
          position: [0, 0, 0],
          rotation: [0, 0, Math.PI / 2],
        },
      ]

    case 'biconcave':
      return [
        {
          key: 'body',
          geometry: new THREE.LatheGeometry(biconcaveProfile(), 48).scale(1.15, 1.15, 1.15),
          position: [0, 0, 0],
        },
      ]

    case 'branched': {
      // A neuron: round cell body, several tapering dendrites, one long axon.
      const soma = new THREE.SphereGeometry(0.68, 40, 28)
      const dendrite = new THREE.ConeGeometry(0.15, 0.8, 16)
      const axon = new THREE.CylinderGeometry(0.075, 0.11, 1.5, 16)
      const tip = new THREE.SphereGeometry(0.11, 14, 12)
      const angles = [-0.75, -0.1, 0.55, 1.2]
      const dendrites: ShellPart[] = angles.map((a, i) => {
        const dir = a + Math.PI / 2
        return {
          key: `dendrite-${i}`,
          geometry: dendrite,
          position: [Math.cos(dir) * 0.88, Math.sin(dir) * 0.88, i % 2 === 0 ? 0.12 : -0.12],
          rotation: [0, 0, dir - Math.PI / 2],
          solid: true,
        }
      })
      return [
        { key: 'soma', geometry: soma, position: [0, 0, 0] },
        ...dendrites,
        { key: 'axon', geometry: axon, position: [0.08, -1.25, 0], rotation: [0, 0, 0.05], solid: true },
        { key: 'axon-tip', geometry: tip, position: [0.14, -2.0, 0], solid: true },
      ]
    }
  }
}
