# CellScope

Educational 3D app: genes → proteins → cell behavior, across 5 cell types.
Read PROJECT_PLAN.md for the full spec and current phase.

## Non-negotiables
- Never invent biological facts. Cite or write "TODO: verify".
- All gene/protein/cell content lives in src/data/cells.json. No biology
  hard-coded in components.
- The app must work with 3D disabled.
- Expression values are approximate and must be labeled as such in the UI.

## Live site
https://gianamal.github.io/cellscope/ — every push to `main` redeploys via
.github/workflows/deploy.yml (runs validate:data, then build).

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
