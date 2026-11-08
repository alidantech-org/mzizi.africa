---
{id: TSK-1AC8F3754DAE,name: Design and harden the auth schema,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:25.990Z,updated_at: 2026-11-08T06:46:25.990Z,order: 1024}
---

# 01 — Design and harden the auth schema

## Goal

Deliver a precise, understandable and reviewable design for this milestone in the improvements rewrite, preserving useful existing functionality and establishing reliable inputs for the next milestone.

## Context

First task; no predecessor. Audit identity and access together, including account_permissions views and token/actor consumers. Design unified auth ownership for accounts, provider identities, roles, permissions and scoped grants; public person identities remain separate. Verify rather than assume missing primary keys, including junction tables. Address provider subject uniqueness, grant expiry/revocation, least privilege and API/mobile sign-in needs. Define audit links without moving participation content into auth.

Inspect current Dryv contracts, generated entities, migration history, runtime readers/writers and existing tests before proposing changes. Distinguish repository evidence from a verified live database audit. For every table specify purpose, columns, SQL types, nullability, defaults, primary keys, foreign keys including cross-schema relationships, unique/check constraints, indexes, deletion behavior and comments. Use KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD decisions with migration mapping; preserve stable IDs, evidence and existing data. Justify temporal/version fields individually. This task is planned design work: creation does not authorize migrations, application changes, deployment or execution of subsequent tasks. Record user design decisions before proposing a coordinated implementation. Work on develop only and do not modify .github. Tasks remain planned until explicitly started.

## Source documentation

- [schema-redesign/auth.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/auth.md)
- [schema-redesign/audit.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/audit.md)
- [schema-redesign/participation.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/participation.md)
- [schema-redesign/README.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/README.md)

## Agreed scope — 8 November 2026

The user accepted scoped RBAC and requests an exact, advanced but understandable auth schema design before giving implementation go-ahead. Use the dated direction in the auth source document as the controlling requirements. Plan authenticated administration, OIDC account mapping, verified institutional onboarding, bounded delegation, dynamic roles, action/field-group permissions and resource-linked scopes. Reference actual institution, geography, jurisdiction, dataset and ownership/stewardship relationships with hard FKs. An account/person link and institutional membership never confer universal access. Editing, reviewing, publishing and assigning access are separate permissions. IEBC-managed electoral records and county-stewarded records must remain distinct even when geographically overlapping. Folder/source/pipeline implementation remains in later tasks.

Produce the design in the existing auth document: exact current and target table/column dictionaries with types, nullability, defaults, PKs, FKs, checks, uniqueness, indexes, lifecycle and comments; annotated relationship diagram; example data and allow/deny decisions; admin/mobile/API and worker enforcement contracts; migration mapping and a focused validation matrix. Verify actual missing keys instead of assuming their absence. Account permissions must be evaluated from current database grants and authoritative resource relationships, including scope/ownership changes, expiry and revocation. No permission-plus-scope mixing across unrelated grants; prevent granting beyond delegation ceilings and self-escalation. Explain the design in plain language and identify dependencies on later domain modeling explicitly.

This task remains planned. This update only documents the agreed direction and future deliverables; do not start implementation, migrate data, provision login infrastructure or mark design acceptance complete. Return the final design to the user for the next go-ahead.

## Acceptance checklist

- [ ] Inventory every current identity/access table, view, key and runtime consumer; list verified defects.
- [ ] Specify complete auth tables and columns, PKs, FKs, uniqueness, scope and lifecycle rules with representative queries.
- [ ] Document OIDC identity-to-account mapping, roles/permissions enforcement and mobile/API contracts.
- [ ] Prepare data-preserving migration mapping, targeted validation and explicit user design-review decisions.
- [ ] Specify accounts, provider identities, roles, permission bundles, verified memberships, invitations, scoped assignments and justified delegation/session tables with exact columns and enforceable links.
- [ ] Explain person versus account versus institution versus resource ownership, using a relationship diagram and concrete IEBC/county examples.
- [ ] Define row and field-group restrictions, scope inheritance/intersection, dynamic resource/ownership synchronization, delegation ceilings and multi-steward publication rules.
- [ ] Define unified backend enforcement across admin/mobile/API, list filtering, bulk operations, exports, workers and promotion; deny unmatched protected operations.
- [ ] Document MFA/login/session behavior, disable/revoke propagation, current and proposed ownership checks and auditable access explanations.
- [ ] Provide meaningful allow/deny and concurrency verification scenarios, and present the exact design for user review before implementation.
