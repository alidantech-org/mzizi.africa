//! Principal resolution: an OIDC (issuer, subject) pair to an active platform account.

use crate::config::TargetDatabase;
use crate::error::Error;
use crate::ids::AccountId;
use crate::pools::Pools;

/// A trusted, resolved caller context. Constructed only here, after the identity row and
/// account status checked out; handlers receive it instead of raw claims.
#[derive(Debug, Clone)]
pub struct Principal {
    pub account_id: AccountId,
    pub display_name: String,
}

/// Resolves an OIDC identity to an active account. Unknown identities and non-active
/// accounts deny with [`Error::Denied`]; no detail distinguishes the two to callers.
pub async fn resolve_identity(
    pools: &Pools,
    issuer: &str,
    subject: &str,
) -> Result<Principal, Error> {
    let row: Option<(uuid::Uuid, String, String)> = sqlx::query_as(
        r#"
        SELECT a.id, a.display_name, a.status
        FROM auth.login_identities i
        JOIN auth.accounts a ON a.id = i.account_id
        WHERE i.issuer = $1 AND i.subject = $2 AND i.unlinked_at IS NULL
        "#,
    )
    .bind(issuer)
    .bind(subject)
    .fetch_optional(pools.get(TargetDatabase::Operations))
    .await?;

    match row {
        Some((id, display_name, status)) if status == "active" => Ok(Principal {
            account_id: AccountId(id),
            display_name,
        }),
        _ => Err(Error::Denied),
    }
}
