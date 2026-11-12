//! Structured errors. Messages never contain credentials or sensitive payloads; database
//! errors are wrapped so connection strings cannot leak through `Display`.

use crate::config::TargetDatabase;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("missing or invalid configuration variable {variable}")]
    Config { variable: &'static str },

    #[error("database {0:?} is unavailable")]
    Unavailable(TargetDatabase),

    /// Authorization denied. Deliberately carries no detail about which check failed.
    #[error("access denied")]
    Denied,

    #[error("not found")]
    NotFound,

    #[error("invalid request: {reason}")]
    Invalid { reason: String },

    /// An underlying database error. The source is logged by the caller at the boundary,
    /// never serialized to clients.
    #[error("database operation failed")]
    Database(#[source] sqlx::Error),
}

impl From<sqlx::Error> for Error {
    fn from(error: sqlx::Error) -> Self {
        match error {
            sqlx::Error::RowNotFound => Error::NotFound,
            other => Error::Database(other),
        }
    }
}
