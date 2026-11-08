# Curation log: gene batch 3 (ATP5F1A, PPARGC1A, MB, GAPDH)

Curator: bio-curator agent. Date: 2026-11-08. Output: `frag-genes-3.json` (same folder).

## Method notes

- **Expression:** same method as batch 1 (docs/curation/README.md). The data is HPA single cell type RNA, in nCPM. Score = min(100, round(25 × log10(1 + nCPM))).
  - The field mapping is unchanged: muscle = `Myonuclei`; neuron = max(`Brain excitatory neurons`, `Brain inhibitory neurons`); hepatocyte = `Hepatocytes`; beta = `Pancreatic islet cells`; rbc = `Erythrocyte progenitors`.
  - I recorded `Erythrocytes` as a raw value only and did not score it.
- **NCBI Gene:** I did not open the web pages. I confirmed symbol, full name, "Official" status and Homo sapiens through E-utilities. `fullName` uses the NCBI/HGNC official name.
- **UniProt:** I read each entry through the REST flat file. WebFetch summarises long text, so I recorded the location lines verbatim and the disease text as summaries.
- **HPA release/version:** not shown in the API output. **TODO: verify** (same open item as batch 1).
- **No MedlinePlus Genetics pages were used.** MB returned 404. I did not check the other three by URL and found no link to them. All disease or knockout statements rest on PubMed records, plus UniProt DISEASE where it exists.

### API URLs queried
- HPA (expression). The comma-separated multi-gene search returned `[]`, so I queried one gene at a time:
  - `https://www.proteinatlas.org/api/search_download.php?search=ATP5F1A&format=json&columns=g,eg,up,sc_RNA_Myonuclei,sc_RNA_Brain_excitatory_neurons,sc_RNA_Brain_inhibitory_neurons,sc_RNA_Hepatocytes,sc_RNA_Pancreatic_islet_cells,sc_RNA_Erythrocyte_progenitors,sc_RNA_Erythrocytes&compress=no`
  - The same URL with `search=PPARGC1A`, `search=GAPDH`, and `search=ENSG00000198125` (MB). I searched MB by ENSG ID to avoid substring hits.
  - The GAPDH search also returned the rows GAPDHS and PRKCI. I used only the row with Gene = GAPDH, ENSG00000111640.
- HPA (specificity labels): the same URLs with `columns=g,eg,rnats,rnatd,rnascs,rnascd,rnascsm`.
- NCBI: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=498,10891,4151,2597&retmode=json`
- UniProt: `https://rest.uniprot.org/uniprotkb/P25705.txt`, `.../Q9UBK2.txt`, `.../P02144.txt`, `.../P04406.txt`
- PubMed: I read the metadata and abstracts through the PubMed tool (esummary/efetch) for PMIDs 23599390, 34483339, 15454086 and 30918256. I also ran an esummary over the GAPDH title-search hits (see GAPDH below).

---

## ATP5F1A
- **Official symbol / full name:** ATP5F1A / ATP synthase F1 subunit alpha (NCBI GeneID 498, Official). Old aliases: ATP5A1, ATP5A. UniProt RecName: "ATP synthase F(1) complex subunit alpha, mitochondrial".
- **UniProt:** P25705 (ATPA_HUMAN, Reviewed). Ensembl ENSG00000152234. MIM 164360.
- **Location:** UniProt places it in the mitochondrion, at the inner membrane, as a peripheral membrane protein on the matrix side → **`mitochondrion`**.
  - UniProt also reports it at the cell membrane and on the T-cell surface. I did not use these: they are a minor, cell-type-specific report and not where it makes ATP.
- **Function used:** UniProt FUNCTION (summary): it is a subunit of mitochondrial ATP synthase (Complex V), which makes ATP from ADP using the proton gradient built by the respiratory chain. It is part of the catalytic core with the beta subunit.
- **HPA single cell (nCPM → score):**
  - muscle (Myonuclei) 115.5 → 52
  - neuron: excitatory 60.9, inhibitory 62.4 → max 62.4 → 45
  - hepatocyte 259.8 → 60
  - beta (islet) 158.5 → 55
  - rbc (Erythrocyte progenitors) 457.1 → 67 (Erythrocytes 33.8, raw only)
  - HPA labels: tissue "Tissue enhanced", "Detected in all"; single cell type "Cell type enhanced", "Detected in all".
- **whatHappensIfBroken source:** UniProt DISEASE lists COXPD22 (MIM 616045), MC5DN4A (MIM 620358) and MC5DN4B (MIM 615228). Each is noted "caused by variants" in this gene.
  - "Fatal in the first weeks": MC5DN4B is described as "usually fatal in the first weeks of life". The PubMed record is Jonckheere et al. 2013, *Brain* 136:1544-54, PMID 23599390, doi:10.1093/brain/awt086. The title says the defect "causes fatal neonatal mitochondrial encephalopathy".
  - "Poor growth, lactic acid buildup": Lines et al. 2021, *Eur J Hum Genet* 29:1719-24, PMID 34483339, doi:10.1038/s41431-021-00956-0. The abstract reports failure to thrive and hyperlactatemia, with some patients recovering by 18 months.
  - "Starve cells of energy" is my plain-language gloss for complex V (ATP synthase) deficiency. It is not a quote.
- **Signature cell type:** none (broadly expressed). The five app scores fall between 45 and 67, and HPA says "Detected in all".
- **Unverified:** none beyond the HPA version.

## PPARGC1A
- **Official symbol / full name:** PPARGC1A / PPARG coactivator 1 alpha (GeneID 10891, Official). Aliases include PGC-1alpha and PGC1A. UniProt RecName: "Peroxisome proliferator-activated receptor gamma coactivator 1-alpha".
- **UniProt:** Q9UBK2 (PRGC1_HUMAN, Reviewed). ENSG00000109819. MIM 604517.
- **Location:** UniProt [Isoform 1]: "Nucleus" (ECO:0000269, PubMed:10713165), and "Nucleus, PML body". Isoforms B4, B5 and 9 are also nuclear. Isoform B4-8a is "Cytoplasm" plus "Nucleus". → **`nucleus`**.
  - Reasoning: it is a transcriptional coactivator ("Transcriptional coactivator for steroid receptors and nuclear receptors", UniProt FUNCTION). Its job is done at genes in the nucleus.
  - Its *effect* is on mitochondria, but it does not work inside them. `cytosol` is a possible alternative only for one minor isoform. I rejected it.
- **Function used:**
  - UniProt FUNCTION: a coactivator of steroid and nuclear receptors, which "Can regulate key mitochondrial genes…".
  - Lin et al. 2004 abstract: it regulates mitochondrial biogenesis and respiration, hepatic gluconeogenesis and muscle fiber-type switching. The job text "in the liver, for making new glucose" rests on this.
- **HPA single cell (nCPM → score):**
  - muscle 525.0 → 68
  - neuron: excitatory 70.7, inhibitory 85.4 → 85.4 → 48
  - hepatocyte 322.4 → 63
  - beta 10.9 → 27
  - rbc progenitors 0.0 → 0 (Erythrocytes 1.5)
  - HPA labels: "Tissue enhanced"; single cell "Cell type enhanced", "Detected in many".
  - HPA's highest cell types are outside the app: choroid plexus epithelial cells 900.3, kidney intercalated cells 813.2 and others. Myonuclei 525.0 and cardiomyocytes 469.7 are also high.
  - "Especially active in muscle and liver" in plainSummary is supported only *within the app's five cell types*. Kidney and choroid plexus cells are higher in HPA.
- **whatHappensIfBroken source:** UniProt has **no DISEASE section**, so no human disease is linked and I did not invent one. I used a mouse knockout study: Lin et al. 2004, *Cell* 119:121-35, PMID 15454086, doi:10.1016/j.cell.2004.09.013. The abstract reports:
  - reduced mitochondrial function
  - "profound hyperactivity"
  - lesions in the striatal region of the brain that controls movement
  - The text says "In mice bred without it…". **Flag for fact-checker**: this is mouse data, not human disease.
- **Signature cell type:** muscle is the highest app score (68), but hepatocyte is close behind (63). **Not distinctive. I recommend none**, or muscle only with that caveat.
- **Unverified:** none beyond the HPA version. The UniProt FUNCTION text was read only to its first ~6 lines.

## MB
- **Official symbol / full name:** MB / myoglobin (GeneID 4151, Official). UniProt RecName: "Myoglobin".
- **UniProt:** P02144 (MYG_HUMAN, Reviewed). ENSG00000198125. MIM 160000.
- **Location:** UniProt "Cytoplasm, sarcoplasm" (ECO:0000269, PubMed:30918256) → **`cytosol`**. Sarcoplasm is the cytoplasm of a muscle cell.
- **Function used:** UniProt: "primary function is to store oxygen and facilitate its diffusion within muscle tissues". The FUNCTION text also describes oxygen binding by the heme iron. I left out its nitrite reductase and ROS-protection roles to keep the entry simple.
- **"Heart and skeletal muscle" (plainSummary):** Olivé et al. 2019 abstract: "highly expressed in cardiac myocytes and oxidative skeletal myofibers".
- **HPA single cell (nCPM → score):**
  - muscle 613.9 → 70
  - neuron: excitatory 0.1, inhibitory 0.1 → 1
  - hepatocyte 0.7 → 6
  - beta 1.8 → 11
  - rbc progenitors 0.0 → 0 (Erythrocytes 0.0)
  - HPA labels: "Group enriched" (Myonuclei 613.9, Thymic myoid cells 1472.5).
- **whatHappensIfBroken source:**
  - UniProt DISEASE: Myopathy, sarcoplasmic body (MYOSB, MIM 620286). It is autosomal dominant and slowly progressive, starts in adulthood with proximal and axial weakness, and progresses to distal muscles. Some patients develop respiratory or cardiac symptoms.
  - PubMed record: Olivé et al. 2019, *Nat Commun* 10:1396, PMID 30918256, doi:10.1038/s41467-019-09111-2. It found a recurrent p.His98Tyr variant in 14 members of 6 families, causing respiratory and cardiac failure.
  - "Near the body's center … spreads outward" is my plain gloss of "proximal and axial … progresses to involve distal muscles".
  - There is no MedlinePlus page (404).
- **Signature cell type: muscle.** It scores 70 against ≤11 for the other app types.
- **Unverified:** none beyond the HPA version.

## GAPDH
- **Official symbol / full name:** GAPDH / glyceraldehyde-3-phosphate dehydrogenase (GeneID 2597, Official). UniProt RecName is the same.
- **UniProt:** P04406 (G3P_HUMAN, Reviewed). ENSG00000111640. MIM 138400.
- **Location:** UniProt lists several places:
  - "Cytoplasm, cytosol" (ECO:0000269)
  - "Nucleus" (by similarity to rat P04797)
  - "Cytoplasm, perinuclear region"
  - "Membrane"
  - "Cytoplasm, cytoskeleton"
  - A Note says it moves into the nucleus after S-nitrosylation and binding to SIAH1.
  - → **`cytosol`**. Its main job in the app's energy theme is the glycolysis step (UniProt FUNCTION, first sentence), and glycolysis happens in the cytosol. The app's cytosol blurb already mentions glycolysis.
  - Alternative: `nucleus`, for its stress-induced nuclear role. I rejected it because that is a secondary role, and the nuclear location is "by similarity" only.
- **Function used:** UniProt: it converts D-glyceraldehyde 3-phosphate into 3-phospho-D-glyceroyl phosphate in glycolysis.
  - The job text uses the common synonym 1,3-bisphosphoglycerate.
  - "A three-carbon piece of broken-down glucose" is a standard textbook gloss and is not quoted from UniProt.
- **"Housekeeping … nearly every cell type":** HPA single cell type distribution says "Detected in all", and tissue distribution says "Detected in all".
  - HPA's specificity label is "Cell type enhanced" (tissue: "Group enriched"). The highest values are in esophageal and trophoblast cells, about 8,000–15,000 nCPM. So it is everywhere but not perfectly uniform.
  - The word "housekeeping" is the brief's framing. It is not an HPA label.
- **HPA single cell (nCPM → score):**
  - muscle 70.7 → 46
  - neuron: excitatory 266.5, inhibitory 267.4 → 267.4 → 61
  - hepatocyte 1825.7 → 82
  - beta (islet) 2157.1 → 83
  - rbc progenitors 991.0 → 75 (Erythrocytes 56.8)
  - Note: the muscle value is the lowest of the five. That is surprising for a glycolytic enzyme. A possible cause is that Myonuclei is single-*nucleus* data and may under-count cytoplasmic transcripts. **This explanation is my speculation, not sourced. I scored the number honestly as given.**
- **whatHappensIfBroken:** **"TODO: verify"**.
  - UniProt has **no DISEASE section**.
  - I found no reliable mouse knockout study. A PubMed title search for GAPDH with knockout, deficiency, deficient, null or loss returned 13 hits. They were plant studies, inhibitor models and reference-gene papers. General searches are swamped because GAPDH is a common lab loading control.
  - The only human hit is a single 1976 case report, "hereditary spherocytosis and GAPDH deficiency" in one kindred (*Blood*, PMID 1244916). It was not confirmed genetically, so I judged it not reliable enough and did not use it.
- **Signature cell type:** none (broadly expressed).
- **Unverified:** the whatHappensIfBroken field, plus the HPA version.

---

## Score arithmetic (25 × log10(1 + x), rounded)
| Value (nCPM) | Raw result | Score |
|---|---|---|
| 115.5 | 51.66 | 52 |
| 62.4 | 45.05 | 45 |
| 259.8 | 60.41 | 60 |
| 158.5 | 55.07 | 55 |
| 457.1 | 66.52 | 67 |
| 525.0 | 68.03 | 68 |
| 85.4 | 48.41 | 48 |
| 322.4 | 62.75 | 63 |
| 10.9 | 26.89 | 27 |
| 0.0 | 0 | 0 |
| 613.9 | 69.72 | 70 |
| 0.1 | 1.03 | 1 |
| 0.7 | 5.76 | 6 |
| 1.8 | 11.18 | 11 |
| 70.7 | 46.39 | 46 |
| 267.4 | 60.72 | 61 |
| 1825.7 | 81.54 | 82 |
| 2157.1 | 83.35 | 83 |
| 991.0 | 74.91 | 75 |

## Word counts
| Gene | plainSummary (max 25) | whatHappensIfBroken (max 30) |
|---|---|---|
| ATP5F1A | 24 | 30 |
| PPARGC1A | 18 | 24 |
| MB | 19 | 28 |
| GAPDH | 24 | TODO |

## Visual choices (not biology)
| Gene | Primitive | Color | Count |
|---|---|---|---|
| ATP5F1A | ring | #F0E442 | 14 |
| PPARGC1A | sphere | #56B4E9 | 8 |
| MB | sphere | #D55E00 | 16 |
| GAPDH | cluster | #0072B2 | 12 |

Colors repeat earlier ones (ACTA1, SCN2A) because there are only 7 Okabe-Ito colors.

## Post-merge edits (main session)

- **ATP5F1A rbc: 67 → 0.** The HPA value (457.1 nCPM) comes from erythrocyte
  *progenitors*, which still have mitochondria. Mature red blood cells have none
  (OpenStax A&P 2e §18.3), so a mitochondrial protein can't be present. The
  validator now enforces this rule for every gene (see README).
- **ATP5F1A whatHappensIfBroken** trimmed from 31 to 27 words ("some cases are
  fatal in the first weeks" → "some die within weeks"). Meaning unchanged.
