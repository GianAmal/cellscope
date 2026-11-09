# Phase 5 fact-check — knockout effects and organelle activities

Independent review of the 14 `proteins[].knockout` entries and 6
`organelles[].activity` labels added in Phase 5.

**Result: 1 WRONG, 0 UNVERIFIABLE** (plus three "should fix" items). All fixed.

## The error, and why it mattered

`glut1.effect` was `stops`: knocking out SLC2A1 halted the glucose animation,
teaching that a GLUT1-null red blood cell takes in no sugar. The paper cited
*in its own sources array* (Martins Freire 2024, PMID 38916993) says the
opposite — it made GLUT1-null human erythroblasts, found glucose uptake only
"partially ablated", detected GLUT3 and GLUT4 protein, measured total ATP
maintained, and is titled "Complete absence of GLUT1 does not impair human
terminal erythroid differentiation."

Two compounding mistakes: the "only glucose transporter" premise came from a
source that hedges it ("thought to be expressed"), and the claim's aside that
other cells use GLUT2/3/4 is wrong for this app's own beta cell, where
SLC2A1 and SLC2A3 predominate over SLC2A2 (McCulloch 2011, PMID 21920790).

Fixed: `effect` → `reduces`, claim rewritten, the aside dropped.

## Other fixes

| Entry | Problem | Fix |
|---|---|---|
| `atp_synthase_alpha` | `confidence: high`, but every cited patient has a partial-function missense variant; no complete null is reported | → `medium`, claim notes patients kept partial function |
| `beta_globin` | Cited a GLUT1 paper (PMID 38916993) for a hemoglobin claim | Swapped for the OpenStax erythrocytes page |
| `snap25` | "that needs transporters, not SNAREs" is false — other SNAREs do traffic GLUT4; SNAP-23 does it in fat cells | Reworded to say the transporters are already in place |
| `pgc1a` | Mouse knockout finding not labelled as mouse, and "much less strongly" overstated a null where PGC-1β compensates | Reworded with the species named |
| `mitochondrion` activity | Named the proton gradient while the organelle blurb names only the electron transport chain, so a reader met the term cold | Label now ties the two together |
| `er`, `golgi` activity | "newly made … being built" was circular; "shipped out" implied everything leaves the cell | Reworded |

## Confirmed as-is

The other 13 knockout entries and all 6 activity labels were confirmed, and
all 14 claims are distinct from the protein's `whatHappensIfBroken`. The
reviewer specifically upheld `gapdh: stops` (the only paralogue, GAPDHS, is
testis-specific per UniProt O14556, so the glycolysis step has no somatic
backup) and the decision to keep `atp_synthase_alpha` at `reduces`.

Nine of fourteen knockouts are `unchanged`, and the reviewer confirmed every
one. The failure mode here was overclaiming an effect, not underclaiming.

## Known limitation

`knockout.effect` is a single value per protein, applied to whichever cell
type is on screen. That is fine for 13 of the 14, whose effect does not vary
much by cell type, but it cannot express "stops in a red blood cell, barely
matters in a neuron". If a future gene needs that, `effect` has to become
per-cell-type. Recorded rather than papered over.
