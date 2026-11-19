---
id: DOC-POWER-MONEY-PATTERNS-SITES-20261119
name: POWER_MONEY_PATTERNS_AND_SITES
type: documentation
tags: [database, governance, power, procurement, ownership, patterns, domains, promises, proposal]
extra: {status: proposal_for_owner_review, date: 2026-11-19, group: GRP-F3C7A28BEB50}
---

# Power, money, patterns, sites and promises: what exists, what is missing, how it connects

**Status: proposal, 19 November 2026.** Nothing here is approved or implemented. Every table, column and vocabulary below needs owner review before it is authored in `dryv/contracts/schemas/postgres/`. Citations are to those contracts (file:line) and to the generated `source/backend/database/sql/schema.sql`. This guide supports the tasks in group GRP-F3C7A28BEB50 and extends [GOVERNANCE_AND_CONTENT](GOVERNANCE_AND_CONTENT.md), [PUBLIC_BODIES_CLASSIFICATION](PUBLIC_BODIES_CLASSIFICATION.md), [ENTITY_RESOLUTION](ENTITY_RESOLUTION.md) and [EVENTS_INFRASTRUCTURE_AND_SPENDING_MODEL](EVENTS_INFRASTRUCTURE_AND_SPENDING_MODEL.md).

## 0. The one idea that holds it together

Every claim the product shows sits in one of four **evidence states**, and the model must be able to say which:

1. **Expected**: generated from a pattern (for example "every county has a governor"). It is a *structure*, never a person, never a fact about the world beyond the rule.
2. **Sourced**: a record found in a source, cited, not yet reviewed.
3. **Verified**: reviewed and accepted (by a human or an approved automated check, see the project's approval rule).
4. **Not found**: we looked in named sources up to a date and found nothing. This is an explicit state, never an empty cell. `source.coverage` (source.ts:407) already records what was looked at and how completely; the screens read "no data recorded" from it.

Placeholders are structure only. A page may show "Governor, Nyeri County: not yet recorded", never "Amina Wekesa (sample data)". Names come from sources one at a time.

## 1. Patterns that generate expected data

### What exists

- `reference.patterns` is a stub: an identity and a `title` (reference.ts:313-322; table at schema.sql:2583). It has no relations and no seed rows in `seed/data`.
- `DEC-REFERENCE-REMOVE-PATTERN-LEGAL-20261113` records that the owner ordered the AI-invented pattern version, binding and dependency tables removed and said not to reintroduce them without a new explicit owner decision. **This proposal depends on such a decision.** The owner's instruction of 19 November 2026 ("model patterns to generate county governments, MCAs, institutions, cabinets and domains even before names are found") is that request; it is recorded in `DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119`. The removed tables are not restored: no pattern versions, no bindings, no dependency graph.
- A draft already exists in `seed/drafts/constitution-patterns/`: 11 patterns (`ke.independent-commission`, `ke.county-government` and so on), 33 institutions, 44 offices, 33 mandates and 182 `established-by` / `governed-by` legal bases pointing at Constitution provisions. It says County governments are one pattern "rather than 94 hand-written institutions" and that a script would create an assembly, committee, governor, deputy and speaker per county. That is exactly the need; the database has nowhere to hold the rule that script follows.
- The Python `patterns` package (`source/packages/patterns`) is a different thing: term lists and scoring for reading documents. It must not be confused with generation patterns (see section 1.5).
- Generic "any table row about any subject" references exist (`dryv/contracts/schemas/_subjects.ts`, a closed enum of table names kept in sync by `bun dryv/tools/sync-tables.ts`). New tables appear in that list automatically.

### What is missing

Nothing says what a pattern *produces*, *how many*, *where*, *named how*, or which generated records are still only expected.

### Proposed model (smallest that works, no versions)

All wording about a country's pattern is a seed row, never code.

- **`reference.patterns`** (extend the stub): `kindId` (scheme `gov.pattern.kind`: institution set, position set, site set, calendar set), `countryId` (optional; empty means usable anywhere), `basisProvisionId`-style legal basis stays in the existing legal-basis mechanism used by the draft (subject references to `legal.provisions`), `description`.
- **`reference.templates`**: one thing a pattern produces. Fields: `patternId`, `code`, `produces` (one of a closed enum: institution, position, office set, domain candidate, contact candidate, event rule), `fanOutLevelId` (belongs to `geography.levels`: produce one per unit of that level, or empty for exactly one), `parentPartId` (self: an assembly part sits under a county-government part), `nameTemplate`, `codeTemplate`, `positionRuleRef` (the position or institution kind attributes the part carries: selection method, seat basis, seat count) and `sourceCitationId`.
- **`reference.instances`**: the ledger. Fields: `patternPartId`, `unitFeatureId`, a subject reference to the generated row (table name from the closed `SubjectTable` enum plus row id), `statusId` (scheme `gov.evidence.status`: expected, sourced, verified, not-found, disputed), `generatedAt`, `verifiedCitationId`. It lets the UI say "1,450 expected ward seats, 312 verified".

Templates use named tokens bound to typed normalisers in the term lists under `seed/terms/` (for example `place.name.slug`, `place.name.without-kind-word`). The `patterns` package or the engine applies them; no module hard-codes `go.ke`.

### Options considered

| Option | Verdict |
|---|---|
| A. Patterns as seed manifests only; database holds identities | Keeps the DB small, but the UI and analytics cannot ask "expected vs verified" and the generator cannot be queried or reviewed in the database. |
| B. Patterns, parts and an instance ledger (above) | Recommended. Three small tables, typed, no versions. |
| C. Add `is_placeholder` flags on every generated table | Rejected: spreads one concept over every table. |
| D. Restore the removed pattern version, binding and dependency tables | Rejected: the owner ordered them removed. |

### Worked example (data, not contract)

Pattern `ke.county-government` has parts: a county-government institution (fan out over the county level, name template "`{place.name}` County Government"), an assembly institution under it, a governor position (head, direct election, one seat, five-year term), a deputy governor position (runs with the governor), a speaker position (ex officio), an assembly-member position (fan out over the ward level, direct election, one per ward), special-seat positions, and an executive-committee position. Expand it over the 47 county features already seeded (`seed/data/ke/geo/counties/features.csv`) and the 1,450 ward features; each expansion writes institution, position and office rows plus a ledger row in state expected. A cabinet pattern does the same with one fixed part per ministry named in the legal basis. The same shape serves any country that supplies its own pattern rows.

### 1.5 Neutrality

Pattern codes are data (`ke.county-government`). A global pattern (`gov.pattern.independent-commission`) may apply to many countries with per-country parameter rows. No contract, package or screen names a country.

## 2. Domain and site patterns

### What exists

- `source.publishers` link a publisher to an official entity and country (source.ts:34-50); `source.sources` are real channels (website or API) with classification, credibility and `officialEntityId` (52-71); `source.domains` hold hosts with start and end dates (73-88); `source.addresses` are pages, listings, files or endpoints on a domain (90-117); `source.discoveries` record links found (119-144); `source.verifications` and `source.coverage` exist (source.ts:311, 407).
- `official.contacts` hold sourced contact channels for exactly one entity or individual, with kind and visibility (official.ts:118-139). A website fits here as a contact of a website kind.
- There is no state for a host we only *expect* to exist.

### Missing

1. A candidate host generated from a pattern (`{county-name-normalised}.go.ke`, `{constituency-name-normalised}.ngcdf.go.ke`, `{ministry-short-name}.go.ke`) with how likely it is and whether it has been probed.
2. A verified link: this host is the official site of this entity, and this source row is the channel we may collect from.
3. A rule that a guessed host never becomes a source by itself.

### Proposed flow (stages, each leaves evidence)

1. **Expect.** A `site set` pattern part produces candidate hosts for each entity from its normalised name. Several variants may be produced, each with a rank.
2. **Record.** Add to `source.domains` a `statusId` (scheme `src.domain.status`: candidate, resolves, verified-official, redirects, dead, rejected), an optional `patternPartId`, `lastCheckedAt` and an optional `entityId` link to `official.entities`, plus an optional `officialContactId` linking to the entity's website contact.
3. **Probe.** The acquisition runtime does DNS and TLS, fetches the home page respecting `robots.txt` as a recorded signal (AGENTS.md, research acquisition rules), compares title and text with the entity's recorded names, and stores a `source.verification` with method and confidence.
4. **Promote.** Only a verified-official domain gets a `source.sources` row with classification and credibility, and an `official.contacts` website row. Both cite the verification. Rejections stay recorded so they are not re-guessed.
5. **Link.** Sites are linked to entities and institutions through `official.entities` (every institution already has an entity, governance.ts:28), so "the site of Nyeri County" and "the site of the Ministry of Roads" are the same lookup.

NGCDF-style irregularities (a constituency whose site does not follow the template) are handled by the probe: unmatched candidates stay candidates and a human supplies the real host with a citation.

### Options

| Option | Verdict |
|---|---|
| Keep candidates only in the engine's memory | Loses audit and review. |
| Candidates as rows in `source.domains` with a status | Recommended: one place, reuses citations and verifications. |
| A separate `official.sites` table | **Rejected by the owner, 19 Nov 2026:** a website is an `official.contacts` row of kind website, and the domain carries the status. |

> **Inventory.** The exact tables, columns and vocabularies are listed in [SCHEMA_CHANGE_INVENTORY_20261119](SCHEMA_CHANGE_INVENTORY_20261119.md), which supersedes any name or column difference in this guide (for example the ledger uses real foreign keys, not a subject reference, and unstructured promise material lives in `filesystem.media` and `filesystem.contents`).

## 3. Leaders' influence and rights to appoint, nominate and elect

### What exists

- `governance.holders` records a tenure with `appointmentKindId` and `appointedByEntityId` (governance.ts:71-87); `governance.relationships` link institutions (116-134); `governance.motions` have a kind `appointment` and outcomes; `governance.votes` record each holder's position; `politics.contests`, `candidates`, `results` record elections; `politics.memberships` record party membership; `legal.effects` record what a wording does (legal.ts:295-309).
- `official.relationships` can link any two identities (entity or individual) with kind, period and `sharePercentage` and already enforces exactly one identity on each side with `rule.exactlyOne` (official.ts:140-172). **Correction to task 004:** an exactly-one rule is available, so a link table can take a position or institution on either side without a Dryv gap.

### Missing

- A statement of **who holds which right over whom**, with the procedure: for a judge, the Judicial Service Commission recommends, the President appoints, the legislature may approve. Today this is prose in a PDF.
- The difference between a right held in law, a right exercised in a particular case, and an informal tie.

### Proposed model

Three layers, never mixed on screen.

1. **Rights in law** (`governance.powers`, replaces the "link" of task 004): `holderPositionId` or `holderInstitutionId` (exactly one) or the electorate institution, `targetPositionId` or `targetInstitutionId` (exactly one), `rightId` (scheme `gov.power.kind`: initiate, nominate, vet, approve, appoint, confirm, remove, veto, assent, dissolve, fund, audit, oversee, summon, elect), `procedureId` and `stepOrder` (rights that form one procedure share a procedure and are ordered), `thresholdKindId` and `thresholdValue` (simple majority, two thirds, unanimous), `isBinding` (must or may), `basisProvisionId`, `sourceCitationId`, period fields. Unique on holder, target, right, procedure, step.
2. **Rights exercised** (add to existing tables, no new table): `Holders.appointmentMotionId` (the motion and vote that approved it), `Holders.nominatedByEntityId`, plus the Gazette notice as a `legal.effects`-style link on the holder record (the notice appointing a person is evidence; see section 7).
3. **Informal and observed ties** (`official.relationships` with scheme `ofc.relationship.kind`; the scheme does not exist yet, the column has no vocabulary): kinship (spouse, parent, sibling), business (director, shareholder, beneficial owner), political (party leader, campaign manager), each with an `evidenceBasisId` (registry record, official declaration, court record, news report, inferred by matching) and a confidence. Inferred ties are proposals for review and are never shown as fact.

### What the screens and analytics can then say

- "Who can remove the Governor, and by what steps": walk powers of kind remove on the Governor position, ordered by step.
- "How was this person appointed": the holder, its motion and vote, the nominating body, the appointing authority, the Gazette notice, each cited.
- **Influence is computed, not stored**, in the read-only `accountability` surface (the existing pattern, accountability.ts:1-8): number of offices a body can appoint to, depth of the chain above a position, concentration (one actor reaching many bodies that oversee each other). Each row carries the evidence count and states that it shows structure, not intent.

### Options

| Option | Verdict |
|---|---|
| Store influence scores | Rejected: opinion stored as fact; scores are query results. |
| Rights as institution relationships only | Cannot express a position or an electorate as holder or target. |
| `powers` with exactly-one on each side and an ordered procedure | Recommended. |

## 4. Suppliers, contracts and money

### What exists

| Concept | Table | Notes |
|---|---|---|
| Project | `civic.projects` (civic.ts:55) | responsible institution, sponsor, implementer entity, place, status, dates, location |
| Procurement | `civic.procurements` (106) | buyer entity, procedure, category, nature, status, publish, close, award dates; **no estimated or budget amount** |
| Bid | `civic.bids` (138) | one bidder entity, amount, outcome |
| Contract | `civic.contracts` (154) | one contractor entity, amount, currency, status, signed date; **no buyer column, no amendments, no joint parties** |
| Delivery | `civic.deliveries` (175) | milestone with amount and place |
| Budget | `finance.budgets`, `budget_versions`, `appropriations` (nested, recipient entity, project, unit) | |
| Money moved | `finance.flows` (123) | links fund, appropriation, contract, debt, project, institution, place; counterparty is an **entity only** |
| Supplier identity | `official.entities` + `official.identifiers` (registration and tax numbers, unique per scheme and issuer) | |
| Entity to person | `official.relationships` (ownership share, dates) | no vocabulary yet |
| Derived indicators | `accountability.*` read-only (procurement performance, project performance, oversight signals) | |

### Missing, in order of value

1. **Parties to a contract.** Joint ventures, consortia and subcontractors: `civic.partners` (`contractId`, `partyEntityId`, `roleId` scheme `civ.contract.role`: lead, member, subcontractor, guarantor, supervisor; `sharePercentage`). `Bids` need the same for consortium bids (`civic.partners` (bid side)) or a rule that a consortium is its own entity with `official.relationships` to its members.
2. **Money facts on the procurement.** `estimatedAmountMinorUnits`, `currencyId`, `bidderCountStated` (as published, which may exist without any bid rows), `evaluationBasisId`. Without an estimate, award-to-estimate ratios cannot be computed.
3. **Contract buyer and changes.** `buyerEntityId` (a contract may have no procurement), `civic.variations` (variation, extension, termination, with amount delta, new end date, reason, citation).
4. **People in the process.** `civic.officials` (`procurementId`, `individualId`, `roleId`: accounting officer, committee chair, evaluator, approver, signatory, and optionally the `officeId` held at the time). This is what lets a conflict be checked on a real signature.
5. **Payments to a person or party.** `finance.flows.counterpartyEntityId` cannot hold an individual; either add `counterpartyIndividualId` with an exactly-one rule or route all payments to entities.
6. **Standards mapping.** Fields named so they export to the Open Contracting Data Standard (OCDS) for procurement and the Beneficial Ownership Data Standard (BODS) for ownership, and to Popolo for people, posts and memberships. It costs nothing now and makes the data usable by other tools.

### Analytics (read models, never stored facts)

All in `accountability`: supplier concentration per buyer (share of value held by the top suppliers), repeat winners, single-bidder rate, award versus estimate, split contracts just below thresholds, time from close to award, cost and time overruns through contract changes, spending by place per head against `statistics.observations`, and the share of procurement with a recorded supplier link to an officeholder. Each row states its evidence count; zero evidence means "no data", not zero risk.

## 5. Linking suppliers to real people, and political money

### What exists

`official.relationships` (entity or individual to entity or individual, `sharePercentage`, dates), `official.identifiers`, `official.individuals`, `politics.parties` (an entity), `politics.memberships`, `finance.flows`, `governance.holders`. Entity resolution rules are in [ENTITY_RESOLUTION](ENTITY_RESOLUTION.md).

### Missing

1. **A vocabulary for ownership, control and kinship** on `official.relationships.kindId` (no `ofc.relationship.kind` scheme exists in `schemes.csv`), with evidence basis and confidence as in section 3.
2. **Declared interests.** Leaders file declarations of wealth and interests; a declaration is a source artifact whose rows become relationships with basis "official declaration". No new table is needed beyond the relationship and its citation.
3. **Political contributions.** `finance.flows` is a bank-style transaction. Political money has other rules (election, disclosure threshold, in-kind gifts, donor type). Propose `politics.contributions`: `donorEntityId` or `donorIndividualId` (exactly one), `recipientPartyId` or `recipientCandidateId` (exactly one), `electionId` (optional), `amountMinorUnits`, `currencyId`, `isInKind`, `givenOn`, `disclosureArtifactId`, `sourceCitationId`.
4. **A decision about evidence grades**, so an inferred match by name is never published as fact (project rule: model output is a reviewable proposal).

### Signals the analytics can compute (as signals, not accusations)

| Signal | Computed from |
|---|---|
| Officeholder or relative owns or directs a supplier | holders, official relationships (ownership, kinship) and contract parties |
| Same body is buyer and the holder's institution (or oversees the buyer) | holders, offices, institutions, powers |
| Supplier gave to a party or candidate, then won within a time window | contributions, contracts, window set as a parameter |
| Contract signed or approved by a person with an interest in the contractor | procurement participants and relationships |
| Concentration of awards to one person's network | supplier network, buyer totals |

Each signal shows the chain of cited records, the dates (the interest and the office must overlap in time), the match method and confidence, and the base rate for comparison. The wording is "connection recorded", never "corruption". Publication is gated by evidence grade; private individuals keep contact visibility classes (official.ts Contacts) and the legal review in [LEGALITY_SAFETY_AND_COMPLIANCE](../policy/LEGALITY_SAFETY_AND_COMPLIANCE.md).

## 6. Speeches, promises, activities and subscriptions

### What exists

- `governance.speeches` link a sitting, a holder, an optional motion or bill and hansard, with kind, position, page reference, summary and word count (governance.ts:444-470); only parliamentary speeches.
- `politics.manifestos` and `manifesto_items` (party or candidate commitments, topic, source) and the read-only `accountability.PromiseProgress` (manifesto item to projects by shared topic; "asserts no causal link").
- `source.coverage` (what was looked at, how completely), `source.artifacts` and `filesystem.media` for videos and documents, `community.subscriptions` and `notifications` with a subscription kind scheme `com.subscription.kind`.
- `event.occurrences` with `event.participants` (entity or individual with a role, event.ts:251-255) already record who did what, when and where.

### Missing

1. **A promise made outside a manifesto or the House** (a rally, a TV interview, a YouTube address): who said it, what exactly, with a timestamp in the recording, what was promised (topic, place, quantity, deadline).
2. **Links from a promise to what happened**, with the strength of the link and who made it.
3. **"No record found" as a stored result**, with the sources checked.
4. **A leader's activity trail** over time, with the UI showing recent items.

### Proposed model

- **`governance.promises`**: `code`, `makerHolderId` or `makerIndividualId` (exactly one), `officeId` (the office held when said), `statement` (the words, short), `madeOn`, `placeUnitFeatureId`, `topicId`, `quantity` and `unitId` (optional), `dueOn` (optional), `occasionOccurrenceId` (optional event), `sourceCitationId`, `statusId` (made, in progress, delivered, broken, withdrawn, no record found), `statusAsOf`.
- **`governance.fulfilments`**: `promiseId`, a project (`civic.projects`), contract, appropriation or bill, `linkKindId` (stated by an official source, matched on place and topic, proposed by a model), `reviewStatus`, `sourceCitationId`. A model-proposed link stays proposed until reviewed.
- **"No record found"**: a `source.coverage` row naming the sources searched, the date and how completely they cover the thing, tied to the promise by the promise status plus the coverage rows used. The screen reads: "No record of this was found in the sources we have checked up to 19 November 2026. It was either not published in those sources or not published at all."
- **Activities** need no new table: an activity feed is a read model that unions the existing facts for a holder: event participation, sittings and votes, speeches, bills sponsored, contracts signed (procurement participants), appointments made (powers exercised), promises. Only add an event participant role for "signatory" and "chief guest" if missing. The UI shows the latest few; the database holds all.
- **Subscriptions**: add subscription kinds for a leader, a promise, a place and a supplier (values only). A change in a promise's status or a new `promise_link` writes a `community.notification`. No new table.

### Options

| Option | Verdict |
|---|---|
| One `activities` table copying all of the above | Rejected: duplicates facts and drifts. |
| Promises as manifesto items only | Cannot hold rally or interview promises or a recording moment. |
| `promises` plus `fulfilments`, feed as a read model | Recommended. |

## 7. Constitutions, acts, bills and Gazette notices

### What exists

`legal.instruments`, `editions`, `provisions`, `wordings`, `translations`, `references`, `relationships` and `effects` (legal.ts); `governance.bills`, `stages` link a bill to the instrument it becomes (governance.ts:294-327). The Constitution 2010 is seeded for Kenya.

### Missing

- A **Gazette notice** as an instrument kind (appointments, boundary changes, tender notices, election dates), each carrying `effects` that point at the governance, geography, event or civic record it creates or changes. Today an effect points at a wording only; it needs to name the record it affects, using the closed subject-reference list. This is how an appointment gets from a notice to a `holders` row with evidence.
- A rule that a pattern's legal basis is the provision the pattern part rests on (already how the draft `patterns.bases.csv` works).

## 8. Feature inventory: what the system has, what it needs, how they connect

Counts are tables in `schema.sql` per schema today (some are in the 2026-11-19 change note).

| Schema | Holds | Needs for this work | Connects to |
|---|---|---|---|
| reference | countries, languages, schemes, values, copy, units, topics, patterns | evidence status, power kind, selection method, pattern kind, domain status, contract role, ofc relationship kind schemes; pattern parts and instances | everything, through value references |
| geography | features, names, geometries, levels, relationships, changes | country to root feature link | governance units, statistics, civic scope, patterns fan-out |
| official | entities, individuals, names, identifiers, contacts, relationships, branding | relationship vocabulary, evidence grade, website contacts | governance institutions, politics parties, civic suppliers, source publishers |
| governance | institutions, offices, holders, mandates, relationships, authority scopes, terms, sittings, bills, motions, votes, speeches, obligations, reports | positions, powers, functions, promises, promise links | politics (contests), civic (projects), legal (provisions) |
| politics | parties, memberships, coalitions, elections, contests, candidates, results, manifestos | contributions | official (donors), finance, governance |
| civic | projects, procurements, bids, contracts, deliveries, facilities, services | contract parties, contract changes, procurement participants, estimated amount, buyer | official (suppliers), finance, governance, geography |
| finance | budgets, appropriations, funds, flows, debts | individual counterparty | civic, governance |
| statistics | indicators, observations, metrics | derived and composite indicators | geography, reference topics |
| source | publishers, sources, domains, addresses, artifacts, citations, verifications, coverage, slugs | domain status and pattern link | official, every cited record |
| event | events, occurrences, rules, schedules, participants | signatory role value | governance sittings, politics elections |
| community | actors, subscriptions, notifications, posts | subscription kinds for leaders, promises, suppliers | governance, civic |
| filesystem | files, media, contents | nothing new | source artifacts, promise recordings |
| legal | instruments, provisions, effects | Gazette notice kind and effects on records | governance, geography, event |
| accountability | read-only indicators | influence, supplier concentration, conflict signals, promise follow-through | all of the above |

## 9. Additional features (all adopted by the owner on 19 November 2026)

1. **A completeness meter on every list.** With patterns, the system knows how many records to expect. Show "1,450 expected, 312 verified, 1,138 not yet found". It tells users what is missing without hiding gaps.
2. **Evidence and review states as one vocabulary** (expected, sourced, verified, not found, disputed) used everywhere instead of per-table flags.
3. **As-of queries.** Offices, boundaries and ownership change; every analytic must be asked "as of this date". Dated periods exist on most tables; make as-of a reading rule.
4. **Disagreement between sources.** Where two sources conflict (a seat count, an owner), keep both with their citations and show the disagreement; do not overwrite.
5. **Corrections and right of reply.** A way to record a correction and a response from the named person or company, shown next to any signal.
6. **Interoperability.** Mappings to OCDS, BODS and Popolo, as in section 4.
7. **Data licence and terms per source**, since some official portals restrict reuse. `source` classifications and the policy documents cover collection; add reuse terms.
8. **Changes of money value over time** (inflation, currency changes) when comparing years; keep amounts in minor units with currency and date, convert only in read models.
9. **Public-interest definition of a politically exposed person**, so who counts as a leader, a relative or an associate is a vocabulary with a legal basis, not a guess.
10. **Review workload.** Expect many proposals; a review queue per evidence state and per source is a feature.
