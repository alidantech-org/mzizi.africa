---
id: DOC-86A3B019F5C2
name: Authentication and access control schema redesign
type: documentation
tags: [improvements, schema-redesign, auth, rbac, planning]
extra: {status: planning_only}
---

# Auth — unified accounts, authentication, roles and permissions

**PLANNING ONLY. The user's explicit requested direction is `identity` + `access` → a simpler `auth` schema.**

## Domain boundaries

The platform's login/authentication identity is not a real-world identity record. A real governor or researcher lives in `person.individuals` whether or not they have a MZIZI login. `auth.accounts` identify actors who can access MZIZI services; `auth` governs credentials/session identities, roles, permissions and grants. Historical/public records of the person's office or political membership must not be mixed into login tables.

Preserve separation from `audit` (who did what), `engine` (who started/reviewed a pipeline) and `participation` (who submitted public feedback or official consultation). These connect through hard foreign keys to authorized actors or relevant person identity, without duplicating user profiles.

## Current tables, view and candidate target

| Existing object | Intended disposition and questions |
|---|---|
| `identity.accounts` | Candidate `auth.accounts` — stable account ID, associated person ID when applicable, login identity and status. |
| `identity.grants` | Candidate `auth.grants` — individual account/resource capability grants; distinguish roles from exceptions. |
| `access.roles` | Candidate `auth.roles` — role identity, scope, status and membership semantics. |
| `access.permissions` | Candidate `auth.permissions` — precise action/resource permission vocabulary, not just UI labels. |
| `access.role_permissions` | Candidate `auth.role_permissions` — enforce each role/permission via real FK. |
| `access.account_permissions` | Existing view; evaluate recalculation under new auth schema and direct grants/roles. |
| **Potential** `account_roles` | Add only if current identity.grants cannot accurately handle user role assignments/scopes. |
| **Potential** `sessions`/`tokens` | Only if actual authentication implementation requires persisted session/revocation data. |

The source of truth for existing fields is current TypeORM `identity` entities plus the access-control migration; older docs may omit `access` altogether. Inventory all columns, enums, composite uniqueness and views before choosing exact target SQL.

## FK and RBAC requirements

All role grants, role permissions, account role assignments and session/actor references must use hard FKs. Cross-domain actor references in `audit` and `engine` should FK to `auth.accounts` where events were performed by authenticated accounts; distinguish service actors and external reviewers if needed. Optional links to `person.individuals` must be evidence-backed and permission-controlled; an account is not a replacement for a person row. Domain- or jurisdiction-scoped access may need a scope junction (resource, organization or jurisdiction) but a generic FK-less target pair should not be the default.

Roles should be explainable (reviewer, data curator, pipeline operator, admin, public user) and separate from data-source truth verification. A person can be granted a temporary reviewer role without becoming a government official; a public official can submit participation content without elevated database privileges.

## Data classification and generation

Mostly **1A static seeded** permission/action vocabulary and default role definitions, plus **2A automatically collected** actor grant/session lifecycle from actual authorized operations. **1B pattern** applies only to repeatable initial role/permission templates, not fabricated user accounts. **2B derived** effective permissions can be a view/query rather than materialized copied grants. Account and security metadata are sensitive and should not be published merely because most crawled source files are public.

## Query and migration examples

Show which actor approved a source or canonical correction at a historical time; inspect which permissions a reviewer had when granting an approval; report the effective capabilities of a pipeline operator with scope; revoke a role without destroying the audit trail; link a public contributor to a person profile only when explicitly appropriate and authorized.

Migration strategy: preserve account/role/grant IDs and login continuity; map `identity` and `access` names to `auth`, update backend guards, API, worker review checks and audit FK; rebuild `account_permissions` view, document table/column comments and run authorization tests **only after approval**. No indiscriminate permission escalation.

## Explicitly unresolved decisions

1. What exactly is `identity.grants` modeling today versus role assignments?
2. Are RBAC roles global, organizational, jurisdiction-scoped or project scoped?
3. Which session/token storage is actually necessary?
4. How to represent service/agent actors separately from human accounts?
5. Which public participation roles require authentication versus anonymous submissions?
6. How to preserve audit identity when an account is retired/deleted?

**References:** [Master register](../mzizi-data-schema-storage-and-pipelines-redesign.md) · [Audit](audit.md) · [Participation](participation.md) · [Engine](engine.md).

**Status: auth consolidation direction recorded; exact table/column design not approved.**
