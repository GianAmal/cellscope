# bio-factcheck report A: organelles, cell types, CKM / ACTA1 / SCN2A / SNAP25 / INS

Reviewer: bio-factcheck (independent). Date: 2026-11-08. No project files edited.

## Independent verification performed
- NCBI E-utilities esummary (gene 1158, 58, 6326, 6616, 3630): all five symbols/full names "Official", Homo sapiens, exact match to `fullName`.
- HGNC REST (rest.genenames.org/fetch/symbol/...): all five "Approved" (CKM previous symbol CKMM).
- UniProt REST JSON (P06732, P68133, Q99250, P60880, P01308): all Reviewed; recommended names, FUNCTION, SUBCELLULAR LOCATION and DISEASE comments read directly.
- HPA API re-queried today by Ensembl ID (HPA current release is 25.1): every nCPM value in genes-batch-1.md reproduced exactly; scores recomputed with 25*log10(1+x) and all match. Also pulled HPA values for the other signature genes (MB, ALB, CYP3A4, HBB, SLC2A1, GCK) to judge signatureGenes only.
- PubMed E-utilities efetch for PMIDs 8358791, 28301072, 38214802, 21467191, 24433144, 33808310 (abstracts read); esummary titles for all 10 cited PMIDs.
- MedlinePlus Genetics ACTA1/SCN2A/INS and OpenStax A&P 10.5, 17.9, 18.3, 23.6 page text fetched and searched. All 41 cited URLs resolve (HTTP 200; PubMed 203 = bot page, content verified via E-utilities).

## Verdict counts
CONFIRMED 91 | WRONG 2 | UNVERIFIABLE 1 (94 unique claims)

## Table

### Organelles

| entry | claim | verdict | source URL | suggested fix |
|---|---|---|---|---|
| nucleus | Stores the cell's DNA, which holds the instructions for making every protein the cell needs | CONFIRMED | https://openstax.org/books/anatomy-and-physiology-2e/pages/3-3-the-nucleus-and-dna-replication | (Pedantic: mtDNA encodes 13 proteins; acceptable simplification at this level.) |
| cytosol | Watery inside of the cell; many proteins made there; glycolysis starts breaking down sugar for energy | CONFIRMED | https://www.proteinatlas.org/humanproteome/subcellular/cytosol | none |
| plasma_membrane | Outer boundary, controls what goes in/out, carries receptors | CONFIRMED | https://www.proteinatlas.org/humanproteome/subcellular/plasma+membrane | none |
| mitochondrion | "Makes the ATP energy that powers the cell" | WRONG (minor, wording) | https://openstax.org/books/anatomy-and-physiology-2e/pages/18-3-erythrocytes ; https://openstax.org/books/anatomy-and-physiology-2e/pages/10-5-types-of-muscle-fibers | Implies all ATP comes from mitochondria, which contradicts the app's own cytosol blurb (glycolysis) and RBC blurb (RBCs make ATP with no mitochondria). Replace with: "Makes most of the cell's ATP energy, using oxygen and a chain of proteins called the electron transport chain." |
| mitochondrion | uses a chain of proteins called the electron transport chain | CONFIRMED | https://www.proteinatlas.org/humanproteome/subcellular/mitochondria | none |
| er | Folded membrane network where export/membrane proteins are made and folded, and lipids are built | CONFIRMED | https://www.proteinatlas.org/humanproteome/subcellular/endoplasmic+reticulum | none |
| golgi | Modifies, sorts and packages proteins from the ER and sends them on | CONFIRMED | https://www.proteinatlas.org/humanproteome/subcellular/golgi+apparatus | none |
| all organelles | Cited HPA subcellular pages exist and cover the organelle | CONFIRMED | (pages above, all HTTP 200) | Optional: HPA pages are atlas pages, not explanatory text; an OpenStax Biology 2e ch. 4 link would back the blurbs better. |

### Cell types

| entry | claim | verdict | source URL | suggested fix |
|---|---|---|---|---|
| neuron | Sends electrical signals; dendrites collect, axon passes on to other cells | CONFIRMED | https://openstax.org/books/biology-2e/pages/35-1-neurons-and-glial-cells | none |
| neuron | shape `branched` | CONFIRMED | https://openstax.org/books/anatomy-and-physiology-2e/pages/12-2-nervous-tissue | none |
| neuron | organelles = all 6 | CONFIRMED | same | none |
| neuron | organelleScale {} | CONFIRMED | n/a | (Neurons are mitochondria-rich too, but leaving default is not wrong.) |
| neuron | signatureGene SCN2A | CONFIRMED | https://medlineplus.gov/genetics/gene/scn2a/ (NaV1.2 "primarily found in the brain"); HPA neurons 682.9 nCPM | none |
| neuron | signatureGene SNAP25 | CONFIRMED | https://www.uniprot.org/uniprotkb/P60880/entry ; HPA neurons 1191.9 nCPM | none |
| neuron | sources support blurb/organelles | CONFIRMED | OpenStax 12.2, Bio 35.1 | none |
| muscle | Long, cylindrical, multinucleate fiber that contracts to move the body | CONFIRMED | https://openstax.org/books/anatomy-and-physiology-2e/pages/10-2-skeletal-muscle | none |
| muscle | Oxidative fibers packed with mitochondria | CONFIRMED | https://openstax.org/books/anatomy-and-physiology-2e/pages/10-5-types-of-muscle-fibers ("oxidative fibers contain many more mitochondria") | none |
| muscle | shape `elongated` | CONFIRMED | OpenStax 10.2 | none |
| muscle | organelles = all 6 (ER = sarcoplasmic reticulum; Golgi present) | CONFIRMED | https://pubmed.ncbi.nlm.nih.gov/21467191/ (ER-to-Golgi trafficking in myofibers) | Note: 21467191 is a rat study; fine for organelle presence, but it is not a teaching source. |
| muscle | organelleScale.mitochondrion 1.4 | CONFIRMED | OpenStax 10.5 | none (applies to oxidative fibers; acceptable stylization) |
| muscle | signatureGene CKM | CONFIRMED | HPA Myonuclei 773.6 nCPM; UniProt P06732 | none |
| muscle | signatureGene ACTA1 | CONFIRMED | HPA Myonuclei 1143.9 nCPM; MedlinePlus ACTA1 | none |
| muscle | signatureGene MB | CONFIRMED | HPA Myonuclei 613.9 nCPM (others <2) | none |
| muscle | sources support claims | CONFIRMED | as above | none |
| hepatocyte | Main liver cell; processes nutrients, toxins, wastes from blood; makes bile | CONFIRMED | https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder | none |
| hepatocyte | plenty of mitochondria | CONFIRMED | https://pubmed.ncbi.nlm.nih.gov/28301072/ ("mitochondria are abundant in liver tissue") | Tissue-level statement, as the curators noted; acceptable. |
| hepatocyte | shape `round` (stylization) | WRONG (convention, low severity) | OpenStax 23.6 (hepatocytes arranged in plates/laminae; histologically polygonal) | Hepatocyte shape is a standard histology teaching point (polygonal/polyhedral cells in plates). A student will learn "liver cells are round". Fix: add a `polygonal` shape, or at minimum a visible caption "Shape simplified: real hepatocytes are many-sided (polygonal)." |
| hepatocyte | organelles = all 6 | CONFIRMED | https://pubmed.ncbi.nlm.nih.gov/24433144/ (hepatocyte TGN); OpenStax 23.6 | none |
| hepatocyte | organelleScale.mitochondrion 1.4 | CONFIRMED | PMID 28301072, 38214802 | none |
| hepatocyte | signatureGene ALB | CONFIRMED | HPA Hepatocytes 81391.2 nCPM | none |
| hepatocyte | signatureGene CYP3A4 | CONFIRMED | HPA Hepatocytes 3988.6 nCPM | none |
| hepatocyte | sources support claims | CONFIRMED | as above | none |
| rbc | Carries O2 lungs to tissues; no mitochondria, so makes energy without oxygen and doesn't use the O2 it carries | CONFIRMED | https://openstax.org/books/anatomy-and-physiology-2e/pages/18-3-erythrocytes ("Lacking mitochondria... rely on anaerobic respiration... do not utilize any of the oxygen they are transporting") | none |
| rbc | shape `biconcave` | CONFIRMED | OpenStax 18.3 | none |
| rbc | organelles = cytosol + plasma_membrane only (no nucleus/ER/Golgi/mito) | CONFIRMED | https://pubmed.ncbi.nlm.nih.gov/29311991/ ; https://pubmed.ncbi.nlm.nih.gov/21423015/ | none |
| rbc | organelleScale {} | CONFIRMED | n/a | none |
| rbc | signatureGene HBB | CONFIRMED | HPA Erythrocyte progenitors 53853.7, Erythrocytes 521402.5 nCPM | none |
| rbc | signatureGene SLC2A1 (GLUT1) | CONFIRMED | HPA progenitors 179.8, Erythrocytes 196.8 nCPM; GLUT1 is a major human RBC membrane protein | (Not RBC-exclusive; also blood-brain barrier. Acceptable.) |
| rbc | sources support claims | CONFIRMED | as above | none |
| beta | Senses high blood sugar and releases insulin, which helps body cells take in glucose and burn it for ATP | CONFIRMED | https://openstax.org/books/anatomy-and-physiology-2e/pages/17-9-the-endocrine-pancreas | Incomplete rather than wrong: OpenStax stresses that glucose not used for fuel is stored (glycogen, fat), which insulin also drives. Optional: "...take in glucose to use for energy or store for later." |
| beta | shape `round` (stylization) | CONFIRMED (acceptable stylization) | n/a | Beta cells are roughly polyhedral/ovoid in islets; "round" is a fair simplification and not a standard teaching point. |
| beta | organelles = all 6 | CONFIRMED | https://pubmed.ncbi.nlm.nih.gov/37152949/ ; https://pubmed.ncbi.nlm.nih.gov/33463547/ ; https://pubmed.ncbi.nlm.nih.gov/33808310/ | none |
| beta | organelleScale {} | CONFIRMED | n/a | none |
| beta | signatureGene INS | CONFIRMED | UniProt P01308 "Expressed by pancreatic beta-cells"; HPA islet 83209.9 nCPM | none |
| beta | signatureGene GCK | CONFIRMED | HPA islet 55.9 nCPM vs <7 elsewhere; GCK is the beta-cell glucose sensor | (GCK is also a liver enzyme in bulk tissue; fine as a beta signature.) |
| beta | sources support claims | CONFIRMED | as above | none |

### Genes / proteins

| entry | claim | verdict | source URL | suggested fix |
|---|---|---|---|---|
| CKM | symbol CKM official/current | CONFIRMED | https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=1158&retmode=json ; HGNC:1994 Approved | none |
| CKM | fullName "creatine kinase, M-type" | CONFIRMED | same | none |
| CKM | protein ck_m "Creatine kinase M-type" is product | CONFIRMED | https://www.uniprot.org/uniprotkb/P06732/entry | none |
| CKM | location cytosol | CONFIRMED | UniProt P06732 "Cytoplasm" | none |
| CKM | expression muscle 72 / neuron 5 / hepatocyte 0 / beta 8 | CONFIRMED | https://www.proteinatlas.org/ENSG00000104879-CKM/single+cell+type (773.6 / 0.6 / 0.0 / 1.0 nCPM, re-queried) | none |
| CKM | expression rbc 7 (from progenitors 0.9 nCPM; mature Erythrocytes 0.0) | UNVERIFIABLE | HPA as above | 0.9 nCPM is at the noise floor and HPA's own mature-erythrocyte value is 0.0; no source shows muscle-type CK protein in circulating RBCs (RBC creatine kinase is mainly the B form). The app will draw CKM blobs inside RBCs. Fix: set rbc to 0 (e.g. treat progenitor nCPM < 1 as 0), or accept and rely on the precursor caveat. |
| CKM | plainSummary: recharges ATP from creatine phosphate; busiest in muscle during sudden bursts | CONFIRMED | UniProt P06732 FUNCTION; https://pubmed.ncbi.nlm.nih.gov/8358791/ | none |
| CKM | job: moves phosphate between ATP and creatine, rebuilding ATP from creatine phosphate | CONFIRMED | UniProt P06732 FUNCTION | none |
| CKM | whatHappensIfBroken: in mice without it, muscles just as strong but no quick bursts | CONFIRMED | PMID 8358791 abstract: "no alterations in absolute muscle force, but lack the ability to perform burst activity" | Correctly labelled as a mouse finding. No human CKM-deficiency disease is listed in UniProt. |
| CKM | sources support claims | CONFIRMED | UniProt, NCBI, HPA, PMID 8358791 | none |
| ACTA1 | symbol official/current | CONFIRMED | NCBI gene 58; HGNC:129 Approved | none |
| ACTA1 | fullName "actin alpha 1, skeletal muscle" | CONFIRMED | NCBI esummary | none |
| ACTA1 | protein "Actin, alpha skeletal muscle" is product | CONFIRMED | https://www.uniprot.org/uniprotkb/P68133/entry | none |
| ACTA1 | location cytosol (UniProt: cytoplasm, cytoskeleton) | CONFIRMED | UniProt P68133 | Cytoskeleton mapped to cytosol: acceptable given 6 IDs. |
| ACTA1 | expression muscle 76 / neuron 10 / hep 0 / rbc 0 / beta 12 | CONFIRMED | https://www.proteinatlas.org/ENSG00000143632-ACTA1/single+cell+type (1143.9 / 1.4 / 0.0 / 0.0 / 2.0) | none |
| ACTA1 | plainSummary: skeletal actin links into thin threads in muscle fibers, needed for contraction | CONFIRMED | https://medlineplus.gov/genetics/gene/acta1/ | none |
| ACTA1 | job: forms thin filaments in sarcomeres, needed for contraction | CONFIRMED | MedlinePlus ACTA1 (sarcomeres, thin filaments) | none |
| ACTA1 | whatHappensIfBroken: disrupted thin threads, weakness, low tone, sometimes severe from birth | CONFIRMED | MedlinePlus ACTA1; UniProt DISEASE congenital myopathy 2B/2C "severe infantile" | none |
| ACTA1 | sources support claims | CONFIRMED | as above | none |
| SCN2A | symbol official/current | CONFIRMED | NCBI gene 6326; HGNC:10588 Approved | none |
| SCN2A | fullName "sodium voltage-gated channel alpha subunit 2" | CONFIRMED | NCBI esummary | none |
| SCN2A | protein "Sodium channel Nav1.2 (alpha subunit)" is product | CONFIRMED | https://www.uniprot.org/uniprotkb/Q99250/entry ; MedlinePlus "alpha subunit of... NaV1.2" | none |
| SCN2A | location plasma_membrane | CONFIRMED | UniProt Q99250 "Cell membrane; Multi-pass membrane protein" | none |
| SCN2A | expression neuron 71 / muscle 4 / hep 9 / rbc 0 / beta 27 | CONFIRMED | https://www.proteinatlas.org/ENSG00000136531-SCN2A/single+cell+type (682.9 / 0.4 / 1.2 / 0.0 / 10.5) | none |
| SCN2A | plainSummary: sodium channel gate in nerve cell membrane; sodium rushes in, helps fire signal | CONFIRMED | UniProt FUNCTION; MedlinePlus SCN2A | none |
| SCN2A | job: voltage-sensitive channel, opens on voltage change, Na+ flows in | CONFIRMED | UniProt FUNCTION | none |
| SCN2A | whatHappensIfBroken: misfiring signals, infant seizures, linked to autism and developmental delays | CONFIRMED | UniProt DISEASE (BFIS3, DEE11, ASD association); MedlinePlus SCN2A | none |
| SCN2A | sources support claims | CONFIRMED | as above | none |
| SNAP25 | symbol official/current | CONFIRMED | NCBI gene 6616; HGNC:11132 Approved | none |
| SNAP25 | fullName "synaptosome associated protein 25" | CONFIRMED | NCBI esummary | none |
| SNAP25 | protein "SNAP-25" is product | CONFIRMED | https://www.uniprot.org/uniprotkb/P60880/entry | none |
| SNAP25 | location plasma_membrane | CONFIRMED | UniProt "Cell membrane; Lipid-anchor"; "Membrane association requires palmitoylation" | Judgment call is the right one (t-SNARE acts at plasma membrane). |
| SNAP25 | expression neuron 77 / muscle 8 / hep 6 / rbc 1 / beta 64 | CONFIRMED | https://www.proteinatlas.org/ENSG00000132639-SNAP25/single+cell+type (1191.9 / 1.0 / 0.7 / 0.1 / 372.8) | High islet value is real biology (UniProt: SNAP25 acts in pancreatic beta cells). |
| SNAP25 | plainSummary: machinery nerve cells use to release neurotransmitters at synapses | CONFIRMED | UniProt FUNCTION | Optional: the app shows SNAP25 at 64 in beta cells while the summary mentions only nerve cells; a student may be puzzled. Not wrong. |
| SNAP25 | job: held on inner face of membrane by fatty tails; SNARE controlling neurotransmitter release | CONFIRMED | UniProt (palmitoyl lipid anchor; t-SNARE) | none |
| SNAP25 | whatHappensIfBroken: severe childhood epilepsy, drug-resistant seizures, delays in learning/walking/development | CONFIRMED | UniProt DISEASE DEE117 (refractory seizures, neurodevelopmental impairment) | none |
| SNAP25 | sources support claims | CONFIRMED | UniProt, NCBI, HPA | none |
| INS | symbol official/current | CONFIRMED | NCBI gene 3630; HGNC:6081 Approved | none |
| INS | fullName "insulin" | CONFIRMED | NCBI esummary | none |
| INS | protein "Insulin" is product | CONFIRMED | https://www.uniprot.org/uniprotkb/P01308/entry | none |
| INS | location golgi (convention; UniProt says "Secreted") | CONFIRMED (acceptable convention) | UniProt P01308 GO-CC: ER lumen, Golgi lumen, secretory granule lumen | Not misleading given the job text mentions storage granules. Mature insulin actually sits in granules that leave the Golgi; consider a UI tooltip "shown where it is packed for release". |
| INS | expression beta 100, all others 0 | CONFIRMED | https://www.proteinatlas.org/ENSG00000254647-INS/single+cell+type (83209.9; others 0.0) | none |
| INS | plainSummary: hormone from beta cells; tells cells to take sugar from blood, lowering blood sugar | CONFIRMED | UniProt FUNCTION; OpenStax 17.9 | none |
| INS | job: made as proinsulin, processed, packed into granules, released, signals glucose uptake | CONFIRMED | UniProt; MedlinePlus INS | none |
| INS | whatHappensIfBroken: no insulin -> diabetes; some INS changes cause diabetes under 6 months; others in young people | CONFIRMED | MedlinePlus INS (PNDM within 6 months; MODY); UniProt PNDM4, MODY10 | Optional: these are rare; "Some rare INS changes..." keeps students from thinking common diabetes is an INS-gene mutation (27 words). |
| INS | sources support claims | CONFIRMED | as above | none |

### Project conventions

| entry | claim | verdict | source URL | suggested fix |
|---|---|---|---|---|
| convention | Secreted proteins use location `golgi` | CONFIRMED (acceptable) | UniProt P01308 GO-CC | See INS row. |
| convention | rbc expression from erythrocyte progenitors + organelle-override zeroing | CONFIRMED (acceptable) | HPA; OpenStax 18.3 | Sound for HBB/SLC2A1 and the override correctly zeroes nuclear/mito/ER/Golgi proteins. Weakness: cytosolic/membrane proteins present only at trace progenitor RNA (CKM 0.9 nCPM) leak a nonzero rbc score; see CKM UNVERIFIABLE row. The UI should label rbc values "based on red-cell precursors". |
| convention | Scoring formula and HPA field mapping | CONFIRMED | HPA API (release 25.1) | All 30 scores in scope reproduce exactly. Record HPA release 25.1 in the curation log (curators' TODO). |
| convention | hepatocyte `round` | WRONG (low severity) | see hepatocyte shape row | see above |
| convention | beta `round` | CONFIRMED (acceptable) | see beta shape row | none |

(Counting rule: the convention rows that duplicate a cell-type row are not double-counted. Totals: 91 CONFIRMED, 2 WRONG, 1 UNVERIFIABLE (94 unique claims; the golgi, hepatocyte-round and beta-round convention rows repeat earlier rows).)
