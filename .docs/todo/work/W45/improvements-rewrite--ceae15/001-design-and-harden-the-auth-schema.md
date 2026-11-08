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

## Acceptance checklist

- [ ] Inventory every current identity/access table, view, key and runtime consumer; list verified defects.
- [ ] Specify complete auth tables and columns, PKs, FKs, uniqueness, scope and lifecycle rules with representative queries.
- [ ] Document OIDC identity-to-account mapping, roles/permissions enforcement and mobile/API contracts.
- [ ] Prepare data-preserving migration mapping, targeted validation and explicit user design-review decisions.
