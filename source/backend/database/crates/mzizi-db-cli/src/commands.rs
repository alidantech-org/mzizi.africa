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

fn snapshot_path(target: TargetDatabase) -> std::path::PathBuf {
    // Schema snapshots are emitted by `dryv generate` (rust-sql pack) into generated/sql.
    let base = std::env::var("MZIZI_DB_SNAPSHOT_DIR").unwrap_or_else(|_| "generated/sql".into());
    std::path::Path::new(&base).join(format!("{}.sql", target.as_str()))
}

/// Outcome of assembling a snapshot into a release stream.
#[derive(Debug, PartialEq, Eq)]
pub enum Assembled {
    /// The stream was empty: `0001_init.sql` was written.
    Initial,
    /// The stream already holds the release for exactly this snapshot.
    UpToDate,
}

const SNAPSHOT_MARKER: &str = ".snapshot";
const INITIAL_RELEASE: &str = "0001_init.sql";

/// Turns a generated schema snapshot into the immutable release stream.
///
/// Empty stream: the snapshot becomes `0001_init.sql` and its checksum is recorded in the
/// `.snapshot` sidecar. Non-empty stream: the snapshot must still match the recorded checksum;
/// a changed snapshot is refused because releases are immutable and schema-evolution releases
/// are not generated yet (see DEC-DATABASE-RELEASE-ASSEMBLY).
pub fn assemble_at(
    snapshot: &std::path::Path,
    stream: &std::path::Path,
) -> anyhow::Result<Assembled> {
    let sql = std::fs::read_to_string(snapshot).map_err(|error| {
        anyhow::anyhow!(
            "cannot read schema snapshot {}: {error}; run `dryv generate` first",
            snapshot.display()
        )
    })?;
    let digest = ledger::checksum(&sql);
    std::fs::create_dir_all(stream)?;
    let marker = stream.join(SNAPSHOT_MARKER);
    let has_releases = std::fs::read_dir(stream)?
        .filter_map(Result::ok)
        .any(|entry| entry.path().extension().is_some_and(|ext| ext == "sql"));

    if !has_releases {
        std::fs::write(stream.join(INITIAL_RELEASE), &sql)?;
        std::fs::write(&marker, format!("{digest}\n"))?;
        return Ok(Assembled::Initial);
    }
    let recorded = std::fs::read_to_string(&marker).map_err(|_| {
        anyhow::anyhow!(
            "{} holds releases but no {SNAPSHOT_MARKER} record; restore it from version control",
            stream.display()
        )
    })?;
    if recorded.trim() == digest {
        Ok(Assembled::UpToDate)
    } else {
        anyhow::bail!(
            "the generated schema snapshot changed after {} was assembled; releases are immutable \
             and schema-evolution releases are not supported yet. Revert the contract change, or \
             start a fresh stream deliberately",
            stream.display()
        )
    }
}

pub async fn assemble(target: TargetDatabase) -> anyhow::Result<()> {
    let outcome = assemble_at(&snapshot_path(target), &migrations_dir(target))?;
    match outcome {
        Assembled::Initial => println!("assembled {INITIAL_RELEASE} for {}", target.as_str()),
        Assembled::UpToDate => println!("release stream for {} is up to date", target.as_str()),
    }
    Ok(())
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

/// Runtime role used by the service: data access only, no DDL, no access to `_mzizi`.
const SERVICE_ROLE: &str = "mzizi_service";

fn quote_ident(name: &str) -> String {
    format!("\"{}\"", name.replace('"', "\"\""))
}

fn quote_literal(value: &str) -> String {
    format!("'{}'", value.replace('\'', "''"))
}

/// Idempotently provisions the service role and its grants on one target database.
///
/// The password comes from `MZIZI_DB_SERVICE_PASSWORD` (never logged). The role is cluster-wide;
/// grants are per database: CONNECT, schema USAGE and table DML for every domain schema, plus
/// default privileges so releases applied later are covered. `_mzizi` stays admin-only.
pub async fn roles(target: TargetDatabase) -> anyhow::Result<()> {
    let password = std::env::var("MZIZI_DB_SERVICE_PASSWORD")
        .map_err(|_| anyhow::anyhow!("MZIZI_DB_SERVICE_PASSWORD is required to provision roles"))?;
    anyhow::ensure!(
        !password.is_empty() && !password.contains('\0'),
        "MZIZI_DB_SERVICE_PASSWORD must be non-empty text"
    );
    let pool = admin_pool(target).await?;
    let role = quote_ident(SERVICE_ROLE);

    let exists: Option<(i32,)> = sqlx::query_as("SELECT 1 FROM pg_roles WHERE rolname = $1")
        .bind(SERVICE_ROLE)
        .fetch_optional(&pool)
        .await?;
    let verb = if exists.is_some() { "ALTER" } else { "CREATE" };
    sqlx::raw_sql(&format!(
        "{verb} ROLE {role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD {}",
        quote_literal(&password)
    ))
    .execute(&pool)
    .await?;

    let (database,): (String,) = sqlx::query_as("SELECT current_database()")
        .fetch_one(&pool)
        .await?;
    sqlx::raw_sql(&format!(
        "GRANT CONNECT ON DATABASE {} TO {role}",
        quote_ident(&database)
    ))
    .execute(&pool)
    .await?;

    let schemas: Vec<(String,)> = sqlx::query_as(
        "SELECT nspname FROM pg_namespace \
         WHERE nspname !~ '^pg_' AND nspname NOT IN ('information_schema', '_mzizi', 'public') \
         ORDER BY nspname",
    )
    .fetch_all(&pool)
    .await?;
    for (schema,) in &schemas {
        let schema = quote_ident(schema);
        sqlx::raw_sql(&format!(
            "GRANT USAGE ON SCHEMA {schema} TO {role}; \
             GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA {schema} TO {role}; \
             GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA {schema} TO {role}; \
             ALTER DEFAULT PRIVILEGES IN SCHEMA {schema} \
               GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO {role}; \
             ALTER DEFAULT PRIVILEGES IN SCHEMA {schema} \
               GRANT USAGE, SELECT ON SEQUENCES TO {role};"
        ))
        .execute(&pool)
        .await?;
    }
    sqlx::raw_sql(&format!(
        "REVOKE ALL ON SCHEMA _mzizi FROM {role}; REVOKE ALL ON ALL TABLES IN SCHEMA _mzizi FROM {role};"
    ))
    .execute(&pool)
    .await?;
    pool.close().await;
    println!(
        "roles ready for {}: {} schema(s) granted to {SERVICE_ROLE}",
        target.as_str(),
        schemas.len()
    );
    Ok(())
}

pub async fn seed(target: TargetDatabase) -> anyhow::Result<()> {
    // seed/_fixtures is documented as test-only and "never applied as seeds" (seed/README.md);
    // reviewed seed inputs for these databases do not exist yet, so loading nothing is the
    // honest behavior until a reviewed seed set (or an explicit dev-fixture decision) lands.
    anyhow::bail!(
        "seed: no reviewed seed set exists for target {}; seed/_fixtures is test-only and is never applied",
        target.as_str()
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    fn scratch(name: &str) -> std::path::PathBuf {
        let dir =
            std::env::temp_dir().join(format!("mzizi-assemble-{name}-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[test]
    fn empty_stream_gets_initial_release_then_is_up_to_date() {
        let dir = scratch("initial");
        let snapshot = dir.join("main.sql");
        std::fs::write(&snapshot, "CREATE SCHEMA a;\n").unwrap();
        let stream = dir.join("migrations");
        assert_eq!(assemble_at(&snapshot, &stream).unwrap(), Assembled::Initial);
        assert_eq!(
            std::fs::read_to_string(stream.join(INITIAL_RELEASE)).unwrap(),
            "CREATE SCHEMA a;\n"
        );
        assert_eq!(
            assemble_at(&snapshot, &stream).unwrap(),
            Assembled::UpToDate
        );
    }

    #[test]
    fn changed_snapshot_is_refused_and_release_is_untouched() {
        let dir = scratch("changed");
        let snapshot = dir.join("main.sql");
        std::fs::write(&snapshot, "CREATE SCHEMA a;\n").unwrap();
        let stream = dir.join("migrations");
        assemble_at(&snapshot, &stream).unwrap();
        std::fs::write(&snapshot, "CREATE SCHEMA b;\n").unwrap();
        let error = assemble_at(&snapshot, &stream).unwrap_err().to_string();
        assert!(error.contains("immutable"), "{error}");
        assert_eq!(
            std::fs::read_to_string(stream.join(INITIAL_RELEASE)).unwrap(),
            "CREATE SCHEMA a;\n"
        );
    }

    #[test]
    fn missing_snapshot_explains_how_to_generate() {
        let dir = scratch("missing");
        let error = assemble_at(&dir.join("none.sql"), &dir.join("m"))
            .unwrap_err()
            .to_string();
        assert!(error.contains("dryv generate"), "{error}");
    }
}
