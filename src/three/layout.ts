// Where each organelle sits inside each cell shape, and what it is drawn as.
// Positions are a stylized teaching layout, not measured anatomy (the
// "shapes_stylized" reading note says so in the UI). Which organelles appear,
// and how big they are, comes from cells.json.
import * as THREE from 'three'
import type { CellShape, OrganelleId } from '../data/schema'

export interface Instance {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export interface OrganelleLayout {
  geometry: THREE.BufferGeometry
  instances: Instance[]
}

// Geometries are module-level singletons: every cell type reuses them.
const geo = {
  nucleus: new THREE.SphereGeometry(0.4, 32, 24),
  mito: new THREE.CapsuleGeometry(0.1, 0.22, 8, 16),
  er: new THREE.TorusGeometry(0.56, 0.05, 10, 44),
  golgi: new THREE.CylinderGeometry(0.24, 0.24, 0.035, 28),
}

const ring = (n: number, r: number, y: number, jitter = 0): Instance[] =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return {
      position: [Math.cos(a) * r, y + (i % 2 ? jitter : -jitter), Math.sin(a) * r] as [number, number, number],
      rotation: [0, -a, Math.PI / 3] as [number, number, number],
    }
  })

const stack = (n: number, at: [number, number, number], gap = 0.07): Instance[] =>
  Array.from({ length: n }, (_, i) => ({
    position: [at[0], at[1] + i * gap, at[2]] as [number, number, number],
    rotation: [0.25, 0, 0.12] as [number, number, number],
    scale: 1 - i * 0.12,
  }))

/** Layout for one organelle inside one shape. Returns null if it isn't drawn. */
export function organelleLayout(shape: CellShape, id: OrganelleId): OrganelleLayout | null {
  switch (id) {
    case 'nucleus':
      return { geometry: geo.nucleus, instances: [{ position: nucleusAt(shape) }] }

    case 'mitochondrion':
      return { geometry: geo.mito, instances: mitochondria(shape) }

    case 'er': {
      const [x, y, z] = nucleusAt(shape)
      return {
        geometry: geo.er,
        instances: [
          { position: [x, y, z], rotation: [1.25, 0.2, 0] },
          { position: [x, y + 0.05, z], rotation: [1.0, 1.1, 0.3], scale: 0.82 },
        ],
      }
    }

    case 'golgi':
      return { geometry: geo.golgi, instances: stack(4, golgiAt(shape)) }

    // The shell itself is the plasma membrane, and the cytosol is the space
    // everything sits in — both are handled by <CellShell>, not as meshes here.
    case 'plasma_membrane':
    case 'cytosol':
      return null
  }
}

function nucleusAt(shape: CellShape): [number, number, number] {
  switch (shape) {
    case 'elongated':
      return [-0.95, 0.3, 0] // muscle fibres push their nuclei to the edge
    case 'branched':
      return [0, 0.05, 0]
    default:
      return [0, 0.08, 0]
  }
}

function golgiAt(shape: CellShape): [number, number, number] {
  switch (shape) {
    case 'elongated':
      return [0.45, -0.2, 0.1]
    case 'branched':
      return [-0.3, -0.3, 0.12]
    default:
      return [0.55, -0.45, 0.15]
  }
}

function mitochondria(shape: CellShape): Instance[] {
  switch (shape) {
    case 'elongated':
      // Spread along the fibre, in two rows.
      return Array.from({ length: 8 }, (_, i) => ({
        position: [-1.2 + i * 0.35, i % 2 ? 0.32 : -0.32, i % 3 === 0 ? 0.22 : -0.18] as [number, number, number],
        rotation: [0, 0, Math.PI / 2] as [number, number, number],
      }))
    case 'branched':
      // All inside the cell body: the dendrites and axon are too thin to hold
      // a mitochondrion at this scale, and one drawn there looks like it is
      // floating outside the cell.
      return ring(5, 0.4, -0.05, 0.1)
    default:
      return ring(6, 0.78, -0.05, 0.14)
  }
}
