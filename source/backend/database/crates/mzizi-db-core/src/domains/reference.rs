//! Reference vocabulary reads: scheme listing, value listing and value lookup.
//! All lists are bounded; `limit` is clamped to [`MAX_LIMIT`].

use uuid::Uuid;

use crate::config::TargetDatabase;
use crate::error::Error;
use crate::pools::Pools;

pub const DEFAULT_LIMIT: i64 = 50;
pub const MAX_LIMIT: i64 = 200;

/// Row types are the generated models (`mzizi-db-generated`), never hand-written.
pub use mzizi_db_generated::models::main::reference::scheme::Scheme;
pub use mzizi_db_generated::models::main::reference::value::Value;

fn clamp(limit: Option<i64>) -> i64 {
    limit.unwrap_or(DEFAULT_LIMIT).clamp(1, MAX_LIMIT)
}

/// Lists schemes, optionally filtered by code prefix, ordered by code.
pub async fn list_schemes(
    pools: &Pools,
    code_prefix: Option<&str>,
    limit: Option<i64>,
    offset: i64,
) -> Result<Vec<Scheme>, Error> {
    let rows = sqlx::query_as::<_, Scheme>(
        r#"
        SELECT code, id, owner_snapshot, title
        FROM reference.schemes
        WHERE ($1::text IS NULL OR code LIKE $1 || '%')
        ORDER BY code
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(code_prefix)
    .bind(clamp(limit))
    .bind(offset.max(0))
    .fetch_all(pools.get(TargetDatabase::Main))
    .await?;
    Ok(rows)
}

/// Lists values of a scheme, ordered by code. Superseded values are included; the caller sees
/// `supersedes_id` and decides.
pub async fn list_values(
    pools: &Pools,
    scheme_id: Uuid,
    limit: Option<i64>,
    offset: i64,
) -> Result<Vec<Value>, Error> {
    let rows = sqlx::query_as::<_, Value>(
        r#"
        SELECT code, id, label, scheme_id, supersedes_id
        FROM reference.values
        WHERE scheme_id = $1
        ORDER BY code
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(scheme_id)
    .bind(clamp(limit))
    .bind(offset.max(0))
    .fetch_all(pools.get(TargetDatabase::Main))
    .await?;
    Ok(rows)
}

/// Looks up one value by scheme code and value code.
pub async fn lookup_value(
    pools: &Pools,
    scheme_code: &str,
    value_code: &str,
) -> Result<Value, Error> {
    let row = sqlx::query_as::<_, Value>(
        r#"
        SELECT v.code, v.id, v.label, v.scheme_id, v.supersedes_id
        FROM reference.values v
        JOIN reference.schemes s ON s.id = v.scheme_id
        WHERE s.code = $1 AND v.code = $2
        "#,
    )
    .bind(scheme_code)
    .bind(value_code)
    .fetch_optional(pools.get(TargetDatabase::Main))
    .await?;
    row.ok_or(Error::NotFound)
}
