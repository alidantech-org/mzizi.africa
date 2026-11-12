//! Reference vocabulary reads, matching the Dryv-authored `VocabularyRead` operations.

use axum::extract::{Query, State};
use axum::Json;
use mzizi_db_core::domains::reference;
use serde::Deserialize;
use uuid::Uuid;

use crate::router::AppState;
use crate::routes::ApiError;

#[derive(Deserialize)]
pub struct SchemeListQuery {
    pub code: Option<String>,
    pub limit: Option<i64>,
    #[serde(default)]
    pub offset: i64,
}

pub async fn list_schemes(
    State(state): State<AppState>,
    Query(query): Query<SchemeListQuery>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let schemes = reference::list_schemes(
        &state.pools,
        query.code.as_deref(),
        query.limit,
        query.offset,
    )
    .await?;
    Ok(Json(serde_json::json!({ "schemes": schemes })))
}

#[derive(Deserialize)]
pub struct ValueListQuery {
    pub scheme_id: Uuid,
    pub limit: Option<i64>,
    #[serde(default)]
    pub offset: i64,
}

pub async fn list_values(
    State(state): State<AppState>,
    Query(query): Query<ValueListQuery>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let values =
        reference::list_values(&state.pools, query.scheme_id, query.limit, query.offset).await?;
    Ok(Json(serde_json::json!({ "values": values })))
}

#[derive(Deserialize)]
pub struct ValueLookupRequest {
    pub scheme: String,
    pub code: String,
}

pub async fn lookup_value(
    State(state): State<AppState>,
    Json(request): Json<ValueLookupRequest>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let value = reference::lookup_value(&state.pools, &request.scheme, &request.code).await?;
    Ok(Json(serde_json::json!({ "value": value })))
}
