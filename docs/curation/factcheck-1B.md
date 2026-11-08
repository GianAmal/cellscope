# bio-factcheck report B: GCK, ALB, CYP3A4, HBB, SLC2A1, ATP5F1A, PPARGC1A, MB, GAPDH

Reviewer: bio-factcheck (independent). Date: 2026-11-08. No project files were edited.

## How I checked
- NCBI Gene via E-utilities esummary (ids 2645,213,1576,3043,6513,498,10891,4151,2597): every symbol is "Official", Homo sapiens, and the full names match `fullName` exactly.
- UniProt REST flat files (P35557, P02768, P08684, P68871, P11166, P25705, Q9UBK2, P02144, P04406): all Reviewed, gene names match, and I read the location and disease lines.
- HPA download API, re-queried myself with single-cell fields plus tissue fields (`t_RNA_liver`, `t_RNA_skeletal_muscle`, `t_RNA_cerebral_cortex`, `t_RNA_pancreas`, `t_RNA_bone_marrow`). Every single-cell nCPM in the curator logs matches what I got, so the score arithmetic is right. The problems below are about what the numbers mean, not about the arithmetic.
- PubMed abstracts via efetch: 23599390, 34483339, 15454086, 30918256, 31057599, 29461981, 40209323.
- MedlinePlus Genetics pages for HBB, GCK and SLC2A1 (read directly).

HPA API URL used (one per symbol):
`https://www.proteinatlas.org/api/search_download.php?search=<SYMBOL>&format=json&columns=g,eg,sc_RNA_Myonuclei,sc_RNA_Brain_excitatory_neurons,sc_RNA_Brain_inhibitory_neurons,sc_RNA_Hepatocytes,sc_RNA_Pancreatic_islet_cells,sc_RNA_Erythrocyte_progenitors,sc_RNA_Erythrocytes,t_RNA_liver,t_RNA_skeletal_muscle,t_RNA_cerebral_cortex,t_RNA_pancreas,t_RNA_bone_marrow&compress=no`

Systemic finding: `sc_RNA_Myonuclei` is single-**nucleus** data. For abundant cytoplasmic muscle transcripts it falls far below HPA bulk skeletal-muscle tissue: GAPDH 70.7 nCPM vs 25843.3 nTPM, ATP5F1A 115.5 vs 1500.9, MB 613.9 vs 38156.8. That changes the ranking across cell types only for GAPDH, where it makes muscle the lowest of the five (see below).

## Table

| entry | claim | verdict | source URL | suggested fix |
|---|---|---|---|---|
| GCK | symbol GCK official, fullName "glucokinase" | CONFIRMED | https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=2645&retmode=json | — |
| GCK | protein = Glucokinase (hexokinase-4), product of GCK | CONFIRMED | https://rest.uniprot.org/uniprotkb/P35557.txt | — |
| GCK | location cytosol | CONFIRMED | https://rest.uniprot.org/uniprotkb/P35557.txt (Cytoplasm, ECO:0000269) | Optional: in hepatocytes at low glucose, GCKR holds it inactive in the nucleus. Fine to leave out. |
| GCK | expression beta 44 (highest) | CONFIRMED | https://www.proteinatlas.org/ENSG00000106633-GCK/single+cell+type ; https://medlineplus.gov/genetics/gene/gck/ | — |
| GCK | expression hepatocyte 5 (lower than neuron 22) | **WRONG** (directionally) | https://medlineplus.gov/genetics/gene/gck/ ("primarily found in the liver and in beta cells"); HPA tissue liver 16.7 nTPM vs cerebral cortex 5.2 nTPM (API above) | Add a documented exception: hepatocyte = score from HPA tissue liver nTPM, round(25×log10(1+16.7)) = **31**. Record it in README/genes-batch-2.md as "GCK hepatocyte: single-cell value 0.6 nCPM contradicts tissue data and MedlinePlus; tissue liver 16.7 nTPM used". After the fix the order is beta 44 > hepatocyte 31 > neuron 22, which is defensible (hypothalamic glucose-sensing neurons do express GCK). |
| GCK | expression neuron 22, muscle 1, rbc 0 | CONFIRMED | HPA API (excit 5.9 / inhib 6.4, myonuclei 0.1, progenitors 0.0); tissue muscle 0.2 | — |
| GCK | plainSummary (phosphate tag; beta cells use it to sense sugar) | CONFIRMED | https://medlineplus.gov/genetics/gene/gck/ ; UniProt P35557 | Optional: add "and liver" if wording allows. Currently 25 words. |
| GCK | job (first step for burning/storing; works fast only when glucose plentiful → sensor) | CONFIRMED | UniProt P35557 FUNCTION | — |
| GCK | whatHappensIfBroken (GCK-MODY, mildly high from birth, usually no symptoms) | CONFIRMED | https://medlineplus.gov/genetics/gene/gck/ ("beta cells are less able to detect changes in blood glucose") | Optional precision: "slow to notice" suggests a delay, but the real effect is a higher glucose threshold. Alternative (27 words): "Weaker glucokinase means beta cells need more sugar before they release insulin, so blood sugar stays mildly high from birth (a diabetes called GCK-MODY), usually without symptoms." |
| GCK | signature gene for beta | CONFIRMED | MedlinePlus GCK; HPA | — |
| ALB | symbol / fullName "albumin" | CONFIRMED | NCBI esummary id=213 | — |
| ALB | protein Albumin | CONFIRMED | https://rest.uniprot.org/uniprotkb/P02768.txt | — |
| ALB | location "golgi" (convention for secreted proteins) | CONFIRMED as an acceptable convention (low risk of misleading) | UniProt P02768 "Secreted"; standard ER→Golgi→secretion route | It is not literally a resident Golgi protein, and albumin is not stored in granules. The job text correctly says it works in blood plasma, which limits the risk. Recommend the UI label secreted proteins in a few words, e.g. "made here, works outside the cell". |
| ALB | expression hepatocyte 100, others ≤9 | CONFIRMED | HPA API (81391.2 nCPM; tissue liver 198523.8 nTPM) | — |
| ALB | plainSummary | CONFIRMED | UniProt P02768 FUNCTION | — |
| ALB | job (water, salts, fatty acids, hormones, drugs; main job oncotic pressure) | CONFIRMED | UniProt P02768 (both statements marked "Probable" there) | — |
| ALB | whatHappensIfBroken (analbuminemia: mild swelling, low BP, tiredness, high blood fats; worse prenatally/infants) | CONFIRMED | https://pubmed.ncbi.nlm.nih.gov/31057599/ | — |
| ALB | signature gene for hepatocyte | CONFIRMED | HPA "Cell type enriched" Hepatocytes | — |
| CYP3A4 | symbol / full name | CONFIRMED | NCBI esummary id=1576 | — |
| CYP3A4 | protein Cytochrome P450 3A4 | CONFIRMED | https://rest.uniprot.org/uniprotkb/P08684.txt | — |
| CYP3A4 | location er | CONFIRMED | UniProt P08684 "Endoplasmic reticulum membrane" | — |
| CYP3A4 | expression hepatocyte 90, muscle 17, neuron 6, beta 2, rbc 0 | CONFIRMED | HPA API (3988.6 / 3.7 / 0.7 / 0.2 / 0.0) | Muscle 17 is slightly high for a student (tissue skeletal muscle is only 1.5 nTPM), but it is not directionally wrong. |
| CYP3A4 | plainSummary "processes most of the medicines people take" | CONFIRMED (UniProt: "majority of the administered drugs") | UniProt P08684 | Optional: the reviews usually quoted say roughly a third to a half of drugs. "Many of the medicines" is safer. |
| CYP3A4 | job (oxidizes drugs, steroids; often less active) | CONFIRMED | UniProt P08684 | — |
| CYP3A4 | whatHappensIfBroken (gain-of-function I301T → early rickets, poor vitamin D response) | CONFIRMED | https://pubmed.ncbi.nlm.nih.gov/29461981/ | It is correctly labelled "overactive". |
| CYP3A4 | signature gene for hepatocyte | CONFIRMED | HPA group enriched (hepatocytes, enterocytes) | — |
| HBB | symbol / full name | CONFIRMED | NCBI esummary id=3043 | — |
| HBB | protein beta-globin | CONFIRMED | https://rest.uniprot.org/uniprotkb/P68871.txt ; https://medlineplus.gov/genetics/gene/hbb/ | — |
| HBB | location cytosol | CONFIRMED | MedlinePlus HBB (inside red blood cells); GO cytosol | — |
| HBB | expression rbc 100, neuron 4, muscle 7, beta 2 | CONFIRMED | HPA API | — |
| HBB | expression hepatocyte 24 | UNVERIFIABLE (likely an artefact) | HPA API: hepatocytes 8.3 nCPM; bulk liver 1882.9 nTPM, which is blood-contaminated | Adult hepatocytes are not known to make beta-globin. 8.3 nCPM next to 53,853 in progenitors looks like ambient blood RNA. Either set it to 0 with a documented exception ("blood contamination; hepatocytes do not make hemoglobin") or leave it and accept a visible but small blob. I lean towards 0. |
| HBB | plainSummary | CONFIRMED | MedlinePlus HBB | — |
| HBB | job (2α + 2β, heme iron binds O2) | CONFIRMED | MedlinePlus HBB; UniProt P68871 | — |
| HBB | whatHappensIfBroken "One tiny change causes sickle cell disease" | **WRONG** (the simplification misleads) | https://medlineplus.gov/genetics/gene/hbb/ (sickle cell anemia = "homozygous sickle cell disease or HbSS") | One changed copy gives sickle cell *trait*, not disease. This is a classic misconception at age 15. Replacement (30 words): "A tiny change in both gene copies causes sickle cell disease: red blood cells bend into sickles, die early and block vessels. Other changes cause beta thalassemia (too little hemoglobin)." |
| HBB | signature gene for rbc | CONFIRMED | HPA cell type enriched (erythrocytes) | — |
| SLC2A1 | symbol / full name | CONFIRMED | NCBI esummary id=6513 | — |
| SLC2A1 | protein GLUT1 | CONFIRMED | https://rest.uniprot.org/uniprotkb/P11166.txt | — |
| SLC2A1 | location plasma_membrane | CONFIRMED | UniProt P11166 "Cell membrane" | — |
| SLC2A1 | expression rbc 56, beta 28, neuron 19, hepatocyte 13, muscle 1 | CONFIRMED | HPA API | Direction is right: GLUT1 is high in human RBCs, low in neurons (which mainly use GLUT3) and low in muscle (GLUT4). |
| SLC2A1 | plainSummary "main way glucose reaches the brain" | CONFIRMED | https://medlineplus.gov/genetics/gene/slc2a1/ (blood-brain barrier) | — |
| SLC2A1 | job | CONFIRMED | UniProt P11166; MedlinePlus | — |
| SLC2A1 | whatHappensIfBroken (GLUT1 deficiency: seizures, movement problems, delay) | CONFIRMED | MedlinePlus SLC2A1 | — |
| SLC2A1 | signature gene for rbc | CONFIRMED | HPA (progenitors 179.8, erythrocytes 196.8 nCPM) | Not RBC-specific (placenta and BBB are higher), but it is characteristic of human RBCs. Acceptable. |
| ATP5F1A | symbol / full name | CONFIRMED | NCBI esummary id=498 | — |
| ATP5F1A | protein ATP synthase subunit alpha, mitochondrial | CONFIRMED | https://rest.uniprot.org/uniprotkb/P25705.txt | — |
| ATP5F1A | location mitochondrion | CONFIRMED | UniProt P25705 | — |
| ATP5F1A | expression neuron 45, muscle 52, hepatocyte 60, beta 55 | CONFIRMED (none of the text claims muscle is highest) | HPA API | Caveat: muscle comes from single-nucleus data and bulk muscle is the highest tissue (1500.9 nTPM). No change required, because hepatocytes are also very mitochondria-rich. |
| ATP5F1A | rbc 67 → 0 (organelle override) | CONFIRMED | OpenStax A&P 2e §18.3 (mature erythrocytes lack mitochondria); HPA erythrocytes 33.8 nCPM is leftover RNA | — |
| ATP5F1A | plainSummary | CONFIRMED | UniProt P25705 FUNCTION | — |
| ATP5F1A | job (core of Complex V, uses proton gradient) | CONFIRMED | UniProt P25705 | — |
| ATP5F1A | whatHappensIfBroken (energy shortage from birth; poor growth, encephalopathy, lactic acid; some die within weeks) | CONFIRMED | https://pubmed.ncbi.nlm.nih.gov/23599390/ ; https://pubmed.ncbi.nlm.nih.gov/34483339/ ; UniProt DISEASE MC5DN4B "death in the first weeks of life" | — |
| PPARGC1A | symbol / full name | CONFIRMED | NCBI esummary id=10891 | — |
| PPARGC1A | protein PGC-1alpha | CONFIRMED | https://rest.uniprot.org/uniprotkb/Q9UBK2.txt | — |
| PPARGC1A | location nucleus | CONFIRMED | UniProt Q9UBK2 [Isoform 1]: Nucleus | — |
| PPARGC1A | expression muscle 68, hepatocyte 63, neuron 48, beta 27, rbc 0 | CONFIRMED | HPA API; tissue liver 41.7 / muscle 28.1 / cortex 6.4 nTPM | rbc 0 is consistent with no nucleus. |
| PPARGC1A | plainSummary "Especially active in muscle and liver" | CONFIRMED (within the app's five cell types) | HPA API; https://pubmed.ncbi.nlm.nih.gov/15454086/ | — |
| PPARGC1A | job (coactivator; mitochondria genes; liver gluconeogenesis) | CONFIRMED | https://pubmed.ncbi.nlm.nih.gov/15454086/ | — |
| PPARGC1A | whatHappensIfBroken (mouse knockout: reduced mitochondrial function, hyperactive, striatal lesions) | CONFIRMED, clearly labelled as mice | https://pubmed.ncbi.nlm.nih.gov/15454086/ | — |
| MB | symbol / full name | CONFIRMED | NCBI esummary id=4151 | — |
| MB | protein Myoglobin | CONFIRMED | https://rest.uniprot.org/uniprotkb/P02144.txt | — |
| MB | location cytosol (sarcoplasm) | CONFIRMED | UniProt P02144 "Cytoplasm, sarcoplasm" | — |
| MB | expression muscle 70, others ≤11, rbc 0 | CONFIRMED | HPA API (tissue muscle 38156.8 nTPM) | — |
| MB | plainSummary (heart and skeletal muscle, stores and spreads O2) | CONFIRMED | UniProt P02144; https://pubmed.ncbi.nlm.nih.gov/30918256/ | — |
| MB | job | CONFIRMED | UniProt P02144 | — |
| MB | whatHappensIfBroken (recurrent variant, adult onset, proximal→distal, breathing/heart) | CONFIRMED | UniProt DISEASE MYOSB; https://pubmed.ncbi.nlm.nih.gov/30918256/ | — |
| MB | signature gene for muscle | CONFIRMED | HPA group enriched (myonuclei) | — |
| GAPDH | symbol / full name | CONFIRMED | NCBI esummary id=2597 | — |
| GAPDH | protein GAPDH | CONFIRMED | https://rest.uniprot.org/uniprotkb/P04406.txt | — |
| GAPDH | location cytosol | CONFIRMED | UniProt P04406 "Cytoplasm, cytosol" (ECO:0000269) | — |
| GAPDH | expression neuron 61, hepatocyte 82, beta 83, rbc 75 | CONFIRMED | HPA API | rbc 75 is fine: mature RBCs have no mitochondria, depend on glycolysis and keep GAPDH. |
| GAPDH | expression muscle 46 (lowest of the five) | **WRONG** (directionally) | HPA API: tissue skeletal muscle 25843.3 nTPM, about 6–11× liver (2360.5), cortex (2988.7) and pancreas (602.3); myonuclei 70.7 is single-nucleus data | Skeletal muscle is the top GAPDH tissue among these. Showing it lowest teaches the opposite. Add a documented exception: muscle = score from HPA tissue skeletal muscle nTPM, min(100, round(25×log10(1+25843.3))) = min(100, 110) = **100**. Log reason: "single-nucleus Myonuclei data under-counts cytoplasmic transcripts; contradicts tissue data". |
| GAPDH | plainSummary (housekeeping, nearly every cell; one glycolysis step) | CONFIRMED | HPA "Detected in all"; UniProt P04406 FUNCTION | — |
| GAPDH | job (G3P → 1,3-bisphosphoglycerate in cytosol) | CONFIRMED | UniProt P04406 | — |
| GAPDH | whatHappensIfBroken "TODO: verify" | **WRONG** (a placeholder must not ship) | UniProt P04406 (no DISEASE section); https://pubmed.ncbi.nlm.nih.gov/40209323/ (GAPDH used as an "essential gene" whose function must be kept for iPSCs to survive) | Replacement (27 words): "No human disease is clearly linked to GAPDH changes. Scientists treat it as an essential gene: human cells grown in the lab cannot survive without working GAPDH." Add the sources https://www.uniprot.org/uniprotkb/P04406/entry (already present) and https://pubmed.ncbi.nlm.nih.gov/40209323/. I agree with the curator that the 1976 single-kindred report (PMID 1244916) should not be used. If you want stronger backing for "cannot survive", cite DepMap (GAPDH is a common-essential gene); I did not verify that page. |
| GAPDH | sources | UNVERIFIABLE (gap) | — | None of the three sources supports any whatHappensIfBroken claim. Add the PMID above together with the new text. |

## Conventions ruling
- **ALB at "golgi":** this is an acceptable stylisation, rated low risk of misleading. The job text puts albumin's work in blood plasma. Add a short UI cue for secreted proteins.
- **rbc from erythrocyte progenitors + organelle override:** acceptable. For my genes every resulting value is directionally right (HBB 100, SLC2A1 56, GAPDH 75; ATP5F1A, PPARGC1A and MB 0). ATP5F1A 67→0 is correct.

## Counts
CONFIRMED 69 · WRONG 4 · UNVERIFIABLE 2 (75 rows)
