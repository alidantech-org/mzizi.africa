---
id: HANDOFF-REBUILD-OWNER-QUESTIONS
name: Rebuild run owner questions
type: handoff
tags: [rebuild, autonomous, owner-questions]
extra: {wave: GRP-1E8DA9A0E58E}
---

# Owner questions from the rebuild run

The autonomous rebuild run (see [the run handoff](HANDOFF-REBUILD-RUN-20261125.md)) records here every decision that genuinely needs the owner, and then continues with other work. Each entry gives the question, the options, the agent's recommendation, and what the agent did in the meantime. The owner answers here; answered entries stay as a record.

## Open questions

### Q1. "Partitioned by country" is HASH, not LIST

- **Question:** FOUNDATION_REDESIGN section 18 says the large tables are "split by country". LIST partitions need the country values at schema time, but `country_id` is a uuid that exists only after seeding.
- **Options:** (a) HASH on `country_id` with 16 partitions: every read for one country prunes to one partition, created once in the baseline. (b) LIST with only a DEFAULT partition in the baseline, plus a migration per country when it is seeded. (c) Partition on a country code column instead of the uuid.
- **Recommendation:** (a). It gives the same pruning, needs no per-country migration, and keeps the baseline independent of data.
- **Meanwhile:** (a) is implemented for `statistics.observations`, `breakdowns`, `figures`, `election.results`, `tallies`, `legislature.votes`, `speeches`, `finance.flows`, `economy.prices` and `community.posts` (helper `byCountry` in `dryv/contracts/schemas/postgres/_links.ts`). Proof: `EXPLAIN` of a `statistics.figures` read by country scans one partition.

### Q2. Years are nullable; date and year agreement is checked by Mzizi's code

- **Question:** The design says "years required, dates optional". Many rows have no known start year (a river, an old name), and an open period has no `to_year`.
- **Options:** (a) `from_year` and `to_year` nullable, with "when a date is set its year is set and agrees" enforced in Mzizi's write code. (b) `from_year` NOT NULL on identity-backed tables, forcing loaders to invent a year.
- **Recommendation:** (a). Dryv expressions have no date-part function, so the agreement check cannot be a generated CHECK yet (recorded in DRYV_GAPS).
- **Meanwhile:** (a). Ordering rules (`from_year <= to_year`, `starts_on <= ends_on`) are generated CHECKs. `elections.from_year` is required.

### Q3. `from_to_precision` removed from the shared period

- **Question:** The old shared period had `from_to_precision`. The approved tables list only `from_year` and `to_year`, and `history.occurrences` has its own `precision` (day, month, year, decade, circa).
- **Recommendation:** keep it removed and use `history.occurrences.precision` where precision matters.
- **Meanwhile:** removed; `DatePrecision` now holds the history values.

### Q4. Identity kinds

- **Question:** Section 18 lists kinds such as `institution` and `party`, but section 30.2 says institutions, parties and publishers share their organisation's identity, and facilities share their feature's identity.
- **Recommendation:** those rows carry kind `entity` (or `feature`) and the enum has no separate `institution` or `party` value.
- **Meanwhile:** `IdentityKind` in `_links.ts` lists the 31 kinds actually extended (country, language, currency, unit, timezone, hierarchy, level, app, feature, entity, individual, position, office, function, procedure, coalition, instrument, bill, election, event, occurrence, era, indicator, metric, collection, product, service, project, procurement, fund, debt). `geography.features` accepts `feature` or `country`.

### Q5. Monthly partitions cover 2024–2027

- **Question:** `source.captures`, `source.discoveries`, `community.views`, `community.notifications` and `community.dispatches` are partitioned by month. The baseline must name a range.
- **Recommendation:** baseline creates January 2024 to December 2027 plus a DEFAULT partition; a yearly maintenance migration adds the next year's months.
- **Meanwhile:** implemented (`byMonth` helper); rows outside the range land in the `_other` partition.

### Q6. Unique keys over nullable columns

- **Question:** PostgreSQL treats NULLs as distinct in unique indexes; the design asks for "NULLS NOT DISTINCT" in places. Dryv cannot declare it yet.
- **Recommendation:** keep partial-index pairs where it matters most (identifiers with and without namespace, product messages with and without country, governance instances placed and unplaced, offices); ask Dryv for a neutral `nullsNotDistinct` index option.
- **Meanwhile:** partial pairs are in place; `statistics.observations` uniqueness (subject, `to_year` and collection may be empty) is also checked by Mzizi's write code. Recorded in DRYV_GAPS.

### Q7. Small internal text columns kept

- `governance.patterns.title` stays as an internal English label for curators (like `auth.roles.title`).
- `auth.permissions.field_group` stays text: the contracts do not yet name field groups. `resource_type` is now an enum of the 22 schema names.
- `filesystem.versions.provenance`, `created_by_snapshot` and `folders.authorization` are kept, stored as text (the persistence pack cannot validate JSON-format strings; recorded in DRYV_GAPS) as the design says "other columns kept"; they describe how bytes were written, not where a fact came from.

### Q8. Links into partitioned tables carry the partition key

- **Question:** PostgreSQL foreign keys into a partitioned table must include its partition key.
- **Meanwhile:** referencing rows carry it: `post_country_id` on community reactions, views, cases, replies, attachments and notifications; `country_id` beside `speech_id` on legislature summaries and attachments and politics commitments; `flow_country_id` on finance findings; `discovered_at` on captures and `retrieved_at` on citations; `name_kind` on `official.parts`. Evidence rows (`source.evidence`) are referenced by id without a foreign key (`source.contenders.evidence_id`, `source.disputes.resolution_id`), because the evidence key includes its subject.

### Q9. API modules need the owner's review

- **Question:** Task TSK-70669AC571AA asks for an owner review of each module. The run could not wait for it.
- **Options:** (a) review `.docs/design/architecture/API_MODULES.md` and `dryv/contracts/apps/api/` after the run; (b) ask for changes per module.
- **Recommendation:** (a); the modules follow the rule exactly and the frontend module is named `frontend`.
- **Meanwhile:** 20 modules implemented and generated; the review items are ticked as "reviewed by the agent, owner review pending" in the task comments.

### Q10. Sign-in is not wired

- **Question:** Section 28.4 designs email and phone sign-in with one-time codes; no token verification existed before the run either. Operations behind `SignedIn` or `PlatformAdmin` fail closed (no principal is resolved).
- **Recommendation:** a dedicated task for sign-in (codes, providers, rate limits) before contributions open.
- **Meanwhile:** `AnonymousPolicyResolver` in `source/backend/api/src/database/database.module.ts`; public reads work.

### Q11. Web screens need the owner's design agreement

- **Question:** TSK-402D8C6A91DD asks to agree each screen's design with the owner before building it. The run built a first server-rendered version of each instead.
- **Recommendation:** review the screens at a running instance (web README lists them); TSK-75981BF08EA5 (UI/UX) is the place for design changes.
- **Meanwhile:** law, parliament, elections and power screens show an honest "not loaded yet" state because the rebuilt database has no rows for them; national WDI/WHO indicators have no names in the seed and show their codes.

## Answered questions

None yet.
