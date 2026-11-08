// Colors for the 3D scene. One place, so the scene and the 2D organelle list
// always agree. Based on the Okabe-Ito colorblind-safe palette; color is never
// the only signal (every organelle also carries a text label).
import type { OrganelleId } from '../data/schema'

export const ORGANELLE_COLOR: Record<OrganelleId, string> = {
  nucleus: '#0072B2', // blue
  cytosol: '#CFE8F5', // pale blue — the fluid the other parts sit in
  plasma_membrane: '#56B4E9', // sky
  mitochondrion: '#D55E00', // vermillion
  er: '#009E73', // green
  golgi: '#E69F00', // orange
}

/** Dimmed opacity for organelles that are not the selected one. */
export const DIM_OPACITY = 0.3
export const NORMAL_OPACITY = 0.95
export const SHELL_OPACITY = 0.17
