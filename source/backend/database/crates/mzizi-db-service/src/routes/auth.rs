//! Identity resolution and permission checks, matching the Dryv-authored operations
//! `auth.ResolveActiveLogin` and `auth.EvaluatePlatformPermission`.

use axum::extract::State;
use axum::Json;
use mzizi_db_core::auth;
use mzizi_db_core::ids::AccountId;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::router::AppState;
use crate::routes::ApiError;

#[derive(Deserialize)]
pub struct ResolveIdentityRequest {
    pub issuer: String,
    pub subject: String,
}

#[derive(Serialize)]
pub struct ResolveIdentityResponse {
    pub identity: ResolvedIdentity,
}

#[derive(Serialize)]
pub struct ResolvedIdentity {
    pub account_id: Uuid,
    pub display_name: String,
    pub status: &'static str,
}

pub async fn resolve_identity(
    State(state): State<AppState>,
    Json(request): Json<ResolveIdentityRequest>,
) -> Result<Json<ResolveIdentityResponse>, ApiError> {
    let principal = auth::resolve_identity(&state.pools, &request.issuer, &request.subject).await?;
    Ok(Json(ResolveIdentityResponse {
        identity: ResolvedIdentity {
            account_id: principal.account_id.0,
            display_name: principal.display_name,
            status: "active",
        },
    }))
}

#[derive(Deserialize)]
pub struct CheckPermissionRequest {
    pub account_id: Uuid,
    pub permission: String,
}

#[derive(Serialize)]
pub struct CheckPermissionResponse {
    pub allowed: bool,
}

pub async fn check_permission(
    State(state): State<AppState>,
    Json(request): Json<CheckPermissionRequest>,
) -> Result<Json<CheckPermissionResponse>, ApiError> {
    let allowed = auth::check_permission(
        &state.pools,
        AccountId(request.account_id),
        &request.permission,
    )
    .await?;
    Ok(Json(CheckPermissionResponse { allowed }))
}
