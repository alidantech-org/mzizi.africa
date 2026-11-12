//! Reference vocabulary reads: scheme listing, value listing and value lookup.
//! All lists are bounded; `limit` is clamped to [`MAX_LIMIT`].

use serde::Serialize;
use time::OffsetDateTime;
use uuid::Uuid;

use crate::config::TargetDatabase;
use crate::error::Error;
use crate::pools::Pools;

pub const DEFAULT_LIMIT: i64 = 50;
pub const MAX_LIMIT: i64 = 200;

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct Scheme {
    pub id: Uuid,
    pub code: String,
    pub title: String,
    pub description: Option<String>,
    pub stewardship_owner: String,
    pub created_at: OffsetDateTime,
}

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct Value {
    pub id: Uuid,
    pub scheme_id: Uuid,
    pub code: String,
    pub description: Option<String>,
    pub retired_at: Option<OffsetDateTime>,
    pub superseded_by_id: Option<Uuid>,
    pub created_at: OffsetDateTime,
}

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
        SELECT id, code, title, description, stewardship_owner, created_at
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

/// Lists values of a scheme, ordered by code. Retired values are included; the caller sees
/// `retired_at` and `superseded_by_id` and decides.
pub async fn list_values(
    pools: &Pools,
    scheme_id: Uuid,
    limit: Option<i64>,
    offset: i64,
) -> Result<Vec<Value>, Error> {
    let rows = sqlx::query_as::<_, Value>(
        r#"
        SELECT id, scheme_id, code, description, retired_at, superseded_by_id, created_at
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
        SELECT v.id, v.scheme_id, v.code, v.description, v.retired_at, v.superseded_by_id, v.created_at
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
