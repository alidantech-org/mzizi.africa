---
{id: DOC-SOURCING-DESIGN,name: SOURCING_DESIGN,type: documentation,tags: [source,provenance,evidence]}
---

# Sourcing design

AGENTS.md section 4 requires every meaningful claim to answer where it came from, which artifact supports it, when it was obtained, what it describes, how it was produced, how confident we are, whether it is disputed and which version is current. The `source` schema answers all of that for every other schema without any of them depending on it.

## The shape of the answer

Data rows carry no provenance. A **source** knows which rows it produced:

```text
publishers     who publishes (institution, outlet, archive, person) and how reliable we judge them
documents      a source work: title, kind, publisher, published date, language, licence, citation
captures       one retrieval of a document: when, how, where from, the preserved file version
methods        how data came to be: extracted, inferred, curated, ai_assisted, with tool, model, version
attributions   the link: this document and capture, through this method, supports this record
verifications  the verification ledger: the state of a record over time
```

`attributions` is the linkage table:

| Column | Meaning |
| --- | --- |
| `target_kind` | the table the claim is in, as `schema.table` (for example `geography.boundaries`) |
| `target_id` | the row's id |
| `target_field` | optional: the field the source supports (null for the whole record) |
| `relation` | `supports`, `contradicts`, `derived_from`, `mentions` |
| `document_id`, `capture_id` | the source work and the retrieval that was used |
| `locator` | page, section, table, cell, timestamp or quoted text within the document |
| `method_id` | how it was produced; carries tool, model and version for AI-assisted work |
| `confidence` | 0 to 1 |
| `attributed_by` | account that created it (soft id) |
| `created_at` | when |

No other schema has a foreign key to `source`, and `source` has none to them; `target_kind` and `target_id` are validated against the contract's list of evidenced tables (the same list that validates audit targets) and checked by integrity jobs. Several sources can support or contradict one record, one document can support thousands of records, and a record can be traced to its sources by an indexed lookup on (`target_kind`, `target_id`) while a source can list everything it caused by (`document_id`).

## Verification

`verifications` is append-only: (`target_kind`, `target_id`, `state`, `decision_id`, `decided_by`, `rationale`, `created_at`, `is_current`). States: unverified, under review, verified, disputed, superseded, rejected. A reviewer's `audit.decisions` row proposes a state; applying it is a controlled promotion owned by the database engine, which writes the verification row and clears `is_current` on the previous one. "Verified boundaries only" in the API means a current verified row exists.

## Capturing without overwriting

`captures` preserves raw evidence (AGENTS.md section 5): each retrieval is a new row with the retrieval time, URL, HTTP status, content hash, the tool that fetched it and the file version in `filesystem` holding the bytes. A capture also carries soft ids for the site, the hostname actually used, the structure version (and inherited family version) that drove retrieval, and the legal/source assessment in force; `documents` carry a nullable `site_id` (see `WEBSITE_DESIGN.md`). A document revisited next year produces a second capture; nothing is replaced. Extraction results and candidates produced from a capture reference it through attributions.

## Sourcing methods

`methods` is a small table of reviewed method definitions: kind (`extracted`, `inferred`, `curated`, `ai_assisted`), name, tool, tool version, model, description and the prompt or procedure reference. AI output is therefore always attributable and never silent. A record created by a human curator uses a `curated` method naming the curator's account on the attribution.

## Document kinds

Kinds are classification records (gazette, statute text, census report, survey, news article, archival record, oral testimony, dataset, map, academic paper, official website), scoped by jurisdiction where that matters, so new kinds need no schema change. Publishers likewise.

## Reading provenance

The API reads a record's sources through the `source` read endpoints (documents, captures, attributions by target, verifications by target). Hot paths that show a single summary line (for example boundary source and licence for the map) join the latest supporting attribution in hand-written SQL; these joins are the only cross-schema reads and are listed in `DATABASE_DESIGN.md`.

## Time

Source time is separate from claim time. `documents.published_on` and `captures.retrieved_at` describe the source; a record's valid time (`valid_from`, `valid_to`, with precision) describes the world and stays on the data row.
