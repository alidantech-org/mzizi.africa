---
id: DOC-MZIZI-SCHEMA-REFERENCE-20261111
name: reference schema — phase-01
type: schema-review
tags: [database, schema-redesign, main, approved-foundation, proposed-contract, user-review]
extra: {status: foundation_accepted_details_under_review, approval: inventory_only, approval_record: DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112, implementation: authored_base_composed_extensions_excluded, database: mzizi, recorded_on: 2026-11-12}
---

# Reference — Phase 01

> **FOUNDATION INVENTORY ACCEPTED — 12 November 2026; detailed field design remains under review.** Reference tables, including typed Legal mediation, are authored in [`reference.ts`](../../../../../dryv/contracts/schemas/mzizi/reference.ts). The base `reference` group is included through the `vocabulary` compatibility export in the active database application; the `referenceLegal` registration group and `referenceProposals` remain outside it. Main review composition passes TypeScript, Dryv doctor and compile; this does not claim faithful Rust SQL generation, migration, live database change, or deployment.

[Phase 01 index](README.md) · [Schema catalogue](../../README.md)

## Approved responsibility

Reference is the shared starting point for canonical modern-country identity, controlled values, measurement units, topics and reviewed reusable pattern definitions. It owns pattern identity, immutable versions, applicability and dependencies. Engine owns execution state. Generated offices and other real records remain in their domain schemas.

`reference.countries` is the canonical modern-country catalogue. It does not contain a fictional `world` country and does not make country membership mandatory for global, historical or cross-border records. Geography owns territory and spatial facts: countrywide geographic scope resolves to that country's Geography unit where a domain record requires geographic scope. Do not confuse `reference.units` (measurement units) with `geography.units` (territorial units).

Reference mediates Legal relationships for other domains. The review-only `reference.legal_basis_links` contract targets exact `legal.provision_versions`, Reference basis-role values and Source citations. Typed associations connect it to `geography.changes` and `official.entities`. The existing optional `reference.pattern_bindings.provision_id` remains a separate unresolved proposal field and is not silently redirected. Governance associations await approved target tables. Do not invent a proxy Legal model or add untyped `target_type`/`target_id` pointers.

## Accepted table inventory and current authored fields

| Table | Authored fields | Identity, relations and indexes |
|---|---|---|
| `reference.countries` | `id`, `code`, `name` | PK `id`; unique `code`; name lookup index. Canonical modern-country identity. |
| `reference.schemes` | `id`, `code`, `title`, `owner_snapshot` | PK `id`; unique `code`. Controlled-vocabulary scheme identity. |
| `reference.values` | `id`, `scheme_id`, `code`, `label`, `supersedes_id?` | PK `id`; FKs to `schemes` and optionally self; globally unique `code`; scheme and supersession lookup indexes; prevents direct self-supersession. Same-scheme and transitive integrity remain unresolved. |
| `reference.units` | `id`, `code`, `symbol`, `quantity`, `scale`, `offset`, `base_id?` | PK `id`; optional self-FK for base unit; unique `code`; base lookup index; positive-scale invariant. Measurement units only. |
| `reference.topics` | `id`, `code`, `label`, `parent_id?` | PK `id`; optional self-FK; unique `code`; parent lookup index; no self-parent invariant. |
| `reference.patterns` | `id`, `code`, `title` | PK `id`; unique `code`; stable reusable pattern identity. |
| `reference.pattern_versions` | `id`, `pattern_id`, `edition`, `file_version_id`, `digest` | PK `id`; FK to patterns; unique pattern/edition; file-version lookup index. `file_version_id` remains a typed UUID pending a supported cross-schema relation in the active application. |
| `reference.pattern_bindings` | `id`, `version_id`, `unit_id?`, `country_id?`, `provision_id?`, `effective_from`, `effective_until?` | PK `id`; FK to pattern version and optional country; indexes for version/scope/time, country, unit, provision and start date; ordered-window expression. `unit_id` and `provision_id` remain typed UUIDs pending exact target and persistence review. |
| `reference.pattern_dependencies` | `id`, `version_id`, `requires_id` | PK `id`; two FKs to pattern versions; unique pair and reverse lookup index; prevents self-dependency. Transitive acyclicity is not enforced by this contract. |

Optional fields are nullable and optional in Dryv input. Scalar profiles come from `_shared.ts`; `LabelKind` is a closed technical enum. Declared relations use restrictive delete/update behavior. This table describes the current authored base contract, not final approval of every physical constraint. Proposed changes and dispositions are in the [classification architecture plan](reference-geography-classification.md).

## Proposed Reference extension

The current contract contains no taxonomy edges between classification values. [The classification plan](reference-geography-classification.md) proposes `reference.value_relations` for directed, multi-parent and cross-scheme relations. This would be an additional table and remains **not approved**; the `referenceProposals` group in `reference.ts` is intentionally uncomposed.

## Relationships and known gaps

The review-only Main entrypoint resolves 100 typed relation fields across Reference, Geography, Filesystem, Source, Legal, Official and Reference-Legal schemas. The active database application still composes only its existing operational schemas and Reference vocabulary; it does not activate these Main domains. Cross-database Operations identifiers remain application-validated external references. Country/unit compatibility for scoped bindings and uniqueness of effective scope are not encoded.

The current Dryv contract uses a SHA-256 digest for pattern version content and a separate typed file-version identifier; Engine owns execution. Pattern dependency cycles beyond direct self-reference require a database or named-operation check. Nullable-scope uniqueness, effective interval exclusion, and a native date-range representation have not been verified through the selected database pack. These semantics must not be treated as enforced merely because TypeScript compiles.

Acceptance of the foundation inventory does not resolve every implementation capability. Generation remains subject to verified IR/SQL semantics for unique nullable scopes, temporal overlap, cross-schema target assignment and all documented relations. No migration or live data action is authorized here.

## Superseded material

The accepted foundation preserves the existing Reference inventory and country direction. The detailed classification field proposals are not yet approved. The old detailed proposal and current-database inventories previously embedded below this heading are superseded where they conflict with the current contract. Existing migrations and generated artifacts remain historical implementation evidence, not the target design.
