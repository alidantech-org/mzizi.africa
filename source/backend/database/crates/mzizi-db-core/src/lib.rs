//! Core of the Mzizi database foundation: configuration, the two bounded connection pools,
//! typed identifiers, fail-closed authorization and the named domain operations.
//!
//! This crate holds every hand-written SQL statement. The service and CLI binaries are thin
//! shells over it; generated models live in `mzizi-db-generated` and are never edited.

pub mod auth;
pub mod config;
pub mod domains;
pub mod error;
pub mod ids;
pub mod pools;

pub use config::{Config, TargetDatabase};
pub use error::Error;
pub use pools::Pools;
