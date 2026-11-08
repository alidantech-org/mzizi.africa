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

## Human review — editable user notes and design sign-off

**Review status:** `NOT REVIEWED` — AI-authored proposals in this document are not final approval.

**In my own words, what this schema should represent and exclude:**

> _My understanding and questions:_

**Tables/columns I want to keep, rename, move, merge, split, remove or add (and why):**

> _My proposed changes and alternative names:_

**Hard foreign keys, geographical and legal scope, pattern generation, classification and evidence I want changed or explained:**

> _My technical feedback, disagreements and alternatives:_

**Real data and queries I want to use to validate this design:**

> _My examples and expected results:_

**Unresolved decisions I want to discuss further:**

> _My remaining questions:_

**Final user decision:** `NOT DECIDED` / `NEEDS CHANGES` / `DESIGN VALIDATED BY USER` / `APPROVED FOR TASK PLANNING`.

**Approval reference and date:** _None. Only record explicit later user authorization. Even design validation does not authorize code, migration or Taskcode task creation._

## Mandatory per-table temporal, rigid-column and deletion review (2026-11-07)

**USER REQUIREMENT; planning only.** Examine every existing/proposed field and expressly record **KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD** for `valid_from`, `valid_to`, `valid_from_precision`, `valid_to_precision`, `is_current`, `status`, `version`, `created_at`, `updated_at` and other copied/rigid flags. These fields are **opt-in by justified meaning**, not blanket schema conventions. Assess `deleted_at` only for recoverable soft deletion where appropriate. The full policy and migration/approval checklist is in [schema redesign README](README.md).

**Domain-specific guidance:** Accounts have registration/deactivation states; grants or scoped roles may truly expire, while permission definitions usually do not. Expiring/revoking access differs from is_current. User erasure/anonymization requires deliberate retention/audit/FK policy and is not satisfied by simply adding deleted_at.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.


## 2026-11-07 admin-initiated activities and rechecks — permissions only (planning)

The user wants an authenticated administrator to enter a sourced event/announcement or request a research/refresh job. `auth` should govern **who may** submit a proposed activity, approve source-backed event verification, trigger a scoped one-time job, author or activate recurring watcher/schedule policies, and approve a canonical update. These **must not be one universal admin privilege**. Review roles, jurisdiction scope, source access and authentication strength. Human input enters as a sourced candidate, not automatically verified truth; service/agent identities need their own accountable actor contract. Record actions in `audit`, execute via `engine`. No account or permission migration authorized.

## 2026-11-08 — Agreed scoped RBAC direction and design deliverables

The user accepted the proposed direction and requested documentation and clarification of task TSK-1AC8F3754DAE. This approves recording and planning the design, not application code, database migrations, provisioning or deployment. Exact table/column specifications and implementation still await the user's subsequent go-ahead. This dated direction refines the older open questions above; it does not retroactively approve every earlier alternative.

### Current implementation and concrete reasons to redesign

Inspected repository models already give identity.accounts and identity.grants UUID primary keys; access.roles and access.permissions have code primary keys, and access.role_permissions has a composite primary key. Missing keys must be demonstrated by an audit, not presumed. Accounts have a unique issuer/subject pair, but token-verifier.ts currently requires a UUID subject and uses it directly as actorId. roles.ts hard-codes four role names and permission bundles. AuthGuard checks route policies without resource scope and permits unmatched routes. The access.account_permissions view considers account status and jurisdiction/validity; database staging review uses separate role/jurisdiction checks. reviewRun checks a permission without constraining its initial selection to the grant scope. These separate paths must be reconciled under one authorization contract. The web review workbench already supports OIDC authorization code with PKCE, but its UI recognizes reviewer/admin names rather than dynamic capabilities. These are source-code findings, not a live database audit.

### Accepted product and authorization direction

- An authenticated admin platform must support platform administrators and institution-scoped officials, with users, institutions, invitations, memberships, role bundles, scoped assignments, review/publication permissions and audit visibility.
- Keep OIDC authentication with an external identity provider; Mzizi owns stable accounts, verified affiliation and authorization. Plan MFA for privileged administration and document session/revocation integration rather than implementing password storage by default.
- Platform admins verify the first institutional administrator. That administrator may invite colleagues and assign approved roles within a delegated ceiling. An institutional email domain alone never creates privileges. Custom institution-defined role bundles can be a later extension within the same ceiling.
- Separate edit, review, publish, archive/delete, export, pipeline execution and access-management capabilities. Direct publication is an explicitly delegated permission for designated datasets/field groups, not an automatic consequence of official status. Authorization to publish does not itself establish evidence quality or truth.
- Support field groups and multiple data stewards, with explicit publication authority. The creator/uploader is not automatically the owning institution. Affiliation with an institution is not sufficient to edit everything associated with it.
- Dynamic roles and assignments are data-managed. Permission codes must correspond to implemented, enforced operations: inserting a permission row cannot create new application behavior.
- Deny access unless an active account has an applicable active grant. Explicit public-read policies remain possible. Platform administration and scoped institutional administration are separate capabilities.

### Candidate tables and columns to specify precisely

The following is a design starting point, not final DDL or a mandate to create every table. The task must resolve exact SQL types, nullability, defaults, checks, unique constraints, indexes, FK/delete behavior and comments for every retained column. Use UUID primary keys for independently referenced identities where justified; join tables may use composite primary keys. Preserve stable existing IDs during migration.

| Candidate object | Candidate columns / relationships to evaluate | Required integrity and meaning |
|---|---|---|
| auth.accounts | id, actor_kind, status, person_id, created_at, disabled_at | Stable accountable human/service actor; optional person FK must not turn a public profile into a login account. A service actor must not fabricate a person. |
| auth.login_identities | id, account_id, issuer, subject, linked_at | Account FK and unique issuer/subject; resolve this pair to internal account ID; never assume subject is UUID. Linking/unlinking requires verified account control. |
| auth.roles | id, code, name, description, managing_institution_id, protected | Dynamic named bundle; distinguish platform-managed and institutional roles; mutable labels do not change stable identity. |
| auth.permissions | id or stable code PK, code, resource_type, action, field_group | Catalog of enforceable capabilities; unique operation identity and recognized binding to API/worker policy. |
| auth.role_permissions | role_id, permission_id | Composite PK, hard FKs, no duplicate capability membership. |
| auth.memberships | id, account_id, institution_id, verified_by, verified_at, starts_at, ends_at, revoked_at | Verified affiliation with lifecycle and actor/institution FKs. Membership alone confers no editing authority. |
| auth.invitations | id, institution_id, invited_by, intended_identity, token_digest, expires_at, accepted_at | Bounded invitation/acceptance flow; no plaintext invitation secret, no automatic privilege from email matching. Link accepted membership/assignment through reviewed constraints. |
| auth.role_assignments | id, account_id, role_id, scope_id, membership_id, granted_by, starts_at, expires_at, revoked_at, revocation_reason | Exact effective grant; timestamps have operational meaning. Any membership-bound grant becomes ineffective when that membership ends. |
| auth.scopes and typed scope bindings | id, scope_kind; typed jurisdiction, geo-unit, institution, dataset and specific-resource FKs as needed | Avoid FK-less resource_kind/resource_id pairs. Explicit global scope, never accidental global authority from null. Define exactly-one-kind checks and scope intersection/composition. |
| auth.delegations, if needed | id, delegator_id, delegate_id, scope_id, permitted_role/permission bindings, expires_at, revoked_at | Authority to grant is separate from authority to edit; recipient cannot exceed permission, field, scope, duration or further-delegation ceilings. |
| auth.sessions, only if required | id, account_id, provider/session reference, created_at, expires_at, revoked_at | Persist only necessary server session/revocation state; specify logout and account-disable behavior. |

Known account-to-person, account-to-institution, actor-to-audit and scope-to-resource relationships require real cross-schema FKs. Resource ownership/stewardship is a domain relationship, not something to invent entirely inside auth. The later domain-schema tasks must resolve its precise typed representation and dataset identities. Define the auth-side contract now and mark external target decisions explicitly; do not prematurely create a universal resource registry or redesign later domains to satisfy a generic UUID reference.

### How accounts, people and resources connect

A login resolves issuer + subject -> login identity -> stable account. An account may have a separately controlled link to person.individuals. Verified membership connects the account to a real institution. A role assignment connects that account to a permission bundle and explicit scope; a delegation bounds who can issue that assignment. Resource metadata supplies authoritative jurisdiction, geographic placement, dataset, steward/owner and workflow state. None of those facts may be trusted merely because a request body or token claims them.

An IEBC editor may edit designated Kenyan electoral datasets managed by IEBC, but not party biographies or all Kenyan records. A Nairobi County editor may edit county-stewarded data, but not IEBC-managed election results merely because they concern Nairobi. A resource with several stewards must identify which actions each steward can perform and who may publish. Examples must include permitted and denied reads, edits, field changes, review, publication, bulk exports and invitations.

Scope dimensions combine explicitly. A single assignment requiring Kenya AND electoral domain AND IEBC stewardship cannot be accidentally satisfied by unrelated grants for separate dimensions. Independent complete grants can supply alternative valid access paths; permission from one grant must not be combined with broader scope from another. Design field-group matching and ownership transitions with the same rule. Geographic descendants are included only where the assignment explicitly requests inheritance. National jurisdiction does not mean authority over all national data.

### Dynamic scope and enforcement contract

Derive effective scope from existing resource identities and validated relationships, not copied county names or a list of IDs embedded in long-lived tokens. Hierarchy changes, ownership transfers, membership expiry, role edits, suspension and revocation must invalidate cached decisions or be re-evaluated within a documented bound; sensitive writes recheck authorization against current resource state within the mutation transaction. Newly linked descendants may enter an explicitly inherited scope, so record changes that broaden access and require an approval policy for reparenting or stewardship transfers. Historical audit must retain the decision basis even after current grants change.

One backend policy contract should accept actor, action, resource, proposed field changes and operation context, then return allow/deny plus the supporting assignment, scope, membership/delegation and policy version. API, workers, import/review/promotion, files, list/search queries, exports and bulk actions must enforce that contract. Filter unauthorized rows before pagination and totals; recheck changed fields and both old and proposed owner/scope to prevent moving a record into an editable scope or escalating access by editing its ownership. Batch jobs must not inherit blanket authority from a triggerer's role name. Specify behavior when permissions change during a long-running job.

The admin UI consumes effective capabilities from the backend and offers an explain-access view, but hiding a button is not enforcement. Login/account status checks, correct issuer/audience validation, provider identity mapping, strong authentication for privileged actions and explicit public-route registration belong in the design. If database RLS is considered, evaluate transaction connection context and worker coverage; it is not assumed necessary or sufficient before an explicit design decision.

### Required final design package and approval boundary

Update this existing auth document with the full current-to-target table inventory and exact column dictionaries, annotated relationship diagram, sample permissions and bounded roles, grant/deny examples, admin/mobile/API flows, delegation and membership lifecycle, audit explanation, migration mapping and focused verification matrix. Explain every table in plain language and how people, accounts, institutions and resources remain distinct while linking correctly. Demonstrate cross-county denial, IEBC/county ownership separation, expired/revoked membership, non-UUID provider subjects, self-escalation denial, unauthorized field updates, role/scope changes, multi-steward conflicts and concurrent ownership change. Prefer explainable scoped RBAC with explicit attributes/relationships over unrestricted user-authored policy code.

Return the completed design for user review. No migrations, schema/contract/code edits, account creation, identity-provider deployment, live resource changes or implementation of later milestones are authorized by this documentation update.
