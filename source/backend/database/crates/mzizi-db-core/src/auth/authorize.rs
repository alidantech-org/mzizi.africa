//! Platform permission checks. Fail closed: only an active account with an unrevoked,
//! unexpired grant of a role carrying the permission is allowed; anything else denies,
//! including unknown permission codes and database unavailability.

use crate::config::TargetDatabase;
use crate::error::Error;
use crate::ids::AccountId;
use crate::pools::Pools;

/// Whether `account` currently holds `permission` (a business code such as `reference/read`).
pub async fn check_permission(
    pools: &Pools,
    account: AccountId,
    permission: &str,
) -> Result<bool, Error> {
    let allowed: Option<(bool,)> = sqlx::query_as(
        r#"
        SELECT TRUE
        FROM auth.role_assignments ra
        JOIN auth.accounts a       ON a.id = ra.account_id AND a.status = 'active'
        JOIN auth.role_permissions rp ON rp.role_id = ra.role_id
        JOIN auth.permissions p    ON p.id = rp.permission_id
        WHERE ra.account_id = $1
          AND p.code = $2
          AND ra.revoked_at IS NULL
          AND (ra.expires_at IS NULL OR ra.expires_at > now())
        LIMIT 1
        "#,
    )
    .bind(account.0)
    .bind(permission)
    .fetch_optional(pools.get(TargetDatabase::Operations))
    .await?;

    Ok(allowed.is_some())
}

/// Enforcing variant: denies instead of returning `false`.
pub async fn require_permission(
    pools: &Pools,
    account: AccountId,
    permission: &str,
) -> Result<(), Error> {
    if check_permission(pools, account, permission).await? {
        Ok(())
    } else {
        Err(Error::Denied)
    }
}
