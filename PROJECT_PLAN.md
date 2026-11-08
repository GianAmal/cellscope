# CellScope — Project Plan

An interactive 3D explainer showing how genes produce proteins, and how those
proteins change what a cell does — and how the same gene behaves differently in
different cell types.

**This file is the standing spec.** Claude Code should read it at the start of
each session and follow the current phase. Update the checkboxes as you go.

---

## 0. Ground rules for Claude Code

- Work **one phase at a time**. Do not skip ahead. Each phase ends in a working,
  committed state.
- Biology accuracy beats features. Every biological claim must trace to a cited
  source (UniProt, NCBI Gene, Human Protein Atlas, or a named textbook).
  **Never invent gene/protein facts.** If unsure, say so and leave a `TODO`.
- This is a **teaching tool**, not a simulator. No molecular dynamics, no real
  physics. Stylized, labeled, animated — optimized for a smart 15-year-old who
  has had one biology class.
- Keep the 2D version fully functional at all times. 3D is a layer on top, never
  a replacement.
- Prefer boring, well-documented libraries over clever ones.

---

## 1. Scope (locked — do not expand without asking)

**Theme:** *How a cell makes and uses energy, and how the same genes play
different roles in different cells.*

- **5 cell types:** neuron, skeletal muscle cell, liver hepatocyte, red blood
  cell, pancreatic beta cell
- **12–15 genes**, each with exactly one associated protein
- **6 organelle locations** proteins can occupy: `nucleus`, `cytosol`,
  `plasma_membrane`, `mitochondrion`, `er`, `golgi`

Anything beyond this is Phase 7+ and out of scope for v1.

---

## 2. Stack

| Layer | Choice | Why |
|---|---|---|
| Build | Vite | Fast, zero-config |
| Language | TypeScript | Catches data-shape mistakes early |
| UI | React | Lots of docs; easy for an AI to edit safely |
| 3D | `three` + `@react-three/fiber` + `@react-three/drei` | Declarative 3D; far easier to modify than raw Three.js |
| Charts | Recharts | Simple bar charts for expression levels |
| Styling | Tailwind CSS | No separate CSS files to drift |
| Data | A single hand-curated `src/data/cells.json` | Version-controlled, reviewable, no backend |
| Deploy | GitHub Pages or Netlify | Free, static |

**No backend. No database. No API keys.** Everything ships as static files.

---

## 3. Custom agents to create

Create these in `.claude/agents/` before Phase 1. Each is a markdown file with
YAML frontmatter.

### `.claude/agents/bio-curator.md`
```yaml
---
name: bio-curator
description: Researches and writes biologically accurate gene/protein/cell-type data entries with cited sources. Use for any task that adds or edits content in src/data/cells.json.
tools: WebSearch, WebFetch, Read, Write, Edit
---
You curate biology content for a high-school-level educational app.

For each gene you are asked to add:
1. Look up the gene on NCBI Gene and UniProt. Confirm the official symbol and
   full name.
2. Confirm the protein's subcellular location from UniProt. Map it to one of:
   nucleus, cytosol, plasma_membrane, mitochondrion, er, golgi.
3. Check relative expression across cell types using the Human Protein Atlas.
   Record approximate values on a 0-100 scale, not raw nTPM.
4. Write a `plainSummary` (max 25 words) and a `whatHappensIfBroken` (max 30
   words) in language a 15-year-old understands. No jargon without a gloss.
5. Record every URL you used in the `sources` array.

Rules:
- If you cannot verify a fact from a primary source, write "TODO: verify" rather
  than guessing. Never fabricate an expression value or a location.
- Expression numbers are illustrative and must be labeled as approximate in the
  UI. Do not imply experimental precision.
- Report back: which genes you added, which facts you could not verify.
```

### `.claude/agents/bio-factcheck.md`
```yaml
---
name: bio-factcheck
description: Independently verifies biology claims in src/data/cells.json against primary sources. Use at the end of each phase that touches data. Must not have written the data it checks.
tools: WebSearch, WebFetch, Read
---
You are an independent reviewer. You did not write this data.

Read src/data/cells.json. For every gene and protein entry, independently verify
against UniProt / NCBI Gene / Human Protein Atlas:
- Is the gene symbol official and current?
- Is the stated protein the correct product of that gene?
- Is the subcellular location correct?
- Is the expression pattern across cell types directionally right? (Exact
  numbers need not match; a gene marked high in muscle must actually be high in
  muscle.)
- Is the plain-language summary accurate, or does simplifying make it wrong?

Output a table: entry | claim | verdict (CONFIRMED / WRONG / UNVERIFIABLE) |
source URL | suggested fix.

Do not edit any files. Report only. Be blunt about errors — a wrong fact in a
teaching tool is worse than a missing one.
```

### `.claude/agents/scene-builder.md`
```yaml
---
name: scene-builder
description: Builds and modifies the react-three-fiber 3D scene — cell shells, organelles, protein meshes, camera, animations. Use for all work under src/three/.
tools: Read, Write, Edit, Bash, Glob, Grep
---
You build the 3D layer with react-three-fiber.

Constraints:
- Stylized and readable, not photorealistic. Primitives and lathe/extrude
  geometry only — no imported 3D model files.
- Every organelle must be a separate named component so it can be highlighted,
  dimmed, or clicked independently.
- All geometry and colors come from props driven by src/data/cells.json. Never
  hard-code a gene, protein, or expression value in a scene file.
- Target 60fps on a 5-year-old laptop. Reuse geometries and materials; keep the
  total mesh count under ~300.
- Every interactive mesh needs a cursor change on hover and an accessible label.
- Animations use @react-three/drei helpers or simple useFrame lerps. No physics
  engine.

After each change, run the build and report any TypeScript or console errors.
```

### `.claude/agents/ui-builder.md`
```yaml
---
name: ui-builder
description: Builds the 2D React interface — gene browser, protein cards, expression charts, comparison views, panels around the 3D canvas. Use for all work under src/components/.
tools: Read, Write, Edit, Bash, Glob, Grep
---
You build the 2D UI in React + Tailwind.

Constraints:
- The app must stay fully usable with the 3D canvas disabled. Treat 3D as
  enhancement.
- Every number shown must carry its unit and a note that expression values are
  approximate and illustrative.
- Keyboard navigable: every clickable thing is a real button or link, focus
  states visible.
- Colorblind-safe palette. Never use color as the only signal — pair it with a
  label, icon, or position.
- Reading level: plain language. Any technical term gets a hover gloss on first
  use.
- No component over 200 lines. Split instead.
```

**Built-in agents to use as-is:** `Explore` (finding code), `Plan`
(architecture decisions before a big change), `general-purpose` (multi-step
research).

---

## 4. `CLAUDE.md` for the repo

Create this at the project root so every session picks up the rules:

```markdown
# CellScope

Educational 3D app: genes → proteins → cell behavior, across 5 cell types.
Read PROJECT_PLAN.md for the full spec and current phase.

## Non-negotiables
- Never invent biological facts. Cite or write "TODO: verify".
- All gene/protein/cell content lives in src/data/cells.json. No biology
  hard-coded in components.
- The app must work with 3D disabled.
- Expression values are approximate and must be labeled as such in the UI.

## Commands
- `npm run dev` — dev server
- `npm run build` — typecheck + production build
- `npm run validate:data` — validate cells.json against the schema

## Agents
- bio-curator — adds/edits biology data
- bio-factcheck — independently verifies data (never let it write)
- scene-builder — src/three/
- ui-builder — src/components/

## Conventions
- TypeScript strict mode on.
- Organelle IDs: nucleus | cytosol | plasma_membrane | mitochondrion | er | golgi
- Commit at the end of each phase. Small commits within a phase are fine.
```

---

## 5. Data schema (Phase 1 target)

`src/data/cells.json`:

```json
{
  "meta": {
    "version": 1,
    "expressionNote": "Values are 0-100 illustrative scores derived from Human Protein Atlas data, not raw experimental measurements."
  },
  "organelles": [
    { "id": "mitochondrion", "name": "Mitochondrion", "blurb": "Makes most of the cell's ATP." }
  ],
  "cellTypes": [
    {
      "id": "muscle",
      "name": "Skeletal muscle cell",
      "blurb": "Long, cylindrical, packed with mitochondria and contractile machinery.",
      "shape": "elongated",
      "organelles": ["nucleus", "cytosol", "plasma_membrane", "mitochondrion", "er"],
      "organelleScale": { "mitochondrion": 1.6 },
      "signatureGenes": ["ACTA1", "CKM"]
    }
  ],
  "genes": [
    {
      "id": "CKM",
      "symbol": "CKM",
      "fullName": "Creatine kinase, M-type",
      "plainSummary": "Recharges the cell's energy currency fast, during hard exercise.",
      "proteinId": "ck_m",
      "expression": { "muscle": 98, "neuron": 12, "hepatocyte": 3, "rbc": 1, "beta": 4 },
      "sources": ["https://www.uniprot.org/uniprotkb/P06732", "https://www.proteinatlas.org/ENSG00000104879-CKM"]
    }
  ],
  "proteins": [
    {
      "id": "ck_m",
      "name": "Creatine kinase M",
      "geneId": "CKM",
      "location": "cytosol",
      "job": "Transfers a phosphate from creatine to ADP to regenerate ATP within seconds.",
      "whatHappensIfBroken": "Muscle tires much faster during short, intense effort and leaks this protein into blood when damaged.",
      "visual": { "primitive": "cluster", "color": "#e8833a", "count": 14 }
    }
  ]
}
```

**Rule:** one gene → one protein, strictly. Real biology is messier (splice
variants, complexes); the simplification is deliberate and should be stated in
the app's "How to read this" note.

---

## 6. Phases

### Phase 0 — Scaffold
- [x] `npm create vite@latest` (React + TS), install three, @react-three/fiber,
      @react-three/drei, recharts, tailwindcss
- [x] Create `CLAUDE.md` and `.claude/agents/*.md` (section 3 & 4 above)
- [x] Write `src/data/schema.ts` — TypeScript types matching section 5
- [x] Write `scripts/validate-data.ts` + `npm run validate:data`
- [x] `git init`, first commit

**Done when:** `npm run dev` shows a blank styled page, `npm run validate:data`
passes on an empty-but-valid data file.

---

### Phase 1 — Data (the real work)
- [x] Use **bio-curator** to add the 5 cell types with blurbs
- [x] Use **bio-curator** to add genes in 3 batches of ~5, with proteins
- [x] Run `npm run validate:data` after each batch
- [x] Use **bio-factcheck** on the complete file
- [x] Fix every WRONG verdict; resolve or delete every UNVERIFIABLE entry

Suggested gene set to start (curator must verify all of it): `CKM`, `ACTA1`,
`SCN2A`, `SNAP25`, `INS`, `GCK`, `ALB`, `CYP3A4`, `HBB`, `SLC2A1`, `ATP5F1A`,
`PPARGC1A`, `MB`, `GAPDH`.

**Done when:** factcheck returns zero WRONG and zero UNVERIFIABLE, and every
entry has at least one source URL. Commit.

> This phase is where the project succeeds or fails. Do not rush it to get to
> the 3D part. Budget more time here than feels reasonable.

---

### Phase 2 — 2D app (a complete, shippable product)
- [x] **ui-builder**: cell type picker (5 cards)
- [x] **ui-builder**: gene list, filterable, showing which cell each is highest in
- [x] **ui-builder**: gene detail panel — plain summary, its protein, protein's
      job, what breaks if it fails, source links
- [x] **ui-builder**: Recharts bar chart of one gene's expression across all 5
      cell types
- [x] **ui-builder**: "How to read this" intro explaining the simplifications
- [x] **ui-builder**: compare mode — two cell types side by side, top genes each

**Done when:** someone who has never seen the project can pick a cell, pick a
gene, and correctly explain what that gene's protein does. Deploy it. Commit.

> **Checkpoint:** if you run out of time or motivation, stop here. This is
> already a real project worth showing.

---

### Phase 3 — 3D cell shell (no genes yet)
- [ ] **Plan** agent: decide the scene graph and how cell shape is parameterized
- [ ] **scene-builder**: `<CellScene>` with orbit controls, lighting, a cutaway
      membrane
- [ ] **scene-builder**: six organelle components, each hoverable with a label
- [ ] **scene-builder**: click an organelle → it highlights, others dim
- [ ] **scene-builder**: `shape` field drives the shell (round / elongated /
      branched / biconcave)
- [ ] Toggle to disable 3D entirely (`?no3d=1` and a UI switch)

**Done when:** you can rotate a cell, click the mitochondrion, and read its
blurb. 60fps. Commit.

---

### Phase 4 — Wire data into 3D
- [ ] **scene-builder**: selecting a gene spawns its protein mesh in the correct
      organelle, animated in
- [ ] **scene-builder**: protein count/size scales with expression level in the
      currently selected cell type
- [ ] **scene-builder**: switching cell type morphs the shell and re-places proteins
- [ ] **ui-builder**: panel and 3D scene share one selection state (no drift)

**Done when:** picking `CKM` in muscle vs. in neuron visibly differs, and the
difference matches the bar chart. Commit.

---

### Phase 5 — Break something (the payoff feature)
- [ ] **ui-builder**: "knock out this gene" toggle
- [ ] **scene-builder**: knocked-out protein fades out of the scene
- [ ] **ui-builder**: show `whatHappensIfBroken` prominently when knocked out
- [ ] **scene-builder**: one stylized downstream animation per organelle type
      (e.g. knocking out `SLC2A1` → glucose particles stop crossing the membrane)
- [ ] **bio-factcheck**: verify every knockout consequence claim

**Done when:** the knockout story for at least 5 genes is accurate and visually
legible. Commit.

---

### Phase 6 — Polish & ship
- [ ] Keyboard navigation audit; visible focus everywhere
- [ ] Colorblind check (simulate deuteranopia); no color-only signals
- [ ] Mobile: 3D degrades gracefully or falls back to 2D
- [ ] Sources page listing every URL used
- [ ] Explicit limitations note: one-gene-one-protein, illustrative values,
      not a simulator
- [ ] README with screenshots and a short "why I built this"
- [ ] Deploy; tag `v1.0`

---

## 7. First message to paste into Claude Code

> Read PROJECT_PLAN.md. We're starting Phase 0.
>
> Scaffold the project per section 2, create CLAUDE.md and the four agent files
> from sections 3 and 4 exactly as written, then write the TypeScript schema in
> src/data/schema.ts to match section 5 and the validate-data script.
>
> Don't start Phase 1. When Phase 0 is done, show me the file tree, confirm
> `npm run dev` and `npm run validate:data` both work, and commit.

Then for each later phase:

> Read PROJECT_PLAN.md. Phase 1 next. Use the bio-curator agent to add the five
> cell types, then the first batch of five genes. Run validate:data after. Don't
> move on to Phase 2.

---

## 8. Known risks

| Risk | Mitigation |
|---|---|
| Biology errors sneak in | bio-factcheck at the end of every data phase; it never writes |
| Scope creep into "all genes" | Section 1 is locked; new ideas go to a BACKLOG.md |
| 3D eats all the time, 2D never finishes | Phase 2 ships before any 3D work starts |
| Expression numbers read as real measurements | `meta.expressionNote` surfaced in the UI on every chart |
| Over-simplification becomes wrong | Explicit limitations note in Phase 6; factcheck reviews summaries, not just facts |

---

## 9. Backlog (not v1)

Disease variants · protein-protein interaction web · a gene-expression timeline
during cell differentiation · quiz mode with scoring · import a gene by symbol
from a live API · comparing human vs. mouse
