---
{id: DOC-EXECUTION-PLAN,name: Parallel execution plan for the data engine lanes,type: documentation,tags: [plan,lanes,agents,data-engine]}
---

# Parallel execution plan

Written 3 November 2026 after reconciling every open task. Task dependencies are recorded with `task update --depends-on`; this file adds lane ownership and the rules that keep parallel agents from colliding.

## Rules for every lane

- **One writer per table set.** A lane owns its schemas; no other lane writes them. Shared surfaces (Dryv contract files, migrations folder, `fixtures/seed`) are touched through short, sequential commits: pull nothing, commit often, never reorder.
- **Migrations:** each lane uses its own timestamp range (A 1793900…, H 1794000…, B 1794100…, C 1794200…, D 1794300…, F 1794400…, G 1794500…) and runs the full database engine tests plus the drift check before committing.
- **Real database `mzizi`:** full autonomy as `mzizi-agent` with a rationale; take a `pg_dump` snapshot before large promotions; stop on a failed validation or any gate stop (401, 403, 429, challenge).
- **Requests:** only through the gate, 0.2 requests per second, robots.txt, trusted `.go.ke` and named exact hosts, depth 2, size caps. Kenya Law is never bypassed.
- **Provenance:** no new `source` text columns; use `source.attributions` and `source.verifications`. Seeds and patterns are source documents.
- **Branch:** `develop` only. Each lane records work in its tasks (`task check`), runs `task validate`, and commits with the trailer.
- **Done means:** tests green, drift clean, task checklist ticked, docs updated, and a short report of counts and gaps.

## Lanes and ownership

| Lane | Tasks (in order) | Owns | Starts when |
|---|---|---|---|
| A domains | TSK-2FE5E3594E4C finish (design note, API reads, rename `source` to `origin`, drop note columns); TSK-998EC5BE2CBA backfill; TSK-41CD5EF36909 probe | `website.domains`, `domain_zones`, `dns_snapshots` | now |
| H places and governance | TSK-2107BCCA74E8; TSK-AA0A323E646D; TSK-28DC592B1E17; TSK-0FDD5A808362; TSK-02CA35EA9ED1; TSK-EBA9E2370C55; TSK-4864E3B1AD5E | `place`, `contact`, `governance`, `civic`, `organization.locations` | now (contracts first) |
| B structures and crawler | TSK-E29DD2591768; TSK-C6D4EC067F97; TSK-C6EB48738A4D | website structure bundles, document registry | now (after A's migration lands) |
| C parties and IEBC | TSK-A67F72A02702; TSK-FDB011601399; TSK-6E8B8BC93A82; TSK-84B0D19A895B | `political`, party and IEBC data | ORPP seed after H's catalogue, register after B's crawler |
| D statistics | TSK-1F02AF48DAD0 then the other eight in dependency order | `statistical`, geography measurements | now |
| E publishers | TSK-2A15C7E9908D | seeds and imports for Gazette, Parliament, lands, budget, audit | after B's crawler |
| F reinforcement and media | TSK-BF88B31E115A; TSK-D16F9399E4B6; TSK-A6C9B9251A15; TSK-7EC27F97DC64 | claims, gap queue, media | framework now, media after |
| G procurement | `fix3.sh` pass, older OCDS years (2018/19 to 2024/25) | `procurement` | now |

## Conflicts resolved

- Constituency offices PDF moved from the IEBC task to the places research task (expected placements, not party data).
- Domain provenance columns removed in favour of attributions (before the backfill).
- Claims task depends on the reinforcement framework; both reuse the source schema.
- `geoUnitId` on institutions, amenities and locations is split into jurisdiction scope, containment, and placement (places plan).

## Start order for the first wave

Run in parallel: A (migration applied to the real database, then provenance cleanup), H1 (place contracts), B1 (section model), D1 (statistical schema), F1 (reinforcement framework), G (promotion pass). Everything else starts as its dependencies complete.
