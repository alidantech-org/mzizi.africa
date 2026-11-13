//! Filesystem writes, matching the Dryv-authored `FilesystemWrite.CreateFolder` operation.
//! The acting account is the authenticated caller, resolved upstream of this handler
//! (`auth::resolve_identity`); this route only runs the named write and maps domain errors.

use axum::extract::State;
use axum::Json;
use mzizi_db_core::domains::filesystem;
use mzizi_db_core::ids::AccountId;
use serde::{Deserialize, Serialize};
use time::OffsetDateTime;
use uuid::Uuid;

use crate::router::AppState;
use crate::routes::ApiError;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateFolderRequest {
    pub account_id: Uuid,
    pub parent_id: Option<Uuid>,
    pub name: String,
    pub code: String,
    pub access: String,
    pub role_id: Uuid,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateFolderResponse {
    pub folder: Folder,
}

/// The wire shape: fields named for callers, not the generated row's internal layout.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Folder {
    pub id: Uuid,
    pub parent_id: Option<Uuid>,
    pub name: String,
    pub code: String,
    pub access: String,
    pub role_id: Uuid,
    pub version: i32,
    #[serde(with = "time::serde::rfc3339")]
    pub created_at: OffsetDateTime,
}

pub async fn create_folder(
    State(state): State<AppState>,
    Json(request): Json<CreateFolderRequest>,
) -> Result<Json<CreateFolderResponse>, ApiError> {
    let row = filesystem::create_folder(
        &state.pools,
        AccountId(request.account_id),
        request.parent_id,
        &request.name,
        &request.code,
        &request.access,
        request.role_id,
    )
    .await?;
    Ok(Json(CreateFolderResponse {
        folder: Folder {
            id: row.id,
            parent_id: row.parent_id,
            name: row.name,
            code: row.code,
            access: row.access,
            role_id: row.role_id,
            version: row.version,
            created_at: row.created_at,
        },
    }))
}
