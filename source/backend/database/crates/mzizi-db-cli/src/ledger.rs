//! The `_mzizi` technical schema: target identity and the migration ledger.
//!
//! Releases are immutable files under `migrations/<target>/` named `NNNN_name.sql`. Each is
//! applied in one transaction together with its ledger row; the ledger records the file's
//! SHA-256, and a changed checksum is refused forever after.

use sha2::{Digest, Sha256};
use sqlx::postgres::PgConnection;
use sqlx::PgPool;

use mzizi_db_core::TargetDatabase;

/// Advisory lock key per target so concurrent migrators serialize.
pub fn lock_key(target: TargetDatabase) -> i64 {
    match target {
        TargetDatabase::Main => 0x6d7a697a695f6d61, // "mzizi_ma"
        TargetDatabase::Operations => 0x6d7a697a695f6f70, // "mzizi_op"
    }
}

#[derive(Debug, sqlx::FromRow)]
pub struct AppliedRelease {
    pub name: String,
    pub checksum: String,
}

/// A release on disk.
#[derive(Debug)]
pub struct Release {
    pub name: String,
    pub sql: String,
    pub checksum: String,
}

pub fn checksum(sql: &str) -> String {
    hex::encode(Sha256::digest(sql.as_bytes()))
}

/// Loads ordered releases from `migrations/<target>/*.sql`.
pub fn load_releases(dir: &std::path::Path) -> anyhow::Result<Vec<Release>> {
    let mut releases = Vec::new();
    if !dir.exists() {
        return Ok(releases);
    }
    let mut paths: Vec<_> = std::fs::read_dir(dir)?
        .filter_map(Result::ok)
        .map(|entry| entry.path())
        .filter(|path| path.extension().is_some_and(|ext| ext == "sql"))
        .collect();
    paths.sort();
    for path in paths {
        let sql = std::fs::read_to_string(&path)?;
        let name = path
            .file_stem()
            .and_then(|stem| stem.to_str())
            .ok_or_else(|| anyhow::anyhow!("unreadable release file name"))?
            .to_string();
        releases.push(Release {
            checksum: checksum(&sql),
            name,
            sql,
        });
    }
    Ok(releases)
}

/// Creates the `_mzizi` schema, identity and ledger tables if missing, and checks that the
/// connected database identifies as the expected target.
pub async fn ensure(pool: &PgPool, target: TargetDatabase) -> anyhow::Result<()> {
    let mut tx = pool.begin().await?;
    sqlx::query("CREATE SCHEMA IF NOT EXISTS _mzizi")
        .execute(&mut *tx)
        .await?;
    sqlx::query(
        r#"CREATE TABLE IF NOT EXISTS _mzizi.target (
               name text PRIMARY KEY,
               created_at timestamptz NOT NULL DEFAULT now()
           )"#,
    )
    .execute(&mut *tx)
    .await?;
    sqlx::query(
        r#"CREATE TABLE IF NOT EXISTS _mzizi.migrations (
               name text PRIMARY KEY,
               checksum text NOT NULL,
               applied_at timestamptz NOT NULL DEFAULT now()
           )"#,
    )
    .execute(&mut *tx)
    .await?;
    sqlx::query("INSERT INTO _mzizi.target (name) VALUES ($1) ON CONFLICT DO NOTHING")
        .bind(target.database_name())
        .execute(&mut *tx)
        .await?;
    tx.commit().await?;

    let (identity,): (String,) = sqlx::query_as("SELECT name FROM _mzizi.target LIMIT 1")
        .fetch_one(pool)
        .await?;
    anyhow::ensure!(
        identity == target.database_name(),
        "target identity mismatch: database says {identity:?}, expected {:?}",
        target.database_name()
    );
    Ok(())
}

pub async fn applied(pool: &PgPool) -> anyhow::Result<Vec<AppliedRelease>> {
    Ok(sqlx::query_as::<_, AppliedRelease>(
        "SELECT name, checksum FROM _mzizi.migrations ORDER BY name",
    )
    .fetch_all(pool)
    .await?)
}

/// Applies one release and its ledger row in a single transaction.
pub async fn apply(connection: &mut PgConnection, release: &Release) -> anyhow::Result<()> {
    sqlx::query("BEGIN").execute(&mut *connection).await?;
    let result = async {
        sqlx::raw_sql(&release.sql)
            .execute(&mut *connection)
            .await?;
        sqlx::query("INSERT INTO _mzizi.migrations (name, checksum) VALUES ($1, $2)")
            .bind(&release.name)
            .bind(&release.checksum)
            .execute(&mut *connection)
            .await?;
        Ok::<_, anyhow::Error>(())
    }
    .await;
    match result {
        Ok(()) => {
            sqlx::query("COMMIT").execute(&mut *connection).await?;
            Ok(())
        }
        Err(error) => {
            let _ = sqlx::query("ROLLBACK").execute(&mut *connection).await;
            Err(error)
        }
    }
}
