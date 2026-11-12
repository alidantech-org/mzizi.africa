//! Liveness and readiness. `/health` says the process is up; `/ready` round-trips both
//! databases so orchestration only routes traffic when the service can actually serve.

use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use mzizi_db_core::TargetDatabase;

use crate::router::AppState;

pub async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "status": "ok" }))
}

pub async fn ready(State(state): State<AppState>) -> Result<Json<serde_json::Value>, StatusCode> {
    let main = state.pools.ready(TargetDatabase::Main).await.is_ok();
    let operations = state.pools.ready(TargetDatabase::Operations).await.is_ok();
    let body = serde_json::json!({ "main": main, "operations": operations });
    if main && operations {
        Ok(Json(body))
    } else {
        Err(StatusCode::SERVICE_UNAVAILABLE)
    }
}
