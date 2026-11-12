---
id: DOC-MZIZI-SCHEMA-REFERENCE-20261111
name: reference schema — phase-01
type: schema-review
tags: [database, schema-redesign, main, approved, user-review]
extra: {status: approved, approval: approved, approval_record: DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112, implementation: authored_and_composed, database: mzizi, recorded_on: 2026-11-12}
---

# Reference — Phase 01

> **APPROVED — 12 November 2026.** The approved Reference design is authored in [`reference.ts`](../../../../../dryv/contracts/schemas/mzizi/reference.ts) and included as `vocabulary` in the database foundation application. This documents contract/application composition, not successful Rust pack generation, SQL migration, live database change, or deployment. Known unsupported semantics and unresolved cross-schema interfaces remain generation blockers.

[Phase 01 index](README.md) · [Schema catalogue](../../README.md)

## Approved responsibility

Reference is the shared starting point for canonical modern-country identity, controlled values, measurement units, topics and reviewed reusable pattern definitions. It owns pattern identity, immutable versions, applicability and dependencies. Engine owns execution state. Generated offices and other real records remain in their domain schemas.

`reference.countries` is the canonical modern-country catalogue. It does not contain a fictional `world` country and does not make country membership mandatory for global, historical or cross-border records. Geography owns territory and spatial facts: countrywide geographic scope resolves to that country's Geography unit where a domain record requires geographic scope. Do not confuse `reference.units` (measurement units) with `geography.units` (territorial units).

Reference mediates Legal relationships for other domains. It is the only domain schema linking to Legal. The existing `reference.pattern_bindings.provision_id` remains an optional typed identifier intended by the proposal to refer to `legal.provision_versions`; its Legal target and semantics are unresolved and no FK is authored. Do not invent a proxy Legal model, remove the proposal silently, or introduce direct Legal FKs in Geography or other domains.

## Approved tables and authored fields

| Table | Authored fields | Identity, relations and indexes |
|---|---|---|
| `reference.countries` | `id`, `code`, `name` | PK `id`; unique `code`; name lookup index. Canonical modern-country identity. |
| `reference.schemes` | `id`, `code`, `title`, `owner_snapshot` | PK `id`; unique `code`. Controlled-vocabulary scheme identity. |
| `reference.values` | `id`, `scheme_id`, `code`, `label`, `supersedes_id?` | PK `id`; FKs to `schemes` and optionally self; unique scheme/code; scheme and supersession lookup indexes; no self-supersession invariant. |
| `reference.units` | `id`, `code`, `symbol`, `quantity`, `scale`, `offset`, `base_id?` | PK `id`; optional self-FK for base unit; unique `code`; base lookup index; positive-scale invariant. Measurement units only. |
| `reference.topics` | `id`, `code`, `label`, `parent_id?` | PK `id`; optional self-FK; unique `code`; parent lookup index; no self-parent invariant. |
| `reference.patterns` | `id`, `code`, `title` | PK `id`; unique `code`; stable reusable pattern identity. |
| `reference.pattern_versions` | `id`, `pattern_id`, `edition`, `file_version_id`, `digest` | PK `id`; FK to patterns; unique pattern/edition; file-version lookup index. File version remains typed UUID until Filesystem authors its target. |
| `reference.pattern_bindings` | `id`, `version_id`, `unit_id?`, `country_id?`, `provision_id?`, `effective_from`, `effective_until?` | PK `id`; FK to pattern version and optional country; indexes for version/scope/time, country, unit, provision and start date; ordered-window invariant. `unit_id` is a typed Geography reference pending a Geography FK target. |
| `reference.pattern_dependencies` | `id`, `version_id`, `requires_id` | PK `id`; two FKs to pattern versions; unique pair and reverse lookup index; prevents self-dependency. Transitive acyclicity is not enforced by this contract. |

Optional fields are nullable and optional in Dryv input. Scalar profiles come from `_shared.ts`; schema-local enum declarations are limited to `LabelKind` for pattern bindings. Declared relations use restrictive delete/update behavior. The executable contract is authoritative where this summary omits field-level commentary.

## Relationships and known gaps

The authored `reference.countries` target is available to Geography: `geography.units.country_id` may refer to country identity, while the spatial territory remains a Geography feature/unit. The authored app composition and schema contracts currently have no executable Geography `Unit` target for `pattern_bindings.unit_id`; no FK enforcement is claimed. `pattern_versions.file_version_id` has no authored Filesystem relation. `pattern_bindings.provision_id` has no Legal FK until the Reference-mediated Legal interface is resolved. Country/unit compatibility for scoped bindings and uniqueness of effective scope are not encoded.

The current Dryv contract uses a SHA-256 digest for pattern version content and a separate typed file-version identifier; Engine owns execution. Pattern dependency cycles beyond direct self-reference require a database or named-operation check. Nullable-scope uniqueness, effective interval exclusion, and a native date-range representation have not been verified through the selected database pack. These semantics must not be treated as enforced merely because TypeScript compiles.

The header and schema approval do not resolve every implementation capability. Generation remains subject to verified IR/SQL semantics for unique nullable scopes, temporal overlap, cross-schema target assignment and all documented relations. No migration or live data action is authorized here.

## Superseded material

This approval replaces earlier candidate Reference proposals that treated country/jurisdiction scope as interchangeable or left all tables pending review. The term `jurisdiction` is not used as the system's country identity; country associations use `reference.countries`. The old detailed proposal and current-database inventories previously embedded below this heading have been removed where they conflicted with the approved authored contracts. Existing migrations and generated artifacts remain historical implementation evidence, not this approved target design.
