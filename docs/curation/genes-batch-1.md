# Curation log: gene batch 1 of 3 (CKM, ACTA1, SCN2A, SNAP25, INS)

Curator: bio-curator agent. Date: 2026-11-08. Output: `frag-genes-1.json` (same folder).

## Method notes. Read these first, they affect every gene

### NCBI Gene
The NCBI Gene web pages (www.ncbi.nlm.nih.gov/gene/<id>) returned a reCAPTCHA browser check, which I did not try to get past. I confirmed the official symbol and full name through NCBI's E-utilities API instead:
https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=1158,58,6326,6616,3630&retmode=json
All five records show nomenclature status "Official", organism Homo sapiens. `fullName` uses the NCBI/HGNC official full name (lowercase, as NCBI gives it). This is not always the same as the UniProt protein name.

### HPA expression: the mapping had to change (DECISION FOR HUMAN)
The current HPA single cell type data no longer uses the labels in the brief. It also reports **nCPM**, not nTPM. The labels "Skeletal myocytes", "Excitatory neurons", "Inhibitory neurons", "Pancreatic endocrine cells" and "Erythroid cells" are not in the per-cell-type field list on https://www.proteinatlas.org/about/help/dataaccess (154 `sc_RNA_*` fields). Some of them now exist only as expression-cluster names. The per-cell-type values are drawn as JS plots on the gene pages and are not in the page text. I got them from the official HPA API (`search_download.php`) and used the closest current labels:

| App cell type | Brief's HPA label | Label used (current HPA field) |
|---|---|---|
| muscle | Skeletal myocytes | `Myonuclei` (skeletal muscle single-nucleus). Skeletal myofibers is a protein (DVP) label with no sc RNA field. |
| neuron | max(Excitatory, Inhibitory neurons) | max(`Brain excitatory neurons`, `Brain inhibitory neurons`) |
| hepatocyte | Hepatocytes | `Hepatocytes` (unchanged) |
| beta | Pancreatic endocrine cells | `Pancreatic islet cells`. Mixes alpha, beta, delta etc.; HPA does not split out beta cells. |
| rbc | Erythroid cells (else TODO) | `Erythrocyte progenitors`. I also recorded `Erythrocytes` (raw only, not scored). |

- Formula applied unchanged to nCPM: score = min(100, round(25 × log10(1 + nCPM))). nCPM and nTPM are both normalized per-million units, but they are not identical. Later batches must use the same fields and units so scores stay comparable.
- **rbc caveat:** mature RBCs have no nucleus and make no new RNA. The rbc score is based on erythrocyte *progenitors* (precursors), not circulating RBCs. The brief said "otherwise TODO" if "Erythroid cells" is missing. I took `Erythrocyte progenitors` as the direct equivalent of the old erythroid-precursor category. If the human prefers the strict reading, set every rbc value to 0 and TODO. All five rbc raw values are ≤ 0.9 nCPM, so the scores (0–7) barely change either way.
- **beta caveat:** the islet cell category is not beta-specific.
- Reproducible query (swap the search term for the gene's ENSG ID):
  `https://www.proteinatlas.org/api/search_download.php?search=<ENSG>&format=json&columns=g,eg,sc_RNA_Myonuclei,sc_RNA_Brain_excitatory_neurons,sc_RNA_Brain_inhibitory_neurons,sc_RNA_Hepatocytes,sc_RNA_Pancreatic_islet_cells,sc_RNA_Erythrocyte_progenitors,sc_RNA_Erythrocytes&compress=no`
  (CKM was queried with `search=CKM`. The result rows include CKMT1A/B, CKMT2 and ATPSCKMT. Only the row with Gene = CKM, ENSG00000104879, was used.)
- HPA release/version number: not shown in the API output or the page text I read. **TODO: verify** and record the HPA version.

---

## CKM
- **Official symbol / full name:** CKM / creatine kinase, M-type (NCBI GeneID 1158, HGNC:1994). UniProt RecName "Creatine kinase M-type".
- **UniProt:** P06732 (KCRM_HUMAN, Reviewed). Ensembl ENSG00000104879. MIM 123310.
- **Location:** UniProt "Cytoplasm." → `cytosol`.
- **HPA single cell (nCPM → score):**
  - muscle (Myonuclei) 773.6 → 72
  - neuron: excitatory 0.5, inhibitory 0.6 → max 0.6 → 5
  - hepatocyte 0.0 → 0
  - beta (Pancreatic islet cells) 1.0 → 8
  - rbc (Erythrocyte progenitors) 0.9 → 7 (Erythrocytes 0.0)
  - HPA also gives the highest value in Thymic myoid cells (1948.3 nCPM), "Group enriched (Thymic myoid cells, Myonuclei)". The JSON summary gave the same Myonuclei value, 773.6, so the two sources agree.
- **whatHappensIfBroken source:** UniProt has **no DISEASE section** for CKM. OMIM 123310 returned HTTP 403. MedlinePlus has no CKM page (not checked by URL; no link from UniProt). The statement is based on a **mouse knockout study**, not on human disease: van Deursen et al. 1993, *Cell* 74:621-31, PMID 8358791, doi:10.1016/0092-8674(93)90510-w. The abstract says the mutant mice show no change in absolute muscle force but "lack the ability to perform burst activity" (read via PubMed E-utilities efetch). The text says "In mice…" so it is not presented as human disease. This is not one of the preferred source types (UniProt/OMIM/MedlinePlus/GeneReviews). **Flag for fact-checker.**
- **Unverified:** whether any human CKM-deficiency disease exists (OMIM unreachable). The plan's example claim "leaks this protein into blood when damaged" was **not used** because I did not source it.

## ACTA1
- **Official symbol / full name:** ACTA1 / actin alpha 1, skeletal muscle (GeneID 58, HGNC:129). UniProt RecName "Actin, alpha skeletal muscle".
- **UniProt:** P68133 (ACTS_HUMAN, Reviewed). ENSG00000143632. MIM 102610.
- **Location:** UniProt "Cytoplasm, cytoskeleton." → `cytosol` (per the brief's rule cytoskeleton → cytosol).
- **HPA single cell (nCPM → score):**
  - muscle 1143.9 → 76
  - neuron: excitatory 1.4, inhibitory 1.3 → 1.4 → 10
  - hepatocyte 0.0 → 0
  - beta 2.0 → 12
  - rbc progenitors 0.0 → 0 (Erythrocytes 0.0)
- **whatHappensIfBroken source:**
  - MedlinePlus Genetics ACTA1 page: variants disrupt thin-filament formation, causing weakness and low muscle tone that can be severe; nemaline myopathy etc.
  - UniProt DISEASE: congenital myopathies 2A/2B/2C, scapulohumeroperoneal myopathy. "Sometimes severe from birth" rests on the congenital/severe infantile forms.
- **Unverified:** none beyond the HPA version.

## SCN2A
- **Official symbol / full name:** SCN2A / sodium voltage-gated channel alpha subunit 2 (GeneID 6326, HGNC:10588). UniProt RecName "Sodium channel protein type 2 subunit alpha". The name "Nav1.2" comes from MedlinePlus ("NaV1.2").
- **UniProt:** Q99250 (Reviewed). ENSG00000136531. MIM 182390.
- **Location:** UniProt "Cell membrane; Multi-pass membrane protein" → `plasma_membrane`.
- **HPA single cell (nCPM → score):**
  - neuron: excitatory 682.9, inhibitory 466.7 → 682.9 → 71
  - muscle 0.4 → 4
  - hepatocyte 1.2 → 9
  - beta 10.5 → 27
  - rbc progenitors 0.0 → 0 (Erythrocytes 0.0)
- **whatHappensIfBroken source:**
  - MedlinePlus Genetics SCN2A page: infantile epilepsies, developmental and epileptic encephalopathy, autism spectrum disorder, episodic ataxia.
  - UniProt DISEASE: BFIS3, DEE11, EA9, ASD association.
  - "Make brain signals misfire" is a plain-language gloss and is not quoted from either source.
- **Unverified:** the UniProt text entry was read only to 100k of 114k characters. The location and disease sections were inside the part that was read.

## SNAP25
- **Official symbol / full name:** SNAP25 / synaptosome associated protein 25 (GeneID 6616, HGNC:11132). UniProt RecName "Synaptosomal-associated protein 25".
- **UniProt:** P60880 (SNP25_HUMAN, Reviewed). ENSG00000132639. MIM 600322.
- **Location:** UniProt lists several places: cytoplasm, perinuclear region; cell membrane, lipid-anchored (palmitoyl); synapse, synaptosome; photoreceptor inner segment. Note: "Membrane association requires palmitoylation." → **`plasma_membrane`** (judgment call). The t-SNARE neurotransmitter-release function happens at the cell/synapse membrane, and the brief maps synapse membrane → plasma_membrane. `cytosol` is the alternative if the perinuclear pool should take priority.
- **HPA single cell (nCPM → score):**
  - neuron: excitatory 1191.9, inhibitory 675.5 → 1191.9 → 77
  - muscle 1.0 → 8
  - hepatocyte 0.7 → 6
  - beta (islet) 372.8 → 64
  - rbc progenitors 0.1 → 1 (Erythrocytes 0.0)
  - The high islet value may be a useful teaching point: the same release machinery appears in hormone-secreting cells. It is not stated in any field because I did not source the islet function.
- **whatHappensIfBroken source:** UniProt DISEASE "Developmental and epileptic encephalopathy 117 (DEE117)" [MIM:616330]: refractory seizures, global developmental delay, difficulty or inability to walk, intellectual disability. There is no MedlinePlus page (404).
- **Unverified:** none beyond the HPA version. The JSON gene sources list UniProt, NCBI and HPA. The UniProt entry is also the disease source.

## INS
- **Official symbol / full name:** INS / insulin (GeneID 3630, HGNC:6081). UniProt RecName "Insulin".
- **UniProt:** P01308 (INS_HUMAN, Reviewed). ENSG00000254647. MIM 176730.
- **Location:** UniProt "Secreted." None of the 6 IDs fits. → **`golgi` (DECISION FOR HUMAN).**
  - Reasoning: inside the beta cell, insulin is made in the ER, moves through the Golgi, and is sorted into secretory (storage) granules that bud from the Golgi before release.
  - UniProt's GO cellular-component lines (TAS:Reactome) support this route: ER lumen, ER–Golgi intermediate compartment membrane, Golgi lumen, Golgi membrane, secretory granule lumen.
  - Of the 6 IDs, `golgi` is closest to "packaged for secretion".
  - `er` is the defensible alternative. The MedlinePlus page says neonatal-diabetes variants disrupt proinsulin processing, which is an argument for ER.
  - The ER→Golgi→granule route itself is standard cell biology. It is not quoted from a primary source beyond those GO terms.
- **HPA single cell (nCPM → score):**
  - beta (islet) 83209.9 → min(100, 123) = 100
  - all others (neurons, myonuclei, hepatocytes, erythrocyte progenitors, erythrocytes) 0.0 → 0
- **whatHappensIfBroken source:**
  - MedlinePlus Genetics INS page: permanent neonatal diabetes (onset within the first 6 months), MODY, T1D association, hyperproinsulinemia.
  - UniProt DISEASE: PNDM4 (onset within the first six months), MODY10 (onset in childhood or early adulthood, usually before 25).
- **Unverified:** none beyond the HPA version and the location judgment.

---

## Score arithmetic (25 × log10(1 + x), rounded)
773.6→72.2, 0.6→5.1, 1.0→7.5→8, 0.9→7.0, 1143.9→76.5→76, 1.4→9.5→10, 2.0→11.9→12, 682.9→70.9→71, 0.4→3.7→4, 1.2→8.6→9, 10.5→26.5→27, 1191.9→76.9→77, 0.7→5.8→6, 372.8→64.3→64, 0.1→1.0, 83209.9→123→100. Note that 76.47 rounds down to 76.

## Visual choices (not biology)
- CKM cluster #E69F00 ×14
- ACTA1 rod #D55E00 ×16
- SCN2A ring #0072B2 ×10
- SNAP25 cluster #CC79A7 ×12
- INS sphere #009E73 ×16
