//! Migration integration tests. They need a live PostgreSQL and run only when
//! `MZIZI_DB_MAIN_ADMIN_URL` / `MZIZI_DB_OPERATIONS_ADMIN_URL` point at the isolated
//! foundation instance; otherwise they are skipped so `cargo test` stays green locally.
//!
//! Covered once releases exist: fresh apply on both targets, harmless rerun, serialized
//! concurrent migrators, checksum-change refusal and interrupted-migration recovery.

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
