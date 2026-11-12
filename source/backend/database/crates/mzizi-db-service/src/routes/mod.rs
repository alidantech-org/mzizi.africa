//! HTTP handlers. Thin: deserialize, call `mzizi-db-core`, serialize. Structured errors
//! never leak SQL, credentials or which authorization check failed.

pub mod auth;
pub mod health;
pub mod reference;

use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use mzizi_db_core::Error;

/// Boundary error mapping. `Denied` is always 403 with no detail; `Database` logs the source
/// here and returns an opaque 500.
pub struct ApiError(pub Error);

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, code) = match &self.0 {
            Error::Denied => (StatusCode::FORBIDDEN, "forbidden"),
            Error::NotFound => (StatusCode::NOT_FOUND, "not_found"),
            Error::Invalid { .. } => (StatusCode::UNPROCESSABLE_ENTITY, "validation_error"),
            Error::Unavailable(_) => (StatusCode::SERVICE_UNAVAILABLE, "unavailable"),
            Error::Config { .. } | Error::Database(_) => {
                tracing::error!(error = ?self.0, "internal error");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal_error")
            }
        };
        (status, Json(serde_json::json!({ "code": code }))).into_response()
    }
}

impl From<Error> for ApiError {
    fn from(error: Error) -> Self {
        ApiError(error)
    }
}
