---
id: DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125
name: Owner decisions - roots carry the template, official units, slots and enums (DB rethink)
type: decision
tags: [database, patterns, templates, slots, geography, governance, enums, owner-direction]
extra: {status: accepted_design_contracts_pending, recorded_on: 2026-11-25, relates_to: DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119}
---

# Owner decisions: the database rethink (25 November 2026)

Recorded from the owner's chat answers while discussing [TEMPLATES_AND_SLOTS](../design/data/TEMPLATES_AND_SLOTS.md), [GEOGRAPHY_REFERENCE_AND_GOVERNANCE_RETHINK](../design/data/GEOGRAPHY_REFERENCE_AND_GOVERNANCE_RETHINK.md) and [SCHEMA_AUDIT_SLOTS_AND_ENUMS](../design/data/SCHEMA_AUDIT_SLOTS_AND_ENUMS.md). **These are design decisions. No contract, migration or seed has changed yet.** Each table and vocabulary is still shown to the owner before it is authored (condition kept from `DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119`).

## Decisions

| # | Decision | Example |
|---|---|---|
| 1 | A **pattern** generates identities, rows and slots. Slots are real rows with nullable fillable columns. | `County Government of Nairobi` is generated before anyone has researched it. |
| 2 | **Roots keep the template reference; effects do not.** A root is the row a template creates directly. Rows that must exist because of the root are effects and trace back through their foreign keys. The reference is a **column on each root table**. | A unit carries the template; its feature and geometry carry none. |
| 3 | The template **records its effects** (the list of what it generates from a root). | The `ward` unit template lists: feature, geometry slot, and (via other templates) the ward MCA office. |
| 4 | **Roots (first list, to be refined):** units, institutions, offices, office terms, election cycles and contests, event rules and schedules, finance budgets and funds. A source domain is an effect of its institution, not a root. | |
| 5 | **Retire `governance.instances`** (empty today). Root rows carry the link. | |
| 6 | **Positions are defined once per role.** The institution and the place sit on the office. A county government is an institution made from a pattern; the pattern lists its role lines (governor, deputy governor, executive members, speaker, county secretary, MCAs). | One `governor` position; 47 offices, one per county government. |
| 7 | **Official unit table** between levels and places, with its **own row id**, a **non-null feature link**, parent, hierarchy, level and period. Geography data is found through the feature's identity id. | Unit `Kabwareng`, electoral ward, parent `Aldai` constituency. |
| 8 | **Feature is never nullable on a unit.** Generation is dependent: unit, then feature, then geometry row with empty shape. Details fill in later. Boundary status follows the geometry's status (derived, not a flag on the unit). | A ward exists with a feature and an empty geometry until IEBC data is loaded. |
| 9 | **Parent membership lives only in the unit table**, not in `geography.relationships` (other relationships such as `borders` stay). The database enforces same hierarchy, shallower parent level, no cycle, and child period inside parent period. | |
| 10 | **A parent may skip a level only where the level definition says so.** | Kenya's national administration line may skip. |
| 11 | **Patterns and templates are identity kinds** (names per language, codes, legal effects work unchanged). | |
| 12 | **Count kinds** (exact, minimum, maximum, range). Generate exact counts and minimums only; no slot until a count is known. | |
| 13 | **Generation is an explicit database function** ("generate dependents for this root") called by the engine, with a coverage view of what is missing. No multi-row triggers on insert. | |
| 14 | **Terms are slots per cycle.** An election-cycle pattern (cadence, start year) produces cycles; each cycle times each elected office produces an office term; each term produces a holder slot with no individual. Horizon: **to the next scheduled cycle only**. | Governor of Nairobi: terms for 2013, 2017, 2022 and the expected 2027 term. |
| 15 | **Contests only** for elections: one contest slot per seat per cycle. A contest links to the office term it fills. | |
| 16 | **Evidence-only data is never generated:** results, tallies, candidates, figures, prices, provenance rows. A coverage view reports what is missing. | |
| 17 | **Premises**: institutions have typed locations (headquarters, regional office and so on), a **term** for kind. A premises row can have a nullable map pin. An office may link to its premises. | The Governor's Office is in County Hall; Nairobi City Hall headquarters. |
| 18 | **Enum rule** (all five must hold): every country the same; code branches on it; about a dozen values or fewer and changes less than yearly; a status or structural kind; editors never add values. Otherwise a `term`. | Instance-like statuses become enums; institution kinds stay terms. |
| 19 | **Enum labels live in the `product` schema** (keys and messages per language). | |
| 20 | **Nullable unique keys:** use the best option Dryv supports (a unique index that treats NULLs as equal, otherwise partial indexes). Checked when the contract is authored. | |
| 21 | **No row links directly to legal provisions.** Remove `Motions.provisionId`, `Motions.instrumentId` and `basisProvisionId` on events, changes and schedules. Law reaches rows through templates and `legal.effects`. | |
| 22 | **Order of work:** units first, then institutions, premises, offices, then election cycles, terms and contests, then other schemas only where the audit found real slots. | |

## Relation to earlier decisions

- Keeps the conditions of `DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119`: placeholders are structure only (never people, never invented names); no per-table approval is skipped; no version fields.
- **Supersedes** that decision's "ledger of generated records with their evidence status": generated rows are traced by the root's template column, and evidence status comes from sources, not from a separate ledger.
- Does not restore pattern versions, bindings or dependencies removed by `DEC-REFERENCE-REMOVE-PATTERN-LEGAL-20261113`.

## Still open

Listed in [TEMPLATES_AND_SLOTS](../design/data/TEMPLATES_AND_SLOTS.md) section 15 and in the audit document: the name of the unit table, the name for a template's list of effects, enum label key naming, which audit contract fixes to apply, and appointed (non-elected) terms.

## Answers chosen on the owner's delegation (26 November 2026)

The owner approved everything for implementation and told the agent to choose the best answer for every pending question. Chosen:

| Question | Chosen answer |
|---|---|
| Name of the official unit table | `reference.areas` (contract `Areas`), because `reference.Units` already means measurement units |
| Name for a template's list of effects | `template.lines` ("effect lines"), because `legal.effects` already exists |
| D2: separate template schema | Yes, a `template` group (own namespace) |
| D8: closed transform list | Yes, a small fixed list implemented as database functions |
| G4: country agreement | Enforced by the database (check or trigger) |
| G6: institution and entity | A foreign key from `institutions.id` to `official.entities.id` (shared identity, checked) |
| G7: committees and their house | Through `governance.relationships`; to be verified while authoring |
| Appointed offices | One open term slot each; dates come from the appointment |
| Vacancies and by-elections | Recorded from evidence, never generated |
| Pattern start year | An effective-from year on the pattern (Kenya counties: 2013) |
| Scope kinds | Fan out over a level, a fixed list, or a single instance |
| Enum label keys | `enum.<enum name>.<value>` in `product.keys`, unless `product.ts` already has a convention |
| Which audit fixes apply | All of them, carried out with the matching contract task |
| Mechanism for triggers, functions and views | Decided from the feasibility notes; always generated through Dryv or the project pack, never by hand |
| Seed task TSK-67FD455410F2 | Left to continue; the rebuild reads its changes first and does not overwrite them |

## Correction (26 November 2026)

Owner correction: a root row carries only the plain link `template_id`. **Confidence and reason belong to the template itself** (`template.templates.confidence` and `reason`), stated once, never repeated on the rows a template creates. The earlier root columns `template_confidence` and `template_reason` were a mistake and are removed from `_templates.ts`. Where any other table appeared to carry the same idea, it is to be removed the same way (checked in contracts, seed builder and generator SQL; generated files follow at the next regeneration).

## Implementation notes (26 November 2026)

- The official area table is **`geography.areas`**, not `reference.areas`: it links a hierarchy and level (reference) to a feature (geography), and reference depends on vocabulary and identity alone.
- **Positions are roots too** (they carry `template_id`); they are seeded once per role, because the generate function does not yet create positions.
- Confidence and reason are on `template.templates` only; roots carry only `template_id`.
- Election cycles generated in the past start as `held`, future ones as `scheduled` (owner answer); the template carries both status terms.
- Guards, text transforms, `template.generate`, `template.generate_pattern` and the coverage views are SQL in the project pack (owner accepted this; Dryv cannot author them yet, see `DRYV_GAPS.md`).
- Seed scope is the thin slice: county governments and assemblies, the National Assembly and Senate seats, and general election cycles. Cabinet, commissions and other national offices are not seeded for now.
- **Enums done (26 November, as the owner asked):** 59 term columns became enums, all defined in `dryv/contracts/schemas/_enums.ts` (a status or structural kind, same in every country; column renamed without the `Term` suffix, for example `holders.method`, `contacts.kind`, `elections.status`). Every value has an English label in `product.keys` and `product.messages` (`enum.<enum name in kebab case>.<value>`, 237 keys). Left as terms on purpose: premises kind (owner), `fil.folder.role` (the filesystem registry code uses it as an id), position exposure and relationship status (no known value list), and everything country-specific or growable. `economy` price kind moved from enum to term. `FormStatus` and `HansardStatus` are one enum.
- **Slot readiness done:** nullable blockers removed where a slot makes sense (media uses, election forms, finance appropriation class, civic roles); partial unique index pairs for nullable keys (alignments, turnouts, relationships, areas, texts); period-ordering and anchor rules added; `product.lang` unique on position. Not done, with reasons: `legal.effects.wording_id` (an effect without a wording needs its own design), `statistics.figures` and `legal.provisions` uniqueness (prepared or seeded data may repeat), the tally-same-contest guard, debt borrower and lender kinds, fiscal-year mapping, and a foreign key to partitioned `source.evidence` (no single-column key exists).
- **Null-equal unique keys (26 November, after Dryv added `nullsNotDistinct`):** areas, relationships, template texts, alignments and turnouts use `.indexes({ ..., unique: true, nullsNotDistinct: true })` instead of pairs of partial unique indexes. The packs `mzizi.postgres-sql` and `mzizi.python-rows` declare `index_nulls_not_distinct`, and the project pack emits `NULLS NOT DISTINCT`.
