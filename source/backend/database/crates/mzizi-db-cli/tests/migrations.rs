//! Migration integration tests. They need a live PostgreSQL and run only when
//! `MZIZI_DB_MAIN_ADMIN_URL` / `MZIZI_DB_OPERATIONS_ADMIN_URL` point at the isolated
//! foundation instance (see the live tests below); otherwise they are skipped so `cargo test`
//! stays green locally.
//!
//! Covered: fresh apply, harmless rerun, serialized concurrent migrators, checksum-change
//! refusal, and fresh apply plus verify of the committed release streams on both targets.

#[test]
fn checksum_is_deterministic() {
    // The ledger refuses changed checksums forever; the hash must be stable across runs.
    let sql = "CREATE TABLE _mzizi.example (id uuid PRIMARY KEY);";
    let first = sha2_hex(sql);
    let second = sha2_hex(sql);
    assert_eq!(first, second);
    assert_eq!(first.len(), 64);
}

fn sha2_hex(input: &str) -> String {
    use sha2::{Digest, Sha256};
    hex::encode(Sha256::digest(input.as_bytes()))
}

// ---------------------------------------------------------------------------------------------
// Live-database tests. Gated: they run only when `MZIZI_DB_TEST_SERVER_URL` is set to an admin
// URL on the isolated foundation instance (any database, normally `postgres`). One scratch
// database named `mzizi_test` is created, reused by every step and dropped at the end; the
// tests never touch other databases. They run as one sequential test because they share it.
// ---------------------------------------------------------------------------------------------

use std::path::{Path, PathBuf};
use std::process::{Command, Output};

use sqlx::{Connection, PgConnection};

const SCRATCH: &str = "mzizi_test";

fn scratch_url(server: &str) -> String {
    let (base, _) = server
        .rsplit_once('/')
        .expect("server URL needs a database");
    format!("{base}/{SCRATCH}")
}

fn cli(target: &str, command: &str, url: &str, migrations: &Path) -> Output {
    let admin = if target == "main" {
        "MZIZI_DB_MAIN_ADMIN_URL"
    } else {
        "MZIZI_DB_OPERATIONS_ADMIN_URL"
    };
    Command::new(env!("CARGO_BIN_EXE_mzizi-db"))
        .args([command, "--target", target])
        .env(admin, url)
        .env("MZIZI_DB_MIGRATIONS_DIR", migrations)
        .output()
        .expect("run mzizi-db")
}

fn write_stream(dir: &Path, target: &str, releases: &[(&str, &str)]) {
    let stream = dir.join(target);
    std::fs::create_dir_all(&stream).unwrap();
    for (name, sql) in releases {
        std::fs::write(stream.join(name), sql).unwrap();
    }
}

async fn recreate(server: &str) {
    let mut admin = PgConnection::connect(server).await.unwrap();
    sqlx::query(&format!("DROP DATABASE IF EXISTS {SCRATCH} WITH (FORCE)"))
        .execute(&mut admin)
        .await
        .unwrap();
    sqlx::query(&format!("CREATE DATABASE {SCRATCH}"))
        .execute(&mut admin)
        .await
        .unwrap();
}

async fn ledger_rows(url: &str) -> i64 {
    let mut connection = PgConnection::connect(url).await.unwrap();
    sqlx::query_scalar("SELECT count(*) FROM _mzizi.migrations")
        .fetch_one(&mut connection)
        .await
        .unwrap()
}

fn repo_migrations() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../../migrations")
}

#[tokio::test]
async fn live_migration_lifecycle() {
    let Ok(server) = std::env::var("MZIZI_DB_TEST_SERVER_URL") else {
        eprintln!("skipped: MZIZI_DB_TEST_SERVER_URL is not set");
        return;
    };
    let url = scratch_url(&server);
    let dir = std::env::temp_dir().join(format!("mzizi-live-{}", std::process::id()));
    let _ = std::fs::remove_dir_all(&dir);

    // Fresh apply, then a harmless rerun.
    recreate(&server).await;
    write_stream(
        &dir,
        "main",
        &[
            (
                "0001_a.sql",
                "CREATE SCHEMA a; CREATE TABLE a.t (id uuid PRIMARY KEY);",
            ),
            ("0002_b.sql", "CREATE TABLE a.u (id uuid PRIMARY KEY);"),
        ],
    );
    assert!(cli("main", "migrate", &url, &dir).status.success());
    assert_eq!(ledger_rows(&url).await, 2);
    assert!(cli("main", "migrate", &url, &dir).status.success());
    assert_eq!(ledger_rows(&url).await, 2, "rerun must not reapply");
    assert!(cli("main", "verify", &url, &dir).status.success());

    // Checksum refusal: an applied release that changed is refused by migrate and verify.
    std::fs::write(
        dir.join("main/0002_b.sql"),
        "CREATE TABLE a.u (id uuid PRIMARY KEY, extra text);",
    )
    .unwrap();
    let migrate = cli("main", "migrate", &url, &dir);
    assert!(!migrate.status.success());
    assert!(String::from_utf8_lossy(&migrate.stderr).contains("changed after it was applied"));
    assert!(!cli("main", "verify", &url, &dir).status.success());

    // Concurrent migrators on a fresh database serialize on the advisory lock.
    recreate(&server).await;
    write_stream(
        &dir,
        "main",
        &[("0002_b.sql", "CREATE TABLE a.u (id uuid PRIMARY KEY);")],
    );
    let handles: Vec<_> = (0..4)
        .map(|_| {
            let (url, dir) = (url.clone(), dir.clone());
            std::thread::spawn(move || cli("main", "migrate", &url, &dir))
        })
        .collect();
    for handle in handles {
        let output = handle.join().unwrap();
        assert!(
            output.status.success(),
            "{}",
            String::from_utf8_lossy(&output.stderr)
        );
    }
    assert_eq!(ledger_rows(&url).await, 2);

    // The committed release streams apply to a fresh database and verify, per target.
    for target in ["main", "operations"] {
        recreate(&server).await;
        let migrations = repo_migrations();
        let output = cli(target, "migrate", &url, &migrations);
        assert!(
            output.status.success(),
            "{target}: {}",
            String::from_utf8_lossy(&output.stderr)
        );
        assert!(cli(target, "verify", &url, &migrations).status.success());
    }

    // Roles: the service role reads domain data but cannot run DDL or see the ledger.
    let admin_env = "MZIZI_DB_MAIN_ADMIN_URL";
    recreate(&server).await;
    assert!(cli("main", "migrate", &url, &repo_migrations())
        .status
        .success());
    let rerun = Command::new(env!("CARGO_BIN_EXE_mzizi-db"))
        .args(["roles", "--target", "main"])
        .env(admin_env, &url)
        .env("MZIZI_DB_SERVICE_PASSWORD", "test-only-password")
        .output()
        .unwrap();
    assert!(
        rerun.status.success(),
        "{}",
        String::from_utf8_lossy(&rerun.stderr)
    );
    let service_url = {
        // Swap the admin password for the service password in the URL userinfo.
        let (scheme, rest) = url.split_once("://").unwrap();
        let (_, host) = rest.split_once('@').unwrap();
        format!("{scheme}://mzizi_service:test-only-password@{host}")
    };
    let mut service = PgConnection::connect(&service_url).await.unwrap();
    sqlx::query("SELECT count(*) FROM reference.schemes")
        .execute(&mut service)
        .await
        .expect("service role can read domain data");
    assert!(sqlx::query("CREATE TABLE reference.denied (id int)")
        .execute(&mut service)
        .await
        .is_err());
    assert!(sqlx::query("SELECT * FROM _mzizi.migrations")
        .execute(&mut service)
        .await
        .is_err());
    drop(service);

    let mut admin = PgConnection::connect(&server).await.unwrap();
    sqlx::query(&format!("DROP DATABASE IF EXISTS {SCRATCH} WITH (FORCE)"))
        .execute(&mut admin)
        .await
        .unwrap();
    let _ = std::fs::remove_dir_all(&dir);
}

/// The generated models must agree with the tables the generated SQL really creates.
#[tokio::test]
async fn generated_models_match_live_tables() {
    let Ok(server) = std::env::var("MZIZI_DB_TEST_SERVER_URL") else {
        eprintln!("skipped: MZIZI_DB_TEST_SERVER_URL is not set");
        return;
    };
    let names = ["mzizi_test_models_main", "mzizi_test_models_ops"];
    let mut admin = PgConnection::connect(&server).await.unwrap();
    let mut urls = Vec::new();
    for (name, target) in names.iter().zip(["main", "operations"]) {
        sqlx::query(&format!("DROP DATABASE IF EXISTS {name} WITH (FORCE)"))
            .execute(&mut admin)
            .await
            .unwrap();
        sqlx::query(&format!("CREATE DATABASE {name}"))
            .execute(&mut admin)
            .await
            .unwrap();
        let (base, _) = server.rsplit_once('/').unwrap();
        let url = format!("{base}/{name}");
        let output = cli(target, "migrate", &url, &repo_migrations());
        assert!(
            output.status.success(),
            "{}",
            String::from_utf8_lossy(&output.stderr)
        );
        urls.push(url);
    }
    let mut main = PgConnection::connect(&urls[0]).await.unwrap();
    let mut operations = PgConnection::connect(&urls[1]).await.unwrap();
    let result = mzizi_db_generated::models::contract::verify(&mut main, &mut operations).await;
    drop((main, operations));
    for name in names {
        sqlx::query(&format!("DROP DATABASE IF EXISTS {name} WITH (FORCE)"))
            .execute(&mut admin)
            .await
            .unwrap();
    }
    let mismatches = result.expect("describe every generated table");
    assert!(
        mismatches.is_empty(),
        "model/table mismatches:\n{}",
        mismatches.join("\n")
    );
}
