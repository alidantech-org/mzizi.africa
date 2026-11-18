---
id: DOC-DATABASE-CHANGES-20261119
name: DATABASE_CHANGES_20261119
type: documentation
tags: [database, schema, postgres, dryv, review]
extra: {status: authored_and_generated_for_review, date: 2026-11-19, generated: schema.sql and engine models only}
---

# Database changes of 2026-11-19 (for review)

Authored in the Dryv contracts and generated with `bun run dryv:database:generate` (the `pgsql` app). The generated snapshot is `source/backend/database/sql/schema.sql`; the engine row models were regenerated with it. **Not generated yet:** the NestJS API modules, the SDKs and the frontend contracts. **No seed, no migration release and no database reset has been done.** The result is **139 tables in 14 schemas** (was 110 in 15 schemas), 570 indexes (160 unique), 536 foreign keys.

## Tables by schema

| Schema | Tables | New or changed this round |
| --- | --- | --- |
| activities (11) | contributions, motions, sittings, votes, **events, event_names, event_rules, occurrences, occurrence_changes, event_subjects, event_participants** | events and calendar, planned versus actual dates, reschedules and adjournments |
| auth (11) | unchanged | |
| civic (9) | bids, contracts, deliveries, procurements, project_features, projects, services, **facilities, beneficiaries** | procurements and contracts gain `category` and `nature`; facilities and beneficiaries new |
| **community (14, new)** | actors, devices, push_tokens, consents, preferences, saved_places, reactions, views, location_proofs, interactions, moderation_cases, subscriptions, notifications, notification_deliveries | device actors, consent, home and labelled places, likes, daily-hash views, mobile posts with location proof and moderation, push |
| filesystem (9) | unchanged (fun facts are `contents` rows of a new category value) | |
| finance (7) | funds gains `funding_source` | |
| geography (9) | **levels** | per-country ladders and the routing hierarchy |
| governance (8) | **obligations, reports** | reporting duties and filings |
| legal (9) | unchanged | |
| official (7) | unchanged (abbreviations are name rows of the existing abbreviation kind) | |
| politics (15) | **electoral_terms, polling_stations**; elections gain status, parent election, term, authority; contests gain vacancy reason, previous holder, seat count; electorates gain spoilt ballots and status; electorates and results unique per status | election model and polling stations |
| reference (11) | **copy**; values gain `icon_code` and `color_token`; countries gain `default_language_id`, `subdomain`, `is_served` | copy per language, display hints, country context |
| source (16) | **slugs, slug_relations, coverage** | slug registry with history and relations; coverage ledger |
| statistics (3) | **metrics** | ranking and comparison measures as data |
| ~~audit~~, ~~facts~~ | **removed** (audit.events, audit.decisions; facts.facts, facts.fact_places) | owner decision |

## Design points worth checking

- **Everything new is a normal table with code or id, foreign keys and indexes** from the same bases as existing tables; subject-carrying tables use the standard `subject_table` and `subject_id` pair, now covering **128 subject tables**. `0002_subject_integrity.sql` was rewritten by the tool (existence, enum and delete-restrict checks).
- **Polling stations** are their own table over a geography feature; voter counts and results are the existing electorates and results with the station feature as the unit; provisional and final results can both be held.
- **Events** keep planned and actual dates separate and record every change; election milestones are events attached to the election through `event_subjects`.
- **Facilities** are a thin role on a feature; capacity and size are observations on the feature; classes and levels are classification values.
- **Buyer, supplier, beneficiary, funder:** `procurements.buyer_entity_id`, `contracts.contractor_entity_id`, `beneficiaries`, `funds.funding_source_id`, plus category and nature.
- **Slugs:** parent is the parent's own slug row; uniqueness is among active rows; no title column.
- **Community tables hold no name, email or phone.** Fingerprints are hashes; location proofs keep a matched place and a coarse cell, not raw coordinates.

## Needs from the owner (seed) before the database can be used

Every classification column points at a scheme that does not exist yet in `seed/`, which is rebuilt only with the owner's approval file by file. New or still-missing schemes: act.change.kind, act.change.reason, act.event.kind, act.occurrence.format, act.occurrence.knowledge, act.occurrence.status, act.participant.role, act.rule.adjustment, act.rule.kind, act.subject.role, civ.benefit.kind, civ.contract.nature, civ.facility.class, civ.facility.ownership, civ.facility.status, civ.procurement.category, com.consent.purpose, com.interaction.kind, com.moderation.decision, com.notification.kind, com.place.label, com.reaction.kind, com.subscription.kind, fin.fund.source, geo.hierarchy.kind, gov.obligation.frequency, gov.obligation.kind, gov.obligor.kind, gov.report.status, pol.election.kind, pol.election.status, pol.result.status, pol.station.kind, pol.term.kind, pol.vacancy.reason, src.coverage.level, src.coverage.subject, src.slug.namespace, src.slug.relation, and the content category value `fun-fact` in fil.content.category. Several older tags (for example fil.content.category and sta.dimension.*) are also absent because the seed was emptied.

## Consequences still open

- The NestJS API, SDKs and frontend contracts still reflect the old schema (facts and audit, no new tables). Regenerating them removes `ListFacts` and its hand-written consumers must move to fun-fact content.
- A migration release for the new schema has not been cut and the development database has not been reset.
- Typed sections (replacing `dynamic()`), the generation manifest and the routable-table subset are not part of this round.
- A fix was needed in the Dryv template server (request bodies over 1 MiB were rejected); see the plan note.
