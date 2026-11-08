# Curation log

Working notes behind `src/data/cells.json`, kept so `bio-factcheck` (and humans)
can trace every value back to its source.

## Expression scoring method (applies to every batch)

- Source: Human Protein Atlas **single cell type** RNA data, unit **nCPM**,
  fetched via the HPA download API
  (`https://www.proteinatlas.org/api/search_download.php?search=<SYMBOL>&format=json&columns=g,eg,<fields>&compress=no`).
- Cell type → HPA field:
  | App cell type | HPA field | Caveat |
  |---|---|---|
  | muscle | `sc_RNA_Myonuclei` | |
  | neuron | max of `sc_RNA_Brain_excitatory_neurons`, `sc_RNA_Brain_inhibitory_neurons` | |
  | hepatocyte | `sc_RNA_Hepatocytes` | |
  | beta | `sc_RNA_Pancreatic_islet_cells` | Mixes alpha, beta and other islet cells |
  | rbc | `sc_RNA_Erythrocyte_progenitors` | Mature RBCs have no nucleus and make no new RNA; this is the precursor |
- Score = `min(100, round(25 × log10(1 + nCPM)))`
  (0 → 0, 10 → 26, 100 → 50, 1000 → 75, 10000 → 100).
- Scores are illustrative, not measurements (see `meta.expressionNote`).

## Files

- `genes-batch-1.md` — CKM, ACTA1, SCN2A, SNAP25, INS (raw nCPM, accessions, location mapping)
- Cell types and organelles: sources are inline in `cells.json`. Judgment calls:
  hepatocyte and beta use `round` as a stylization (real hepatocytes are
  polygonal); `organelleScale.mitochondrion = 1.4` for muscle (OpenStax A&P 10.5,
  oxidative fibers) and hepatocyte (Hu & Li 2017, tissue-level statement).
