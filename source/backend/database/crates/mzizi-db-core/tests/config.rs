//! Configuration behavior that must hold without a database.

use mzizi_db_core::TargetDatabase;

#[test]
fn target_names_are_stable() {
    // The ledger and verify command record these; changing them is a breaking migration.
    assert_eq!(TargetDatabase::Main.database_name(), "mzizi");
    assert_eq!(
        TargetDatabase::Operations.database_name(),
        "mzizi_operations"
    );
    assert_eq!(TargetDatabase::Main.as_str(), "main");
    assert_eq!(TargetDatabase::Operations.as_str(), "operations");
}
