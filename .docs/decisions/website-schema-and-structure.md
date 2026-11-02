---
{id: DEC-WEBSITE-SCHEMA-STRUCTURE,name: Decision - website schema and Mzizi-owned site structure format,type: decision,tags: [website,source,data-engine]}
---

# Decision: website schema and Mzizi-owned site structure format

Date: 2026-11-02. Decided by the user.

## Decision

1. A new `website` schema holds known sites, their domains (many per site, with validity), site-to-publisher links, logical structures, immutable structure versions, the files of each version and append-only checks. Sites have their own stable ids; domain is never an identifier.
2. Structure bytes are files in `filesystem`, one folder per version. `source.captures` and `source.documents` link back with soft ids to site, domain and structure version.
3. Mzizi defines its own site structure format (`mzizi.site/v1`): modular bundle of manifest, module, mapping and tag files plus Markdown notes. DevAuto's `site.structure.yml` is not used; only concepts such as alternative selectors with confidence and declarative-only rules are borrowed.
4. Agents author structures in batches and publish them without human approval, because a structure is not canonical data. Authorship is attributed (method, model, inputs). A failing live check demotes a version automatically.
5. The engine runs structures deterministically; no model runs at extraction time.

6. Sites belong to families (geographic unit, institution type, independent body, platform, purpose) defined by domain patterns such as `{county}.go.ke`. Patterns plus subject sets (geography units, institutions) generate `expected` sites that are probed and promoted; they are never identifiers.
7. Families own base structure bundles; sites extend them with overlays. Similarity is captured three ways: agent-assigned trait tags, computed fingerprints, and explicit relation edges between sites and families. Sites link to geography units, governance institutions, organizations and kinds of material through `site_subjects`.

8. Legal and source approval is an independent, versioned gate (`LEGALITY_SAFETY_AND_COMPLIANCE.md`). Decision 4 (agents publish structures without approval) covers only the structure as a technical recipe: publication never activates collection, agents may draft but never approve an assessment, and the engine fails closed unless a current approved assessment covers the request.

9. Assessments and jurisdiction dossiers are stored in the `website` schema (not `reference` or `source`): the gate reads them with the site registry, `reference` holds vocabularies, and `source` holds provenance. They are append-only with an `is_current` row, are not exposed by the public API, and captures carry a soft `assessment_id`. The gate is `engine/database/src/gate.ts`.

## Consequences

The earlier research note's DevAuto integration contract, the "structure approval" gate and the plan to reference DevAuto structures by hash are dropped from the intake plan. New work: Dryv contracts for `website`, migrations, the JSON Schema, structure loader/runner and agent batch tooling. Data extracted through structures keeps its normal candidate, validation and review path.
