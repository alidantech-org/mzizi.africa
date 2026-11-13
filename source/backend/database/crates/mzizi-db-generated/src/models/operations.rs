//! Generated rows for the logical operations store (mzizi_operations).
#[doc(hidden)]
#[path = "operations/acquisition/access_attempts.rs"]
pub mod acquisition_access_attempts;
#[doc(hidden)]
#[path = "operations/acquisition/discovered_links.rs"]
pub mod acquisition_discovered_links;
#[doc(hidden)]
#[path = "operations/acquisition/frontier.rs"]
pub mod acquisition_frontier;
#[doc(hidden)]
#[path = "operations/acquisition/observations.rs"]
pub mod acquisition_observations;
#[doc(hidden)]
#[path = "operations/acquisition/policies.rs"]
pub mod acquisition_policies;
#[doc(hidden)]
#[path = "operations/acquisition/policy_versions.rs"]
pub mod acquisition_policy_versions;
#[doc(hidden)]
#[path = "operations/acquisition/targets.rs"]
pub mod acquisition_targets;
#[doc(hidden)]
#[path = "operations/analytics/evaluations.rs"]
pub mod analytics_evaluations;
#[doc(hidden)]
#[path = "operations/analytics/experiments.rs"]
pub mod analytics_experiments;
#[doc(hidden)]
#[path = "operations/analytics/projections.rs"]
pub mod analytics_projections;
#[doc(hidden)]
#[path = "operations/analytics/requests.rs"]
pub mod analytics_requests;
#[doc(hidden)]
#[path = "operations/analytics/results.rs"]
pub mod analytics_results;
#[doc(hidden)]
#[path = "operations/audit/decisions.rs"]
pub mod audit_decisions;
#[doc(hidden)]
#[path = "operations/audit/events.rs"]
pub mod audit_events;
#[doc(hidden)]
#[path = "operations/auth/accounts.rs"]
pub mod auth_accounts;
#[doc(hidden)]
#[path = "operations/auth/delegation_roles.rs"]
pub mod auth_delegation_roles;
#[doc(hidden)]
#[path = "operations/auth/delegations.rs"]
pub mod auth_delegations;
#[doc(hidden)]
#[path = "operations/auth/invitations.rs"]
pub mod auth_invitations;
#[doc(hidden)]
#[path = "operations/auth/login_identities.rs"]
pub mod auth_login_identities;
#[doc(hidden)]
#[path = "operations/auth/memberships.rs"]
pub mod auth_memberships;
#[doc(hidden)]
#[path = "operations/auth/permissions.rs"]
pub mod auth_permissions;
#[doc(hidden)]
#[path = "operations/auth/role_assignments.rs"]
pub mod auth_role_assignments;
#[doc(hidden)]
#[path = "operations/auth/role_permissions.rs"]
pub mod auth_role_permissions;
#[doc(hidden)]
#[path = "operations/auth/roles.rs"]
pub mod auth_roles;
#[doc(hidden)]
#[path = "operations/auth/scopes.rs"]
pub mod auth_scopes;
#[doc(hidden)]
#[path = "operations/engine/artifacts.rs"]
pub mod engine_artifacts;
#[doc(hidden)]
#[path = "operations/engine/checkpoints.rs"]
pub mod engine_checkpoints;
#[doc(hidden)]
#[path = "operations/engine/events.rs"]
pub mod engine_events;
#[doc(hidden)]
#[path = "operations/engine/job_attempts.rs"]
pub mod engine_job_attempts;
#[doc(hidden)]
#[path = "operations/engine/job_dependencies.rs"]
pub mod engine_job_dependencies;
#[doc(hidden)]
#[path = "operations/engine/jobs.rs"]
pub mod engine_jobs;
#[doc(hidden)]
#[path = "operations/engine/outbox.rs"]
pub mod engine_outbox;
#[doc(hidden)]
#[path = "operations/engine/pipeline_releases.rs"]
pub mod engine_pipeline_releases;
#[doc(hidden)]
#[path = "operations/engine/pipelines.rs"]
pub mod engine_pipelines;
#[doc(hidden)]
#[path = "operations/engine/runs.rs"]
pub mod engine_runs;
#[doc(hidden)]
#[path = "operations/management/delivery_receipts.rs"]
pub mod management_delivery_receipts;
#[doc(hidden)]
#[path = "operations/management/publication_items.rs"]
pub mod management_publication_items;
#[doc(hidden)]
#[path = "operations/management/publications.rs"]
pub mod management_publications;
#[doc(hidden)]
#[path = "operations/management/schema_releases.rs"]
pub mod management_schema_releases;
#[doc(hidden)]
#[path = "operations/staging/candidates.rs"]
pub mod staging_candidates;
#[doc(hidden)]
#[path = "operations/staging/findings.rs"]
pub mod staging_findings;
#[doc(hidden)]
#[path = "operations/staging/mappings.rs"]
pub mod staging_mappings;
#[doc(hidden)]
#[path = "operations/staging/promotion_requests.rs"]
pub mod staging_promotion_requests;
#[doc(hidden)]
#[path = "operations/staging/reviews.rs"]
pub mod staging_reviews;
#[doc(hidden)]
#[path = "operations/staging/revision_sources.rs"]
pub mod staging_revision_sources;
#[doc(hidden)]
#[path = "operations/staging/revisions.rs"]
pub mod staging_revisions;

pub mod acquisition {
    pub use super::acquisition_access_attempts as access_attempts;
    pub use super::acquisition_discovered_links as discovered_links;
    pub use super::acquisition_frontier as frontier;
    pub use super::acquisition_observations as observations;
    pub use super::acquisition_policies as policies;
    pub use super::acquisition_policy_versions as policy_versions;
    pub use super::acquisition_targets as targets;
}

pub mod analytics {
    pub use super::analytics_evaluations as evaluations;
    pub use super::analytics_experiments as experiments;
    pub use super::analytics_projections as projections;
    pub use super::analytics_requests as requests;
    pub use super::analytics_results as results;
}

pub mod audit {
    pub use super::audit_decisions as decisions;
    pub use super::audit_events as events;
}

pub mod auth {
    pub use super::auth_accounts as accounts;
    pub use super::auth_delegation_roles as delegation_roles;
    pub use super::auth_delegations as delegations;
    pub use super::auth_invitations as invitations;
    pub use super::auth_login_identities as login_identities;
    pub use super::auth_memberships as memberships;
    pub use super::auth_permissions as permissions;
    pub use super::auth_role_assignments as role_assignments;
    pub use super::auth_role_permissions as role_permissions;
    pub use super::auth_roles as roles;
    pub use super::auth_scopes as scopes;
}

pub mod engine {
    pub use super::engine_artifacts as artifacts;
    pub use super::engine_checkpoints as checkpoints;
    pub use super::engine_events as events;
    pub use super::engine_job_attempts as job_attempts;
    pub use super::engine_job_dependencies as job_dependencies;
    pub use super::engine_jobs as jobs;
    pub use super::engine_outbox as outbox;
    pub use super::engine_pipeline_releases as pipeline_releases;
    pub use super::engine_pipelines as pipelines;
    pub use super::engine_runs as runs;
}

pub mod management {
    pub use super::management_delivery_receipts as delivery_receipts;
    pub use super::management_publication_items as publication_items;
    pub use super::management_publications as publications;
    pub use super::management_schema_releases as schema_releases;
}

pub mod staging {
    pub use super::staging_candidates as candidates;
    pub use super::staging_findings as findings;
    pub use super::staging_mappings as mappings;
    pub use super::staging_promotion_requests as promotion_requests;
    pub use super::staging_reviews as reviews;
    pub use super::staging_revision_sources as revision_sources;
    pub use super::staging_revisions as revisions;
}