You’re right to push for the existing proposals as the baseline. I checked the Phase 01 files you listed. They already contain detailed table and column reviews, so the schema plan should be fitted to those proposals—not expanded with a new table catalogue.

The Phase 01 README and schema documents also contain sections titled **“Agreed responsibility — 12 November 2026.”** Those are the right starting point for the current decisions. The earlier list I gave was inaccurate: it introduced tables not established in those proposals and missed the actual designs.

The documented proposals currently include:

- `reference`: `schemes`, `values`, `units`, `topics`, and pattern tables including `patterns`, `pattern_versions`, `pattern_bindings` and `pattern_dependencies`.
- `geography`: `units`, `places`, `boundaries`, `relationships`, `names`, `changes`, `countries`, `legal_bases` and `datasets`.
- `legal`: `instruments`, `instrument_versions`, `provisions`, `provision_versions` and `amendments`.
- `official`: separate organization and person proposals, including `entities`, `individuals`, official names and identifiers, ownership, contact and source relationships. This is more specific than my invented generic `profiles` and `verification_records`.
- `governance`: `institutions`, `offices`, `holders`, `mandates` and `relationships`.
- `politics`: election proposals such as `elections`, `contests`, `candidates`, `results`, `turnout`, `options` and `option_results`, plus political proposals such as `parties`, `memberships`, `coalitions`, `alignments` and `positions`.
- `finance`: `years`, `budgets`, `allocations`, `entries`, `loans`, `repayments` and `disbursements`.
- `civic`: `assets`, `networks`, `segments`, `services`, `coverage` and `projects`.
- `accountability`: existing participation proposals such as `programmes`, `contributions` and `reviews`, plus the retained commitment proposal. The agreed expansion into government accountability needs to be fitted into this design carefully.
- `source`: `publishers`, `websites`, `documents`, `captures`, `evidence`, `citations`, `verifications` and `attributions`.
- `filesystem`: `folders`, `files`, `file_versions`, `file_relations`, `tags` and `taggings`.

One correction is already clear: replace `reference.jurisdictions` with **`reference.countries`** and keep the connected-foundation guidance: modern countries are reference identities; geography holds territorial units and their representations. Countrywide records link to the Kenya geographic unit, and null does not mean national scope.

There is also a decision to apply to the existing schema set: **remove `procurement` as a standalone Phase 01 schema and incorporate its proposed tables into `civic`**. The existing `procurement.md` must be read and its useful table and column proposals reconciled into Civic; it should not be replaced by my earlier guessed tender-table list. Finance remains separately responsible for fiscal records and payments.

Other items need reconciliation rather than invention. The existing Politics file combines two earlier designs; its agreed responsibility and actual table review should decide how the content is organized. Accountability’s current documented tables focus on participation, so the new accountability scope must be integrated into that proposal without assuming a particular table structure before reviewing its columns and relationships. Legal linkage must also follow the controlling connected-foundation decisions and the latest agreed Reference/Legal boundary, with any conflict called out.

For the document reorganization, the local agent should therefore:

1. Use the actual Phase 01 schema documents and their existing table/column inventories as source material.
2. Apply approved changes only: `reference.jurisdictions` → `reference.countries`; move Procurement’s existing proposals into Civic; incorporate the agreed Accountability/Participation scope; retain Source and Filesystem as separate schemas.
3. Preserve the source-redesign requirements for acquisition, review, extraction, provenance, file lineage and operational pipeline state.
4. Update table and column proposals only where needed to reflect those decisions; do not introduce speculative table names or imply unreviewed columns are approved.
5. Move other unassigned schemas to Phase 02 and operational schemas to their separate database folder, retaining proposal status and updating links.

This corrected approach fits the plan around the schemas and table proposals already in the repository.