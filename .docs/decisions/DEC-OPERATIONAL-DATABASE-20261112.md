---
id: DEC-OPERATIONAL-DATABASE-20261112
name: Operational database design approval
type: decision
tags: [database, operations, dryv, schema-redesign, approval]
extra: {status: accepted, approved_on: 2026-11-12, database: mzizi_operations, tables: 45, implementation: dryv_contracts_authorized, migrations: not_authorized, deployment: not_authorized}
---

# Decision: approve the Mzizi Operational database design

**Date:** 2026-11-12  
**Status:** ACCEPTED AND APPROVED  
**Approval:** The user explicitly approved the complete Operational database proposal in the 12 November 2026 review conversation and authorized it to proceed to implementation.

## Decision

The seven Operational schemas and their **45-table inventory and listed columns** are accepted as the approved design baseline for the single PostgreSQL database `mzizi_operations`. A later explicit user direction renames the optional Main-country reference in `auth.scopes` from `jurisdiction_ref_id` to `country_ref_id`; this amendment supersedes that one field name in the original inventory.

The approval covers the responsibilities, ownership, table names and column inventories listed below. The seven schemas are:

| Schema | Approved tables |
|---|---:|
| `auth` | 11 |
| `acquisition` | 7 |
| `engine` | 10 |
| `staging` | 6 |
| `analytics` | 5 |
| `audit` | 2 |
| `management` | 4 |
| **Total** | **45** |

## Implementation authorization and boundary

1. Dryv contract authoring for all seven Operational schemas is authorized on `develop`.
2. The owning schema design documents must carry the accepted inventory and link to this decision.
3. The implementation must follow `.docs/rules/schema-contract-authoring.md`, `.docs/rules/code-columns.md`, and `.docs/_plan/schema-redesign/contract-authoring.md`.
4. Reusable non-enum scalar properties belong in `dryv/contracts/schemas/_shared.ts`; schema-local properties are permitted only for enums. Do not create duplicate scalar properties because field names differ.
5. Do not force generic lifecycle columns onto every table. Each table receives only fields justified by its meaning.
6. Hard foreign keys are permitted across schemas inside `mzizi_operations` when they represent real, enforceable relationships.
7. References from Operations to records in Main (`mzizi`) use typed identifiers and application-level validation. There are no cross-database foreign keys or distributed transactions.
8. Acquisition owns discovery and retrieval; Staging owns extraction mappings, candidate revisions, validation and review; Engine owns execution and retry coordination; Audit owns attributable operational/security events and decisions; Management coordinates publication but cannot claim Main committed data without authoritative acknowledgement.
9. The approved inventory is not permission to silently add, remove or rename tables or columns. If implementation reveals a material modelling gap, record the proposed change and its reason in the owning document before changing the approved inventory.

## Engineering details to resolve during contract authoring

The approval does not require the user to approve every implementation detail separately. The implementation author should make and document coherent technical decisions for field types, nullability, defaults, primary keys, uniqueness, foreign-key cardinality and delete/update actions, checks, indexes, query exposure, retention, and any partitioning. Follow the approved semantics and repository rules; benchmark before adding partitions.

If Dryv cannot express a required constraint or relationship, document the exact capability gap. Do not silently weaken the intended database invariant or invent unsupported syntax.

## Explicit exclusions

- No Main `mzizi` Phase 01 schema is approved by this decision. The user will review those schemas individually later, one at a time.
- Phase 02 remains deferred.
- This decision does not authorize SQL migration generation/application, database provisioning, seed loading, data migration, destructive changes, deployment or production activation.
- Existing databases, data and object storage must remain untouched during contract authoring.
- The earlier shared-property catalogue review is not blanket-approved by this decision. Only changes needed to implement these Operational contracts may be proposed and must comply with the authoring rules.

## Approved table and column inventory

## auth — 11 approved tables

**Responsibility:** Accounts, login identities, roles, permissions, memberships, invitations, explicit scopes, assignments and bounded delegation.

### `auth.accounts`

`id`, `actor_kind`, `display_name`, `status`, `person_ref_id`, `created_at`, `disabled_at`, `last_authenticated_at`

### `auth.login_identities`

`id`, `account_id`, `issuer`, `subject`, `linked_at`, `unlinked_at`, `last_authenticated_at`

### `auth.roles`

`id`, `code`, `title`, `description`, `managing_institution_ref_id`, `protected`, `policy_version`, `created_at`, `retired_at`

### `auth.permissions`

`id`, `code`, `resource_type`, `action`, `field_group`, `description`, `is_active`

### `auth.role_permissions`

`role_id`, `permission_id`, `granted_by`, `granted_at`

### `auth.memberships`

`id`, `account_id`, `institution_ref_id`, `status`, `verified_by`, `verified_at`, `starts_at`, `ends_at`, `revoked_by`, `revoked_at`

### `auth.invitations`

`id`, `institution_ref_id`, `invited_by`, `intended_email`, `token_digest`, `expires_at`, `accepted_account_id`, `accepted_at`, `revoked_at`, `created_at`

### `auth.scopes`

`id`, `is_global`, `institution_ref_id`, `country_ref_id`, `geographic_unit_ref_id`, `dataset_ref_id`, `field_group`, `include_descendants`, `scope_hash`, `created_at`

**Country-reference amendment:** `country_ref_id` is an optional typed reference to a country record in Main. It is validated by the application because Main and Operations are separate databases; no cross-database foreign key is created. Main's proposed geography inventory uses countries and does not retain a jurisdiction table.

### `auth.role_assignments`

`id`, `account_id`, `role_id`, `scope_id`, `membership_id`, `delegation_id`, `granted_by`, `starts_at`, `expires_at`, `revoked_by`, `revoked_at`, `revocation_reason`, `created_at`

### `auth.delegations`

`id`, `delegator_account_id`, `delegate_account_id`, `scope_id`, `starts_at`, `expires_at`, `revoked_by`, `revoked_at`, `created_at`

### `auth.delegation_roles`

`delegation_id`, `role_id`

## acquisition — 7 approved tables

**Responsibility:** Source targets, versioned collection policy, crawl frontier, access attempts, observations and discovered links.

### `acquisition.targets`

`id`, `url`, `publisher_ref_id`, `policy_version_id`, `state`, `created_at`, `updated_at`, `retired_at`

### `acquisition.policies`

`id`, `code`, `title`, `description`, `created_by`, `created_at`, `retired_at`

### `acquisition.policy_versions`

`id`, `policy_id`, `version`, `rules`, `rules_hash`, `approved_by`, `approved_at`, `effective_from`, `effective_until`

### `acquisition.frontier`

`id`, `target_id`, `url`, `priority`, `state`, `due_at`, `lease_owner`, `lease_until`, `lease_fence`, `attempt_count`, `last_attempt_at`, `engine_job_id`, `created_at`, `updated_at`

### `acquisition.access_attempts`

`id`, `target_id`, `frontier_id`, `run_id`, `job_id`, `requested_url`, `started_at`, `completed_at`, `http_status`, `outcome`, `retry_after`, `error_code`, `response_hash`, `artifact_id`, `bytes_received`

### `acquisition.observations`

`id`, `target_id`, `access_attempt_id`, `url`, `canonical_url`, `content_hash`, `observed_at`, `content_type`, `etag`, `last_modified`, `artifact_id`

### `acquisition.discovered_links`

`id`, `observation_id`, `target_url`, `normalized_url`, `anchor_text`, `rel`, `resolved_target_id`, `discovered_at`

## engine — 10 approved tables

**Responsibility:** Pipeline identity/releases, runs, schedulable jobs, dependencies, attempts, checkpoints, execution events, outbox delivery and artifacts.

### `engine.pipelines`

`id`, `code`, `title`, `description`, `owner_account_id`, `enabled`, `created_at`, `retired_at`

### `engine.pipeline_releases`

`id`, `pipeline_id`, `version`, `manifest_hash`, `manifest_object_key`, `contract_version`, `approved_by`, `released_at`

### `engine.runs`

`id`, `release_id`, `requested_by`, `trigger_kind`, `trigger_ref`, `idempotency_key`, `request_hash`, `status`, `submitted_at`, `started_at`, `finished_at`, `cancelled_at`, `summary`

### `engine.jobs`

`id`, `run_id`, `kind`, `input_ref`, `status`, `attempt_count`, `max_attempts`, `next_attempt_at`, `lease_owner`, `lease_until`, `fence`, `created_at`, `started_at`, `finished_at`

### `engine.job_dependencies`

`job_id`, `depends_on_job_id`, `dependency_kind`, `created_at`

### `engine.job_attempts`

`id`, `job_id`, `attempt_number`, `worker_identity`, `started_at`, `finished_at`, `status`, `error_code`, `error_summary`, `input_hash`, `output_hash`

### `engine.checkpoints`

`id`, `job_id`, `sequence`, `checkpoint_key`, `state_hash`, `artifact_id`, `saved_at`

### `engine.events`

`id`, `run_id`, `job_id`, `sequence`, `kind`, `actor_id`, `occurred_at`, `payload`

### `engine.outbox`

`id`, `event_id`, `destination`, `status`, `attempts`, `next_attempt_at`, `delivered_at`, `last_error`, `idempotency_key`

### `engine.artifacts`

`id`, `run_id`, `job_id`, `object_key`, `sha256`, `size_bytes`, `media_type`, `role`, `access_classification`, `created_at`, `expires_at`

## staging — 6 approved tables

**Responsibility:** Candidate identities, immutable revisions, extraction mappings, validation findings, human reviews and idempotent promotion requests.

### `staging.candidates`

`id`, `target_schema`, `target_table`, `target_contract`, `target_contract_version`, `stable_key`, `source_run_id`, `status`, `current_revision_id`, `created_by`, `created_at`

### `staging.revisions`

`id`, `candidate_id`, `revision_number`, `payload`, `schema_version`, `content_hash`, `artifact_id`, `source_manifest_key`, `source_manifest_hash`, `created_by`, `created_at`, `supersedes_revision_id`

### `staging.mappings`

`id`, `source_kind`, `target_contract`, `target_contract_version`, `version`, `mapping_definition`, `mapping_hash`, `model_provider`, `model_name`, `model_version`, `status`, `created_by`, `approved_by`, `approved_at`, `created_at`

### `staging.findings`

`id`, `revision_id`, `path`, `code`, `severity`, `message`, `details`, `rule_version`, `created_at`

### `staging.reviews`

`id`, `revision_id`, `reviewer_id`, `decision`, `reason`, `decided_at`, `policy_version`

### `staging.promotion_requests`

`id`, `revision_id`, `expected_main_version`, `idempotency_key`, `request_hash`, `status`, `publication_id`, `requested_by`, `requested_at`, `completed_at`, `failure_code`

## analytics — 5 approved tables

**Responsibility:** Research experiments, analytical requests, rebuildable projections, unpublished results and reproducibility evaluations.

### `analytics.experiments`

`id`, `code`, `title`, `hypothesis`, `protocol`, `protocol_version`, `status`, `created_by`, `created_at`, `closed_at`

### `analytics.requests`

`id`, `experiment_id`, `requested_by`, `query_contract`, `query_version`, `input_release_ids`, `request_hash`, `engine_run_id`, `status`, `requested_at`, `completed_at`

### `analytics.projections`

`id`, `request_id`, `source_contract`, `source_release`, `object_key`, `sha256`, `schema_version`, `row_count`, `created_at`, `expires_at`

### `analytics.results`

`id`, `request_id`, `method_version`, `object_key`, `inline_summary`, `sha256`, `created_at`

### `analytics.evaluations`

`id`, `result_id`, `check_name`, `passed`, `details`, `evaluator_version`, `checked_at`

## audit — 2 approved tables

**Responsibility:** Append-only attributable operational/security events and formal decisions.

### `audit.events`

`id`, `actor_id`, `action`, `target_kind`, `target_id`, `target_version`, `request_id`, `correlation_id`, `recorded_at`, `details`, `previous_hash`, `event_hash`

### `audit.decisions`

`id`, `event_id`, `actor_id`, `decision_type`, `decision`, `subject_kind`, `subject_id`, `subject_version`, `policy_version`, `reason`, `request_hash`, `decided_at`

## management — 4 approved tables

**Responsibility:** Operations schema-release history and cross-database publication coordination/reconciliation.

### `management.schema_releases`

`id`, `release_id`, `database_target`, `digest`, `applied_at`, `manager_version`, `applied_by`

### `management.publications`

`id`, `publication_id`, `request_key`, `request_hash`, `actor_snapshot`, `contract_version`, `state`, `requested_at`, `submitted_at`, `published_at`, `last_reconciled_at`

### `management.publication_items`

`id`, `publication_id`, `schema_name`, `table_name`, `record_id`, `operation`, `expected_record_version`, `resulting_record_version`, `payload_hash`

### `management.delivery_receipts`

`id`, `publication_id`, `request_key`, `request_hash`, `observed_at`, `state`, `main_commit_ref`, `response_hash`, `details`


## Consequences

The previous candidate inventories and pre-approval status notes in the seven Operational design documents are superseded by this decision. Historical notes remain available as design context but cannot override the approved inventory above.

The next implementation task is to author complete Dryv definitions for these 45 tables, validate the contracts and report any generator limitations. Once Operational contracts are complete, Main Phase 01 review resumes only at the user's direction, schema by schema.
