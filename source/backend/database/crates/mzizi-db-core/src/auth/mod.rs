//! Fail-closed authorization.
//!
//! The service authenticates its callers (NestJS API, Python engine) and resolves a trusted
//! principal before any domain operation runs. Missing credentials, unknown identities,
//! inactive accounts, missing permissions and unavailable authorization state all deny.

pub mod authorize;
pub mod principal;

pub use authorize::check_permission;
pub use principal::{resolve_identity, Principal};
