---
{id: TSK-1AC8F3754DAE,name: Design and harden the auth schema,type: task,status: completed,priority: medium,created_at: 2026-11-08T06:46:25.990Z,updated_at: 2026-11-11T04:25:32.929Z,order: 1024,extra: {status_history: [{from: planned,to: completed,at: 2026-11-11T04:25:32.929Z}]}}
---

---
{id: TSK-1AC8F3754DAE,name: Design and harden the auth schema,type: task,status: completed,priority: medium,created_at: 2026-11-08T06:46:25.990Z,updated_at: 2026-11-11T04:25:32.929Z,order: 1024,extra: {status_history: [{from: planned,to: completed,at: 2026-11-11T04:25:32.929Z}]}}
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

Reconciled on 2026-11-11 against the accepted simplified implementation in `.docs/improvements/schema-redesign/auth.md`. Completion covers the nine-table foundation; the earlier expanded criteria are preserved below as history.

- [x] Inventory legacy identity/access tables and consumers and record verified key, identity and grant defects.
- [x] Implement the accepted nine auth tables with primary keys, foreign keys, uniqueness, scope validation and grant lifecycle constraints in `source/schema/database/auth/`.
- [x] Implement opaque OIDC issuer/subject resolution, active-account checks and database-backed roles and namespaced permissions.
- [x] Implement scoped descendant access, governed-table ownership, current/proposed owner checks and allowed-link filtering, with IEBC/county allow/deny examples.
- [x] Implement grant expiry, revocation and suspension checks, immutable assignments and platform-admin grant/revoke authority.
- [x] Provide the NestJS database guard and authority, selected by `AUTH_DATABASE_URL`, and Python migration/auth seed tooling using root seed inputs.
- [x] Provide focused schema and API authorization tests and record the historical verification results and their limits.
- [x] Record the clean-rewrite decision, accepted simplification and explicitly deferred product integration and advanced access features.

## Deferred scope (not delivered by this milestone)

Invitations, verified memberships, delegated access-management ceilings, field groups, MFA/session extensions, audit/decision logs, service-account ownership, account anonymization, admin screens and review-workbench adoption remain deferred as recorded by the controlling design. The account-to-person link and concrete geography/domain bindings require later domain schemas (tasks 03/04). Product-wide enforcement and rollout are not claimed complete. No new test run was performed during this checklist reconciliation.

## Superseded acceptance criteria (historical)

- Inventory every current identity/access table, view, key and runtime consumer; list verified defects.
- Specify complete auth tables and columns, PKs, FKs, uniqueness, scope and lifecycle rules with representative queries.
- Document OIDC identity-to-account mapping, roles/permissions enforcement and mobile/API contracts.
- Prepare data-preserving migration mapping, targeted validation and explicit user design-review decisions.
- Specify accounts, provider identities, roles, permission bundles, verified memberships, invitations, scoped assignments and justified delegation/session tables with exact columns and enforceable links.
- Explain person versus account versus institution versus resource ownership, using a relationship diagram and concrete IEBC/county examples.
- Define row and field-group restrictions, scope inheritance/intersection, dynamic resource/ownership synchronization, delegation ceilings and multi-steward publication rules.
- Define unified backend enforcement across admin/mobile/API, list filtering, bulk operations, exports, workers and promotion; deny unmatched protected operations.
- Document MFA/login/session behavior, disable/revoke propagation, current and proposed ownership checks and auditable access explanations.
- Provide meaningful allow/deny and concurrency verification scenarios, and present the exact design for user review before implementation.

## Root seed registry requirement — 8 November 2026

All manually/AI-prepared bootstrap inputs now belong under root `seed/`, including baseline auth permissions/roles, global file types and jurisdictions, curated folders, system and jurisdiction patterns, site structures and seed-specific source artifacts. Read [seed registry convention](https://github.com/alidantech-org/mzizi.africa/blob/develop/seed/README.md). Preserve global/system/jurisdiction separation; curated `seed/ke/...` inputs are distinct from ignored regeneratable `seed/generated/ke/...` outputs. Manifests map every adopted input to its immutable S3 artifact identity and recognized loader/domain target, natural keys, dependencies, hash and explicit access. Do not create another seed schema or filesystem registry without demonstrated need. Runtime loaders remain under source; Dryv schema contracts remain under dryv.

The clean database target is mzizi_new: schema/data disposal and fresh identities are approved, with no legacy compatibility or migration requirement. Existing S3 objects are not disposable. This task update documents requirements; actual content, manifest runtime support, bulk relocation and application remain gated by the owning implementation task. Folder/type seed production is still deferred until its model and reference/geography prerequisites are ready.

## Progress and findings (2026-11-08)

Repository evidence only; the legacy databases were not audited live and are not needed under the clean-rewrite policy.

**Inventory.** `identity.accounts` (issuer, subject, status, person_id), `identity.grants` (role enum, jurisdiction_id, validity dates and precisions, is_current, granted_by), `access.roles`, `access.permissions`, `access.role_permissions`, view `access.account_permissions`. Consumers: API `src/auth/*` (roles claim, UUID subject), `engine/database` seeds (`seed dev-accounts`), grants and review code, and `access.touch()` triggers shared with staging tables.

**Verified defects.** No table lacks a primary key (including the `role_permissions` junction), so there was no missing-PK defect. The real defects: `identity.grants` has foreign keys only on `account_id`, while `granted_by`, `jurisdiction_id` and `accounts.person_id` are unconstrained plain uuids; no uniqueness prevents duplicate grants; grants use a closed role enum with no FK to `access.roles`; `is_current` and precision columns duplicate validity; grants may be open-ended; the token verifier rejects any non-UUID subject and takes roles from the token claim rather than the database; no delegation, membership, ownership or field-level concept existed; `account_permissions` could not express institution scope.

**Delivered (second, simplified build).** A first build had 19 tables and was rejected as too complex. The final design has nine tables in `auth` (accounts, identities, permissions, roles, role_permissions, institutions, scope_targets, governed_tables, role_assignments), built in `mzizi_new` and documented in `.docs/improvements/schema-redesign/auth.md`. Access is namespaced permissions (`electoral.edit`), dynamic roles, and grants scoped to a `schema.table` record that cover its children; governed tables declare their one owning link, so a county grant cannot reach IEBC-owned data. Tooling and allowlist: `engine/database/src/rewrite.ts` and `config.ts`; API guard and authority: `source/backend/api/src/auth/`. Verification: 18 database tests and 6 API tests pass. Deferred until needed: invitations, memberships, delegation limits, field groups, MFA flags, operation registry, audit and decision logs, admin screens, review workbench switch, and the person link.

## Comments

### 2026-11-11T04:25:32.623Z · PETER IRUNGU

Status reconciliation, 2026-11-11: the accepted simplified auth foundation is completed. The controlling Implemented design and Status and policy sections in .docs/improvements/schema-redesign/auth.md explicitly supersede the original larger proposal and design-only restriction. Verified repository evidence: nine auth tables in source/schema/database/auth/0001_auth.sql; identity resolution, scoped authorization, ownership-change checks, grant expiry/revocation and administrative grant functions in 0002_auth_functions.sql; Python auth seed loader; NestJS database guard/authority and conditional installation through AUTH_DATABASE_URL; focused auth schema tests present. Historical test results are recorded in the task; no database initialization or live tests were run during this status review. Original unchecked criteria include superseded requirements and must not be interpreted as delivered: memberships/invitations, delegation ceilings, field groups, MFA, audit logs and admin screens were explicitly deferred. Person/domain scope integration awaits tasks 03/04 and later consumers; the review workbench switch remains deferred. These do not block the accepted nine-table foundation. Completion is bounded to that accepted implementation, not full product-wide auth rollout.
