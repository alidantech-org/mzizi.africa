---
{id: TSK-B01DE85F253D,name: Plan all page and link migrations and verification before implementation,type: task,status: in-progress,priority: medium,created_at: 2026-11-19T11:46:50.306Z,updated_at: 2026-11-19T13:16:04.332Z,order: 3072,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T13:16:04.332Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-B01DE85F253D/1795094164335-start,started_at: 2026-11-19T13:16:05.631Z}]}}}
---

# Plan all page and link migrations and verification before implementation

## Goal

Translate the active route inventory into a reviewable migration plan. Preserve geographic scope, meaningful record selection and evidence when opening existing links or saved items. Include the approved language and sharing journey while keeping runtime implementation details outside this documentation update.

## Context

This is planning work in the geographic explorer task group, which remains IMPLEMENTATION AUTHORIZED. The owner chose a single site with explicit country prefixes such as /ke and /ug. Country subdomains are excluded from the initial scope. The owner also approved optional lang selection, cookie persistence and a language-in-sharing toggle, without language path prefixes or translated place slugs. These are agreed product behaviours; technical implementation has not yet been documented or approved. Preserve unrelated work and update these same task records as discussion continues. No application changes, generation or deployment follow from completing this documentation update.

## Acceptance checklist

- [ ] Retain the complete mapping of 43 page routes and nine contextual variants, referencing inventory task TSK-D3D7345BAA2F.
- [ ] Inventory sidebar, map, search, card, article, evidence, form, saved-item and legacy links under country-prefixed paths.
- [ ] Identify product gaps in applicability, historical validity, missing data and meaningful sharing state without claiming they already work.
- [ ] Specify user-visible verification for direct/shared links, language preference, explicit lang, fallback translations and desktop/mobile navigation.
- [ ] Obtain explicit acceptance of remaining planning before implementation begins.

## Readiness

Product direction is agreed, but this task remains planned and authorized for implementation. Further discussion will refine its acceptance criteria. Technical implementation details are intentionally deferred.

## MUST-FIX consolidation

This task owns the consolidated MUST-FIX mapping and acceptance inventory; API, generator and web implementation remain in the moved existing tasks. Preserve completed audit items as regressions, distinguish data/generator/deployment/policy gaps, and review the pasted delivery report against active code. The separate Dryv, API, generation and web tasks are now members of this group.

## Comments

### 2026-11-19T12:12:24.591Z · PETER IRUNGU

Owner-requested consolidation recorded from MUST-FIX.md and the attached delivery transcript on 2026-11-19. Five existing API/Dryv/web tasks were moved into GRP-F1658FA99444 with stable IDs, expanded acceptance, and explicit not-ready metadata; four product planning tasks remain. MUST-FIX is now the historical audit/index, not a competing backlog. Role-based reads, the place chip, generated interactions and delivered list/server pages are preserved as regression requirements, not newly marked complete. Missing data, seed approval, deployment controls and policy decisions remain separately visible. Plan execution is one integrated feature migration after readiness approval, not two successive frontend rewrites. task validate passed; no application, seed or deployment changes performed.

## Implementation authorization

The owner explicitly requested implementation of the integrated database, API and web redesign on 19 November 2026. That request supersedes earlier planning-only gates in this record. Implement web only, with realistic labelled synthetic development fixtures, contract-generated screen reads and clients/types. Engine operations, the dev frontend, Flutter and real-data acquisition are excluded. The accepted plan in this conversation is authoritative where older task prose conflicts. Seed-file approval rules remain in force.

## Implementation screen-to-data matrix

| Screen family | Required records and generated screen contract | Presentation and proof |
| --- | --- | --- |
| Context/home/place | countries, routing levels, slugs, geographic names/relations, local observations and coverage | authoritative country path, source-labelled local/ancestor measures, contextual navigation |
| Governance | institutions, positions, seats, holders, procedures/powers, public functions/assignments | StructureDocument authored from ReadStructure; graph edges retain actual meaning; named seat rules |
| Law/evidence | instruments, provisions/wordings, reviewed effects, citations/captures | instrument/provision identity validation and applicability, not country-wide text falsely labelled local |
| Statistics/comparison | indicators/roles, observations/components, metrics and dated geometry | units/periods and comparison compatibility; no invented overall score |
| Elections/parliament | elections, contests, electorates/results, motions/votes/speeches | geographic drill-down and source-labelled results, table alternatives |
| Finance/procurement | funds/flows, projects, procurements/contracts, bids/suppliers/partners/variations | distinguish allocation, award, contract and payment; consistent totals |
| Supplier/promises/completeness | ownership evidence, contributions, promises/fulfilments, patterns/templates/instances, disputes/replies | deterministic fixture-backed signals with evidence grades; no engine matching or inference |
| Existing auxiliary screens | events/occurrences, content/media, sources, personal saved state and approved engagement | retain existing functionality; keep product reads on server and local preferences/mutations separate |

The user explicitly authorized implementation. Baseline root check is captured in /tmp/mzizi-baseline-check.log and fails before this implementation in formatting/lint, mypy, stale .next types, manifest tests, database tests and a web server-only test import. HTTP success and past reports are not current browser QA. No screen row is marked complete by this matrix.
