# Curation log: gene batch 2 of 3 (GCK, ALB, CYP3A4, HBB, SLC2A1)

Curator: bio-curator agent. Date: 2026-11-08. Output: `frag-genes-2.json` (same folder).

## Method notes

- **Expression:** scored exactly as in `docs/curation/README.md` / batch 1. HPA single cell type RNA, nCPM, same seven fields, score = min(100, round(25 × log10(1 + nCPM))). neuron = max(excitatory, inhibitory). `Erythrocytes` is recorded raw only, not scored.
- **NCBI Gene:** confirmed through E-utilities (web pages may show a CAPTCHA, as in batch 1). All five records: nomenclature status "Official", Homo sapiens. `fullName` uses the NCBI official full name (lowercase, as NCBI gives it).
- **UniProt:** read through the REST JSON (all five Reviewed / Swiss-Prot).
- **HPA page URLs:** `https://www.proteinatlas.org/<ENSG>-<SYMBOL>/single+cell+type` returns HTTP 301 to `https://www.proteinatlas.org/<ENSG>/single+cell`. Batch-1 URLs (e.g. CKM) behave the same way, so I kept the batch-1 URL form in `sources`.
- **HPA release version:** still not shown in the API output. **TODO: verify** (same open item as batch 1).
- **Secreted-protein convention:** ALB is "Secreted" in UniProt. Following the INS convention from batch 1, it is mapped to `golgi` (where it is packaged before leaving the cell). See ALB below.

### API URLs queried
- NCBI: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=2645,213,1576,3043,6513&retmode=json`
- HPA expression (one per symbol; only the row whose Gene matches exactly was used):
  `https://www.proteinatlas.org/api/search_download.php?search=<SYMBOL>&format=json&columns=g,eg,up,sc_RNA_Myonuclei,sc_RNA_Brain_excitatory_neurons,sc_RNA_Brain_inhibitory_neurons,sc_RNA_Hepatocytes,sc_RNA_Pancreatic_islet_cells,sc_RNA_Erythrocyte_progenitors,sc_RNA_Erythrocytes&compress=no`
- HPA specificity summary: `https://www.proteinatlas.org/api/search_download.php?search=<SYMBOL>&format=json&columns=g,eg,rnascs,rnascd,rnascsm,rnats,rnatsm&compress=no`
- UniProt: `https://rest.uniprot.org/uniprotkb/<ACC>.json` for P35557, P02768, P08684, P68871, P11166
- PubMed: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=29461981&rettype=abstract&retmode=text` (same for 31057599). Searches: `esearch.fcgi?db=pubmed&term=CYP3A4+vitamin+D-dependent+rickets+type+3` and `term=analbuminemia[ti]`
- MedlinePlus Genetics (human pages, read directly): gck, hbb, slc2a1 = 200; alb and cyp3a4 = 404 (no page).

---

## GCK
- **Official symbol / full name:** GCK / glucokinase (NCBI GeneID 2645). UniProt RecName "Hexokinase-4" (HXK4_HUMAN). MedlinePlus lists "hexokinase type IV" as another name, so the protein name is "Glucokinase (hexokinase-4)".
- **UniProt:** P35557 (Reviewed). Ensembl ENSG00000106633.
- **Location:** UniProt lists Cytoplasm (experimental), Nucleus (experimental) and Mitochondrion (by similarity). The note says that under low glucose, GCK binds GCKR and "the inactive complex is recruited to the hepatocyte nucleus". → **`cytosol`** (judgment call). The enzyme does its main job, phosphorylating glucose, in the cytoplasm. GO includes cytosol (IDA:HPA). The nucleus holds the *inactive* storage pool in hepatocytes, so it is the alternative but not where the main job happens. Mitochondrion is only "by similarity" (inferred from another species' protein).
- **HPA single cell (nCPM → score):**
  - neuron: excitatory 5.9, inhibitory 6.4 → 6.4 → 22
  - muscle (Myonuclei) 0.1 → 1
  - hepatocyte 0.6 → 5
  - beta (Pancreatic islet cells) 55.9 → 44
  - rbc (Erythrocyte progenitors) 0.0 → 0 (Erythrocytes 0.0)
  - HPA: "Cell type enhanced". Top types are pituitary cells (corticotrophs 75.2, somatotrophs 60.6, thyrotrophs 57.9) and pancreatic islet cells 55.9. Tissue RNA: liver 16.7 nTPM, pituitary 19.5, brain 12.4.
  - **FLAG for fact-checker / human:** UniProt and MedlinePlus both say GCK is mainly in pancreatic beta cells and the liver. The HPA single-cell hepatocyte value is only 0.6 nCPM, so the hepatocyte score (5) is probably lower than the biology suggests. I reported the data as is and did not adjust it. The bulk tissue value for liver (16.7 nTPM) is consistent with liver expression.
- **whatHappensIfBroken source:** MedlinePlus Genetics GCK page. GCK-MODY (MODY2): mildly raised blood glucose from birth, usually no symptoms. Variants reduce glucokinase activity, so beta cells are less able to detect glucose changes and release insulin. UniProt DISEASE agrees (MODY2) and also lists PNDM1, HHF3 (low blood sugar from too much insulin) and a T2D association. These were left out for the word limit.
- **Signature gene for:** `beta` (highest of the 5 app cell types). The liver role is real (sources above) but not shown in the HPA single-cell data.
- **Unverified:** why the hepatocyte single-cell value is so low (data/method issue in HPA vs biology). HPA version.

## ALB
- **Official symbol / full name:** ALB / albumin (GeneID 213). UniProt RecName "Albumin" (ALBU_HUMAN).
- **UniProt:** P02768 (Reviewed). ENSG00000163631.
- **Location:** UniProt "Secreted." → **`golgi`**, by the project convention for secreted proteins (same as INS): the Golgi is where the protein is packaged before it leaves the cell. **Note for fact-checker:** UniProt's GO terms for ALB include ER lumen (TAS:Reactome) but **no Golgi term**, unlike INS. The ER → Golgi → secretion route for a secreted protein is standard cell biology and not quoted from a primary source here. `er` is the alternative. Unlike insulin, albumin is not stored in granules. I did not say it is, and the `job` says only "packaged for release".
- **HPA single cell (nCPM → score):**
  - hepatocyte 81391.2 → min(100, 123) = 100
  - neuron: excitatory 0.6, inhibitory 1.3 → 1.3 → 9
  - muscle 0.0 → 0
  - beta 1.0 → 8
  - rbc progenitors 0.0 → 0 (Erythrocytes 0.0)
  - HPA: "Cell type enriched" (Hepatocytes). Tissue: liver 198523.8 nTPM, "Tissue enriched".
- **Job text source:** UniProt FUNCTION: "Binds water, Ca(2+), Na(+), K(+), fatty acids, hormones, bilirubin and drugs (Probable). Its main function is the regulation of the colloidal osmotic pressure of blood (Probable)." "Keeping water in the blood" and "helps keep water inside blood vessels" are my plain-language glosses of colloid osmotic pressure. UniProt marks both statements "(Probable)".
- **whatHappensIfBroken source:** there is no MedlinePlus page (404). PubMed review: Minchiotti et al. 2019, *Front Genet* 10:336, PMID 31057599, "Diagnosis, Phenotype, and Molecular Genetics of Congenital Analbuminemia". From the abstract: very rare (about 90 cases worldwide), recessive; adults almost always have hyperlipidemia (high blood fats) and usually mild oedema (swelling), reduced blood pressure and fatigue; there are serious risks before birth (miscarriage, preterm birth) and in early childhood. UniProt DISEASE "Analbuminemia" agrees.
- **Signature gene for:** `hepatocyte`.
- **Unverified:** the Golgi mapping (convention, not a UniProt annotation). HPA version.

## CYP3A4
- **Official symbol / full name:** CYP3A4 / cytochrome P450 family 3 subfamily A member 4 (GeneID 1576). UniProt RecName "Cytochrome P450 3A4" (CP3A4_HUMAN).
- **UniProt:** P08684 (Reviewed). ENSG00000160868.
- **Location:** UniProt "Endoplasmic reticulum membrane; Single-pass membrane protein" and "Microsome membrane" (microsomes are lab fragments of ER) → `er`.
- **HPA single cell (nCPM → score):**
  - hepatocyte 3988.6 → 90
  - muscle 3.7 → 17
  - neuron: excitatory 0.7, inhibitory 0.6 → 0.7 → 6
  - beta 0.2 → 2
  - rbc progenitors 0.0 → 0 (Erythrocytes 0.0)
  - HPA: "Group enriched" (Hepatocytes 3988.6, Enterocytes 2039.8). Tissue: liver 3367.1 nTPM. "Liver and gut cells" in plainSummary is based on this hepatocyte + enterocyte group.
- **Job/summary source:** UniProt FUNCTION: "Responsible for oxidative metabolism of xenobiotics", "Metabolizes the majority of the administered drugs", plus sterols, steroid hormones, retinoids and fatty acids, and "oxidative deactivation of testosterone". "Often making them less active" generalizes the testosterone example and drug metabolism. **Fact-checker:** some drugs are activated rather than deactivated by CYP3A4, which is why the text says "often".
- **whatHappensIfBroken source:** there is no MedlinePlus page (404). PubMed: Roizen et al. 2018, *J Clin Invest* 128:1913-18, PMID 29461981, "CYP3A4 mutation causes vitamin D-dependent rickets type 3". Abstract: a recurrent de novo p.I301T variant in two unrelated patients with early-onset rickets, low vitamin D metabolites and deficient responsiveness to vitamin D. The mutant enzyme inactivates 1,25-dihydroxyvitamin D about 10 times faster than normal. UniProt DISEASE "Vitamin D-dependent rickets 3" agrees. **Note:** this is a *gain-of-function* (overactive) change, not a loss. The text says "overactive" so it is not misread as "broken = missing". "Rickets (soft, weak bones)" is a standard gloss and is not quoted. Only 2 patients were described in that paper.
- **Signature gene for:** `hepatocyte`.
- **Unverified:** whether complete loss of CYP3A4 causes any human disease. I found no source and made no claim. HPA version.

## HBB
- **Official symbol / full name:** HBB / hemoglobin subunit beta (GeneID 3043). UniProt RecName "Hemoglobin subunit beta" (HBB_HUMAN). MedlinePlus calls the protein "beta-globin".
- **UniProt:** P68871 (Reviewed). ENSG00000244734.
- **Location:** UniProt has **no SUBCELLULAR LOCATION comment** for HBB. GO cellular component includes cytosol (TAS:Reactome), hemoglobin complex (IDA) and extracellular region/exosome/blood microparticle. MedlinePlus says hemoglobin is "located inside red blood cells". → `cytosol` (hemoglobin fills the red-cell cytoplasm). The extracellular GO terms reflect free hemoglobin and haptoglobin-bound hemoglobin, not its main job.
- **HPA single cell (nCPM → score):**
  - rbc (Erythrocyte progenitors) 53853.7 → 100 (Erythrocytes 521402.5, raw only)
  - hepatocyte 8.3 → 24
  - muscle 0.9 → 7
  - neuron: excitatory 0.5, inhibitory 0.4 → 0.5 → 4
  - beta 0.2 → 2
  - HPA: "Cell type enriched" (Erythrocytes). Tissue: bone marrow 125480.9 nTPM.
  - The hepatocyte 8.3 value may be contamination from blood cells. Not verified; reported as is.
- **whatHappensIfBroken source:** MedlinePlus Genetics HBB page. Sickle cell disease: the Glu6Val change makes HbS stick together and bend red cells into sickles. The cells die early (anemia) and block small blood vessels. Beta thalassemia: variants that reduce or prevent beta-globin production. UniProt DISEASE agrees (sickle cell disease, beta-thalassemia, Heinz body anemias). "One tiny change" glosses the single amino-acid substitution.
- **Signature gene for:** `rbc` (strongest of all values in this batch).
- **Unverified:** HPA version only.

## SLC2A1
- **Official symbol / full name:** SLC2A1 / solute carrier family 2 member 1 (GeneID 6513). UniProt RecName "Solute carrier family 2, facilitated glucose transporter member 1" (GTR1_HUMAN). Common name GLUT1 (MedlinePlus, NCBI aliases).
- **UniProt:** P11166 (Reviewed). ENSG00000117394.
- **Location:** UniProt "Cell membrane; Multi-pass membrane protein" (plus melanosome and photoreceptor inner segment). Note: "Localizes primarily at the cell surface". → `plasma_membrane`.
- **HPA single cell (nCPM → score):**
  - rbc (Erythrocyte progenitors) 179.8 → 56 (Erythrocytes 196.8)
  - beta 12.1 → 28
  - neuron: excitatory 4.2, inhibitory 4.5 → 4.5 → 19
  - hepatocyte 2.2 → 13
  - muscle 0.1 → 1
  - HPA: "Cell type enhanced", "Detected in many". Top types are syncytiotrophoblasts 2979.0 and other placental/epithelial cells. Tissue: placenta 92.7 nTPM.
- **Job/summary source:** UniProt FUNCTION: facilitative (energy-independent) transporter for constitutive/basal glucose uptake, "Most important energy carrier of the brain", present at the blood-brain barrier. MedlinePlus: embedded in the outer membrane, moves glucose across the blood-brain barrier and between glia. **Teaching caveat:** GLUT1's brain role is mainly at the blood-brain barrier (blood-vessel cells) and in glia, not in neurons. This fits the low neuron score (19). The texts do not claim GLUT1 is high in neurons.
- **whatHappensIfBroken source:** MedlinePlus Genetics SLC2A1 page. GLUT1 deficiency syndrome: developmental delay, intellectual disability, movement problems, seizures. Reduced GLUT1 lowers the glucose available to brain cells. UniProt DISEASE agrees (GLUT1DS1/2, EIG12, DYT9).
- **Signature gene for:** `rbc` (highest of the 5 app types). Secondarily it is a teaching link to `neuron` via the brain glucose supply, but the HPA neuron value is low, so I do **not** recommend it as a neuron signature gene.
- **Unverified:** HPA version only.

---

## Signature-gene suggestions (from HPA data)
| Gene | Most characteristic app cell type |
|---|---|
| GCK | beta (HPA hepatocyte value unexpectedly low; see flag) |
| ALB | hepatocyte |
| CYP3A4 | hepatocyte |
| HBB | rbc |
| SLC2A1 | rbc |

## Score arithmetic (25 × log10(1 + x), rounded)
6.4→21.73→22, 0.1→1.03→1, 0.6→5.10→5, 55.9→43.88→44, 1.3→9.04→9, 81391.2→122.76→100, 1.0→7.53→8, 0.7→5.76→6, 3.7→16.80→17, 3988.6→90.02→90, 0.2→1.98→2, 0.5→4.40→4, 0.9→6.97→7, 8.3→24.21→24, 53853.7→118.28→100, 4.5→18.51→19, 2.2→12.63→13, 12.1→27.93→28, 179.8→56.43→56, 0.0→0.

## Word counts (limits 25 / 30)
plainSummary: GCK 25, ALB 25, CYP3A4 23, HBB 23, SLC2A1 23. whatHappensIfBroken: GCK 27, ALB 29, CYP3A4 27, HBB 28, SLC2A1 26.

## Visual choices (not biology)
- GCK cluster #F0E442 ×12
- ALB sphere #56B4E9 ×16
- CYP3A4 cluster #CC79A7 ×12 (CKM already uses #E69F00 cluster)
- HBB sphere #D55E00 ×16
- SLC2A1 ring #009E73 ×10
