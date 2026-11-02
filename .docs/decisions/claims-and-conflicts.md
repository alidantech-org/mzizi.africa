---
{id: DEC-CLAIMS-AND-CONFLICTS,name: Decision - keep all claims, rank by source trust, derive the canonical value,type: decision,tags: [data-engine,provenance,reinforcement,claims]}
---

# Decision: claims, corroboration and conflicts

Date: 3 November 2026. Builds on DEC-PROVENANCE-IN-SOURCE and DEC-ENTITY-MATCHING; implements TSK-BF88B31E115A and starts TSK-D16F9399E4B6.

## Decision

- **Keep every claim.** A claim is one value that one source asserts for one field of one record. Disagreeing or older claims are never overwritten or deleted; a reviewer can mark one `rejected`.
- **Existing relations first.** Who asserts it, when, by what method and with what confidence is the existing `source.attributions` row (`supports`/`contradicts`, `target_field`, `method_id`, `confidence`). Source trust is `source.publishers.reliability` (0.5 when unset) multiplied by the attribution confidence. The only new thing is the value itself, which attributions cannot hold: `engine.claims` (value, hash of the value, `attribution_id`, publisher, trust, observed time, valid period, review state). References are plain uuids, never cross-schema foreign keys.
- **Canonical value is derived.** The winner is the claim with the highest trust, then the most recent `observed_at`. It is written to `engine.claim_standings` (one row per record and field) with the reason, never to the data table directly; promotion of a winner into the data table stays the controlled, reviewed path.
- **Corroboration** is the number of independent publishers behind the winning value (the same publisher repeating itself counts once).
- **Disputed** means more than one distinct value among non-rejected claims. Disputed fields re-enter the gap queue (reason `disputed`) for a reviewer; so do winners older than a year (`stale`).
- **AI-assisted** claims use an `ai_assisted` method on the attribution and are ordinary claims: ranked by trust, reviewable, never silent.
- Deduplication of the *records* claims are about stays with DEC-ENTITY-MATCHING (scores and flags, never a name-only merge).

## Reinforcement tables (`engine` schema)

- `gaps`: one row per missing/stale/disputed field (target_kind `schema.table`, target_id, field), status `open`, `queued`, `found`, `not_found`, `ambiguous`, `known_absent`, priority, ordered `refill_sources`, retry time.
- `gap_attempts`: append-only log of each source tried and its outcome, so a search is not repeated before the retry window (30 days).
- `claims`, `claim_standings` as above.

## Refill

A `refill` job (existing job runner) takes a gap, runs each registered source handler not yet tried, logs the attempt, and on `found` records a *proposed* claim tied to an attribution the handler wrote. Handlers (Wikidata, ORPP, KNBS, IEBC, Kenya Law) are registered by other lanes with `register_refill`; the framework contains none. Coverage (`coverage`) and the queue (`gaps build|report|enqueue`) are CLI commands; coverage rules live in `reinforcement.RULES`.

## Open

Status document and review workbench publishing of the coverage report; promotion of an accepted winner into the data table.
