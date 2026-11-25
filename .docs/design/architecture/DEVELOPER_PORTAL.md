---
id: DOC-DEVELOPER-PORTAL
name: Developer portal and research workspace
type: documentation
tags: [portal, engine, acquisition, seeds]
---

# Developer portal and research workspace

**Status: agreed direction.** The pilot and workspace described here are planned. The [decision record](../../decisions/DEC-DEVELOPER-PORTAL.md) captures the approved scope.

## Current implementation and gaps

| Area | Current implementation | Portal gap |
|---|---|---|
| Dashboard | The Next.js workbench reads review and job views through the NestJS API. The inherited admin area uses a separate legacy integration. | Start and cancel operations, browse run artifacts, inspect progress and evidence, and edit or export drafts. |
| Engine | FastAPI lists registered capabilities and accepts job submissions. Its HTTP executor store is in memory. The spec-run ledger and artifact stores have a separate persistence path. | Read-only seed catalog, workspace replay, and verified run-artifact inspection and replay are available over HTTP. A PDF table draft can return evidence-linked rows, lookup issues and CSV. Persistent draft revision, handover and the portal remain planned. |
| Acquisition | The crawler uses HTTP, optional browser rendering, manifest-driven extraction, pagination and saved captures. Extraction emits structured PDF and HTML blocks, with bounded PDF page ranges, table diagnostics and OCR. | Add repeatable quality comparisons and section-level interpretation. Trial Docling against saved difficult pages before adopting it. |
| Data and identity | Dryv generates table and seed metadata and the engine exposes the seed catalog over HTTP. The manifest validator checks seed CSV shapes and code links. The seed loader derives stable IDs and supports transactional dry runs. | Drafts can check mappings and exact name lookups against a pinned, operator-supplied reference artifact. A managed reference provider and full validation for seed import remain separate work. |
| Scripting and agent | The developer CLI calls the runtime in process. The agent directory describes a future client. | Opt-in isolated Python and Bash jobs run over HTTP with verified inputs, cancellation and durable text outputs. Portal parity and the live LLM agent remain planned. |

See the [developer portal](../../../source/apps/dev) (the earlier admin app is deferred and removed), [engine](../../../source/backend/engine/README.md), [acquisition runtime](../acquisition/WEB_ACQUISITION_RUNTIME.md) and seed guide (seed now lives in the git-ignored `.dev/seed/`, [decision](../../decisions/DEC-SEED-OUTSIDE-GIT-20261125.md)). Current entry points include the [HTTP operation routes](../../../source/backend/engine/src/mzizi_engine/runtime/http/app.py), [crawler replay](../../../source/packages/crawler/src/mzizi_crawler/features/replay/replay.py), [generated table reader](../../../source/packages/manifest/src/mzizi_manifest/features/database/tables.py) and `seed loader` (removed with the in-repository seed).

## Explorer, collection proof and what the portal shows now

The engine serves read-only exploration endpoints under `/v1/explore` (see [explore.py](../../../source/backend/engine/src/mzizi_engine/runtime/http/explore.py)) and the developer portal (`source/apps/dev`, port 3400) puts a page on each. The portal reaches them only through its server-side proxy, which keeps the engine service key off the browser.

| Portal page | What it does | Engine endpoint |
|---|---|---|
| Runs | Lists runs with status and duration; a run opens as a pipeline (queued, running, finished), its fetched pages, result, input, output files and event timeline; run again or cancel | `/v1/jobs`, `/v1/explore/jobs/{id}` |
| New run | A form built from the chosen capability's input schema, an advanced and a raw JSON mode, and ready setups that load their files from the dev root | `/capabilities`, `/v1/jobs` |
| Files and viewers | Browse the seed, dev, run-output and docs folders; Markdown renders, CSV opens as a paged table, JSON and YAML as trees, PDFs and images inline; text files under the dev root can be edited and saved; a PDF can be sent to the extraction capabilities | `/v1/explore/files`, `file`, `file/raw`, `PUT file` |
| CSV preparation | Choose, rename and clean columns with the fixed transform library, preview live, save a copy under `.dev/prepared/` (never overwrites) | `/v1/explore/csv/prepare` |
| Database | Curated data lists (SQL shipped with the engine in `persistence/postgres/datalists/`) and every raw table grouped by schema, with search, sorting and paging; read-only role, read-only transaction, statement timeout | `/v1/explore/db/*` |
| Terms and knowledge | The engine's term groups and a tester that tags text with them | `/v1/explore/terms` |

Job history survives an engine restart when `ENGINE_STATE_FILE` is set (the dev stack sets it); production persistence is still the planned engine store.

**Procurement API proof.** The Kenya tenders portal (`tenders.go.ke`, robots allow `/api/`) answers `GET /api/active-tenders?page=N` with JSON (ten tenders per page, 436 on the day checked) and `GET /api/counties` with the 47 counties. `/api/awarded-tenders` and `/api/contracts` return the site's HTML shell, so awards are not available as a public API there. The response embeds staff contact details under `created_by`; the module never reads them. The new `api.collect` capability (crawler package, `features/api_collect/`) takes an API source manifest and a module, pages with the manifest's pagination rule, keeps each raw page and writes `records.csv`, `records.jsonl` and `summary.json`. The development source and module are in `.dev/sources/ke-tenders/` and are not in `seed/` until the owner approves them. A full run collected all 436 tenders over 45 pages with no extraction errors. Mapping those rows into the `civic.*` tables is not done.

## Shared workflow over HTTP

The portal, CLI and agent use the same typed engine operations. Each research or data-preparation action available to the agent must have a human path in the portal. The portal uses a server-side integration that enforces the developer's permissions. The engine validates operation inputs, checks access to the referenced data and executes the action. Replay uses authorized capture or workspace references over HTTP. A caller-supplied server path is outside that interface.

A developer can open an agent's run, inspect its evidence, operations, scripts, outputs and validation reports, and continue from a specific saved draft. Continuation records the human edit and its input revision. The run history preserves both contributions. Define the conflict behavior for concurrent edits before implementing takeover.

Python and Bash jobs run in an isolated data workspace with read-only inputs and writable draft outputs. Both users can consult relevant repository code and docs, the engine operation catalog, generated database contracts and approved reference data. The first workspace is for data preparation. Record the script, runtime and dependency settings, input hashes, logs, output hashes and related validation results. Resolve isolation, resource budgets, network access and cancellation before enabling script jobs. Source acquisition goes through the existing collection policy. Credentials and direct database writes are outside the workspace permission model.

The engine owns operational jobs, artifact access and persistence. Packages provide typed capabilities and keep database access behind engine bindings. Portal views and agent clients submit the same operations and use the same validation rules. Follow the [typed-code rules](../../rules/typed-code.md) and [runtime package guide](ENGINE_RUNTIME_AND_PACKAGES.md).

## Deterministic processing and evidence

1. **Discover and inventory.** Use the source policy, publisher manifests and captured links. Discovery ranking estimates which pages or actions lead to useful resources. Extraction ranking estimates which resources merit processing. Retain the signals and reasons for decisions so an overlooked item can be revisited.
2. **Preserve and parse.** Save raw bytes first. Link each derivative to its input. Keep page numbers, table cells and spans, figures and captions, and HTML view and selector evidence where available. Report partial coverage and missing locators.
3. **Interpret within scope.** Classify document, section and table separately. Preserve original text alongside interpreted values. Record whether each value was explicit, inherited from a specific heading or other scoped evidence, inferred by a named rule, or unresolved. Keep alternatives when rules or sources disagree. Observation time and historical validity are separate.
4. **Map, validate and export.** Validate target fields and code links before describing a CSV as a seed proposal. Keep unsupported fields in the research draft, with evidence and an issue report. Export the exact draft and report for owner review. Registering approved seed files and applying them to the database are separate authorized actions.

Use structural parsing, validated mappings and reference data first. An optional model may propose a resolution using the relevant evidence and table contracts. Keep the workflow usable without a provider. Measure the approximately 90% automation objective on a reviewed sample as the share of in-scope items that reach a valid draft without an LLM call. Report correctness, coverage, unresolved items and reviewer effort independently. Review quality by checking exact cells and row counts, source locators, proposed code matches and false matches.

## Manifests and Dryv

- Source and module definitions carry scope, discovery, selectors and extraction expectations. Validated engine mappings and term lists carry publisher or domain knowledge. Reuse reference schemes and values for established concepts. Unknown categories and new mappings can be proposed with evidence.
- The generated table catalog owns required fields, target types, natural keys, seedable tables and link aliases. A mapping supplies source meaning and context. It does not define another copy of a table. Read catalog metadata and use existing manifest validation before export.
- Draft CSV links use the target's seed identity path for the generated link alias. Preserve an external identifier and its scheme as separate facts. Resolve that identifier to the correct identity path before export. An ambiguous or missing link stays unresolved. [Schema map](../../../source/schema/README.md) · [Code rules](../../rules/codes.md)

## Worked examples

### IEBC discovery and constituency-office pilot

From an IEBC homepage capture, rank a document listing highly for discovery if it leads to many resources. Rank a linked office-location PDF separately for extraction. Capture the reason for both rankings. Identify new collections by evidence and propose manifest changes for uncertain classifications.

The engine pilot ran page 1 of the saved constituency-office PDF against the local run store and a scratch MongoDB ledger. It exported 10 rows with nine exact constituency matches and one unresolved name. The portal parity part of the pilot starts with the same PDF. A developer and an API client select the same page range, inspect exact row or cell evidence, resolve constituency codes, correct a draft and validate the result. Compare evidence and validation outcomes for the same inputs and edits. The draft retains location descriptions, landmarks and distances. The generated `governance.offices` seed fields describe institutional offices and provide no fields for those physical-location details. Report the contract gap and export the research draft with its validation report for owner review.

### One report with several datasets

A county report contains a project list, approved allocations and actual expenditure figures. Parse the tables separately. A heading can supply a location and reporting period to the table below it if the rule's scope permits it. Preserve the heading locator and keep approved and actual values distinct. Map the project draft to `civic.projects` only when its required `code`, `name`, `description` and `status_code` are supported. Keep the expenditure draft separate and flag evidence or target gaps before claiming it is seed-ready.

### From a published identifier to a relationship

The existing Changamwe seed data associates external identifier `KE-001-001` under `geo.identifier.scheme.ke-iebc-pcode` with feature identity path `ke.mombasa.changamwe`. A suitable mapping can resolve the external identifier through that scheme and put the identity path in a generated link alias such as `civic.projects.scope_unit_feature_code` when the evidence establishes that scope. The validator checks the target. The seed loader derives the corresponding internal foreign key on a separately authorized import.

## Dependencies before drafting implementation tasks

- Build draft revision and handover on the verified artifact references documented in the [engine guide](../../../source/backend/engine/README.md#research-from-run-artifacts). Exercise the staged S3 adapter against a live compatible endpoint before relying on that deployment.
- Extend the [engine script workspace](../../../source/backend/engine/README.md#isolated-python-and-bash-jobs) to hand selected draft outputs into later validation jobs. The current runner preserves stdout and stderr locally.
- Define run visibility, draft revision and takeover semantics, including what happens when two users edit the same draft.
- Set the draft validation report and export boundaries with the existing catalog and validators. Keep source evidence accessible with the exported proposal.
- Agree on checked IEBC pages, expected cells and constituency links, and on the portal/API parity test. Compare parser quality on saved evidence before selecting an additional production parser.
