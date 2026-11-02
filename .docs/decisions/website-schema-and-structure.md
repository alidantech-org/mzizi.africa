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

## Consequences

The earlier research note's DevAuto integration contract, the "structure approval" gate and the plan to reference DevAuto structures by hash are dropped from the intake plan. New work: Dryv contracts for `website`, migrations, the JSON Schema, structure loader/runner and agent batch tooling. Data extracted through structures keeps its normal candidate, validation and review path.
