//! Filesystem writes: folder creation today, the shape every other filesystem write operation
//! (upload completion, version registration, access transitions) follows next. Callers never
//! supply SQL; `role_id` is resolved beforehand through the existing `reference catalogue` operations
//! (a folder's role is a `reference.values` row, like any other controlled vocabulary term).

use time::OffsetDateTime;
use uuid::Uuid;

use crate::auth::authorize::require_permission;
use crate::config::TargetDatabase;
use crate::error::Error;
use crate::ids::AccountId;
use crate::pools::Pools;

/// Row type is the generated model (`mzizi-db-generated`), never hand-written.
pub use mzizi_db_generated::models::main::filesystem::folders::Folders;

const PERMISSION_EDIT: &str = "filesystem/edit";

/// Creates a folder. Fails closed on a duplicate `code` (`Error::Invalid`) rather than guessing
/// whether the caller meant to reuse or rename an existing one.
pub async fn create_folder(
    pools: &Pools,
    account: AccountId,
    parent_id: Option<Uuid>,
    name: &str,
    code: &str,
    access: &str,
    role_id: Uuid,
) -> Result<Folders, Error> {
    require_permission(pools, account, PERMISSION_EDIT).await?;

    let id = Uuid::now_v7();
    let now = OffsetDateTime::now_utc();
    let row = sqlx::query_as::<_, Folders>(
        r#"
        INSERT INTO filesystem.folders
            (id, parent_id, name, code, access, role_id, created_at, updated_at, version)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $7, 1)
        RETURNING access, "authorization", code, created_at, deleted_at, id, name, parent_id,
                  role_id, updated_at, version
        "#,
    )
    .bind(id)
    .bind(parent_id)
    .bind(name)
    .bind(code)
    .bind(access)
    .bind(role_id)
    .bind(now)
    .fetch_one(pools.get(TargetDatabase::Main))
    .await
    .map_err(|error| match &error {
        sqlx::Error::Database(db) if db.constraint() == Some("uq_folders__code") => {
            Error::Invalid {
                reason: format!("a folder with code {code:?} already exists"),
            }
        }
        _ => Error::from(error),
    })?;
    Ok(row)
}
