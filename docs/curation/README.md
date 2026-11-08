# Curation log

Working notes behind `src/data/cells.json`, kept so `bio-factcheck` (and humans)
can trace every value back to its source.

## Expression scoring method (applies to every batch)

- Source (HPA release 25.1): Human Protein Atlas **single cell type** RNA data, unit **nCPM**,
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
- **Noise floor:** values at or below 1 nCPM (score ≤ 8) are set to 0. Trace RNA at
  that level is noise or contamination, and the app would otherwise draw the
  protein in a cell that doesn't make it.
- **Organelle override:** if a protein's `location` is not in a cell type's
  `organelles` list, that cell type's score is 0 regardless of RNA data (e.g.
  mitochondrial proteins in mature red blood cells). Enforced by `validate:data`.
- **Muscle tissue rule:** `Myonuclei` is single-*nucleus* data and under-counts
  very abundant cytoplasmic transcripts. For any gene whose HPA tissue
  `t_RNA_skeletal_muscle` is ≥ 10,000 nTPM, muscle is scored from tissue nTPM
  instead (same formula). Checked for all 14 genes: applies to CKM (68,909),
  ACTA1 (123,974), MB (38,157), GAPDH (25,843), all → 100. Not used for all
  genes because bulk tissue includes blood (e.g. HBB 544 nTPM in muscle tissue).
- **Documented exceptions** (single-cell value contradicts well-established
  biology; replaced after independent fact-check, Phase 1):
  | Gene | Cell type | Single-cell score | Final | Why |
  |---|---|---|---|---|
  | GCK | hepatocyte | 5 (0.6 nCPM) | 31 | Glucokinase is mainly a liver + beta-cell enzyme (MedlinePlus). Scored from HPA tissue liver 16.7 nTPM with the same formula. |
  | CYP3A4 | muscle | 17 (3.7 nCPM) | 10 | Not in UniProt's tissue list; HPA tissue skeletal muscle only 1.5 nTPM. Scored from tissue. |
  | HBB | hepatocyte | 24 (8.3 nCPM) | 0 | Adult hepatocytes don't make hemoglobin; the signal is contaminating blood RNA. |
- Scores are illustrative, not measurements (see `meta.expressionNote`).

## Files

- `genes-batch-1.md` — CKM, ACTA1, SCN2A, SNAP25, INS (raw nCPM, accessions, location mapping)
- `genes-batch-2.md` — GCK, ALB, CYP3A4, HBB, SLC2A1
- `genes-batch-3.md` — ATP5F1A, PPARGC1A, MB, GAPDH
- `factcheck-1A.md`, `factcheck-1B.md` — Phase 1 independent fact-check (organelles, cell types, batch 1 / batches 2–3)
- Secreted proteins (INS, ALB) use `location: golgi` by project convention:
  where the protein is packaged before leaving the cell. Not a UniProt term.
- Cell types and organelles: sources are inline in `cells.json`. Judgment calls:
  hepatocyte and beta use `round` as a stylization (real hepatocytes are
  polygonal); `organelleScale.mitochondrion = 1.4` for muscle (OpenStax A&P 10.5,
  oxidative fibers) and hepatocyte (Hu & Li 2017, tissue-level statement).

## Phase 1 fact-check outcome

Round 1 (`factcheck-1A.md`, `factcheck-1B.md`): 6 WRONG, 3 UNVERIFIABLE → all fixed.
Round 2 (re-check of changes): 4 WRONG, 0 UNVERIFIABLE → all fixed (muscle tissue rule,
GAPDH wording, source additions).
Round 3 (narrow re-check): **0 WRONG, 0 UNVERIFIABLE.**

Known weak spot, not wrong: GAPDH's "essential gene" claim rests on a methods paper
(PMID 40209323) that calls it essential in passing. A CRISPR essentiality screen or
DepMap page would be a stronger citation.
