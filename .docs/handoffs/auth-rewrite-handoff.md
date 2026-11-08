---
{id: HANDOFF-AUTH-REWRITE,name: Handoff - auth schema built in mzizi_new,type: handoff,tags: [auth,rewrite,schema-redesign]}
---

# Handoff: auth schema built in `mzizi_new` (task 01)

Date: 2026-11-08. Task: `TSK-1AC8F3754DAE`. Policy: `.docs/decisions/clean-rewrite-mzizi-new.md`.

## What exists

Nine tables, built small on purpose after a first 19-table build was rejected as too complex.

- SQL: `source/backend/engine/database/rewrite/0001_auth.sql` and `0002_auth_functions.sql`.
- Tooling: `src/rewrite.ts` (init, reset, status, bootstrap-admin); migrations tracked in `public.migrations`; allowlist for the exact database `mzizi_new` in `src/config.ts`.
- Tests: `test/rewrite-auth.test.ts` (18) and `source/backend/api/src/auth/database-auth.spec.ts`.
- API: `createIdentityVerifier`, `PgAccessAuthority`, `DatabaseAuthGuard`, `installDatabaseAuth`; `AUTH_DATABASE_URL` enables it in `main.ts`.
- Design: `.docs/improvements/schema-redesign/auth.md`.

## For later milestones

When a data table is built, register it: `auth.register_scope_target` if grants may point at its records (jurisdictions, geo units), and `auth.register_governed_table` with its one owning link column. New data schemas call `auth.register_namespace`. Link `accounts` to `person.individuals` when that schema exists.

## Deferred

Invitations, memberships, delegation, field-group restrictions, MFA flags, operation registry, audit logs, admin screens, review workbench switch. See "Deferred until needed" in auth.md.

## Next

Task 02: filesystem on the existing S3 deployment. Keep it equally small; reference `auth.accounts` for uploaders only.
