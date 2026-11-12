//! Command implementations. Each opens its own single-use administrative connection pool
//! from the target's admin URL; the runtime pools and credentials are never involved.

use sqlx::postgres::{PgPool, PgPoolOptions};
use sqlx::Connection;

use mzizi_db_core::{Config, TargetDatabase};

use crate::ledger;

fn migrations_dir(target: TargetDatabase) -> std::path::PathBuf {
    // Relative to the database backend folder (the CLI's working directory by convention;
    // override with MZIZI_DB_MIGRATIONS_DIR).
    let base = std::env::var("MZIZI_DB_MIGRATIONS_DIR").unwrap_or_else(|_| "migrations".into());
    std::path::Path::new(&base).join(target.as_str())
}

async fn admin_pool(target: TargetDatabase) -> anyhow::Result<PgPool> {
    let url = Config::admin_url(target)?;
    Ok(PgPoolOptions::new()
        .max_connections(2)
        .connect(&url)
        .await?)
}

pub async fn status(target: TargetDatabase) -> anyhow::Result<()> {
    let pool = admin_pool(target).await?;
    ledger::ensure(&pool, target).await?;
    let applied = ledger::applied(&pool).await?;
    let releases = ledger::load_releases(&migrations_dir(target))?;
    println!("target: {} ({})", target.as_str(), target.database_name());
    println!("applied: {}", applied.len());
    for release in &releases {
        let state = match applied.iter().find(|row| row.name == release.name) {
            Some(row) if row.checksum == release.checksum => "applied",
            Some(_) => "CHECKSUM MISMATCH",
            None => "pending",
        };
        println!("  {:30} {}", release.name, state);
    }
    Ok(())
}

pub async fn plan(target: TargetDatabase) -> anyhow::Result<()> {
    let pool = admin_pool(target).await?;
    ledger::ensure(&pool, target).await?;
    let applied = ledger::applied(&pool).await?;
    let releases = ledger::load_releases(&migrations_dir(target))?;
    let mut pending = 0;
    for release in &releases {
        match applied.iter().find(|row| row.name == release.name) {
            Some(row) if row.checksum != release.checksum => {
                anyhow::bail!(
                    "release {} changed after it was applied; refusing",
                    release.name
                )
            }
            Some(_) => {}
            None => {
                println!("would apply {}", release.name);
                pending += 1;
            }
        }
    }
    println!("{pending} pending release(s)");
    Ok(())
}

pub async fn migrate(target: TargetDatabase) -> anyhow::Result<()> {
    let url = Config::admin_url(target)?;
    let mut connection = sqlx::postgres::PgConnection::connect(&url).await?;

    // Serialize migrators per database.
    sqlx::query("SELECT pg_advisory_lock($1)")
        .bind(ledger::lock_key(target))
        .execute(&mut connection)
        .await?;

    let result = run_migrations(&mut connection, target).await;

    let _ = sqlx::query("SELECT pg_advisory_unlock($1)")
        .bind(ledger::lock_key(target))
        .execute(&mut connection)
        .await;
    result
}

async fn run_migrations(
    connection: &mut sqlx::postgres::PgConnection,
    target: TargetDatabase,
) -> anyhow::Result<()> {
    // Ledger bootstrap through a short-lived pool on the same URL.
    let pool = admin_pool(target).await?;
    ledger::ensure(&pool, target).await?;
    let applied = ledger::applied(&pool).await?;
    pool.close().await;

    let releases = ledger::load_releases(&migrations_dir(target))?;
    for release in &releases {
        match applied.iter().find(|row| row.name == release.name) {
            Some(row) if row.checksum != release.checksum => {
                anyhow::bail!(
                    "release {} changed after it was applied; refusing",
                    release.name
                )
            }
            Some(_) => continue,
            None => {
                tracing::info!(release = %release.name, "applying");
                ledger::apply(connection, release).await?;
            }
        }
    }
    println!("migrations up to date for {}", target.as_str());
    Ok(())
}

pub async fn verify(target: TargetDatabase) -> anyhow::Result<()> {
    let pool = admin_pool(target).await?;
    ledger::ensure(&pool, target).await?;
    let applied = ledger::applied(&pool).await?;
    let releases = ledger::load_releases(&migrations_dir(target))?;
    for row in &applied {
        match releases.iter().find(|release| release.name == row.name) {
            Some(release) if release.checksum == row.checksum => {}
            Some(_) => anyhow::bail!("checksum mismatch for applied release {}", row.name),
            None => anyhow::bail!("applied release {} is missing on disk", row.name),
        }
    }
    println!(
        "verified {} applied release(s) for {}",
        applied.len(),
        target.as_str()
    );
    Ok(())
}

pub async fn roles(target: TargetDatabase) -> anyhow::Result<()> {
    // Idempotent service-role provisioning lands with the first generated releases.
    anyhow::bail!(
        "roles: not implemented in the foundation skeleton (target {})",
        target.as_str()
    )
}

pub async fn seed(target: TargetDatabase) -> anyhow::Result<()> {
    // Idempotent fixture loading from seed/_fixtures lands with the first generated releases.
    anyhow::bail!(
        "seed: not implemented in the foundation skeleton (target {})",
        target.as_str()
    )
}
