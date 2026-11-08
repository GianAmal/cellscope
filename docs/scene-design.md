# 3D scene design (Phase 3)

Decisions behind `src/three/`. Written before the scene was built, and updated
with what changed once it ran in a browser.

## Scene graph

```
<CellView>                     2D wrapper: heading, 3D on/off, <OrganelleList>
  └─ <CellScene cell>          Canvas, lights, OrbitControls, hover label
       ├─ <CellShell shape>    the shell IS the plasma membrane; also the cytosol fill
       └─ <Organelle3D id>     one per organelle that has a mesh
```

`CellScene` takes a whole `CellType` plus the selected organelle, and reports
clicks back out. It reads no gene, protein or expression value — those arrive
in Phase 4.

## What is a mesh, and what isn't

| Organelle | How it is drawn |
|---|---|
| nucleus, mitochondrion, er, golgi | Real meshes, from `layout.ts` |
| plasma_membrane | **The shell itself.** Clicking the shell selects it |
| cytosol | **The space inside.** A faint fill that brightens when selected |

Treating the membrane and cytosol as the container rather than as objects
floating inside it matches the biology and avoids two meshes that would sit on
top of everything else and swallow clicks.

## The cutaway

The shell is drawn **back-faces-only** (`side: THREE.BackSide`). The near wall
disappears, so you look straight into the cell. Two reasons this beat the
clipping plane tried first:

1. A clipping plane is fixed in world space, so it stops cutting as soon as you
   orbit around the cell.
2. Clipping affects rendering but **not** raycasting, so the invisible near wall
   still swallowed every click. Three.js raycasting *does* honour
   `material.side`, so back-faces-only makes clicks pass through to the
   organelles inside, which is what a reader expects.

Thin parts (a neuron's dendrites and axon) are `solid: true` and drawn
front-faces-only: there is nothing to look into, and back faces made them read
as flat spikes.

## Shape parameterization

`shape` in `cells.json` picks the geometry, in `shapes.ts`:

| shape | geometry | used by |
|---|---|---|
| `round` | sphere | hepatocyte, beta cell |
| `elongated` | capsule along X | skeletal muscle |
| `biconcave` | lathe of a dimpled profile | red blood cell |
| `branched` | sphere + 4 cones + axon cylinder | neuron |

Geometries are built once per shape and cached at module level, so switching
cell types allocates nothing new.

## Performance

Meshes per cell (all far under the 300 budget):
red blood cell 2 · round 15 · muscle 17 · neuron 20.

One material per organelle, shared by all its instances, updated in a layout
effect rather than recreated. `three` is a lazy chunk, so with 3D off the
browser never downloads it.

> Frame rate was not measured reliably: the automated browser pane runs the
> page in the background, which throttles animation. Needs a check on a real
> machine with the window in front.

## Accessibility and the 3D-off path

`OrganelleList` is the keyboard and screen-reader route to everything the scene
shows: real buttons, an `aria-live` region announcing the selection, and a list
of the organelles this cell type lacks. It shares one selection store with the
scene, so clicking a mesh and pressing a button do exactly the same thing. With
`?no3d=1` or the toggle, the canvas is gone and the list carries the page.

## Known rough edges

- The neuron's dendrites are stylized cones, not branching trees.
- The cutaway is subtle on the biconcave red blood cell, which has nothing
  inside it to reveal.
