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

## Named parts of the outline

Pieces of a shell can carry a `partId` that matches an entry in the
`cellParts` list in `cells.json`. Those pieces become separately clickable and
labelled. A neuron has four: dendrites, cell body (soma), axon and axon
terminals; every other shape has none, so its whole outline selects the plasma
membrane as before.

Parts belong to a **shape**, not a cell type, so any future cell drawn
`branched` gets them for free. They are a separate list rather than new
`OrganelleId`s because they are regions of the cell itself, not organelles —
and like every other claim in the app, each one carries a sourced blurb.

Selecting a part and selecting an organelle are mutually exclusive: one thing
is highlighted at a time, in `cellPart` or `organelle` on the shared store.

Clicking the cell body is worth describing, because the cutaway makes it
subtle: the ray passes through the invisible near wall, hits an organelle if
one is behind that pixel, and otherwise lands on the body's far wall and
selects the soma. So clicking an organelle picks the organelle, and clicking
a clear patch of the body picks the body — which is what a reader expects.

## Proteins (Phase 4)

Selecting a gene draws its protein inside the organelle it works in.
`CellView` reads the selection, looks up the gene and its protein, and hands
`CellScene` plain values — organelle, colour, primitive, base count and this
gene's score **in the cell currently on screen**. No scene file names a gene,
a protein or an expression value.

- **How many.** `copies = max(1, round(visual.count × score / 100))`, and 0
  when the score is 0. The score is already log-scaled (see the curation
  README), so a straight proportion of it is the right relationship. A gene
  present at all gets at least one copy, so "a little" never looks like
  "none". Size also rises mildly with the score, so the difference reads at a
  glance.
- **Where.** `proteinLayout.ts` scatters them: on the mitochondria themselves,
  around the ER ring, by the Golgi stack, inside the nucleus, through the
  cytosol, or over the outer surface for membrane proteins. Positions come
  from a seeded PRNG keyed on the protein id, so they are stable across
  re-renders and differ between proteins.
- **Arriving.** Copies scale up with a short staggered ease, skipped entirely
  under `prefers-reduced-motion`.
- **Nothing to draw.** The caption says which case it is: a score of 0 here,
  or an organelle this cell type doesn't have (a mitochondrial protein in a
  mature red blood cell). Silence would read as a bug.
- **Honesty.** The caption always says the copies are an illustration, not a
  real count, next to the score it was derived from.

Switching cell type plays a short scale-and-settle (`CellTransition`). It is
**not** a vertex morph between shapes — the geometries are different meshes —
and the code says so rather than implying the cell deforms.

## Knockouts (Phase 5)

Knocking a gene out fades its protein out of the cell and changes what the
organelle is doing. The second half is the part that can be wrong, so it is
driven entirely by data rather than by the scene:

- `organelles[].activity.label` says what the drifting particles represent —
  one process per organelle, sourced.
- `proteins[].knockout.effect` says what losing *that one protein* does to
  *that* process: `stops`, `reduces` or `unchanged`, with a sourced claim and
  a confidence level.

`unchanged` is a first-class answer and the common one. Most cells have other
isoforms or parallel routes, so losing one protein rarely halts an organelle.
A scene that always stopped the animation would teach something false, so
`ActivityFlow` reads the effect and keeps running when the sources say the job
carries on. The panel says the same thing in words.

`knockout.effect` is one value per protein, applied to whichever cell type is
on screen. It cannot say "stops in a red blood cell, barely matters in a
neuron". That is acceptable for the current 14 genes but is a real ceiling —
see docs/curation/factcheck-phase5.md.

The protein itself always fades out — that part is just "this cell no longer
makes it", which is true by construction.

Knockout is per selected gene and clears whenever the gene changes, so it can
never silently carry over to a gene the reader did not knock out.

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
- The curated soma blurb places "adding up incoming signals" in the cell body.
  Sources put summation precisely at the axon hillock, a structure within the
  cell body. A deliberate coarsening; worth revisiting if a fifth part is added.
- The cutaway is subtle on the biconcave red blood cell, which has nothing
  inside it to reveal.
